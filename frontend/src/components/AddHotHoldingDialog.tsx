import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useCreateHotHoldingRecord } from "@/hooks/useHotHolding";

const AddHotHoldingDialog = ({ onRecordAdded }: { onRecordAdded: () => void }) => {
  const [open, setOpen] = useState(false);
  const [foodItem, setFoodItem] = useState("");
  const [timeIntoHotHold, setTimeIntoHotHold] = useState("");
  const [coreTemperature, setCoreTemperature] = useState("");
  const [checkedBy, setCheckedBy] = useState("");
  const [comments, setComments] = useState("");
  
  const createRecord = useCreateHotHoldingRecord();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createRecord.mutateAsync({
      foodItem,
      timeIntoHotHold,
      coreTemperature,
      checkedBy,
      comments,
    });

    setOpen(false);
    setFoodItem("");
    setTimeIntoHotHold("");
    setCoreTemperature("");
    setCheckedBy("");
    setComments("");
    onRecordAdded();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-voice-purple hover:bg-voice-purple/90">
          <Plus className="h-4 w-4 mr-2" />
          Log Check
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Hot Holding Check</DialogTitle>
          <DialogDescription>Core temperature must be ≥63°C</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="foodItem">Food Item *</Label>
            <Input
              id="foodItem"
              value={foodItem}
              onChange={(e) => setFoodItem(e.target.value)}
              placeholder="e.g., Roast Chicken"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeIntoHotHold">Time into Hot Hold *</Label>
            <Input
              id="timeIntoHotHold"
              type="time"
              value={timeIntoHotHold}
              onChange={(e) => setTimeIntoHotHold(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coreTemperature">Core Temperature (°C) *</Label>
            <Input
              id="coreTemperature"
              type="number"
              step="0.1"
              value={coreTemperature}
              onChange={(e) => setCoreTemperature(e.target.value)}
              placeholder="Must be ≥63°C"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="checkedBy">Checked By *</Label>
            <Input
              id="checkedBy"
              value={checkedBy}
              onChange={(e) => setCheckedBy(e.target.value)}
              placeholder="Staff member name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">Comments</Label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Any observations..."
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-voice-purple hover:bg-voice-purple/90" disabled={createRecord.isPending}>
              {createRecord.isPending ? "Saving..." : "Save Check"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHotHoldingDialog;