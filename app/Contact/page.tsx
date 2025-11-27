"use client";

import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/use-Scroll-Animation";
import { Layout } from "@/components/collection/layouts/layout";

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Us",
    details: [
      "Student Dean's Office",
      "Jigjiga University Main Campus",
      "Jigjiga, Somali Region, Ethiopia",
    ],
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["support@jju.edu.et", "cards@jju.edu.et"],
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+251 25 775 2020", "+251 25 775 2021"],
  },
  {
    icon: Clock,
    title: "Office Hours",
    details: [
      "Monday - Friday: 8:00 AM - 5:00 PM",
      "Saturday: 8:00 AM - 12:00 PM",
      "Sunday: Closed",
    ],
  },
];

const Contact = () => {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: formRef, isVisible: formVisible } = useScrollAnimation();

  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
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
              Contact Us
            </span>
            <h1
              className={cn(
                "font-heading text-4xl md:text-5xl font-bold mb-6 opacity-0",
                heroVisible && "animate-fade-in-up animation-delay-100"
              )}
            >
              Get in Touch
            </h1>
            <p
              className={cn(
                "text-xl text-primary-foreground/90 opacity-0",
                heroVisible && "animate-fade-in-up animation-delay-200"
              )}
            >
              Have questions about the card replacement process? We're here to
              help. Reach out to the Student Dean's Office for assistance.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="section-padding bg-background">
        <div ref={formRef} className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2
                className={cn(
                  "font-heading text-2xl md:text-3xl font-bold text-foreground mb-8 opacity-0",
                  formVisible && "animate-fade-in-up"
                )}
              >
                Contact Information
              </h2>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex gap-4 p-5 rounded-xl bg-card border border-border card-hover opacity-0",
                      formVisible && "animate-fade-in-up"
                    )}
                    style={{ animationDelay: `${(index + 1) * 100}ms` }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        {info.title}
                      </h3>
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-sm text-muted-foreground">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Placeholder */}
              <div
                className={cn(
                  "mt-8 rounded-2xl overflow-hidden border border-border opacity-0",
                  formVisible && "animate-fade-in-up animation-delay-500"
                )}
              >
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <div className="text-center p-8">
                    <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h4 className="font-semibold text-foreground mb-2">
                      Jigjiga University
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Main Campus, Jigjiga, Somali Region
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div
              className={cn(
                "opacity-0",
                formVisible && "animate-slide-in-right animation-delay-200"
              )}
            >
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-8">
                Send Us a Message
              </h2>

              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Student ID
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your student ID"
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Subject
                  </label>
                  <select className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Select a subject</option>
                    <option value="application">Application Issue</option>
                    <option value="status">Status Inquiry</option>
                    <option value="collection">Card Collection</option>
                    <option value="technical">Technical Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Describe your issue or question..."
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  ></textarea>
                </div>

                <Button type="button" size="lg" className="w-full">
                  <Send className="w-5 h-5" />
                  Send Message
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  This is a demo form. No data will be submitted.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
