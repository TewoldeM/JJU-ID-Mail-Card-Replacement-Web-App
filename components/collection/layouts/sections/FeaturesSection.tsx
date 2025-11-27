import {
  FileText,
  Search,
  Bell,
  Key,
  Users,
  Clock,
  Shield,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/use-Scroll-Animation";

const features = [
  {
    icon: FileText,
    title: "Online Application",
    description:
      "Apply for ID or meal card replacement from anywhere, anytime. No physical visits required.",
  },
  {
    icon: Search,
    title: "Real-Time Tracking",
    description:
      "Monitor your application status at every stage with live updates.",
  },
  {
    icon: Bell,
    title: "Instant Notifications",
    description:
      "Receive email and SMS alerts when your application is approved or needs attention.",
  },
  {
    icon: Key,
    title: "Secure Approval Code",
    description: "Get a unique code to collect your replacement card securely.",
  },
  {
    icon: Users,
    title: "No Long Queues",
    description:
      "Skip the traditional waiting lines. Everything happens digitally.",
  },
  {
    icon: Clock,
    title: "Fast Processing",
    description: "Most applications are processed within 24-48 hours.",
  },
  {
    icon: Shield,
    title: "Data Security",
    description: "Your personal information is encrypted and protected.",
  },
  {
    icon: CheckCircle,
    title: "Transparent Process",
    description: "Clear steps and requirements. No hidden fees or surprises.",
  },
];

export function FeaturesSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="features" className="section-padding bg-muted/50">
      <div ref={ref} className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span
            className={cn(
              "inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 opacity-0",
              isVisible && "animate-fade-in-up"
            )}
          >
            Features
          </span>
          <h2
            className={cn(
              "font-heading text-3xl md:text-4xl font-bold text-foreground mb-4 opacity-0",
              isVisible && "animate-fade-in-up animation-delay-100"
            )}
          >
            Everything You Need
          </h2>
          <p
            className={cn(
              "text-muted-foreground text-lg opacity-0",
              isVisible && "animate-fade-in-up animation-delay-200"
            )}
          >
            Our system is designed to make card replacement simple, fast, and
            stress-free.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                "group p-6 rounded-xl bg-card border border-border card-hover opacity-0",
                isVisible && "animate-fade-in-up",
                `animation-delay-${((index % 4) + 1) * 100}`
              )}
              style={{ animationDelay: `${((index % 4) + 1) * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <feature.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
