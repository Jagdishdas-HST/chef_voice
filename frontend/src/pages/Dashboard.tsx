import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Thermometer, 
  Truck, 
  Flame, 
  Clock, 
  ClipboardCheck, 
  GraduationCap, 
  HeartPulse, 
  Gauge,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const modules = [
    {
      icon: Thermometer,
      title: "Refrigeration",
      description: "Monitor fridge and freezer temperatures",
      path: "/refrigeration",
      color: "text-info-blue",
      bgColor: "bg-info-blue/10",
    },
    {
      icon: Truck,
      title: "Delivery",
      description: "Log deliveries with OCR and voice",
      path: "/delivery",
      color: "text-voice-purple",
      bgColor: "bg-voice-purple/10",
    },
    {
      icon: Flame,
      title: "Cook/Cool/Reheat",
      description: "Track cooking temperatures",
      path: "/cook-cool-reheat",
      color: "text-danger-red",
      bgColor: "bg-danger-red/10",
    },
    {
      icon: Clock,
      title: "Hot Holding",
      description: "Monitor hot holding temperatures",
      path: "/hot-holding",
      color: "text-warning-yellow",
      bgColor: "bg-warning-yellow/10",
    },
    {
      icon: ClipboardCheck,
      title: "Hygiene Inspection",
      description: "Complete hygiene checklists",
      path: "/hygiene-inspection",
      color: "text-success-green",
      bgColor: "bg-success-green/10",
    },
    {
      icon: GraduationCap,
      title: "Training",
      description: "Record staff training sessions",
      path: "/training",
      color: "text-voice-purple",
      bgColor: "bg-voice-purple/10",
    },
    {
      icon: HeartPulse,
      title: "Fitness to Work",
      description: "Daily health assessments",
      path: "/fitness-to-work",
      color: "text-danger-red",
      bgColor: "bg-danger-red/10",
    },
    {
      icon: Gauge,
      title: "Thermometer Check",
      description: "Calibrate thermometers",
      path: "/thermometer-check",
      color: "text-info-blue",
      bgColor: "bg-info-blue/10",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">HACCP Compliance Dashboard</h1>
          <p className="text-gray-600">Manage your kitchen operations with voice-first compliance tracking</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Today's Logs</CardDescription>
              <CardTitle className="text-3xl">24</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Compliance Status</CardDescription>
              <CardTitle className="text-3xl text-success-green">98%</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active Alerts</CardDescription>
              <CardTitle className="text-3xl text-warning-yellow">2</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Staff Members</CardDescription>
              <CardTitle className="text-3xl">12</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Module Cards */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Compliance Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {modules.map((module) => (
              <Card key={module.path} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(module.path)}>
                <CardHeader>
                  <div className={`w-12 h-12 ${module.bgColor} rounded-lg flex items-center justify-center mb-3`}>
                    <module.icon className={`h-6 w-6 ${module.color}`} />
                  </div>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full justify-between" onClick={() => navigate(module.path)}>
                    Open
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;