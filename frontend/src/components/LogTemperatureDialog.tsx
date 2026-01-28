import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Thermometer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LogTemperatureDialogProps {
  unit: {
    id: string;
    fridgeNumber: string;
    type: string;
    targetTemperature: number;
  };
  onLogAdded: () => void;
}

const LogTemperatureDialog = ({ unit, onLogAdded }: LogTemperatureDialogProps) => {
  const [open, setOpen] = useState(false);
  const [temperature, setTemperature] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const getStatus = (temp: number, target: number, type: string) => {
    if (type === "Freezer") {
      if (temp <= -18) return "ok";
      if (temp <= -15) return "warning";
      return "critical";
    } else if (type === "Fridge") {
      if (temp >= 0 && temp <= 5) return "ok";
      if (temp <= 8) return "warning";
      return "critical";
    }
    return "ok";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!temperature) {
      toast({
        title: "Missing Temperature",
        description: "Please enter a temperature reading",
        variant: "destructive",
      });
      return;
    }

    const tempValue = parseFloat(temperature);
    const status = getStatus(tempValue, unit.targetTemperature, unit.type);

    const logs = JSON.parse(localStorage.getItem("temperatureLogs") || "[]");
    const newLog = {
      id: Date.now().toString(),
      unitId: unit.id,
      fridgeNumber: unit.fridgeNumber,
      type: unit.type,
      temperature: tempValue,
      targetTemperature: unit.targetTemperature,
      status,
      notes,
      readingTime: new Date().toISOString(),
    };
    
    logs.push(newLog);
    localStorage.setItem("temperatureLogs", JSON.stringify(logs));

    const statusMessages = {
      ok: "Temperature is within safe range",
      warning: "Temperature is approaching unsafe levels",
      critical: "CRITICAL: Temperature is outside safe range!",
    };

    toast({
      title: status === "ok" ? "Temperature Logged" : status === "warning" ? "Warning" : "Critical Alert",
      description: statusMessages[status],
      variant: status === "critical" ? "destructive" : "default",
    });

    setOpen(false);
    setTemperature("");
    setNotes("");
    onLogAdded();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Thermometer className="h-4 w-4 mr-2" />
          Log Temp
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Temperature - {unit.fridgeNumber}</DialogTitle>
          <DialogDescription>
            Target: {unit.targetTemperature}°C | Type: {unit.type}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature (°C) *</Label>
            <Input
              id="temperature"
              type="number"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              placeholder="Enter temperature"
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any observations..."
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-voice-purple hover:bg-voice-purple/90">
              Log Temperature
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LogTemperatureDialog;