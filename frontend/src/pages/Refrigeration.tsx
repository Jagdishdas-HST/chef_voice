import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Thermometer, Plus } from "lucide-react";

const Refrigeration = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Refrigeration Monitoring</h1>
            <p className="text-gray-600">Track fridge and freezer temperatures (FSAI SC2)</p>
          </div>
          <Button className="bg-voice-purple hover:bg-voice-purple/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Unit
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Temperature Monitoring Units</CardTitle>
            <CardDescription>Manage your refrigeration units and log temperatures</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <Thermometer className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No refrigeration units added yet</p>
              <p className="text-sm mt-2">Click "Add Unit" to create your first monitoring unit</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Refrigeration;