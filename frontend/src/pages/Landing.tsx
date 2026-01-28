import { Button } from "@/components/ui/button";
import { Mic, Thermometer, ClipboardCheck, FileText, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic className="h-8 w-8 text-voice-purple" />
            <span className="text-2xl font-bold text-gray-900">ChefVoice</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button onClick={() => navigate("/signup")} className="bg-voice-purple hover:bg-voice-purple/90">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Voice-First HACCP Compliance for Professional Kitchens
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Hands-free kitchen operations management aligned with FSAI standards. 
            Log temperatures, track deliveries, and maintain compliance—all with your voice.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate("/signup")} className="bg-voice-purple hover:bg-voice-purple/90 text-lg px-8 py-6">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/login")} className="text-lg px-8 py-6">
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything You Need for HACCP Compliance
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-voice-purple/10 rounded-lg flex items-center justify-center mb-4">
              <Mic className="h-6 w-6 text-voice-purple" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Voice-Guided Forms</h3>
            <p className="text-gray-600">
              Complete compliance forms hands-free with sequential voice prompts and automatic validation.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-info-blue/10 rounded-lg flex items-center justify-center mb-4">
              <Thermometer className="h-6 w-6 text-info-blue" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Temperature Monitoring</h3>
            <p className="text-gray-600">
              Track fridge, freezer, and cooking temperatures with real-time compliance alerts.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-success-green/10 rounded-lg flex items-center justify-center mb-4">
              <ClipboardCheck className="h-6 w-6 text-success-green" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Delivery Tracking</h3>
            <p className="text-gray-600">
              OCR invoice capture and voice logging for all deliveries with batch number tracking.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-warning-yellow/10 rounded-lg flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-warning-yellow" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Comprehensive Reports</h3>
            <p className="text-gray-600">
              Generate FSAI-compliant reports with PDF export and complete audit trails.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-danger-red/10 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-danger-red" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Multi-Tenant Security</h3>
            <p className="text-gray-600">
              Role-based access control with complete data isolation per restaurant.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-voice-purple/10 rounded-lg flex items-center justify-center mb-4">
              <Mic className="h-6 w-6 text-voice-purple" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Voice Navigation</h3>
            <p className="text-gray-600">
              Navigate the entire system with voice commands—perfect for busy kitchen environments.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20 bg-gray-50">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Simple, Transparent Pricing
        </h2>
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">Professional</h3>
            <div className="text-4xl font-bold text-voice-purple mb-2">€99<span className="text-xl text-gray-600">/month</span></div>
            <p className="text-gray-600">Per restaurant location</p>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-success-green/10 flex items-center justify-center">
                <span className="text-success-green text-xs">✓</span>
              </div>
              <span>Unlimited voice recordings</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-success-green/10 flex items-center justify-center">
                <span className="text-success-green text-xs">✓</span>
              </div>
              <span>OCR invoice processing</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-success-green/10 flex items-center justify-center">
                <span className="text-success-green text-xs">✓</span>
              </div>
              <span>Complete FSAI compliance</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-success-green/10 flex items-center justify-center">
                <span className="text-success-green text-xs">✓</span>
              </div>
              <span>Unlimited staff members</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-success-green/10 flex items-center justify-center">
                <span className="text-success-green text-xs">✓</span>
              </div>
              <span>Priority support</span>
            </li>
          </ul>
          <Button className="w-full bg-voice-purple hover:bg-voice-purple/90" size="lg" onClick={() => navigate("/signup")}>
            Start Free Trial
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2026 ChefVoice. FSAI-compliant HACCP management system.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;