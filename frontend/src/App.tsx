import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Refrigeration from "./pages/Refrigeration";
import Delivery from "./pages/Delivery";
import CookCoolReheat from "./pages/CookCoolReheat";
import HotHolding from "./pages/HotHolding";
import HygieneInspection from "./pages/HygieneInspection";
import Training from "./pages/Training";
import FitnessToWork from "./pages/FitnessToWork";
import ThermometerCheck from "./pages/ThermometerCheck";
import Reports from "./pages/Reports";
import Compliance from "./pages/Compliance";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/refrigeration" element={<Refrigeration />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/cook-cool-reheat" element={<CookCoolReheat />} />
          <Route path="/hot-holding" element={<HotHolding />} />
          <Route path="/hygiene-inspection" element={<HygieneInspection />} />
          <Route path="/training" element={<Training />} />
          <Route path="/fitness-to-work" element={<FitnessToWork />} />
          <Route path="/thermometer-check" element={<ThermometerCheck />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;