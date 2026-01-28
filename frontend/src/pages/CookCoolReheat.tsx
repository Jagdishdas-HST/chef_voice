import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Flame, Plus } from "lucide-react";

const CookCoolReheat = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Cook, Cool & Reheat</h1>
            <p className="text-gray-600">Track cooking temperatures (FSAI SC3)</p>
          </div>
        </div>

        <Tabs defaultValue="cook" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cook">Cooking</TabsTrigger>
            <TabsTrigger value="cool">Cooling</TabsTrigger>
            <TabsTrigger value="reheat">Reheating</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cook">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Cooking Records</CardTitle>
                    <CardDescription>Temperature must be ≥75°C</CardDescription>
                  </div>
                  <Button className="bg-voice-purple hover:bg-voice-purple/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Log Cook
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <Flame className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No cooking records yet</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cool">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Cooling Records</CardTitle>
                    <CardDescription>Track cooling time and temperature</CardDescription>
                  </div>
                  <Button className="bg-voice-purple hover:bg-voice-purple/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Log Cool
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <p>No cooling records yet</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reheat">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Reheating Records</CardTitle>
                    <CardDescription>Temperature must be ≥75°C</CardDescription>
                  </div>
                  <Button className="bg-voice-purple hover:bg-voice-purple/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Log Reheat
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <p>No reheating records yet</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CookCoolReheat;