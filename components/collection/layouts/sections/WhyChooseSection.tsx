import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/use-Scroll-Animation";

const comparisons = {
  traditional: [
    "Long waiting queues",
    "Unclear processing times",
    "No status updates",
    "Multiple office visits",
    "Paper-based forms",
    "Limited office hours",
  ],
  digital: [
    "Apply from anywhere",
    "24-48 hour processing",
    "Real-time tracking",
    "Single collection visit",
    "Digital forms",
    "24/7 system access",
  ],
};

export function WhyChooseSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="section-padding bg-muted/50">
      <div ref={ref} className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span
            className={cn(
              "inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 opacity-0",
              isVisible && "animate-fade-in-up"
            )}
          >
            Why Choose Us
          </span>
          <h2
            className={cn(
              "font-heading text-3xl md:text-4xl font-bold text-foreground mb-4 opacity-0",
              isVisible && "animate-fade-in-up animation-delay-100"
            )}
          >
            Traditional vs. Digital
          </h2>
          <p
            className={cn(
              "text-muted-foreground text-lg opacity-0",
              isVisible && "animate-fade-in-up animation-delay-200"
            )}
          >
            See how our digital system transforms the card replacement
            experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Traditional */}
          <div
            className={cn(
              "p-6 rounded-2xl bg-card border border-border opacity-0",
              isVisible && "animate-slide-in-left animation-delay-300"
            )}
          >
            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-3">
                <XCircle className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground">
                Traditional Process
              </h3>
            </div>
            <ul className="space-y-3">
              {comparisons.traditional.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-muted-foreground"
                >
                  <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Digital */}
          <div
            className={cn(
              "p-6 rounded-2xl bg-primary text-primary-foreground opacity-0",
              isVisible && "animate-slide-in-right animation-delay-300"
            )}
          >
            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary-foreground/20 flex items-center justify-center mb-3">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-semibold">
                Our Digital System
              </h3>
            </div>
            <ul className="space-y-3">
              {comparisons.digital.map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
