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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
            <div className="flex items-center gap-2">
              <Mic className="h-6 w-6 text-voice-purple" />
              <span className="text-xl font-bold">ChefVoice</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden md:inline">Restaurant Name</span>
            <Button variant="outline" size="sm" onClick={() => navigate("/")}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 bg-white border-r min-h-[calc(100vh-73px)] sticky top-[73px]">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "secondary" : "ghost"}
                className={`w-full justify-start ${
                  isActive(item.path) ? "bg-voice-purple/10 text-voice-purple" : ""
                }`}
                onClick={() => navigate(item.path)}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </nav>
        </aside>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <aside className="w-64 bg-white h-full" onClick={(e) => e.stopPropagation()}>
              <nav className="p-4 space-y-1">
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    variant={isActive(item.path) ? "secondary" : "ghost"}
                    className={`w-full justify-start ${
                      isActive(item.path) ? "bg-voice-purple/10 text-voice-purple" : ""
                    }`}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
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