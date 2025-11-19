import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Stethoscope, Users, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Stethoscope className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-bold text-foreground">EHR System</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Comprehensive Electronic Health Records management for healthcare providers and patients
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mb-12">
          <Card className="text-center">
            <CardHeader>
              <Users className="w-8 h-8 text-primary mx-auto mb-2" />
              <CardTitle>Patient Management</CardTitle>
              <CardDescription>
                Comprehensive patient records, diagnoses, prescriptions, and medical history
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Stethoscope className="w-8 h-8 text-primary mx-auto mb-2" />
              <CardTitle>Doctor Tools</CardTitle>
              <CardDescription>
                Advanced tools for diagnosis, prescription management, and patient care
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
              <CardTitle>Secure & Compliant</CardTitle>
              <CardDescription>
                HIPAA compliant platform with enterprise-grade security for health data
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Button */}
        <Button 
          size="lg" 
          className="text-lg px-8 py-6"
          onClick={() => navigate("/login")}
        >
          Access EHR System
        </Button>
      </div>
    </div>
  );
};

export default Index;
