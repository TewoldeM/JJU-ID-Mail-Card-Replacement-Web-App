import {
  LogIn,
  CreditCard,
  FileEdit,
  Send,
  Eye,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/use-Scroll-Animation";

const steps = [
  {
    icon: LogIn,
    title: "Sign In",
    description:
      "Log in with your JJU student credentials to access the system.",
  },
  {
    icon: CreditCard,
    title: "Select Card Type",
    description: "Choose whether you need an ID card or meal card replacement.",
  },
  {
    icon: FileEdit,
    title: "Fill Application",
    description:
      "Complete the application form with your details and reason for replacement.",
  },
  {
    icon: Send,
    title: "Submit Request",
    description: "Review and submit your application for processing.",
  },
  {
    icon: Eye,
    title: "Track Status",
    description: "Monitor your application progress in real-time.",
  },
  {
    icon: CheckCircle2,
    title: "Collect Card",
    description: "Receive approval code and collect your new card.",
  },
];

export function StepsSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="steps" className="section-padding bg-background">
      <div ref={ref} className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span
            className={cn(
              "inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 opacity-0",
              isVisible && "animate-fade-in-up"
            )}
          >
            How It Works
          </span>
          <h2
            className={cn(
              "font-heading text-3xl md:text-4xl font-bold text-foreground mb-4 opacity-0",
              isVisible && "animate-fade-in-up animation-delay-100"
            )}
          >
            Simple 6-Step Process
          </h2>
          <p
            className={cn(
              "text-muted-foreground text-lg opacity-0",
              isVisible && "animate-fade-in-up animation-delay-200"
            )}
          >
            Get your replacement card in just a few easy steps.
          </p>
        </div>

        {/* Desktop View - Horizontal */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-16 left-0 right-0 h-0.5 bg-border" />

            <div className="grid grid-cols-6 gap-4">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={cn(
                    "relative text-center opacity-0",
                    isVisible && "animate-fade-in-up"
                  )}
                  style={{ animationDelay: `${(index + 1) * 150}ms` }}
                >
                  <div className="relative z-10 w-12 h-12 mx-auto rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mb-4">
                    {index + 1}
                  </div>
                  <div className="p-4 rounded-xl bg-card border border-border card-hover">
                    <step.icon className="w-8 h-8 mx-auto text-primary mb-3" />
                    <h4 className="font-heading font-semibold text-foreground mb-2 text-sm">
                      {step.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile/Tablet View - Vertical */}
        <div className="lg:hidden space-y-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className={cn(
                "flex gap-4 items-start opacity-0",
                isVisible && "animate-fade-in-up"
              )}
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className="w-0.5 h-full min-h-[60px] bg-border mt-2" />
                )}
              </div>
              <div className="flex-1 pb-6">
                <div className="p-4 rounded-xl bg-card border border-border card-hover">
                  <div className="flex items-center gap-3 mb-2">
                    <step.icon className="w-6 h-6 text-primary" />
                    <h4 className="font-heading font-semibold text-foreground">
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
