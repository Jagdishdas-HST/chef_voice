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
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2
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
      bgColor: "bg-gradient-to-br from-info-blue/10 to-info-blue/5",
      borderColor: "border-info-blue/20",
    },
    {
      icon: Truck,
      title: "Delivery",
      description: "Log deliveries with OCR and voice",
      path: "/delivery",
      color: "text-voice-purple",
      bgColor: "bg-gradient-to-br from-voice-purple/10 to-voice-purple/5",
      borderColor: "border-voice-purple/20",
    },
    {
      icon: Flame,
      title: "Cook/Cool/Reheat",
      description: "Track cooking temperatures",
      path: "/cook-cool-reheat",
      color: "text-danger-red",
      bgColor: "bg-gradient-to-br from-danger-red/10 to-danger-red/5",
      borderColor: "border-danger-red/20",
    },
    {
      icon: Clock,
      title: "Hot Holding",
      description: "Monitor hot holding temperatures",
      path: "/hot-holding",
      color: "text-warning-yellow",
      bgColor: "bg-gradient-to-br from-warning-yellow/10 to-warning-yellow/5",
      borderColor: "border-warning-yellow/20",
    },
    {
      icon: ClipboardCheck,
      title: "Hygiene Inspection",
      description: "Complete hygiene checklists",
      path: "/hygiene-inspection",
      color: "text-success-green",
      bgColor: "bg-gradient-to-br from-success-green/10 to-success-green/5",
      borderColor: "border-success-green/20",
    },
    {
      icon: GraduationCap,
      title: "Training",
      description: "Record staff training sessions",
      path: "/training",
      color: "text-voice-purple",
      bgColor: "bg-gradient-to-br from-voice-purple/10 to-voice-purple/5",
      borderColor: "border-voice-purple/20",
    },
    {
      icon: HeartPulse,
      title: "Fitness to Work",
      description: "Daily health assessments",
      path: "/fitness-to-work",
      color: "text-danger-red",
      bgColor: "bg-gradient-to-br from-danger-red/10 to-danger-red/5",
      borderColor: "border-danger-red/20",
    },
    {
      icon: Gauge,
      title: "Thermometer Check",
      description: "Calibrate thermometers",
      path: "/thermometer-check",
      color: "text-info-blue",
      bgColor: "bg-gradient-to-br from-info-blue/10 to-info-blue/5",
      borderColor: "border-info-blue/20",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 slide-in">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-voice-purple/10 via-transparent to-info-blue/10 rounded-3xl blur-3xl -z-10" />
          <div className="relative">
            <h1 className="text-4xl font-bold mb-2 gradient-text">HACCP Compliance Dashboard</h1>
            <p className="text-gray-600 text-lg">Manage your kitchen operations with voice-first compliance tracking</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="card-hover glass border-2 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-voice-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="pb-3 relative z-10">
              <CardDescription className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-voice-purple" />
                Today's Logs
              </CardDescription>
              <CardTitle className="text-4xl font-bold">24</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="card-hover glass border-2 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-success-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="pb-3 relative z-10">
              <CardDescription className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success-green" />
                Compliance Status
              </CardDescription>
              <CardTitle className="text-4xl font-bold text-success-green">98%</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="card-hover glass border-2 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-warning-yellow/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="pb-3 relative z-10">
              <CardDescription className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-warning-yellow" />
                Active Alerts
              </CardDescription>
              <CardTitle className="text-4xl font-bold text-warning-yellow">2</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="card-hover glass border-2 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-info-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="pb-3 relative z-10">
              <CardDescription className="flex items-center gap-2">
                <HeartPulse className="h-4 w-4 text-info-blue" />
                Staff Members
              </CardDescription>
              <CardTitle className="text-4xl font-bold">12</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Module Cards */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="gradient-text">Compliance Modules</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((module, index) => (
              <Card 
                key={module.path} 
                className={`card-hover glass border-2 ${module.borderColor} cursor-pointer overflow-hidden relative group`}
                onClick={() => navigate(module.path)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`absolute inset-0 ${module.bgColor} opacity-0 group-hover:opacity-100 transition-all duration-300`} />
                <CardHeader className="relative z-10">
                  <div className={`w-14 h-14 ${module.bgColor} rounded-2xl flex items-center justify-center mb-4 float-animation group-hover:scale-110 transition-transform duration-300`}>
                    <module.icon className={`h-7 w-7 ${module.color}`} />
                  </div>
                  <CardTitle className="text-lg group-hover:text-voice-purple transition-colors duration-300">{module.title}</CardTitle>
                  <CardDescription className="min-h-[40px]">{module.description}</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between group-hover:bg-white/50 transition-all duration-300 btn-scale" 
                    onClick={() => navigate(module.path)}
                  >
                    <span>Open</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
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