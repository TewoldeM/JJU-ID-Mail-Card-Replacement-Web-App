import { Shield, Users, Zap, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/use-Scroll-Animation";

const highlights = [
  {
    icon: Shield,
    title: "Secure & Reliable",
    description:
      "Your data is protected with enterprise-grade security measures.",
  },
  {
    icon: Users,
    title: "Student-Centered",
    description:
      "Designed specifically for Jigjiga University students' needs.",
  },
  {
    icon: Zap,
    title: "Fast Processing",
    description: "Get your replacement card within 24-48 hours of approval.",
  },
  {
    icon: Award,
    title: "Official Service",
    description: "Authorized by the university administration.",
  },
];

export function AboutSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="about" className="section-padding bg-background">
      <div ref={ref} className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <span
              className={cn(
                "inline-block px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4 opacity-0",
                isVisible && "animate-fade-in-up"
              )}
            >
              About the System
            </span>
            <h2
              className={cn(
                "font-heading text-3xl md:text-4xl font-bold text-foreground mb-6 opacity-0",
                isVisible && "animate-fade-in-up animation-delay-100"
              )}
            >
              Modernizing Card Replacement for JJU Students
            </h2>
            <p
              className={cn(
                "text-muted-foreground text-lg mb-6 opacity-0",
                isVisible && "animate-fade-in-up animation-delay-200"
              )}
            >
              The Jigjiga University ID & Meal Card Replacement System
              eliminates the hassle of traditional card replacement. No more
              long queues, unclear processes, or waiting without updates.
            </p>
            <p
              className={cn(
                "text-muted-foreground mb-8 opacity-0",
                isVisible && "animate-fade-in-up animation-delay-300"
              )}
            >
              Our digital platform allows you to submit applications online,
              track progress in real-time, and receive instant notifications
              when your new card is ready for collection.
            </p>

            <div
              className={cn(
                "grid grid-cols-2 gap-4 opacity-0",
                isVisible && "animate-fade-in-up animation-delay-400"
              )}
            >
              {highlights.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border card-hover"
                >
                  <div className="p-2 rounded-lg bg-primary/10">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">
                      {item.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div
            className={cn(
              "relative opacity-0",
              isVisible && "animate-slide-in-right animation-delay-200"
            )}
          >
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl" />
              <div className="absolute inset-4 bg-card rounded-2xl border border-border shadow-xl flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Shield className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                    JJU Card
                  </h3>
                  <p className="text-muted-foreground">
                    Official University ID
                  </p>
                  <div className="mt-6 flex justify-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      ID Card
                    </span>
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      Meal Card
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
