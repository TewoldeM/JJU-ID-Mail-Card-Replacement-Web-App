"use client";

import {
  LogIn,
  CreditCard,
  FileEdit,
  Send,
  Eye,
  CheckCircle2,
  ArrowDown,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/use-Scroll-Animation";
import { Layout } from "@/components/collection/layouts/layout";

const steps = [
  {
    icon: LogIn,
    title: "Sign In to Your Account",
    description:
      "Use your Jigjiga University student credentials to log in to the system. Your student ID and password are required.",
    details: [
      "Go to the login page",
      "Enter your student ID number",
      "Enter your password",
      'Click "Sign In"',
    ],
  },
  {
    icon: CreditCard,
    title: "Select Card Type",
    description:
      "Choose the type of card you need to replace. You can apply for either an ID card or a meal card replacement.",
    details: [
      'Click on "New Application"',
      'Select "ID Card" or "Meal Card"',
      "Read the requirements carefully",
      'Click "Continue"',
    ],
  },
  {
    icon: FileEdit,
    title: "Fill the Application Form",
    description:
      "Complete the application form with accurate information. Provide details about why you need a replacement.",
    details: [
      "Fill in your personal details",
      "Select reason for replacement",
      "Upload a recent photo (if required)",
      "Review all information",
    ],
  },
  {
    icon: Send,
    title: "Submit Your Request",
    description:
      "Review your application and submit it for processing. You will receive a confirmation with your application reference number.",
    details: [
      "Review your application summary",
      "Agree to the terms and conditions",
      'Click "Submit Application"',
      "Save your reference number",
    ],
  },
  {
    icon: Eye,
    title: "Track Your Application",
    description:
      "Monitor your application status in real-time. You can check the progress at any time using your reference number.",
    details: [
      'Go to "Track Status" page',
      "Enter your reference number",
      "View current status",
      "Check for any required actions",
    ],
  },
  {
    icon: CheckCircle2,
    title: "Collect Your Card",
    description:
      "Once approved, receive your unique approval code and collect your new card from the Student Dean's Office.",
    details: [
      "Receive approval notification",
      "Note your approval code",
      "Visit Student Dean's Office",
      "Present code and collect card",
    ],
  },
];

const Steps = () => {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: stepsRef, isVisible: stepsVisible } = useScrollAnimation();

  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-1/2 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
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
              How It Works
            </span>
            <h1
              className={cn(
                "font-heading text-4xl md:text-5xl font-bold mb-6 opacity-0",
                heroVisible && "animate-fade-in-up animation-delay-100"
              )}
            >
              Step-by-Step Guide
            </h1>
            <p
              className={cn(
                "text-xl text-primary-foreground/90 opacity-0",
                heroVisible && "animate-fade-in-up animation-delay-200"
              )}
            >
              Follow these simple steps to apply for your replacement ID or meal
              card. The entire process can be completed in minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="section-padding bg-background">
        <div ref={stepsRef} className="container-custom">
          <div className="max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div
                key={index}
                className={cn(
                  "relative opacity-0",
                  stepsVisible && "animate-fade-in-up"
                )}
                style={{ animationDelay: `${(index + 1) * 150}ms` }}
              >
                <div className="flex gap-6 md:gap-8">
                  {/* Timeline */}
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold z-10">
                      {index + 1}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-0.5 h-full bg-border min-h-[200px] mt-4" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-12">
                    <div className="p-6 md:p-8 rounded-2xl bg-card border border-border card-hover">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <step.icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-heading text-xl md:text-2xl font-semibold text-foreground">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground mb-6">
                        {step.description}
                      </p>

                      <div className="bg-muted/50 rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <Info className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">
                            What to do:
                          </span>
                        </div>
                        <ul className="space-y-2">
                          {step.details.map((detail, detailIndex) => (
                            <li
                              key={detailIndex}
                              className="flex items-start gap-3 text-sm text-muted-foreground"
                            >
                              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {index < steps.length - 1 && (
                      <div className="flex justify-center mt-4 md:hidden">
                        <ArrowDown className="w-6 h-6 text-muted-foreground animate-bounce" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
              Helpful Tips
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Keep Your Reference Number",
                  description:
                    "Save your application reference number. You will need it to track your application status.",
                },
                {
                  title: "Upload a Clear Photo",
                  description:
                    "If a photo is required, make sure it is recent, clear, and meets the specified requirements.",
                },
                {
                  title: "Check Your Email",
                  description:
                    "Important updates and notifications will be sent to your registered email address.",
                },
                {
                  title: "Bring Valid ID",
                  description:
                    "When collecting your card, bring your approval code and any valid identification.",
                },
              ].map((tip, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-card border border-border"
                >
                  <h4 className="font-semibold text-foreground mb-2">
                    {tip.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {tip.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Steps;
