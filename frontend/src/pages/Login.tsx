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
import type { LoginCredentials } from "@shared/schema";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      console.log("[Login] Attempting login:", credentials.email);
      const response = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      return response.json();
    },
    onSuccess: (data) => {
      console.log("[Login] Login successful:", data.user);
      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.name || data.user.username}!`,
      });
      navigate("/dashboard");
    },
    meta: {
      onError: (error: unknown) => {
        console.error("[Login] Login failed:", error);
        toast({
          title: "Login failed",
          description: String(error),
          variant: "destructive",
        });
      },
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
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
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to your HACCP compliance dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="chef@restaurant.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="transition-all duration-300 focus:scale-[1.02]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="transition-all duration-300 focus:scale-[1.02]"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-voice-purple to-blue-600 hover:from-voice-purple/90 hover:to-blue-600/90 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]" 
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <Button 
              variant="link" 
              className="p-0 text-voice-purple hover:text-blue-600 transition-colors" 
              onClick={() => navigate("/signup")}
            >
              Sign up
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;