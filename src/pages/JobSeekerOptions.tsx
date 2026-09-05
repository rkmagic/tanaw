import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, MessageCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

const JobSeekerOptions = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      {/* Top bar with back button and language toggle */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-cream/70 hover:text-cream transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">{t("jobSeeker.backToHome")}</span>
        </Link>
        <LanguageToggle variant="light" />
      </div>

      <div className="max-w-2xl w-full text-center">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-cream mb-4 animate-fade-in">
          {t("jobSeeker.title")}
        </h1>
        <p className="text-cream/70 text-lg mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {t("jobSeeker.subtitle")}
        </p>

        {/* Options */}
        <div className="grid sm:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {/* Option 1: Continue on Website */}
          <Link to="/job-seeker/chat" className="group">
            <div className="bg-cream/10 border-2 border-cream/20 rounded-2xl p-8 hover:bg-cream/15 hover:border-secondary/50 transition-all duration-300 h-full flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mb-6 group-hover:bg-secondary/30 transition-colors">
                <Globe className="h-8 w-8 text-secondary" />
              </div>
              <h2 className="text-xl font-bold text-cream mb-3">{t("jobSeeker.continueOnWebsite")}</h2>
              <p className="text-cream/60 mb-6 flex-grow">
                {t("jobSeeker.continueOnWebsiteDesc")}
              </p>
              <Button variant="gold" className="w-full">
                {t("nav.getStarted")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Link>

          {/* Option 2: WhatsApp Bot - Coming Soon */}
          <div className="group cursor-not-allowed">
            <div className="bg-cream/5 border-2 border-cream/10 rounded-2xl p-8 h-full flex flex-col items-center text-center opacity-60">
              <div className="w-16 h-16 rounded-full bg-cream/10 flex items-center justify-center mb-6">
                <MessageCircle className="h-8 w-8 text-cream/40" />
              </div>
              <h2 className="text-xl font-bold text-cream mb-3">{t("jobSeeker.whatsappBot")}</h2>
              <p className="text-cream/40 mb-6 flex-grow">
                {t("jobSeeker.whatsappBotDesc")}
              </p>
              <Button disabled className="w-full bg-cream/10 text-cream/50 cursor-not-allowed">
                {t("jobSeeker.comingSoon")}
              </Button>
            </div>
          </div>
        </div>

        {/* Trust badge */}
        <p className="text-cream/40 text-sm mt-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          {t("jobSeeker.trustBadge")}
        </p>
      </div>
    </div>
  );
};

export default JobSeekerOptions;