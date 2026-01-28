import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartPulse, Plus } from "lucide-react";

const FitnessToWork = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Fitness to Work</h1>
            <p className="text-gray-600">Daily health assessments (FSAI SC7)</p>
          </div>
          <Button className="bg-voice-purple hover:bg-voice-purple/90">
            <Plus className="h-4 w-4 mr-2" />
            New Assessment
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Fitness Records</CardTitle>
            <CardDescription>Staff health check declarations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <HeartPulse className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No fitness assessments yet</p>
              <p className="text-sm mt-2">Complete your first health check</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FitnessToWork;