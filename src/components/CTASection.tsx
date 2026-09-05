import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, UserCircle } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* For Employers */}
          <div 
            id="for-employers"
            className="relative overflow-hidden rounded-3xl bg-primary p-10 lg:p-14"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-xl bg-secondary/20 flex items-center justify-center mb-6">
                <Building2 className="h-7 w-7 text-secondary" />
              </div>
              
              <h3 className="text-3xl lg:text-4xl font-display font-bold text-cream mb-4">
                For Employers
              </h3>
              <p className="text-cream/70 text-lg mb-8 max-w-md">
                Find skilled, pre-vetted Filipino talent ready for deployment across Europe. 
                Reduce hiring time by up to 85% with our AI-powered matching.
              </p>
              
              <ul className="space-y-3 mb-10">
                {[
                  "Access 50,000+ verified candidates",
                  "Full compliance management",
                  "Dedicated recruitment support",
                  "No upfront costs"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-cream/80">
                    <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              
              <Button variant="gold" size="xl">
                Start Hiring Today
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* For Candidates */}
          <div 
            id="for-candidates"
            className="relative overflow-hidden rounded-3xl border-2 border-primary bg-card p-10 lg:p-14"
          >
            {/* Background decoration */}
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <UserCircle className="h-7 w-7 text-primary" />
              </div>
              
              <h3 className="text-3xl lg:text-4xl font-display font-bold text-foreground mb-4">
                For Candidates
              </h3>
              <p className="text-muted-foreground text-lg mb-8 max-w-md">
                Your skills are in demand across Europe. Join thousands of Filipino professionals 
                who've built successful international careers through Tanaw.
              </p>
              
              <ul className="space-y-3 mb-10">
                {[
                  "Free to join and apply",
                  "AI-matched job opportunities",
                  "Visa and documentation support",
                  "Pre-departure training"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground/80">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              
              <Button variant="default" size="xl">
                Create Your Profile
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
