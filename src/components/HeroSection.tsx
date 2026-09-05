import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Users, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-primary/80" />
      
      {/* Gradient accent */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-secondary/30 text-secondary mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">AI-Powered Recruitment</span>
          </div>
          
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-cream leading-tight mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {t("hero.title").split("European").map((part, i) => 
              i === 0 ? part : <><span key={i} className="text-secondary">European</span>{part}</>
            )}
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-cream/80 max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {t("hero.subtitle")}
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button variant="gold" size="xl" className="w-full sm:w-auto">
              {t("hero.hiring")}
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Link to="/job-seeker">
              <Button variant="heroOutline" size="xl" className="w-full sm:w-auto group">
                <Sparkles className="h-5 w-5 text-secondary group-hover:scale-110 transition-transform" />
                {t("hero.lookingForWork")}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="h-5 w-5 text-secondary" />
                <span className="text-3xl lg:text-4xl font-bold text-cream">50K+</span>
              </div>
              <p className="text-cream/60 text-sm">Candidates Placed</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Globe className="h-5 w-5 text-secondary" />
                <span className="text-3xl lg:text-4xl font-bold text-cream">15+</span>
              </div>
              <p className="text-cream/60 text-sm">European Countries</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-secondary" />
                <span className="text-3xl lg:text-4xl font-bold text-cream">85%</span>
              </div>
              <p className="text-cream/60 text-sm">Faster Hiring</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;