import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, Plus } from "lucide-react";

const HygieneInspection = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Hygiene Inspection</h1>
            <p className="text-gray-600">Complete hygiene checklists (FSAI SC5)</p>
          </div>
          <Button className="bg-voice-purple hover:bg-voice-purple/90">
            <Plus className="h-4 w-4 mr-2" />
            New Inspection
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Inspection Records</CardTitle>
            <CardDescription>12-point hygiene checklist</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <ClipboardCheck className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No inspections completed yet</p>
              <p className="text-sm mt-2">Start your first hygiene inspection</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HygieneInspection;