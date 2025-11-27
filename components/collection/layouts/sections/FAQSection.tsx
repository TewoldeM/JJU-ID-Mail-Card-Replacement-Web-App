import { useState } from "react";
import { ChevronDown, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/use-Scroll-Animation";

const faqs = [
  {
    question: "How long does the card replacement process take?",
    answer:
      "Most applications are processed within 24-48 hours. Once approved, you can collect your card from the Student Dean's Office during working hours.",
  },
  {
    question: "What documents do I need to apply?",
    answer:
      "You need your student ID number, a recent passport-size photo, and a brief explanation of why you need a replacement (lost, damaged, expired, etc.).",
  },
  {
    question: "Is there a fee for card replacement?",
    answer:
      "Yes, there is a small administrative fee for card replacement. The exact amount will be displayed during the application process.",
  },
  {
    question: "Can I track my application status?",
    answer:
      'Yes! Once you submit your application, you can track its status in real-time through the "Track Status" page using your application reference number.',
  },
  {
    question: "What should I do if my application is rejected?",
    answer:
      "If your application is rejected, you will receive a notification with the reason. You can correct any issues and resubmit your application.",
  },
  {
    question: "How do I collect my replacement card?",
    answer:
      "After approval, you will receive a unique approval code. Present this code along with your student ID at the Student Dean's Office to collect your new card.",
  },
];

export function FAQSection() {
  const { ref, isVisible } = useScrollAnimation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section-padding bg-muted/50">
      <div ref={ref} className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span
            className={cn(
              "inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 opacity-0",
              isVisible && "animate-fade-in-up"
            )}
          >
            FAQ
          </span>
          <h2
            className={cn(
              "font-heading text-3xl md:text-4xl font-bold text-foreground mb-4 opacity-0",
              isVisible && "animate-fade-in-up animation-delay-100"
            )}
          >
            Frequently Asked Questions
          </h2>
          <p
            className={cn(
              "text-muted-foreground text-lg opacity-0",
              isVisible && "animate-fade-in-up animation-delay-200"
            )}
          >
            Find answers to common questions about the card replacement process.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={cn(
                "rounded-xl border border-border bg-card overflow-hidden opacity-0",
                isVisible && "animate-fade-in-up"
              )}
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-accent/50 transition-colors"
              >
                <span className="font-medium text-foreground pr-4">
                  {faq.question}
                </span>
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  {openIndex === index ? (
                    <Minus className="w-4 h-4 text-primary" />
                  ) : (
                    <Plus className="w-4 h-4 text-primary" />
                  )}
                </div>
              </button>
              {openIndex === index && (
                <div className="px-5 pb-5 text-muted-foreground animate-fade-in">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
