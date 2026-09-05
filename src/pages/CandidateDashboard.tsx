import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Copy,
  Share2,
  User,
  FileText,
  Search,
  MapPin,
  Calendar,
  Phone,
  Briefcase,
  GraduationCap,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/integrations/gcp/api-client";
import type { Profile } from "@/integrations/gcp/types";
import DocumentsTab from "@/components/dashboard/DocumentsTab";
import JobsTab from "@/components/dashboard/JobsTab";

const CandidateDashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    apiClient
      .getMyProfile()
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [user]);

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const calculateAge = (birthday: string | null) => {
    if (!birthday) return null;
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const getShareableLink = () =>
    profile ? `${window.location.origin}/profile/${profile.id}` : "";

  const copyToClipboard = () => {
    if (!profile) return;
    navigator.clipboard.writeText(getShareableLink());
    toast({ title: "Link copied", description: "Share your profile link with employers." });
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No profile yet. Complete your profile first.</p>
          <Link to="/job-seeker/chat">
            <Button>Go to profile setup</Button>
          </Link>
        </div>
      </div>
    );
  }

  const fullName = profile.full_name ?? "";
  const gender = profile.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1).replace("-", " ") : "";

  return (
    <div className="min-h-[100dvh] bg-primary flex flex-col">
      <header className="flex-shrink-0 p-4 sm:p-6 border-b border-cream/10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-cream/70 hover:text-cream transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back</span>
          </Link>
          <h1 className="text-xl font-display font-bold text-cream">Candidate Dashboard</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut()}
            className="text-cream/70 hover:text-cream hover:bg-cream/10"
          >
            Logout
          </Button>
        </div>
      </header>

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <div className="max-w-xl mx-auto">
          <div className="bg-secondary/20 border border-secondary/30 rounded-xl p-4 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center flex-shrink-0">
              <Check className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-cream font-semibold">Your profile is live</p>
              <p className="text-cream/60 text-sm">Share the link below with employers.</p>
            </div>
          </div>

          <div className="bg-cream/10 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Share2 className="h-4 w-4 text-secondary" />
              <span className="text-cream font-semibold text-sm">Shareable profile link</span>
            </div>
            <div className="flex gap-2">
              <Input value={getShareableLink()} readOnly className="bg-cream/5 border-cream/20 text-cream text-sm" />
              <Button variant="secondary" size="sm" onClick={copyToClipboard} className="flex-shrink-0">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="w-full bg-cream/10 border border-cream/20 p-1 mb-6 grid grid-cols-3">
              <TabsTrigger value="profile" className="data-[state=active]:bg-cream data-[state=active]:text-primary text-cream">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="documents" className="data-[state=active]:bg-cream data-[state=active]:text-primary text-cream">
                <FileText className="h-4 w-4 mr-2" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="jobs" className="data-[state=active]:bg-cream data-[state=active]:text-primary text-cream">
                <Search className="h-4 w-4 mr-2" />
                Jobs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-0">
              <div className="bg-cream rounded-2xl overflow-hidden shadow-xl">
                <div className="h-24 bg-gradient-to-r from-primary via-primary/80 to-secondary/60" />
                <div className="px-6 pb-6 -mt-12">
                  <div className="w-24 h-24 rounded-full bg-primary border-4 border-cream flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-cream">{getInitials(profile.full_name)}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="text-2xl font-display font-bold text-primary">{fullName}</h2>
                    <span className="inline-flex items-center px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium border border-amber-200">
                      Pending Verification
                    </span>
                  </div>
                  <p className="text-lg text-primary/80 font-medium mb-2">{profile.desired_job ?? ""}</p>
                  <div className="flex items-center gap-2 text-primary/60 mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>Seeking work in {profile.desired_country ?? ""}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 mb-6">
                    {gender && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        <User className="h-3.5 w-3.5" />
                        {gender}
                      </span>
                    )}
                    {profile.birthday && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        <Calendar className="h-3.5 w-3.5" />
                        {calculateAge(profile.birthday)} years old
                      </span>
                    )}
                  </div>
                </div>
                <div className="h-px bg-primary/10" />
                {profile.mobile_number && (
                  <>
                    <div className="px-6 py-5">
                      <h3 className="text-sm font-semibold text-primary/60 uppercase tracking-wide mb-3">Contact</h3>
                      <div className="flex items-center gap-3 text-primary">
                        <Phone className="h-5 w-5 text-primary/60" />
                        <span className="font-medium">{profile.mobile_number}</span>
                      </div>
                    </div>
                    <div className="h-px bg-primary/10" />
                  </>
                )}
                <div className="px-6 py-5">
                  <h3 className="text-sm font-semibold text-primary/60 uppercase tracking-wide mb-3">Work experience</h3>
                  <div className="flex items-start gap-3">
                    <Briefcase className="h-5 w-5 text-primary/60 mt-0.5" />
                    <p className="text-primary">{profile.past_work_experience ?? ""}</p>
                  </div>
                </div>
                <div className="h-px bg-primary/10" />
                {profile.educational_background && (
                  <>
                    <div className="px-6 py-5">
                      <h3 className="text-sm font-semibold text-primary/60 uppercase tracking-wide mb-3">Education</h3>
                      <div className="flex items-start gap-3">
                        <GraduationCap className="h-5 w-5 text-primary/60 mt-0.5" />
                        <p className="text-primary">{profile.educational_background}</p>
                      </div>
                    </div>
                    <div className="h-px bg-primary/10" />
                  </>
                )}
                <div className="px-6 py-5">
                  <h3 className="text-sm font-semibold text-primary/60 uppercase tracking-wide mb-3">Career goals</h3>
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-primary/60 mt-0.5" />
                    <p className="text-primary">
                      Looking for opportunities as a <strong>{profile.desired_job ?? ""}</strong> in{" "}
                      <strong>{profile.desired_country ?? ""}</strong>
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="mt-0">
              <DocumentsTab userId={user.uid} />
            </TabsContent>

            <TabsContent value="jobs" className="mt-0">
              <JobsTab
                userDesiredJob={profile.desired_job ?? ""}
                userDesiredCountry={profile.desired_country ?? ""}
              />
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <Link to="/">
              <Button variant="outline" className="border-cream/30 text-primary bg-cream hover:bg-cream/90">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
