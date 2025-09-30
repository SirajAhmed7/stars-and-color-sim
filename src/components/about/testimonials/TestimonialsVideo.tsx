"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function TestimonialsVideo() {
  useGSAP(() => {
    let timeout: number;

    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 1024px)",
      (context: gsap.Context, contextSafe?: gsap.ContextSafeFunc) => {
        if (!contextSafe) return;

        const delayedAnimation = contextSafe(() => {
          gsap.set(".testimonials-video", {
            y: "25vh",
            z: 200,
          });

          gsap.to(".testimonials-video", {
            scrollTrigger: {
              trigger: ".testimonials-video-container-outer",
              start: "top 50%",
              end: "top top",
              scrub: true,
            },
            z: 0,
            y: 0,
          });
        });

        timeout = setTimeout(delayedAnimation, 350);
      }
    );

    return () => {
      clearTimeout(timeout);
    };
  });

  return (
    <div className="testimonials-video-container-outer absolute top-0 left-0 h-screen w-full">
      <div
        className="absolute w-[70%] sm:w-full h-[50%] sm:h-[60%] lg:h-[80%] top-[20%] sm:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          transformStyle: "preserve-3d",
          perspective: 200,
        }}
      >
        <video
          muted
          autoPlay
          loop
          controls={false}
          // src="/videos/home-diamond-2.mp4"
          className="testimonials-video w-full h-full object-contain"
          playsInline
          // style={{
          //   transform: "translate3d(0, 25vh, 200px)",
          // }}
        >
          <source src="/videos/testimonial-heart-2_1.webm" type="video/webm" />
          <source src="/videos/testimonial-heart-2_1.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}

export default TestimonialsVideo;
