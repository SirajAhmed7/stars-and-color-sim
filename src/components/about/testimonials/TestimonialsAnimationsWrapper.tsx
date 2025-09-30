"use client";

import { ContextSafeFunc, useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

function TestimonialsAnimationsWrapper({
  numOfTestimonials,
  children,
}: {
  numOfTestimonials: number;
  children: React.ReactNode;
}) {
  useGSAP((context: gsap.Context, contextSafe?: ContextSafeFunc) => {
    if (!contextSafe) return;

    const delayedAnimation = contextSafe(() => {
      const letters = new Array(numOfTestimonials).fill(1).map((_, i) =>
        // new SplitType(`.testimonials-quote-${i + 1}`, {
        //   types: "chars",
        //   charClass: "origin-bottom scale-y-0",
        // })
        SplitText.create(`.testimonials-quote-${i + 1}`, {
          type: "chars, words",
          charsClass: "origin-bottom scale-y-0",
        })
      );

      const videoPin = ScrollTrigger.create({
        trigger: ".testimonials-video-container-outer",
        start: "top top",
        end: `+=${numOfTestimonials * 100}%`,
        pin: true,
        // markers: true,
      });

      const contentPin = ScrollTrigger.create({
        trigger: ".testimonials-content-wrapper",
        start: "top top",
        end: `+=${numOfTestimonials * 100}%`,
        pin: true,
      });

      const tl1 = gsap.timeline({
        scrollTrigger: {
          trigger: ".testimonials",
          start: "top 30%",
          toggleActions: "play none none reverse",
        },
      });

      tl1.to(letters[0].chars, {
        scaleY: 1,
        // filter: "blur(0px)",
        // opacity: 1,
        stagger: 0.017,
        duration: 0.55,
        ease: "power3.inOut",
      });

      tl1.to(
        ".testimonials-phone-text",
        {
          yPercent: -100,
          duration: 0.4,
          ease: "power3.inOut",
        },
        "<0.2"
      );

      tl1.to(
        ".testimonials-number-text",
        {
          yPercent: -105,
          duration: 0.4,
          ease: "power3.inOut",
        },
        "<0.3"
      );
      tl1.to(
        ".testimonials-nums",
        {
          yPercent: -(100 / numOfTestimonials),
          duration: 0.4,
          ease: "power3.inOut",
        },
        "<0.15"
      );

      tl1.to(
        ".testimonials-number-line-star",
        {
          opacity: 1,
          duration: 0.3,
          ease: "power1.out",
        },
        ">-0.2"
      );

      tl1.to(
        ".testimonials-number-line",
        {
          scaleX: 1,
          duration: 0.6,
          ease: "power3.inOut",
        },
        "<"
      );

      tl1.to(
        ".testimonials-subheading-wrapper",
        {
          yPercent: -100,
          duration: 0.6,
          ease: "power2.inOut",
        },
        0.2
      );

      for (let i = 0; i < numOfTestimonials; i++) {
        if (i === 0) continue;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".testimonials",
            start: `top top-=${i * 100}%`,
            toggleActions: "play none none reverse",
          },
        });

        tl.set(letters[i - 1].chars, {
          transformOrigin: "top",
          scaleY: 1,
        });

        tl.to(letters[i - 1].chars, {
          scaleY: 0,
          stagger: 0.017,
          duration: 0.55,
          ease: "power3.inOut",
        });

        tl.to(
          letters[i].chars,
          {
            scaleY: 1,
            stagger: 0.017,
            duration: 0.55,
            ease: "power3.inOut",
          },
          "<"
        );

        tl.to(
          ".testimonials-nums",
          {
            yPercent: -(100 / numOfTestimonials) * (i + 1),
            duration: 0.4,
            ease: "power2.inOut",
          },
          "<"
        );

        tl.to(
          ".testimonials-subheading-wrapper",
          {
            yPercent: -100 * (i + 1),
            duration: 0.6,
            ease: "power2.inOut",
          },
          0.2
        );
      }
    });

    const timeout = setTimeout(delayedAnimation, 300);

    return () => {
      clearTimeout(timeout);
    };
  });

  return <>{children}</>;
}

export default TestimonialsAnimationsWrapper;
