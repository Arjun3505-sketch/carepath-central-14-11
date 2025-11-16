import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { GlobeDemo } from "@/components/ui/GlobeDemo";

const authSchema = z.object({
  email: z.string().email("Invalid email address").max(255, "Email too long"),
  password: z.string().min(6, "Password must be at least 6 characters").max(100, "Password too long"),
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long").optional()
});

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { signIn, signUp, user, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in and check if profile setup is needed
    const checkAndRedirect = async () => {
      if (user && userRole) {
        try {
          if (userRole === 'doctor') {
            // Check if doctor profile exists and is complete
            const { data, error } = await supabase
              .from('doctors')
              .select('specialization, license_number')
              .eq('user_id', user.id)
              .maybeSingle();
            
            if (error) {
              console.error('Error checking doctor profile:', error);
              return;
            }
            
            // Redirect to setup if no record exists or fields are incomplete
            if (!data || !data.specialization || !data.license_number) {
              navigate('/doctor-profile-setup', { replace: true });
              return;
            }
            
            navigate('/doctor-dashboard', { replace: true });
          } else if (userRole === 'patient') {
            // Check if patient profile exists
            const { data, error } = await supabase
              .from('patients')
              .select('id')
              .eq('user_id', user.id)
              .maybeSingle();
            
            if (error) {
              console.error('Error checking patient profile:', error);
              return;
            }
            
            if (!data) {
              navigate('/patient-profile-setup', { replace: true });
              return;
            }
            
            navigate('/patient-dashboard', { replace: true });
          }
        } catch (error) {
          console.error('Error in redirect logic:', error);
        }
      }
    };
    
    checkAndRedirect();
  }, [user, userRole, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate inputs
      const validation = authSchema.safeParse({
        email: email.trim(),
        password,
        fullName: isLogin ? undefined : fullName.trim()
      });

      if (!validation.success) {
        toast({
          title: "Validation Error",
          description: validation.error.errors[0].message,
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      if (isLogin) {
        const { error } = await signIn(email.trim(), password);
        
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast({
              title: "Login Failed",
              description: "Invalid email or password. Please try again.",
              variant: "destructive"
            });
          } else if (error.message.includes("Email not confirmed")) {
            toast({
              title: "Email Not Confirmed",
              description: "Please check your email and confirm your account before logging in.",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Login Failed",
              description: error.message || "An error occurred during login",
              variant: "destructive"
            });
          }
        } else {
          toast({
            title: "Success",
            description: "Logged in successfully!"
          });
        }
      } else {
        const { error } = await signUp(email.trim(), password, fullName.trim());
        
        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Account Exists",
              description: "This email is already registered. Please login instead.",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Sign Up Failed",
              description: error.message || "An error occurred during sign up",
              variant: "destructive"
            });
          }
        } else {
          toast({
            title: "Success",
            description: "Account created! Please check your email to confirm your account.",
          });
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900">
      {/* Left side - Globe */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden">
        <GlobeDemo />
      </div>
      
      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 bg-slate-900">
        <Card className="w-full max-w-md bg-slate-800/80 backdrop-blur-sm border-slate-700">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">EHR System</CardTitle>
            <CardDescription className="text-neutral-300">
              {isLogin ? "Sign in to access your electronic health records" : "Create your account to get started"}
            </CardDescription>
          </CardHeader>
        
          <Tabs value={isLogin ? "login" : "signup"} onValueChange={(v) => setIsLogin(v === "login")} className="px-6">
            <TabsList className="grid w-full grid-cols-2 bg-slate-700/50">
              <TabsTrigger value="login" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Login</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Sign Up</TabsTrigger>
            </TabsList>
          
            <TabsContent value="login">
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4 px-0">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-neutral-200">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-neutral-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-neutral-200">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-neutral-400"
                    />
                  </div>
                </CardContent>
                <CardFooter className="px-0">
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          
            <TabsContent value="signup">
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4 px-0">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-neutral-200">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      disabled={loading}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-neutral-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-neutral-200">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-neutral-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-neutral-200">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password (min 6 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-neutral-400"
                    />
                  </div>
                </CardContent>
                <CardFooter className="px-0">
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                    {loading ? "Creating account..." : "Sign Up"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Login;