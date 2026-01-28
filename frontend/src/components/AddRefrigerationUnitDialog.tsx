import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddRefrigerationUnitDialogProps {
  onUnitAdded: () => void;
}

const AddRefrigerationUnitDialog = ({ onUnitAdded }: AddRefrigerationUnitDialogProps) => {
  const [open, setOpen] = useState(false);
  const [fridgeNumber, setFridgeNumber] = useState("");
  const [type, setType] = useState<"Fridge" | "Freezer" | "Blast Chiller">("Fridge");
  const [location, setLocation] = useState("");
  const [targetTemperature, setTargetTemperature] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fridgeNumber || !location || !targetTemperature) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Save to localStorage for now
    const units = JSON.parse(localStorage.getItem("refrigerationUnits") || "[]");
    const newUnit = {
      id: Date.now().toString(),
      fridgeNumber,
      type,
      location,
      targetTemperature: parseFloat(targetTemperature),
      notes,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    
    units.push(newUnit);
    localStorage.setItem("refrigerationUnits", JSON.stringify(units));

    toast({
      title: "Unit Added",
      description: `${type} ${fridgeNumber} has been added successfully`,
    });

    setOpen(false);
    setFridgeNumber("");
    setLocation("");
    setTargetTemperature("");
    setNotes("");
    onUnitAdded();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-voice-purple hover:bg-voice-purple/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Unit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Refrigeration Unit</DialogTitle>
          <DialogDescription>Create a new fridge, freezer, or blast chiller for temperature monitoring</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fridgeNumber">Unit Number *</Label>
            <Input
              id="fridgeNumber"
              value={fridgeNumber}
              onChange={(e) => setFridgeNumber(e.target.value)}
              placeholder="e.g., Fridge 1"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type *</Label>
            <Select value={type} onValueChange={(value: any) => setType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fridge">Fridge</SelectItem>
                <SelectItem value="Freezer">Freezer</SelectItem>
                <SelectItem value="Blast Chiller">Blast Chiller</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Main Kitchen"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetTemperature">Target Temperature (°C) *</Label>
            <Input
              id="targetTemperature"
              type="number"
              step="0.1"
              value={targetTemperature}
              onChange={(e) => setTargetTemperature(e.target.value)}
              placeholder={type === "Freezer" ? "-18" : "3"}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional information..."
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-voice-purple hover:bg-voice-purple/90">
              Add Unit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRefrigerationUnitDialog;