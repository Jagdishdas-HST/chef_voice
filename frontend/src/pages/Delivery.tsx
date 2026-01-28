import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Plus, Mic, Camera } from "lucide-react";

const Delivery = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Delivery Logging</h1>
            <p className="text-gray-600">Record deliveries with voice or OCR (FSAI SC1)</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Camera className="h-4 w-4 mr-2" />
              Scan Invoice
            </Button>
            <Button variant="outline">
              <Mic className="h-4 w-4 mr-2" />
              Voice Log
            </Button>
            <Button className="bg-voice-purple hover:bg-voice-purple/90">
              <Plus className="h-4 w-4 mr-2" />
              New Delivery
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Deliveries</CardTitle>
            <CardDescription>View and manage delivery records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <Truck className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No deliveries logged yet</p>
              <p className="text-sm mt-2">Use voice, OCR, or manual entry to log your first delivery</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Delivery;