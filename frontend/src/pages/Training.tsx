import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Plus } from "lucide-react";

const Training = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Hygiene Training</h1>
            <p className="text-gray-600">Record staff training sessions (FSAI SC6)</p>
          </div>
          <Button className="bg-voice-purple hover:bg-voice-purple/90">
            <Plus className="h-4 w-4 mr-2" />
            Log Training
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Training Records</CardTitle>
            <CardDescription>Track staff training and refresher dates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No training records yet</p>
              <p className="text-sm mt-2">Log your first training session</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Training;