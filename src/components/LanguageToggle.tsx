import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LanguageToggleProps {
  variant?: "light" | "dark";
}

const LanguageToggle = ({ variant = "dark" }: LanguageToggleProps) => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "tl" : "en");
  };

  const baseClasses = "flex items-center gap-2 text-sm font-medium";
  const colorClasses = variant === "light" 
    ? "text-cream/70 hover:text-cream" 
    : "text-foreground/70 hover:text-foreground";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className={`${baseClasses} ${colorClasses}`}
    >
      <Globe className="h-4 w-4" />
      <span>{language === "en" ? "EN" : "TL"}</span>
    </Button>
  );
};

export default LanguageToggle;