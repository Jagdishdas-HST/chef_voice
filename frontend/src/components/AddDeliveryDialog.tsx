import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Camera, Mic, Upload } from "lucide-react";
import { useCreateDelivery } from "@/hooks/useDeliveries";
import { processInvoice } from "@/services/ocr.service";
import { voiceService, parseDeliveryVoiceInput } from "@/services/voice.service";
import { useToast } from "@/hooks/use-toast";

interface Product {
  name: string;
  quantity: string;
  temperature: string;
  category: "Frozen" | "Chilled" | "Ambient";
  batchNumber: string;
  quality: "Good" | "Acceptable" | "Rejected";
}

const AddDeliveryDialog = ({ onDeliveryAdded }: { onDeliveryAdded: () => void }) => {
  const [open, setOpen] = useState(false);
  const [staffMember, setStaffMember] = useState("");
  const [supplier, setSupplier] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().split('T')[0]);
  const [products, setProducts] = useState<Product[]>([
    { name: "", quantity: "", temperature: "", category: "Chilled", batchNumber: "", quality: "Good" }
  ]);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const createDelivery = useCreateDelivery();
  const { toast } = useToast();

  const addProduct = () => {
    setProducts([...products, { name: "", quantity: "", temperature: "", category: "Chilled", batchNumber: "", quality: "Good" }]);
  };

  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const updateProduct = (index: number, field: keyof Product, value: string) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: value };
    setProducts(updated);
  };

  const handleOCRScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingOCR(true);
    toast({
      title: "Processing invoice...",
      description: "Extracting text from image",
    });

    try {
      const parsed = await processInvoice(file);
      
      if (parsed.supplier) {
        setSupplier(parsed.supplier);
      }
      
      if (parsed.deliveryDate) {
        setDeliveryDate(parsed.deliveryDate);
      }

      if (parsed.products.length > 0) {
        setProducts(parsed.products.map(p => ({
          name: p.name,
          quantity: p.quantity || "",
          temperature: p.temperature || "",
          category: "Chilled" as const,
          batchNumber: p.batchNumber || "",
          quality: "Good" as const,
        })));
      }

      toast({
        title: "Invoice scanned successfully",
        description: `Found ${parsed.products.length} products`,
      });
    } catch (error) {
      console.error('[OCR] Error:', error);
      toast({
        title: "OCR failed",
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setIsProcessingOCR(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleVoiceInput = () => {
    if (!voiceService.isSupported()) {
      toast({
        title: "Voice not supported",
        description: "Please use Chrome, Edge, or Safari",
        variant: "destructive",
      });
      return;
    }

    if (isListeningVoice) {
      voiceService.stopListening();
      setIsListeningVoice(false);
      return;
    }

    voiceService.startListening(
      (result) => {
        console.log('[Voice] Result:', result);
        setVoiceTranscript(result.transcript);

        if (result.isFinal) {
          const parsed = parseDeliveryVoiceInput(result.transcript);
          
          if (parsed.supplier) {
            setSupplier(parsed.supplier);
          }
          
          if (parsed.staffMember) {
            setStaffMember(parsed.staffMember);
          }

          if (parsed.products && parsed.products.length > 0) {
            setProducts(parsed.products.map(p => ({
              name: p.name,
              quantity: p.quantity || "",
              temperature: p.temperature || "",
              category: p.category || "Chilled",
              batchNumber: p.batchNumber || "",
              quality: "Good" as const,
            })));
          }

          toast({
            title: "Voice input processed",
            description: "Delivery data extracted from voice",
          });

          voiceService.stopListening();
          setIsListeningVoice(false);
          setVoiceTranscript("");
        }
      },
      (error) => {
        console.error('[Voice] Error:', error);
        toast({
          title: "Voice recognition error",
          description: error,
          variant: "destructive",
        });
        setIsListeningVoice(false);
      }
    );

    setIsListeningVoice(true);
    toast({
      title: "Listening...",
      description: "Say: 'Supplier is [name], received by [staff], product [name] [quantity] [temperature] batch [number]'",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createDelivery.mutateAsync({
      staffMember,
      supplier,
      deliveryDate,
      products,
    });

    setOpen(false);
    setStaffMember("");
    setSupplier("");
    setProducts([{ name: "", quantity: "", temperature: "", category: "Chilled", batchNumber: "", quality: "Good" }]);
    onDeliveryAdded();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-voice-purple hover:bg-voice-purple/90">
          <Plus className="h-4 w-4 mr-2" />
          New Delivery
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log Delivery</DialogTitle>
          <DialogDescription>Record delivery details with products and temperatures</DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleOCRScan}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessingOCR}
            className="flex-1"
          >
            <Camera className="h-4 w-4 mr-2" />
            {isProcessingOCR ? "Processing..." : "Scan Invoice"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleVoiceInput}
            className={`flex-1 ${isListeningVoice ? 'bg-red-50 border-red-300' : ''}`}
          >
            <Mic className={`h-4 w-4 mr-2 ${isListeningVoice ? 'text-red-500' : ''}`} />
            {isListeningVoice ? "Listening..." : "Voice Log"}
          </Button>
        </div>

        {voiceTranscript && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm mb-4">
            <strong>Transcript:</strong> {voiceTranscript}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="staffMember">Staff Member *</Label>
              <Input
                id="staffMember"
                value={staffMember}
                onChange={(e) => setStaffMember(e.target.value)}
                placeholder="Who received this?"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier *</Label>
              <Input
                id="supplier"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="Supplier name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryDate">Delivery Date *</Label>
            <Input
              id="deliveryDate"
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Products *</Label>
              <Button type="button" size="sm" variant="outline" onClick={addProduct}>
                <Plus className="h-4 w-4 mr-1" />
                Add Product
              </Button>
            </div>

            {products.map((product, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Product {index + 1}</span>
                  {products.length > 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => removeProduct(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Product name *"
                    value={product.name}
                    onChange={(e) => updateProduct(index, "name", e.target.value)}
                    required
                  />
                  <Input
                    placeholder="Quantity"
                    value={product.quantity}
                    onChange={(e) => updateProduct(index, "quantity", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Select
                    value={product.category}
                    onValueChange={(value: any) => updateProduct(index, "category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Frozen">Frozen</SelectItem>
                      <SelectItem value="Chilled">Chilled</SelectItem>
                      <SelectItem value="Ambient">Ambient</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    step="0.1"
                    placeholder={product.category === "Ambient" ? "Temp (optional)" : "Temperature *"}
                    value={product.temperature}
                    onChange={(e) => updateProduct(index, "temperature", e.target.value)}
                    required={product.category !== "Ambient"}
                  />

                  <Input
                    placeholder="Batch # *"
                    value={product.batchNumber}
                    onChange={(e) => updateProduct(index, "batchNumber", e.target.value)}
                    required
                  />
                </div>

                <Select
                  value={product.quality}
                  onValueChange={(value: any) => updateProduct(index, "quality", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Good">Good Quality</SelectItem>
                    <SelectItem value="Acceptable">Acceptable</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-voice-purple hover:bg-voice-purple/90" disabled={createDelivery.isPending}>
              {createDelivery.isPending ? "Saving..." : "Save Delivery"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDeliveryDialog;