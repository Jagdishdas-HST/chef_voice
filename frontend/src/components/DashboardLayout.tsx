import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Home, 
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
  Menu,
  X,
  Mic
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Thermometer, label: "Refrigeration", path: "/refrigeration" },
    { icon: Truck, label: "Delivery", path: "/delivery" },
    { icon: Flame, label: "Cook/Cool/Reheat", path: "/cook-cool-reheat" },
    { icon: Clock, label: "Hot Holding", path: "/hot-holding" },
    { icon: ClipboardCheck, label: "Hygiene Inspection", path: "/hygiene-inspection" },
    { icon: GraduationCap, label: "Training", path: "/training" },
    { icon: HeartPulse, label: "Fitness to Work", path: "/fitness-to-work" },
    { icon: Gauge, label: "Thermometer Check", path: "/thermometer-check" },
    { icon: FileText, label: "Reports", path: "/reports" },
    { icon: Shield, label: "Compliance", path: "/compliance" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-white/20 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden btn-scale hover:bg-white/50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/dashboard")}>
              <div className="w-10 h-10 bg-gradient-to-br from-voice-purple to-info-blue rounded-xl flex items-center justify-center float-animation">
                <Mic className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">ChefVoice</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden md:inline px-4 py-2 glass rounded-lg">Restaurant Name</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate("/")}
              className="btn-scale glass hover:bg-white/80 border-white/30"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 glass border-r border-white/20 min-h-[calc(100vh-73px)] sticky top-[73px]">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "secondary" : "ghost"}
                className={`w-full justify-start transition-all duration-300 btn-scale ${
                  isActive(item.path) 
                    ? "bg-gradient-to-r from-voice-purple/20 to-info-blue/20 text-voice-purple border-l-4 border-voice-purple shadow-lg" 
                    : "hover:bg-white/50 hover:translate-x-1"
                }`}
                onClick={() => navigate(item.path)}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            ))}
          </nav>
        </aside>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <aside 
              className="w-64 glass-dark h-full slide-in" 
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="p-4 space-y-1">
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    variant={isActive(item.path) ? "secondary" : "ghost"}
                    className={`w-full justify-start transition-all duration-300 ${
                      isActive(item.path) 
                        ? "bg-gradient-to-r from-voice-purple/20 to-info-blue/20 text-voice-purple border-l-4 border-voice-purple" 
                        : "text-white hover:bg-white/10"
                    }`}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Button>
                ))}
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;