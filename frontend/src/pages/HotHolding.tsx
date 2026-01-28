import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Plus } from "lucide-react";

const HotHolding = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Hot Holding</h1>
            <p className="text-gray-600">Monitor hot holding temperatures (FSAI SC4)</p>
          </div>
          <Button className="bg-voice-purple hover:bg-voice-purple/90">
            <Plus className="h-4 w-4 mr-2" />
            Log Check
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hot Holding Records</CardTitle>
            <CardDescription>Core temperature must be ≥63°C. Check every 90 minutes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No hot holding records yet</p>
              <p className="text-sm mt-2">Log your first hot holding temperature check</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HotHolding;