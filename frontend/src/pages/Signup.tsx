import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { SignupData } from "@shared/schema";

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    restaurantName: "",
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupData) => {
      console.log("[Signup] Attempting signup:", data.email);
      const response = await apiRequest("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: (data) => {
      console.log("[Signup] Signup successful:", data.user);
      toast({
        title: "Account created",
        description: `Welcome to ChefVoice, ${data.user.name || data.user.username}!`,
      });
      navigate("/dashboard");
    },
    meta: {
      onError: (error: unknown) => {
        console.error("[Signup] Signup failed:", error);
        toast({
          title: "Signup failed",
          description: String(error),
          variant: "destructive",
        });
      },
    },
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    signupMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4 animate-float">
            <Mic className="h-8 w-8 text-voice-purple" />
            <span className="text-2xl font-bold bg-gradient-to-r from-voice-purple to-blue-600 bg-clip-text text-transparent">
              ChefVoice
            </span>
          </div>
          <CardTitle className="text-2xl">Create Your Account</CardTitle>
          <CardDescription>Start your 14-day free trial today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="restaurantName">Restaurant Name</Label>
              <Input
                id="restaurantName"
                type="text"
                placeholder="Your Restaurant"
                value={formData.restaurantName}
                onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                className="transition-all duration-300 focus:scale-[1.02]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="transition-all duration-300 focus:scale-[1.02]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="johndoe"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                className="transition-all duration-300 focus:scale-[1.02]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="chef@restaurant.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="transition-all duration-300 focus:scale-[1.02]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="transition-all duration-300 focus:scale-[1.02]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                className="transition-all duration-300 focus:scale-[1.02]"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-voice-purple to-blue-600 hover:from-voice-purple/90 hover:to-blue-600/90 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]" 
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Button 
              variant="link" 
              className="p-0 text-voice-purple hover:text-blue-600 transition-colors" 
              onClick={() => navigate("/login")}
            >
              Sign in
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;