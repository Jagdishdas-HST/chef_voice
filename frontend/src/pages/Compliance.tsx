import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";

const Compliance = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Compliance Dashboard</h1>
          <p className="text-gray-600">Monitor overdue items and upcoming alerts</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Compliance Score</CardDescription>
              <CardTitle className="text-3xl text-success-green flex items-center gap-2">
                <CheckCircle className="h-8 w-8" />
                98%
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Overdue Items</CardDescription>
              <CardTitle className="text-3xl text-danger-red flex items-center gap-2">
                <AlertTriangle className="h-8 w-8" />
                2
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Upcoming (7 days)</CardDescription>
              <CardTitle className="text-3xl text-warning-yellow flex items-center gap-2">
                <Shield className="h-8 w-8" />
                5
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Overdue Items</CardTitle>
            <CardDescription>Action required</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>All compliance items up to date</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Alerts</CardTitle>
            <CardDescription>Due in next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <p>No upcoming alerts</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Compliance;