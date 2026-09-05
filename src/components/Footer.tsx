import { Linkedin, Twitter, Facebook, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <span className="text-2xl font-display font-bold text-cream mb-4 block">
              Tanaw
            </span>
            <p className="text-cream/60 mb-6 max-w-xs">
              AI-powered recruitment platform bridging Filipino talent with European opportunities.
            </p>
            <div className="flex items-center gap-4">
              {[Linkedin, Twitter, Facebook, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center text-cream/60 hover:bg-secondary hover:text-secondary-foreground transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="text-cream font-semibold mb-4">For Employers</h4>
            <ul className="space-y-3">
              {["How It Works", "Pricing", "Industries", "Success Stories", "Contact Sales"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-cream/60 hover:text-cream transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* For Candidates */}
          <div>
            <h4 className="text-cream font-semibold mb-4">For Candidates</h4>
            <ul className="space-y-3">
              {["Browse Jobs", "Create Profile", "Resources", "Success Stories", "FAQ"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-cream/60 hover:text-cream transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-cream font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {["About Us", "Careers", "Blog", "Press", "Contact"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-cream/60 hover:text-cream transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-cream/40 text-sm">
            © 2025 Tanaw. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-cream/40 hover:text-cream/60 text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-cream/40 hover:text-cream/60 text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-cream/40 hover:text-cream/60 text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
