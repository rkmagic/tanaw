import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2, MapPin, Calendar, Phone, User, Globe, Briefcase, Mail, Eye, EyeOff, Share2, Copy, Search, GraduationCap, FileText } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import { useAuth } from "@/contexts/AuthContext";
import { signUp, signIn, User as FirebaseUser } from "@/integrations/gcp/auth";
import { apiClient } from "@/integrations/gcp/api-client";
import JobsTab from "@/components/dashboard/JobsTab";
import DocumentsTab from "@/components/dashboard/DocumentsTab";

interface FormData {
  full_name: string;
  birthday: string;
  gender: string;
  mobile_number: string;
  past_work_experience: string;
  educational_background: string;
  desired_job: string;
  desired_country: string;
}

const europeanCountries = [
  "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic",
  "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary",
  "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands",
  "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden"
];

const JobSeekerChat = () => {
  const [step, setStep] = useState<"auth" | "form" | "confirm" | "success">("auth");
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  
  // Auth state
  const { user, session, loading: authLoading } = useAuth();
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  
  const [formData, setFormData] = useState<FormData>({
    full_name: "",
    birthday: "",
    gender: "",
    mobile_number: "",
    past_work_experience: "",
    educational_background: "",
    desired_job: "",
    desired_country: "",
  });
  const { toast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  // Redirect to candidate dashboard when profile is complete (e.g. returning user)
  useEffect(() => {
    if (step === "success") {
      navigate("/candidate/dashboard", { replace: true });
    }
  }, [step, navigate]);

  // Check for existing profile when user changes
  useEffect(() => {
    if (user && !authLoading) {
      checkExistingProfile();
    } else if (!user && !authLoading) {
      setStep("auth");
    }
  }, [user, authLoading]);

  const checkExistingProfile = async () => {
    if (!user) return;
    
    try {
      const profile = await apiClient.getMyProfile();
      // User already has a profile, go to success
      setFormData({
        full_name: profile.full_name || "",
        birthday: profile.birthday || "",
        gender: profile.gender || "",
        mobile_number: profile.mobile_number || "",
        past_work_experience: profile.past_work_experience || "",
        educational_background: profile.educational_background || "",
        desired_job: profile.desired_job || "",
        desired_country: profile.desired_country || "",
      });
      setProfileId(profile.id);
      setStep("success");
    } catch (error: any) {
      // Profile doesn't exist (404) or other error
      if (error.message?.includes("404") || error.message?.includes("not found")) {
        // No profile yet, go to form
        setStep("form");
      } else {
        console.error("Error checking profile:", error);
        setStep("form");
      }
    }
  };

  const handleSignUp = async () => {
    setIsSubmitting(true);
    setAuthError("");
    
    try {
      await signUp(authEmail, authPassword);
      toast({
        title: "Account Created!",
        description: "You can now complete your profile.",
      });
      // Auth state change will handle the transition
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setAuthError("This email is already registered. Please log in instead.");
      } else {
        setAuthError(error.message || "Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async () => {
    setIsSubmitting(true);
    setAuthError("");
    
    try {
      await signIn(authEmail, authPassword);
      toast({
        title: "Welcome back!",
        description: "Loading your profile...",
      });
      // Auth state change will handle the transition
    } catch (error: any) {
      setAuthError(error.message || "Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return (
      formData.full_name.trim() &&
      formData.birthday &&
      formData.gender &&
      formData.mobile_number.trim() &&
      formData.past_work_experience.trim() &&
      formData.educational_background.trim() &&
      formData.desired_job.trim() &&
      formData.desired_country
    );
  };

  const handleReviewClick = () => {
    if (isFormValid()) {
      setStep("confirm");
    } else {
      toast({
        variant: "destructive",
        title: "Incomplete Form",
        description: "Please fill in all fields before continuing.",
      });
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const profile = await apiClient.createProfile({
        full_name: formData.full_name,
        birthday: formData.birthday,
        gender: formData.gender,
        mobile_number: formData.mobile_number,
        past_work_experience: formData.past_work_experience,
        educational_background: formData.educational_background,
        desired_job: formData.desired_job,
        desired_country: formData.desired_country,
      });

      setProfileId(profile.id);
      setStep("success");
      toast({
        title: "Profile Created!",
        description: "Your profile is now live and shareable.",
      });
      navigate("/candidate/dashboard", { replace: true });
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateAge = (birthday: string) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getShareableLink = () => {
    return `${window.location.origin}/profile/${profileId}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getShareableLink());
    toast({
      title: "Link Copied!",
      description: "Share your profile link with employers.",
    });
  };

  const handleLogout = async () => {
    await signOut();
    setStep("auth");
    setFormData({
      full_name: "",
      birthday: "",
      gender: "",
      mobile_number: "",
      past_work_experience: "",
      educational_background: "",
      desired_job: "",
      desired_country: "",
    });
    setProfileId(null);
  };

  return (
    <div className="min-h-[100dvh] bg-primary flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 p-4 sm:p-6 border-b border-cream/10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            to="/job-seeker"
            className="flex items-center gap-2 text-cream/70 hover:text-cream transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">{t("chat.back")}</span>
          </Link>
          <h1 className="text-xl font-display font-bold text-cream">{t("chat.assistant")}</h1>
          <div className="flex items-center gap-2">
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-cream/70 hover:text-cream hover:bg-cream/10"
              >
                Logout
              </Button>
            )}
            <LanguageToggle variant="light" />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <div className="max-w-xl mx-auto">
          
          {/* Step 1: Authentication */}
          {step === "auth" && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-display font-bold text-cream mb-2">
                  {authMode === "signup" ? "Create Your Account" : "Welcome Back"}
                </h2>
                <p className="text-cream/60">
                  {authMode === "signup" 
                    ? "Sign up to create your professional profile" 
                    : "Log in to access your profile"}
                </p>
              </div>

              <Tabs value={authMode} onValueChange={(v) => setAuthMode(v as "login" | "signup")} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-cream/10 mb-6">
                  <TabsTrigger value="signup" className="text-cream data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                    Sign Up
                  </TabsTrigger>
                  <TabsTrigger value="login" className="text-cream data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                    Log In
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signup" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-cream">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cream/40" />
                      <Input
                        id="signup-email"
                        type="email"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="bg-cream/10 border-cream/20 text-cream placeholder:text-cream/40 focus-visible:ring-secondary pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-cream">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="Create a password (min 6 characters)"
                        className="bg-cream/10 border-cream/20 text-cream placeholder:text-cream/40 focus-visible:ring-secondary pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  {authError && (
                    <p className="text-red-400 text-sm">{authError}</p>
                  )}
                  
                  <Button
                    onClick={handleSignUp}
                    variant="gold"
                    className="w-full mt-4"
                    disabled={isSubmitting || !authEmail || authPassword.length < 6}
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </TabsContent>

                <TabsContent value="login" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-cream">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cream/40" />
                      <Input
                        id="login-email"
                        type="email"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="bg-cream/10 border-cream/20 text-cream placeholder:text-cream/40 focus-visible:ring-secondary pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-cream">Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="bg-cream/10 border-cream/20 text-cream placeholder:text-cream/40 focus-visible:ring-secondary pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  {authError && (
                    <p className="text-red-400 text-sm">{authError}</p>
                  )}
                  
                  <Button
                    onClick={handleLogin}
                    variant="gold"
                    className="w-full mt-4"
                    disabled={isSubmitting || !authEmail || !authPassword}
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log In"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Step 2: Form */}
          {step === "form" && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-display font-bold text-cream mb-2">
                  Tell Us About Yourself
                </h2>
                <p className="text-cream/60">
                  Fill in the details below to complete your profile
                </p>
              </div>

              <div className="space-y-5">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-cream">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange("full_name", e.target.value)}
                    placeholder="Juan Dela Cruz"
                    className="bg-cream/10 border-cream/20 text-cream placeholder:text-cream/40 focus-visible:ring-secondary"
                  />
                </div>

                {/* Birthday */}
                <div className="space-y-2">
                  <Label htmlFor="birthday" className="text-cream">Birthday *</Label>
                  <Input
                    id="birthday"
                    type="date"
                    value={formData.birthday}
                    onChange={(e) => handleInputChange("birthday", e.target.value)}
                    className="bg-cream/10 border-cream/20 text-cream placeholder:text-cream/40 focus-visible:ring-secondary [color-scheme:dark]"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label className="text-cream">Gender *</Label>
                  <Select value={formData.gender} onValueChange={(v) => handleInputChange("gender", v)}>
                    <SelectTrigger className="bg-cream/10 border-cream/20 text-cream focus:ring-secondary">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-primary border-cream/20">
                      <SelectItem value="male" className="text-cream hover:bg-cream/10">Male</SelectItem>
                      <SelectItem value="female" className="text-cream hover:bg-cream/10">Female</SelectItem>
                      <SelectItem value="other" className="text-cream hover:bg-cream/10">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say" className="text-cream hover:bg-cream/10">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Mobile Number */}
                <div className="space-y-2">
                  <Label htmlFor="mobile" className="text-cream">Mobile Number *</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    value={formData.mobile_number}
                    onChange={(e) => handleInputChange("mobile_number", e.target.value)}
                    placeholder="+63 912 345 6789"
                    className="bg-cream/10 border-cream/20 text-cream placeholder:text-cream/40 focus-visible:ring-secondary"
                  />
                </div>

                {/* Past Work Experience */}
                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-cream">Past Work Experience *</Label>
                  <Textarea
                    id="experience"
                    value={formData.past_work_experience}
                    onChange={(e) => handleInputChange("past_work_experience", e.target.value)}
                    placeholder="e.g., 3 years as a caregiver in Saudi Arabia, 2 years as a factory worker in Taiwan..."
                    rows={3}
                    className="bg-cream/10 border-cream/20 text-cream placeholder:text-cream/40 focus-visible:ring-secondary resize-none"
                  />
                </div>

                {/* Educational Background */}
                <div className="space-y-2">
                  <Label htmlFor="education" className="text-cream">Educational Background *</Label>
                  <Textarea
                    id="education"
                    value={formData.educational_background}
                    onChange={(e) => handleInputChange("educational_background", e.target.value)}
                    placeholder="e.g., Bachelor's in Nursing from University of Santo Tomas, TESDA NC II in Caregiving..."
                    rows={3}
                    className="bg-cream/10 border-cream/20 text-cream placeholder:text-cream/40 focus-visible:ring-secondary resize-none"
                  />
                </div>

                {/* Desired Job */}
                <div className="space-y-2">
                  <Label htmlFor="job" className="text-cream">Desired Job *</Label>
                  <Input
                    id="job"
                    value={formData.desired_job}
                    onChange={(e) => handleInputChange("desired_job", e.target.value)}
                    placeholder="e.g., Caregiver, Factory Worker, Hotel Staff..."
                    className="bg-cream/10 border-cream/20 text-cream placeholder:text-cream/40 focus-visible:ring-secondary"
                  />
                </div>

                {/* Desired Country */}
                <div className="space-y-2">
                  <Label className="text-cream">Desired Country of Work *</Label>
                  <Select value={formData.desired_country} onValueChange={(v) => handleInputChange("desired_country", v)}>
                    <SelectTrigger className="bg-cream/10 border-cream/20 text-cream focus:ring-secondary">
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent className="bg-primary border-cream/20 max-h-60">
                      {europeanCountries.map((country) => (
                        <SelectItem key={country} value={country} className="text-cream hover:bg-cream/10">
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleReviewClick}
                  variant="gold"
                  className="w-full mt-6"
                  disabled={!isFormValid()}
                >
                  Review Your Information
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === "confirm" && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-display font-bold text-cream mb-2">
                  Confirm Your Details
                </h2>
                <p className="text-cream/60">
                  Please review your information before submitting
                </p>
              </div>

              <div className="bg-cream/10 rounded-2xl p-6 space-y-4 mb-6">
                <div className="flex justify-between border-b border-cream/10 pb-3">
                  <span className="text-cream/60">Full Name</span>
                  <span className="text-cream font-medium">{formData.full_name}</span>
                </div>
                <div className="flex justify-between border-b border-cream/10 pb-3">
                  <span className="text-cream/60">Birthday</span>
                  <span className="text-cream font-medium">
                    {new Date(formData.birthday).toLocaleDateString('en-US', { 
                      year: 'numeric', month: 'long', day: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="flex justify-between border-b border-cream/10 pb-3">
                  <span className="text-cream/60">Gender</span>
                  <span className="text-cream font-medium capitalize">{formData.gender.replace("-", " ")}</span>
                </div>
                <div className="flex justify-between border-b border-cream/10 pb-3">
                  <span className="text-cream/60">Mobile Number</span>
                  <span className="text-cream font-medium">{formData.mobile_number}</span>
                </div>
                <div className="flex flex-col border-b border-cream/10 pb-3">
                  <span className="text-cream/60 mb-1">Past Work Experience</span>
                  <span className="text-cream font-medium">{formData.past_work_experience}</span>
                </div>
                <div className="flex flex-col border-b border-cream/10 pb-3">
                  <span className="text-cream/60 mb-1">Educational Background</span>
                  <span className="text-cream font-medium">{formData.educational_background}</span>
                </div>
                <div className="flex justify-between border-b border-cream/10 pb-3">
                  <span className="text-cream/60">Desired Job</span>
                  <span className="text-cream font-medium">{formData.desired_job}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cream/60">Desired Country</span>
                  <span className="text-cream font-medium">{formData.desired_country}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep("form")}
                  className="flex-1 border-primary bg-cream text-primary hover:bg-cream/90 font-semibold"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="gold"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Confirm & Submit
                      <Check className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 4 & 5: Success + Profile Dashboard */}
          {step === "success" && (
            <div className="animate-fade-in">
              {/* Success Banner */}
              <div className="bg-secondary/20 border border-secondary/30 rounded-xl p-4 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center flex-shrink-0">
                  <Check className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-cream font-semibold">Profile Created!</p>
                  <p className="text-cream/60 text-sm">Your profile is now live and shareable.</p>
                </div>
              </div>


              {/* Share Link */}
              {profileId && (
                <div className="bg-cream/10 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Share2 className="h-4 w-4 text-secondary" />
                    <span className="text-cream font-semibold text-sm">Your Shareable Profile Link</span>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={getShareableLink()}
                      readOnly
                      className="bg-cream/5 border-cream/20 text-cream text-sm"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={copyToClipboard}
                      className="flex-shrink-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Dashboard Tabs */}
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="w-full bg-cream/10 border border-cream/20 p-1 mb-6 grid grid-cols-3">
                  <TabsTrigger 
                    value="profile" 
                    className="data-[state=active]:bg-cream data-[state=active]:text-primary text-cream"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger 
                    value="documents" 
                    className="data-[state=active]:bg-cream data-[state=active]:text-primary text-cream"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Documents
                  </TabsTrigger>
                  <TabsTrigger 
                    value="jobs" 
                    className="data-[state=active]:bg-cream data-[state=active]:text-primary text-cream"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Jobs
                  </TabsTrigger>
                </TabsList>

                {/* Profile Tab Content */}
                <TabsContent value="profile" className="mt-0">
                  {/* Profile Card - LinkedIn Style */}
                  <div className="bg-cream rounded-2xl overflow-hidden shadow-xl">
                    {/* Cover Photo */}
                    <div className="h-24 bg-gradient-to-r from-primary via-primary/80 to-secondary/60" />
                    
                    {/* Profile Header */}
                    <div className="px-6 pb-6 -mt-12">
                      {/* Avatar */}
                      <div className="w-24 h-24 rounded-full bg-primary border-4 border-cream flex items-center justify-center mb-4">
                        <span className="text-2xl font-bold text-cream">{getInitials(formData.full_name)}</span>
                      </div>

                      {/* Name & Verification Status */}
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h2 className="text-2xl font-display font-bold text-primary">
                          {formData.full_name}
                        </h2>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium border border-amber-200">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Pending Verification
                        </span>
                      </div>
                      <p className="text-lg text-primary/80 font-medium mb-2">
                        {formData.desired_job}
                      </p>
                      
                      {/* Location Badge */}
                      <div className="flex items-center gap-2 text-primary/60 mb-4">
                        <MapPin className="h-4 w-4" />
                        <span>Seeking work in {formData.desired_country}</span>
                      </div>

                      {/* Quick Stats */}
                      <div className="flex flex-wrap gap-3 mb-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                          <User className="h-3.5 w-3.5" />
                          {formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1).replace("-", " ")}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                          <Calendar className="h-3.5 w-3.5" />
                          {calculateAge(formData.birthday)} years old
                        </span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-primary/10" />

                    {/* Contact Section */}
                    <div className="px-6 py-5">
                      <h3 className="text-sm font-semibold text-primary/60 uppercase tracking-wide mb-3">
                        Contact Information
                      </h3>
                      <div className="flex items-center gap-3 text-primary">
                        <Phone className="h-5 w-5 text-primary/60" />
                        <span className="font-medium">{formData.mobile_number}</span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-primary/10" />

                    {/* Experience Section */}
                    <div className="px-6 py-5">
                      <h3 className="text-sm font-semibold text-primary/60 uppercase tracking-wide mb-3">
                        Work Experience
                      </h3>
                      <div className="flex items-start gap-3">
                        <Briefcase className="h-5 w-5 text-primary/60 mt-0.5" />
                        <p className="text-primary">{formData.past_work_experience}</p>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-primary/10" />

                    {/* Education Section */}
                    {formData.educational_background && (
                      <>
                        <div className="px-6 py-5">
                          <h3 className="text-sm font-semibold text-primary/60 uppercase tracking-wide mb-3">
                            Educational Background
                          </h3>
                          <div className="flex items-start gap-3">
                            <GraduationCap className="h-5 w-5 text-primary/60 mt-0.5" />
                            <p className="text-primary">{formData.educational_background}</p>
                          </div>
                        </div>
                        <div className="h-px bg-primary/10" />
                      </>
                    )}

                    {/* Career Goals */}
                    <div className="px-6 py-5">
                      <h3 className="text-sm font-semibold text-primary/60 uppercase tracking-wide mb-3">
                        Career Goals
                      </h3>
                      <div className="flex items-start gap-3">
                        <Globe className="h-5 w-5 text-primary/60 mt-0.5" />
                        <p className="text-primary">
                          Looking for opportunities as a <strong>{formData.desired_job}</strong> in <strong>{formData.desired_country}</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Documents Tab Content */}
                <TabsContent value="documents" className="mt-0">
                  {user && <DocumentsTab userId={user.id} />}
                </TabsContent>

                {/* Jobs Tab Content */}
                <TabsContent value="jobs" className="mt-0">
                  <JobsTab 
                    userDesiredJob={formData.desired_job} 
                    userDesiredCountry={formData.desired_country} 
                  />
                </TabsContent>
              </Tabs>

              {/* Back to Home */}
              <div className="mt-6 text-center">
                <Link to="/">
                  <Button variant="outline" className="border-cream/30 text-primary bg-cream hover:bg-cream/90">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSeekerChat;
