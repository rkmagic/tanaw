import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import LanguageToggle from "@/components/LanguageToggle";

const DASHBOARD_BY_ROLE: Record<string, string> = {
  candidate: "/candidate/dashboard",
  agency: "/agency/dashboard",
  employer: "/employer/dashboard",
  admin: "/admin/dashboard",
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { user, role, loading, signOut } = useAuth();
  const dashboardHref = role ? DASHBOARD_BY_ROLE[role] ?? "/job-seeker/chat" : "/job-seeker/chat";

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-display font-bold text-primary">
              Tanaw
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#features" className="text-foreground/70 hover:text-foreground transition-colors font-medium">
              {t("nav.features")}
            </a>
            <a href="#how-it-works" className="text-foreground/70 hover:text-foreground transition-colors font-medium">
              {t("nav.howItWorks")}
            </a>
            <a href="#for-employers" className="text-foreground/70 hover:text-foreground transition-colors font-medium">
              {t("nav.forEmployers")}
            </a>
            <a href="#for-candidates" className="text-foreground/70 hover:text-foreground transition-colors font-medium">
              {t("nav.forCandidates")}
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <LanguageToggle />
            {loading ? (
              <div className="w-20 h-9 bg-muted animate-pulse rounded-md" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <Link to={dashboardHref}>
                  <Button variant="ghost" className="gap-2">
                    <User className="h-4 w-4" />
                    {user.email?.split("@")[0] || "Profile"}
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  {t("nav.logout") || "Log Out"}
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">{t("nav.login")}</Button>
                </Link>
                <Link to="/job-seeker">
                  <Button variant="gold">{t("nav.getStarted")}</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <LanguageToggle />
            <button
              className="p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-4">
              <a href="#features" className="text-foreground/70 hover:text-foreground transition-colors font-medium py-2">
                {t("nav.features")}
              </a>
              <a href="#how-it-works" className="text-foreground/70 hover:text-foreground transition-colors font-medium py-2">
                {t("nav.howItWorks")}
              </a>
              <a href="#for-employers" className="text-foreground/70 hover:text-foreground transition-colors font-medium py-2">
                {t("nav.forEmployers")}
              </a>
              <a href="#for-candidates" className="text-foreground/70 hover:text-foreground transition-colors font-medium py-2">
                {t("nav.forCandidates")}
              </a>
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                {loading ? (
                  <div className="w-full h-9 bg-muted animate-pulse rounded-md" />
                ) : user ? (
                  <>
                    <Link to={dashboardHref} onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="justify-start w-full gap-2">
                        <User className="h-4 w-4" />
                        {user.email?.split("@")[0] || "Profile"}
                      </Button>
                    </Link>
                    <Button variant="outline" onClick={handleSignOut} className="justify-start gap-2">
                      <LogOut className="h-4 w-4" />
                      {t("nav.logout") || "Log Out"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="justify-start w-full">{t("nav.login")}</Button>
                    </Link>
                    <Link to="/job-seeker" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="gold" className="w-full">{t("nav.getStarted")}</Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
