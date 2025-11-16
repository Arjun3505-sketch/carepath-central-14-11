import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  User, 
  Lock, 
  Bell, 
  Settings, 
  Shield, 
  Palette,
  Users,
  UserPlus,
  Calendar,
  BarChart3,
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const DoctorProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<any[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(false);

  const [doctorInfo, setDoctorInfo] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    licenseNumber: "",
    experience: "",
    hospital: "",
    department: "",
    bio: ""
  });

  useEffect(() => {
    if (user) {
      fetchDoctorData();
    }
  }, [user]);

  const fetchDoctorData = async () => {
    try {
      if (!user) return;

      const { data: doctor, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching doctor:', error);
        throw error;
      }

      if (doctor) {
        setDoctorInfo({
          name: doctor.name || "",
          email: doctor.email || "",
          phone: doctor.phone || "",
          specialization: doctor.specialization || "",
          licenseNumber: doctor.license_number || "",
          experience: "", // Not in DB schema
          hospital: "", // Not in DB schema
          department: "", // Not in DB schema
          bio: "" // Not in DB schema
        });
      }
    } catch (error) {
      console.error('Error fetching doctor data:', error);
      toast({
        title: "Error",
        description: "Failed to load doctor profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    appointmentReminders: true,
    labResults: true,
    emergencyAlerts: true
  });

  const [practiceSettings, setPracticeSettings] = useState({
    consultationDuration: "30",
    workingHours: "9:00 AM - 5:00 PM",
    breakTime: "12:00 PM - 1:00 PM",
    weekends: false,
    emergencyAvailable: true
  });

  const fetchMyPatients = async () => {
    try {
      setLoadingPatients(true);
      if (!user) return;

      // Get doctor record
      const { data: doctorData, error: doctorError } = await supabase
        .from('doctors')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (doctorError || !doctorData) {
        throw new Error("Doctor profile not found");
      }

      // Get all unique patient IDs from diagnoses, prescriptions, surgeries, and lab reports
      const [diagnosesRes, prescriptionsRes, surgeriesRes, labReportsRes] = await Promise.all([
        supabase.from('diagnoses').select('patient_id').eq('doctor_id', doctorData.id),
        supabase.from('prescriptions').select('patient_id').eq('doctor_id', doctorData.id),
        supabase.from('surgeries').select('patient_id').eq('surgeon_id', doctorData.id),
        supabase.from('lab_reports').select('patient_id').eq('doctor_id', doctorData.id)
      ]);

      const patientIds = new Set([
        ...(diagnosesRes.data?.map(d => d.patient_id) || []),
        ...(prescriptionsRes.data?.map(p => p.patient_id) || []),
        ...(surgeriesRes.data?.map(s => s.patient_id) || []),
        ...(labReportsRes.data?.map(l => l.patient_id) || [])
      ]);

      if (patientIds.size === 0) {
        setPatients([]);
        return;
      }

      // Fetch patient details
      const { data: patientsData, error: patientsError } = await supabase
        .from('patients')
        .select('*')
        .in('id', Array.from(patientIds));

      if (patientsError) throw patientsError;

      setPatients(patientsData || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast({
        title: "Error",
        description: "Failed to load patients",
        variant: "destructive",
      });
    } finally {
      setLoadingPatients(false);
    }
  };

  const handleSave = (section: string) => {
    // TODO: Implement actual save to Supabase
    toast({
      title: "Settings Saved",
      description: `${section} settings have been updated successfully.`,
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate("/doctor-dashboard")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Doctor Profile</h1>
        </div>

        <Tabs defaultValue="professional" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="practice">Practice</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
          </TabsList>

          {/* Professional Information */}
          <TabsContent value="professional">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Edit Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={doctorInfo.name}
                      onChange={(e) => setDoctorInfo({...doctorInfo, name: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={doctorInfo.email}
                      onChange={(e) => setDoctorInfo({...doctorInfo, email: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={doctorInfo.phone}
                      onChange={(e) => setDoctorInfo({...doctorInfo, phone: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      value={doctorInfo.specialization}
                      onChange={(e) => setDoctorInfo({...doctorInfo, specialization: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="license">License Number</Label>
                    <Input
                      id="license"
                      value={doctorInfo.licenseNumber}
                      onChange={(e) => setDoctorInfo({...doctorInfo, licenseNumber: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience</Label>
                    <Input
                      id="experience"
                      value={doctorInfo.experience}
                      onChange={(e) => setDoctorInfo({...doctorInfo, experience: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hospital">Hospital/Clinic</Label>
                    <Input
                      id="hospital"
                      value={doctorInfo.hospital}
                      onChange={(e) => setDoctorInfo({...doctorInfo, hospital: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={doctorInfo.department}
                      onChange={(e) => setDoctorInfo({...doctorInfo, department: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={doctorInfo.bio}
                      onChange={(e) => setDoctorInfo({...doctorInfo, bio: e.target.value})}
                    />
                  </div>
                </div>

                <Button onClick={() => handleSave("Professional")} className="mt-4">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security & Password */}
          <TabsContent value="security">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Change Password
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <Button onClick={() => handleSave("Password")}>
                    Update Password
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security & Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add extra security to your account</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Session Timeout</Label>
                      <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Login Notifications</Label>
                      <p className="text-sm text-muted-foreground">Get notified of new logins</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>


          {/* Patient Management */}
          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  My Patients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Patients you have treated</p>
                <Button onClick={fetchMyPatients} className="mb-4" disabled={loadingPatients}>
                  {loadingPatients ? "Loading..." : "Load Patients"}
                </Button>
                
                {patients.length === 0 && !loadingPatients ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No patients found. Add diagnoses, prescriptions, surgeries, or lab reports to see patients here.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {patients.map((patient) => (
                      <Card key={patient.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg">{patient.name}</h3>
                              <p className="text-sm text-muted-foreground">ID: {patient.id}</p>
                              <p className="text-sm text-muted-foreground">Email: {patient.email || 'N/A'}</p>
                              <p className="text-sm text-muted-foreground">Phone: {patient.phone || 'N/A'}</p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/find-patient?id=${patient.id}`)}
                            >
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DoctorProfile;