import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Create Your Profile",
    description: "Whether you're an employer or candidate, get started by creating your profile with your requirements or qualifications.",
    forEmployer: "Define your role requirements, preferred qualifications, and timeline.",
    forCandidate: "Upload your resume, certifications, and set your preferences.",
  },
  {
    number: "02",
    title: "AI-Powered Matching",
    description: "Our intelligent system analyzes thousands of data points to find the perfect match between talent and opportunity.",
    forEmployer: "Receive curated candidate recommendations ranked by fit.",
    forCandidate: "Get matched with roles that align with your skills and goals.",
  },
  {
    number: "03",
    title: "Streamlined Processing",
    description: "All documentation, verification, and compliance checks are handled automatically through our platform.",
    forEmployer: "Track progress and approve candidates in real-time.",
    forCandidate: "Complete requirements step-by-step with clear guidance.",
  },
  {
    number: "04",
    title: "Successful Placement",
    description: "From offer acceptance to deployment, we support both parties through the final stages of recruitment.",
    forEmployer: "Onboard your new team members with confidence.",
    forCandidate: "Begin your new chapter with full support.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider mb-4 block">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
            Simple Process, Powerful Results
          </h2>
          <p className="text-lg text-muted-foreground">
            From first contact to successful placement, our streamlined process removes the complexity 
            from international recruitment.
          </p>
        </div>

        {/* Steps */}
        <div className="relative max-w-4xl mx-auto">
          {/* Connector Line */}
          <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-px bg-border lg:-translate-x-px hidden sm:block" />

          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`relative flex flex-col lg:flex-row items-start gap-6 lg:gap-12 mb-12 last:mb-0 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Number bubble */}
              <div className="absolute left-0 lg:left-1/2 lg:-translate-x-1/2 w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold text-lg shadow-lg z-10">
                {step.number}
              </div>

              {/* Content card */}
              <div className={`ml-24 lg:ml-0 lg:w-1/2 ${index % 2 === 1 ? 'lg:pr-20' : 'lg:pl-20'}`}>
                <div className="bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-lg transition-shadow">
                  <h3 className="text-2xl font-display font-bold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {step.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <ArrowRight className="h-3 w-3 text-primary" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-primary uppercase tracking-wide">For Employers</span>
                        <p className="text-sm text-muted-foreground">{step.forEmployer}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <ArrowRight className="h-3 w-3 text-secondary" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-secondary uppercase tracking-wide">For Candidates</span>
                        <p className="text-sm text-muted-foreground">{step.forCandidate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
