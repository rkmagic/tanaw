import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, User, Globe, Briefcase, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/integrations/gcp/api-client";
import type { PublicProfile } from "@/integrations/gcp/types";

const PublicProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) {
        setError("Profile not found");
        setLoading(false);
        return;
      }

      try {
        const data = await apiClient.getProfile(id);
        setProfile(data);
      } catch (fetchError: any) {
        if (fetchError.message?.includes("404") || fetchError.message?.includes("not found")) {
          setError("Profile not found");
        } else {
          setError("Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);


  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-cream animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold text-cream mb-2">
            {error || "Profile Not Found"}
          </h1>
          <p className="text-cream/60 mb-6">
            This profile may have been removed or the link is incorrect.
          </p>
          <Link to="/">
            <Button variant="gold">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go to Homepage
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <header className="p-4 sm:p-6 border-b border-cream/10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-cream/70 hover:text-cream transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Home</span>
          </Link>
          <h1 className="text-xl font-display font-bold text-cream">Candidate Profile</h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <div className="max-w-xl mx-auto">
          {/* Profile Card - LinkedIn Style */}
          <div className="bg-cream rounded-2xl overflow-hidden shadow-xl">
            {/* Cover Photo */}
            <div className="h-24 bg-gradient-to-r from-primary via-primary/80 to-secondary/60" />
            
            {/* Profile Header */}
            <div className="px-6 pb-6 -mt-12">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-primary border-4 border-cream flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-cream">
                  {profile.full_name ? getInitials(profile.full_name) : "??"}
                </span>
              </div>

              {/* Name & Title */}
              <h2 className="text-2xl font-display font-bold text-primary mb-1">
                {profile.full_name || "Unknown"}
              </h2>
              <p className="text-lg text-primary/80 font-medium mb-2">
                {profile.desired_job || "Job Seeker"}
              </p>
              
              {/* Location Badge */}
              {profile.desired_country && (
                <div className="flex items-center gap-2 text-primary/60 mb-4">
                  <MapPin className="h-4 w-4" />
                  <span>Seeking work in {profile.desired_country}</span>
                </div>
              )}

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-3 mb-6">
                {profile.gender && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    <User className="h-3.5 w-3.5" />
                    {profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1).replace("-", " ")}
                  </span>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-primary/10" />

            {/* Experience Section */}
            {profile.past_work_experience && (
              <>
                <div className="px-6 py-5">
                  <h3 className="text-sm font-semibold text-primary/60 uppercase tracking-wide mb-3">
                    Work Experience
                  </h3>
                  <div className="flex items-start gap-3">
                    <Briefcase className="h-5 w-5 text-primary/60 mt-0.5" />
                    <p className="text-primary">{profile.past_work_experience}</p>
                  </div>
                </div>
                <div className="h-px bg-primary/10" />
              </>
            )}

            {/* Career Goals */}
            {(profile.desired_job || profile.desired_country) && (
              <div className="px-6 py-5">
                <h3 className="text-sm font-semibold text-primary/60 uppercase tracking-wide mb-3">
                  Career Goals
                </h3>
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-primary/60 mt-0.5" />
                  <p className="text-primary">
                    Looking for opportunities as a <strong>{profile.desired_job || "any role"}</strong>
                    {profile.desired_country && <> in <strong>{profile.desired_country}</strong></>}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CTA for employers */}
          <div className="mt-6 bg-cream/10 rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-cream mb-2">Interested in this candidate?</h3>
            <p className="text-cream/60 mb-4 text-sm">
              Contact them directly or visit our homepage to learn more about our recruitment services.
            </p>
            <Link to="/">
              <Button variant="gold">
                Learn More About Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
