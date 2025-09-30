"use client";

import Star from "@/components/ui/Star";
import { cn } from "@/utils/utils";
import TestimonialsAnimationsWrapper from "./TestimonialsAnimationsWrapper";
import TestimonialsNumber from "./TestimonialsNumber";
import TestimonialsVideo from "./TestimonialsVideo";

function Testimonials() {
  const testimonials = [
    {
      name: "Akash Gupta",
      title: "COO",
      company: "Trinkerr",
      quote: "Rare isn't just a service, it's a strategic edge.",
    },
    {
      name: "Sarah Mitchell",
      title: "Marketing Director",
      company: "BlueTech Solutions",
      quote: "Game changing results, highly recommend!",
    },
    {
      name: "Michael Chen",
      title: "Founder",
      company: "Green Valley Consulting",
      quote: "Best investment I've made for my business.",
    },
  ];

  return (
    <TestimonialsAnimationsWrapper numOfTestimonials={testimonials.length}>
      <section
        className="testimonials px-5 min-h-screen relative"
        style={{
          height: `${(testimonials.length + 1) * 100}vh`,
        }}
      >
        <Star className="absolute top-[35%] right-[13%] w-16" />

        <Star className="absolute top-[55%] left-[10%] w-20" />

        <Star className="absolute top-[75%] right-[11%] w-20" />

        <TestimonialsVideo />

        <div className="testimonials-content-wrapper w-full h-screen flex justify-center items-center">
          <div className="relative translate-y-[20%] sm:translate-y-0">
            <div className="absolute -top-12 sm:-top-32 left-0 w-full overflow-hidden">
              <div className="testimonials-subheading-wrapper relative w-full translate-y-full">
                {testimonials.map((testimonial, i) => (
                  <p
                    className={cn(
                      "font-extralight text-base sm:text-2xl md:text-[40px] md:leading-[52px] text-center",
                      i > 0 ? "absolute top-0 left-0 w-full h-full" : ""
                    )}
                    style={{
                      transform: `translateY(${i * 100}%)`,
                    }}
                    key={testimonial.name}
                  >
                    {testimonial.name} - {testimonial.title}{" "}
                    {testimonial.company}
                  </p>
                ))}
              </div>
            </div>

            {/* <p className="font-harmond condensed font-semibold text-9xl leading-none text-center max-w-[70%] mx-auto"> */}
            <div className="w-full max-w-[80%] sm:max-w-[65%] mx-auto relative">
              {testimonials.map((testimonial, i) => (
                <p
                  className={`font-harmond condensed font-semibold text-5xl sm:text-[8vw] leading-none text-center ${
                    "testimonials-quote-" + (i + 1)
                  } ${i > 0 ? "absolute top-0 left-0 w-full h-full" : ""}`}
                  key={testimonial.name + "-quote"}
                >
                  {testimonial.quote}
                </p>
              ))}
            </div>

            <div className="block md:hidden absolute -bottom-20 left-1/2 -translate-x-1/2 w-[65%] overflow-hidden">
              <p className="testimonials-phone-text font-extralight text-center translate-y-full">
                Purpose driven brains, zero drama, just shipping.
              </p>
            </div>

            <TestimonialsNumber numOfTestimonials={testimonials.length} />
          </div>
        </div>
      </section>
    </TestimonialsAnimationsWrapper>
  );
}

export default Testimonials;
