"use client";
import {
  FileText,
  Search,
  Bell,
  Key,
  Users,
  Clock,
  Shield,
  CheckCircle,
  Smartphone,
  Globe,
  Lock,
  Headphones,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/use-Scroll-Animation";
import { Layout } from "@/components/collection/layouts/layout";

const mainFeatures = [
  {
    icon: FileText,
    title: "Online Application",
    description:
      "Apply for ID or meal card replacement from anywhere, anytime. No physical visits required to submit your application.",
    highlight: true,
  },
  {
    icon: Search,
    title: "Real-Time Tracking",
    description:
      "Monitor your application status at every stage. Know exactly where your application is in the process.",
    highlight: true,
  },
  {
    icon: Bell,
    title: "Instant Notifications",
    description:
      "Receive email and SMS alerts when your application is approved, rejected, or needs attention.",
    highlight: true,
  },
  {
    icon: Key,
    title: "Secure Approval Code",
    description:
      "Get a unique code to collect your replacement card securely from the Student Dean's Office.",
    highlight: true,
  },
];

const additionalFeatures = [
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
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description:
      "Access the system from any device - phone, tablet, or computer.",
  },
  {
    icon: Globe,
    title: "24/7 Access",
    description: "Submit applications anytime, day or night.",
  },
  {
    icon: Lock,
    title: "Secure Login",
    description: "Protected access with your JJU student credentials.",
  },
  {
    icon: Headphones,
    title: "Support Available",
    description: "Get help when you need it from our support team.",
  },
];

const Features = () => {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: mainRef, isVisible: mainVisible } = useScrollAnimation();
  const { ref: additionalRef, isVisible: additionalVisible } =
    useScrollAnimation();

  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
        </div>
        <div
          ref={heroRef}
          className="container-custom section-padding relative"
        >
          <div className="max-w-3xl">
            <span
              className={cn(
                "inline-block px-3 py-1 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 text-sm font-medium mb-4 opacity-0",
                heroVisible && "animate-fade-in-up"
              )}
            >
              Features
            </span>
            <h1
              className={cn(
                "font-heading text-4xl md:text-5xl font-bold mb-6 opacity-0",
                heroVisible && "animate-fade-in-up animation-delay-100"
              )}
            >
              Powerful Features for a Seamless Experience
            </h1>
            <p
              className={cn(
                "text-xl text-primary-foreground/90 opacity-0",
                heroVisible && "animate-fade-in-up animation-delay-200"
              )}
            >
              Discover all the features that make our card replacement system
              efficient, secure, and user-friendly.
            </p>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="section-padding bg-background">
        <div ref={mainRef} className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span
              className={cn(
                "inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 opacity-0",
                mainVisible && "animate-fade-in-up"
              )}
            >
              Core Features
            </span>
            <h2
              className={cn(
                "font-heading text-3xl md:text-4xl font-bold text-foreground mb-4 opacity-0",
                mainVisible && "animate-fade-in-up animation-delay-100"
              )}
            >
              Key System Features
            </h2>
            <p
              className={cn(
                "text-muted-foreground text-lg opacity-0",
                mainVisible && "animate-fade-in-up animation-delay-200"
              )}
            >
              The essential features that power your card replacement journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {mainFeatures.map((feature, index) => (
              <div
                key={index}
                className={cn(
                  "group p-8 rounded-2xl bg-card border-2 border-primary/20 card-hover opacity-0",
                  mainVisible && "animate-fade-in-up"
                )}
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="section-padding bg-muted/50">
        <div ref={additionalRef} className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span
              className={cn(
                "inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 opacity-0",
                additionalVisible && "animate-fade-in-up"
              )}
            >
              More Features
            </span>
            <h2
              className={cn(
                "font-heading text-3xl md:text-4xl font-bold text-foreground mb-4 opacity-0",
                additionalVisible && "animate-fade-in-up animation-delay-100"
              )}
            >
              Additional Benefits
            </h2>
            <p
              className={cn(
                "text-muted-foreground text-lg opacity-0",
                additionalVisible && "animate-fade-in-up animation-delay-200"
              )}
            >
              More reasons to love our card replacement system.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, index) => (
              <div
                key={index}
                className={cn(
                  "group p-6 rounded-xl bg-card border border-border card-hover text-center opacity-0",
                  additionalVisible && "animate-fade-in-up"
                )}
                style={{ animationDelay: `${((index % 4) + 1) * 100}ms` }}
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
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

      {/* CTA */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience These Features?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Start your card replacement application today and enjoy a seamless,
            modern experience.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Features;
