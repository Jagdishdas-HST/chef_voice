import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gauge, Plus } from "lucide-react";

const ThermometerCheck = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Thermometer Calibration</h1>
            <p className="text-gray-600">Verify thermometer accuracy</p>
          </div>
          <Button className="bg-voice-purple hover:bg-voice-purple/90">
            <Plus className="h-4 w-4 mr-2" />
            Log Check
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Calibration Records</CardTitle>
            <CardDescription>Ice water (0°C) and boiling water (100°C) tests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <Gauge className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No calibration checks yet</p>
              <p className="text-sm mt-2">Perform your first thermometer calibration</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ThermometerCheck;