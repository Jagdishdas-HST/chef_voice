import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AddCookRecordDialog = ({ onRecordAdded }: { onRecordAdded: () => void }) => {
  const [open, setOpen] = useState(false);
  const [productName, setProductName] = useState("");
  const [staffName, setStaffName] = useState("");
  const [temperature, setTemperature] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productName || !staffName || !temperature) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const tempValue = parseFloat(temperature);
    if (tempValue < 75) {
      toast({
        title: "Temperature Too Low",
        description: "Cooking temperature must be ≥75°C",
        variant: "destructive",
      });
      return;
    }

    const records = JSON.parse(localStorage.getItem("cookRecords") || "[]");
    const newRecord = {
      id: Date.now().toString(),
      productName,
      staffName,
      temperature: tempValue,
      cookedAt: new Date().toISOString(),
    };
    
    records.push(newRecord);
    localStorage.setItem("cookRecords", JSON.stringify(records));

    toast({
      title: "Cook Record Added",
      description: `${productName} cooked at ${tempValue}°C`,
    });

    setOpen(false);
    setProductName("");
    setStaffName("");
    setTemperature("");
    onRecordAdded();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-voice-purple hover:bg-voice-purple/90">
          <Plus className="h-4 w-4 mr-2" />
          Log Cook
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Cooking</DialogTitle>
          <DialogDescription>Temperature must be ≥75°C</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="productName">Product Name *</Label>
            <Input
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g., Chicken Breast"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="staffName">Staff Member *</Label>
            <Input
              id="staffName"
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              placeholder="Who cooked this?"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature After Cooking (°C) *</Label>
            <Input
              id="temperature"
              type="number"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              placeholder="Must be ≥75°C"
              required
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-voice-purple hover:bg-voice-purple/90">
              Save Record
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCookRecordDialog;