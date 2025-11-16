import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Stethoscope, Users, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Boxes } from "@/components/ui/background-boxes";
import { cn } from "@/lib/utils";

const Index = () => {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();

  useEffect(() => {
    // Redirect authenticated users to their dashboard
    if (user && userRole) {
      const redirectPath = userRole === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard';
      navigate(redirectPath, { replace: true });
    }
  }, [user, userRole, navigate]);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section with Background Boxes */}
      <div className="relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center min-h-screen p-8">
        <div 
          className="absolute inset-0 w-full h-full bg-slate-900 z-20 pointer-events-none" 
          style={{
            maskImage: 'radial-gradient(ellipse at center, transparent 20%, white 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 20%, white 70%)'
          }}
        />
        <Boxes />
        
        <div className="text-center mb-12 relative z-20">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Stethoscope className="w-12 h-12 text-blue-400" />
            <h1 className={cn("text-5xl font-bold text-white")}>EHR System</h1>
          </div>
          <p className="text-xl text-neutral-300 max-w-2xl">
            Comprehensive Electronic Health Records management for healthcare providers and patients
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mb-12 relative z-20">
          <Card className="text-center bg-slate-800/80 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <CardTitle className="text-white">Patient Management</CardTitle>
              <CardDescription className="text-neutral-300">
                Comprehensive patient records, diagnoses, prescriptions, and medical history
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center bg-slate-800/80 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <Stethoscope className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <CardTitle className="text-white">Doctor Tools</CardTitle>
              <CardDescription className="text-neutral-300">
                Advanced tools for diagnosis, prescription management, and patient care
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center bg-slate-800/80 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <CardTitle className="text-white">Secure & Compliant</CardTitle>
              <CardDescription className="text-neutral-300">
                HIPAA compliant platform with enterprise-grade security for health data
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Button */}
        <Button 
          size="lg" 
          className="text-lg px-8 py-6 relative z-20 bg-blue-600 hover:bg-blue-700"
          onClick={() => navigate("/login")}
        >
          Access EHR System
        </Button>
      </div>
    </div>
  );
};

export default Index;
