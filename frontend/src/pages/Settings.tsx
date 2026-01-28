import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Mic, Users, Building2 } from "lucide-react";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-gray-600">Configure voice, staff, and company settings</p>
        </div>

        <Tabs defaultValue="voice" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="voice">Voice Settings</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          </TabsList>

          <TabsContent value="voice">
            <Card>
              <CardHeader>
                <CardTitle>Voice Configuration</CardTitle>
                <CardDescription>Customize voice alerts and navigation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Voice Navigation</Label>
                    <p className="text-sm text-gray-500">Enable voice commands for navigation</p>
                  </div>
                  <Switch />
                </div>

                <div className="space-y-2">
                  <Label>Speech Speed</Label>
                  <Slider defaultValue={[1]} min={0.5} max={2} step={0.1} />
                  <p className="text-sm text-gray-500">0.5x - 2.0x</p>
                </div>

                <div className="space-y-2">
                  <Label>Pitch</Label>
                  <Slider defaultValue={[1]} min={0} max={2} step={0.1} />
                  <p className="text-sm text-gray-500">0 - 2</p>
                </div>

                <div className="space-y-2">
                  <Label>Volume</Label>
                  <Slider defaultValue={[100]} min={0} max={100} step={1} />
                  <p className="text-sm text-gray-500">0% - 100%</p>
                </div>

                <Button variant="outline" className="w-full">
                  <Mic className="h-4 w-4 mr-2" />
                  Test Voice Settings
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Available Voice Commands</CardTitle>
                <CardDescription>Say "Go to [page]" to navigate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  <div className="p-2 bg-gray-50 rounded">Dashboard</div>
                  <div className="p-2 bg-gray-50 rounded">Refrigeration</div>
                  <div className="p-2 bg-gray-50 rounded">Delivery</div>
                  <div className="p-2 bg-gray-50 rounded">Cooking</div>
                  <div className="p-2 bg-gray-50 rounded">Hot Holding</div>
                  <div className="p-2 bg-gray-50 rounded">Hygiene</div>
                  <div className="p-2 bg-gray-50 rounded">Training</div>
                  <div className="p-2 bg-gray-50 rounded">Fitness</div>
                  <div className="p-2 bg-gray-50 rounded">Thermometer</div>
                  <div className="p-2 bg-gray-50 rounded">Reports</div>
                  <div className="p-2 bg-gray-50 rounded">Compliance</div>
                  <div className="p-2 bg-gray-50 rounded">Settings</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Staff Members</CardTitle>
                    <CardDescription>Manage your team</CardDescription>
                  </div>
                  <Button className="bg-voice-purple hover:bg-voice-purple/90">
                    <Users className="h-4 w-4 mr-2" />
                    Add Staff
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No staff members registered</p>
                  <p className="text-sm mt-2">Add staff members to use in compliance logs</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suppliers">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Suppliers</CardTitle>
                    <CardDescription>Manage your supplier registry</CardDescription>
                  </div>
                  <Button className="bg-voice-purple hover:bg-voice-purple/90">
                    <Building2 className="h-4 w-4 mr-2" />
                    Add Supplier
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No suppliers registered</p>
                  <p className="text-sm mt-2">Add suppliers for delivery logging and OCR validation</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;