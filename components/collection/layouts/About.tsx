
import {
  Shield,
  Users,
  Target,
  Heart,
  Award,
  Clock,
  CheckCircle,
  Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/use-Scroll-Animation";
import { Layout } from "./layout";

const benefits = [
  {
    icon: Clock,
    title: "Save Time",
    description: "No need to visit multiple offices or wait in long queues.",
  },
  {
    icon: Shield,
    title: "Secure Process",
    description: "Your personal information is protected with encryption.",
  },
  {
    icon: CheckCircle,
    title: "Transparent",
    description: "Track every step of your application in real-time.",
  },
  {
    icon: Zap,
    title: "Fast Delivery",
    description: "Get your replacement card within 24-48 hours.",
  },
];

const About = () => {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: missionRef, isVisible: missionVisible } = useScrollAnimation();
  const { ref: benefitsRef, isVisible: benefitsVisible } = useScrollAnimation();

  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary-foreground rounded-full blur-3xl" />
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
              About Us
            </span>
            <h1
              className={cn(
                "font-heading text-4xl md:text-5xl font-bold mb-6 opacity-0",
                heroVisible && "animate-fade-in-up animation-delay-100"
              )}
            >
              About the ID & Meal Card Replacement System
            </h1>
            <p
              className={cn(
                "text-xl text-primary-foreground/90 opacity-0",
                heroVisible && "animate-fade-in-up animation-delay-200"
              )}
            >
              A modern digital solution designed to simplify card replacement
              for all Jigjiga University students.
            </p>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="section-padding bg-background">
        <div ref={missionRef} className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span
                className={cn(
                  "inline-block px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4 opacity-0",
                  missionVisible && "animate-fade-in-up"
                )}
              >
                What We Do
              </span>
              <h2
                className={cn(
                  "font-heading text-3xl md:text-4xl font-bold text-foreground mb-6 opacity-0",
                  missionVisible && "animate-fade-in-up animation-delay-100"
                )}
              >
                Streamlining Card Replacement
              </h2>
              <p
                className={cn(
                  "text-muted-foreground text-lg mb-6 opacity-0",
                  missionVisible && "animate-fade-in-up animation-delay-200"
                )}
              >
                The JJU ID & Meal Card Replacement System is an official online
                platform that enables students to apply for replacement cards
                when their original cards are lost, damaged, stolen, or expired.
              </p>
              <p
                className={cn(
                  "text-muted-foreground mb-6 opacity-0",
                  missionVisible && "animate-fade-in-up animation-delay-300"
                )}
              >
                Instead of the traditional paper-based process that required
                multiple office visits, our digital system allows you to
                complete the entire application process from your phone or
                computer.
              </p>
              <div
                className={cn(
                  "space-y-4 opacity-0",
                  missionVisible && "animate-fade-in-up animation-delay-400"
                )}
              >
                {[
                  "ID Card Replacement",
                  "Meal Card Replacement",
                  "Real-time Status Tracking",
                  "Secure Approval Codes",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={cn(
                "relative opacity-0",
                missionVisible && "animate-slide-in-right animation-delay-200"
              )}
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="p-6 rounded-2xl bg-primary text-primary-foreground">
                    <Target className="w-10 h-10 mb-4" />
                    <h3 className="font-heading font-semibold text-lg mb-2">
                      Our Mission
                    </h3>
                    <p className="text-sm text-primary-foreground/90">
                      To provide a seamless, efficient, and transparent card
                      replacement service.
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-card border border-border">
                    <Users className="w-10 h-10 text-primary mb-4" />
                    <h3 className="font-heading font-semibold text-lg mb-2 text-foreground">
                      Student First
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Designed with student convenience as the top priority.
                    </p>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="p-6 rounded-2xl bg-card border border-border">
                    <Heart className="w-10 h-10 text-primary mb-4" />
                    <h3 className="font-heading font-semibold text-lg mb-2 text-foreground">
                      Our Values
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Transparency, efficiency, and dedication to student
                      welfare.
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-muted">
                    <Award className="w-10 h-10 text-primary mb-4" />
                    <h3 className="font-heading font-semibold text-lg mb-2 text-foreground">
                      Official Service
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Authorized by Jigjiga University administration.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Created */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Why We Built This
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
              Solving Real Problems
            </h2>
            <p className="text-muted-foreground text-lg">
              We created this system to address the challenges students faced
              with the traditional card replacement process. Long queues,
              unclear timelines, and multiple office visits made a simple task
              frustrating and time-consuming.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 rounded-2xl bg-card border border-border text-center card-hover">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                <span className="text-2xl">😤</span>
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-2">
                The Problem
              </h3>
              <p className="text-sm text-muted-foreground">
                Students spent hours waiting in queues with no updates on their
                applications.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border text-center card-hover">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-2">
                The Solution
              </h3>
              <p className="text-sm text-muted-foreground">
                A digital platform that brings the entire process online with
                real-time tracking.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border text-center card-hover">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
                <span className="text-2xl">🎉</span>
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-2">
                The Result
              </h3>
              <p className="text-sm text-muted-foreground">
                Faster processing, happier students, and a more efficient
                university system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-background">
        <div ref={benefitsRef} className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span
              className={cn(
                "inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 opacity-0",
                benefitsVisible && "animate-fade-in-up"
              )}
            >
              Benefits
            </span>
            <h2
              className={cn(
                "font-heading text-3xl md:text-4xl font-bold text-foreground mb-4 opacity-0",
                benefitsVisible && "animate-fade-in-up animation-delay-100"
              )}
            >
              Benefits for Students
            </h2>
            <p
              className={cn(
                "text-muted-foreground text-lg opacity-0",
                benefitsVisible && "animate-fade-in-up animation-delay-200"
              )}
            >
              Our system is designed to make your life easier.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className={cn(
                  "p-6 rounded-xl bg-card border border-border card-hover text-center opacity-0",
                  benefitsVisible && "animate-fade-in-up"
                )}
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <benefit.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
