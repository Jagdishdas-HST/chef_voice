import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Thermometer, 
  Truck, 
  Flame, 
  Clock, 
  ClipboardCheck, 
  GraduationCap, 
  HeartPulse, 
  Gauge, 
  FileText, 
  Shield, 
  Settings,
  LogOut,
  Mic,
  MicOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useVoiceNavigation } from "@/hooks/useVoiceNavigation";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isListening, transcript, startListening, stopListening, isSupported } = useVoiceNavigation();

  const handleLogout = async () => {
    try {
      await apiRequest("/api/auth/logout", { method: "POST" });
      toast({ title: "Logged out successfully" });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Logout failed",
        description: String(error),
        variant: "destructive",
      });
    }
  };

  const toggleVoiceNavigation = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/refrigeration", icon: Thermometer, label: "Refrigeration" },
    { path: "/delivery", icon: Truck, label: "Delivery" },
    { path: "/cook-cool-reheat", icon: Flame, label: "Cook/Cool/Reheat" },
    { path: "/hot-holding", icon: Clock, label: "Hot Holding" },
    { path: "/hygiene-inspection", icon: ClipboardCheck, label: "Hygiene" },
    { path: "/training", icon: GraduationCap, label: "Training" },
    { path: "/fitness-to-work", icon: HeartPulse, label: "Fitness" },
    { path: "/thermometer-check", icon: Gauge, label: "Thermometer" },
    { path: "/reports", icon: FileText, label: "Reports" },
    { path: "/compliance", icon: Shield, label: "Compliance" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-voice-purple">HACCP Manager</h1>
          <p className="text-sm text-gray-600 mt-1">Food Safety Compliance</p>
        </div>

        {isSupported && (
          <div className="px-4 mb-4">
            <Button
              variant={isListening ? "destructive" : "outline"}
              className="w-full"
              onClick={toggleVoiceNavigation}
            >
              {isListening ? (
                <>
                  <MicOff className="h-4 w-4 mr-2" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  Voice Navigation
                </>
              )}
            </Button>
            {transcript && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                {transcript}
              </div>
            )}
          </div>
        )}

        <nav className="px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-voice-purple text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;