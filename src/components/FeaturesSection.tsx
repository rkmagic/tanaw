import { Bot, FileCheck, Shield, Clock, Users, LineChart } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI-Powered Matching",
    description: "Our intelligent algorithms match candidates to roles based on skills, experience, and cultural fit—not just keywords.",
  },
  {
    icon: FileCheck,
    title: "Automated Document Processing",
    description: "Streamlined verification of credentials, certifications, and visa requirements. No more paper chase.",
  },
  {
    icon: Shield,
    title: "Compliance Built-In",
    description: "Stay compliant with European labor laws and immigration requirements with automated checks and updates.",
  },
  {
    icon: Clock,
    title: "Faster Time-to-Hire",
    description: "Reduce your hiring timeline by up to 85% with pre-vetted candidates ready for international deployment.",
  },
  {
    icon: Users,
    title: "Talent Pool Access",
    description: "Connect with over 50,000 skilled Filipino professionals across healthcare, IT, engineering, and more.",
  },
  {
    icon: LineChart,
    title: "Real-Time Analytics",
    description: "Track your recruitment pipeline, measure success rates, and optimize your hiring strategy with data.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider mb-4 block">
            Why Tanaw
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
            Recruitment, Reimagined with AI
          </h2>
          <p className="text-lg text-muted-foreground">
            We've replaced the friction of traditional international recruitment with intelligent automation, 
            making it easier than ever to hire skilled talent from the Philippines.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-8 rounded-2xl bg-card border border-border hover:border-secondary/50 hover:shadow-xl transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
                <feature.icon className="h-7 w-7 text-secondary" />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-display font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Hover accent */}
              <div className="absolute bottom-0 left-8 right-8 h-1 bg-secondary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
