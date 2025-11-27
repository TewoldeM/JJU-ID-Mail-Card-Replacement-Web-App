import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/use-Scroll-Animation";
import Link from "next/link";

export function CTASection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="section-padding bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-foreground rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      <div ref={ref} className="container-custom relative">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className={cn(
              "font-heading text-3xl md:text-4xl font-bold mb-6 opacity-0",
              isVisible && "animate-fade-in-up"
            )}
          >
            Ready to Replace Your Card?
          </h2>
          <p
            className={cn(
              "text-lg text-primary-foreground/90 mb-8 opacity-0",
              isVisible && "animate-fade-in-up animation-delay-100"
            )}
          >
            Don't wait in long queues. Apply online now and get your replacement
            ID or meal card within 24-48 hours.
          </p>
          <div
            className={cn(
              "flex flex-col sm:flex-row gap-4 justify-center opacity-0 text-gray-500",
              isVisible && "animate-fade-in-up animation-delay-200"
            )}
          >
            <Button asChild variant="outline" size="lg">
              <Link href="/steps">
                Start Application <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
