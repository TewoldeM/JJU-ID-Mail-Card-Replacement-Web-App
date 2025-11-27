import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/use-Scroll-Animation";

const testimonials = [
  {
    name: "Ahmed Mohamed",
    department: "Computer Science",
    year: "3rd Year",
    content:
      "I lost my ID card and was dreading the traditional process. This system made it so easy - I applied online and got my new card in just 2 days!",
    rating: 5,
  },
  {
    name: "Fatima Hassan",
    department: "Medicine",
    year: "4th Year",
    content:
      "The real-time tracking feature is amazing. I always knew exactly where my application was in the process. Highly recommended!",
    rating: 5,
  },
  {
    name: "Abdi Omar",
    department: "Engineering",
    year: "2nd Year",
    content:
      "My meal card expired and I needed a replacement urgently. The online system was straightforward and the staff processed it quickly.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="section-padding bg-background">
      <div ref={ref} className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span
            className={cn(
              "inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 opacity-0",
              isVisible && "animate-fade-in-up"
            )}
          >
            Testimonials
          </span>
          <h2
            className={cn(
              "font-heading text-3xl md:text-4xl font-bold text-foreground mb-4 opacity-0",
              isVisible && "animate-fade-in-up animation-delay-100"
            )}
          >
            What Students Say
          </h2>
          <p
            className={cn(
              "text-muted-foreground text-lg opacity-0",
              isVisible && "animate-fade-in-up animation-delay-200"
            )}
          >
            Hear from JJU students who have used our card replacement system.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={cn(
                "relative p-6 rounded-2xl bg-card border border-border card-hover opacity-0",
                isVisible && "animate-fade-in-up"
              )}
              style={{ animationDelay: `${(index + 1) * 150}ms` }}
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/20" />

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                ))}
              </div>

              <p className="text-muted-foreground mb-6">
                {testimonial.content}
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm">
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.department} • {testimonial.year}
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
