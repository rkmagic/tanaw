import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "tl";

interface Translations {
  [key: string]: {
    en: string;
    tl: string;
  };
}

export const translations: Translations = {
  // Header
  "nav.features": { en: "Features", tl: "Mga Feature" },
  "nav.howItWorks": { en: "How It Works", tl: "Paano Ito Gumagana" },
  "nav.forEmployers": { en: "For Employers", tl: "Para sa mga Employer" },
  "nav.forCandidates": { en: "For Candidates", tl: "Para sa mga Kandidato" },
  "nav.login": { en: "Log In", tl: "Mag-login" },
  "nav.getStarted": { en: "Get Started", tl: "Magsimula" },

  // Hero Section
  "hero.title": { en: "Connecting Filipino Talent with European Opportunities", tl: "Ikinokonekta ang Filipino Talent sa mga Oportunidad sa Europa" },
  "hero.subtitle": { en: "Tanaw bridges skilled Overseas Filipino Workers with employers across Europe through AI-powered matching and streamlined recruitment.", tl: "Ikinukonekta ng Tanaw ang mga skilled OFW sa mga employer sa buong Europa sa pamamagitan ng AI-powered matching at streamlined recruitment." },
  "hero.lookingForWork": { en: "I'm Looking for Work", tl: "Naghahanap Ako ng Trabaho" },
  "hero.hiring": { en: "I'm Hiring", tl: "Naghahanap Ako ng Empleyado" },

  // Job Seeker Options
  "jobSeeker.title": { en: "Start Your Journey", tl: "Simulan ang Iyong Paglalakbay" },
  "jobSeeker.subtitle": { en: "Choose how you'd like to get started with Tanaw", tl: "Piliin kung paano mo gustong magsimula sa Tanaw" },
  "jobSeeker.backToHome": { en: "Back to Home", tl: "Bumalik sa Home" },
  "jobSeeker.continueOnWebsite": { en: "Continue on Website", tl: "Magpatuloy sa Website" },
  "jobSeeker.continueOnWebsiteDesc": { en: "Fill out your profile and browse opportunities directly on our platform", tl: "Punan ang iyong profile at mag-browse ng mga oportunidad direkta sa aming platform" },
  "jobSeeker.whatsappBot": { en: "WhatsApp Bot", tl: "WhatsApp Bot" },
  "jobSeeker.whatsappBotDesc": { en: "Quickly submit your information through our conversational WhatsApp assistant", tl: "Mabilis na isumite ang iyong impormasyon sa pamamagitan ng aming WhatsApp assistant" },
  "jobSeeker.comingSoon": { en: "Coming Soon", tl: "Paparating Na" },
  "jobSeeker.trustBadge": { en: "Your information is secure and will only be used to match you with opportunities", tl: "Ang iyong impormasyon ay secure at gagamitin lamang para ipares ka sa mga oportunidad" },

  // Chat
  "chat.back": { en: "Back", tl: "Bumalik" },
  "chat.assistant": { en: "Tanaw Assistant", tl: "Tanaw Assistant" },
  "chat.placeholder": { en: "Type your message...", tl: "I-type ang iyong mensahe..." },
  "chat.saved": { en: "Your information has been saved. We'll be in touch soon!", tl: "Nai-save na ang iyong impormasyon. Makikipag-ugnayan kami sa lalong madaling panahon!" },

  // Features
  "features.title": { en: "Why Choose Tanaw?", tl: "Bakit Piliin ang Tanaw?" },
  "features.subtitle": { en: "We're revolutionizing how Filipino talent connects with European employers", tl: "Binabago namin ang paraan ng pagkonekta ng Filipino talent sa mga European employer" },

  // CTA
  "cta.title": { en: "Ready to Take the Next Step?", tl: "Handa Ka Na Bang Mag-Next Step?" },
  "cta.subtitle": { en: "Join thousands of Filipino workers who have found opportunities through Tanaw", tl: "Sumali sa libu-libong Filipino worker na nakahanap ng oportunidad sa pamamagitan ng Tanaw" },

  // Footer
  "footer.rights": { en: "All rights reserved.", tl: "Lahat ng karapatan ay nakalaan." },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Missing translation for key: ${key}`);
      return key;
    }
    return translation[language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};