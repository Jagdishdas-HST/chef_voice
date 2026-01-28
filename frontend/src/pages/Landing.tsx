import { Button } from "@/components/ui/button";
import { Mic, Thermometer, ClipboardCheck, FileText, Shield, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30">
      {/* Header */}
      <header className="glass border-b border-white/20 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-voice-purple to-info-blue rounded-xl flex items-center justify-center float-animation">
              <Mic className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">ChefVoice</span>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/login")}
              className="btn-scale hover:bg-white/50"
            >
              Login
            </Button>
            <Button 
              onClick={() => navigate("/signup")} 
              className="bg-gradient-to-r from-voice-purple to-info-blue hover:opacity-90 btn-scale shadow-lg"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-voice-purple/10 via-transparent to-info-blue/10 rounded-3xl blur-3xl -z-10" />
        <div className="max-w-4xl mx-auto slide-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6 border border-white/30">
            <Sparkles className="h-4 w-4 text-voice-purple" />
            <span className="text-sm font-medium gradient-text">Voice-First HACCP Compliance</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Professional Kitchen
            <span className="gradient-text block">Compliance Made Easy</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Hands-free kitchen operations management aligned with FSAI standards. 
            Log temperatures, track deliveries, and maintain compliance—all with your voice.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button 
              size="lg" 
              onClick={() => navigate("/signup")} 
              className="bg-gradient-to-r from-voice-purple to-info-blue hover:opacity-90 text-lg px-8 py-6 btn-scale shadow-xl"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate("/login")} 
              className="text-lg px-8 py-6 btn-scale glass border-2 hover:bg-white/80"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold gradient-text mb-4">
            Everything You Need for HACCP Compliance
          </h2>
          <p className="text-gray-600 text-lg">Powerful features designed for professional kitchens</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Mic,
              title: "Voice-Guided Forms",
              description: "Complete compliance forms hands-free with sequential voice prompts and automatic validation.",
              color: "voice-purple"
            },
            {
              icon: Thermometer,
              title: "Temperature Monitoring",
              description: "Track fridge, freezer, and cooking temperatures with real-time compliance alerts.",
              color: "info-blue"
            },
            {
              icon: ClipboardCheck,
              title: "Delivery Tracking",
              description: "OCR invoice capture and voice logging for all deliveries with batch number tracking.",
              color: "success-green"
            },
            {
              icon: FileText,
              title: "Comprehensive Reports",
              description: "Generate FSAI-compliant reports with PDF export and complete audit trails.",
              color: "warning-yellow"
            },
            {
              icon: Shield,
              title: "Multi-Tenant Security",
              description: "Role-based access control with complete data isolation per restaurant.",
              color: "danger-red"
            },
            {
              icon: Mic,
              title: "Voice Navigation",
              description: "Navigate the entire system with voice commands—perfect for busy kitchen environments.",
              color: "voice-purple"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="card-hover glass p-8 rounded-2xl border-2 border-white/30 relative overflow-hidden group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-${feature.color}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className={`w-14 h-14 bg-gradient-to-br from-${feature.color}/20 to-${feature.color}/10 rounded-2xl flex items-center justify-center mb-4 float-animation relative z-10`}>
                <feature.icon className={`h-7 w-7 text-${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold mb-3 relative z-10">{feature.title}</h3>
              <p className="text-gray-600 relative z-10">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold gradient-text mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-600 text-lg">One plan, all features included</p>
        </div>
        <div className="max-w-md mx-auto">
          <div className="card-hover glass p-8 rounded-3xl border-2 border-white/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-voice-purple/5 to-info-blue/5" />
            <div className="text-center mb-6 relative z-10">
              <h3 className="text-2xl font-bold mb-2">Professional</h3>
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-5xl font-bold gradient-text">€99</span>
                <span className="text-xl text-gray-600">/month</span>
              </div>
              <p className="text-gray-600">Per restaurant location</p>
            </div>
            <ul className="space-y-4 mb-8 relative z-10">
              {[
                "Unlimited voice recordings",
                "OCR invoice processing",
                "Complete FSAI compliance",
                "Unlimited staff members",
                "Priority support"
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-success-green/20 to-success-green/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-success-green text-sm">✓</span>
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button 
              className="w-full bg-gradient-to-r from-voice-purple to-info-blue hover:opacity-90 btn-scale shadow-xl relative z-10" 
              size="lg" 
              onClick={() => navigate("/signup")}
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/20 glass py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2026 ChefVoice. FSAI-compliant HACCP management system.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;