
import { ArrowRight, Shield, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useScrollAnimation } from "@/hooks/use-Scroll-Animation";

export function HeroSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-foreground rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
      </div>

      <div ref={ref} className="container-custom section-padding relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className={cn("opacity-0", isVisible && "animate-fade-in-down")}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Official Jigjiga University Service
            </span>
          </div>

          <h1
            className={cn(
              "font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 opacity-0",
              isVisible && "animate-fade-in-up animation-delay-100"
            )}
          >
            ID & Meal Card
            <span className="block mt-2">Replacement System</span>
          </h1>

          <p
            className={cn(
              "text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto opacity-0",
              isVisible && "animate-fade-in-up animation-delay-200"
            )}
          >
            Apply online for lost or expired university ID and meal cards. Track
            your application status in real-time and receive instant
            notifications.
          </p>

          <div
            className={cn(
              "flex flex-col sm:flex-row gap-4 justify-center mb-12 opacity-0",
              isVisible && "animate-fade-in-up animation-delay-300"
            )}
          >
            <Button asChild variant="outline">
              <Link href="/steps">
                Apply Now <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
          
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link href="/status">Track Application</Link>
            </Button>
          </div>

          {/* Stats */}
          <div
            className={cn(
              "grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto opacity-0",
              isVisible && "animate-fade-in-up animation-delay-400"
            )}
          >
            {[
              { icon: Clock, label: "Fast Processing", value: "24-48 hrs" },
              { icon: Shield, label: "Secure System", value: "100%" },
              { icon: CheckCircle, label: "Success Rate", value: "99.9%" },
            ].map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-4 rounded-xl bg-primary-foreground/10 backdrop-blur-sm"
              >
                <stat.icon className="w-6 h-6 mb-2" />
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className="text-sm text-primary-foreground/80">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wave Bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
}
