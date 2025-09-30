"use client";

import { useScrollSmoother } from "@/contexts/ScrollSmootherContext";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, Observer);

function AboutHero() {
  const heroRef = useRef<HTMLElement>(null);
  const { scroller } = useScrollSmoother();

  // useGSAP(() => {
  //   Observer.create({
  //     target: heroRef.current,
  //     onDown: () => {
  //       scroller?.scrollTo(".founders-owners-partners", true);
  //     },
  //   });
  // }, [scroller]);

  return (
    <section
      ref={heroRef}
      className="h-screen relative flex justify-center items-center mb-96"
    >
      <div className="absolute inset-0 w-full h-screen mx-auto shrink-0 -z-10">
        <video
          muted
          autoPlay
          loop
          controls={false}
          // src="/videos/home-diamond-2.mp4"
          // className="w-full h-full mx-auto object-contain"
          className="w-full h-full mx-auto object-cover"
          playsInline
        >
          <source src="/videos/robot-dance.mp4" type="video/mp4" />
          {/* <source src="/videos/home-diamond-2.mp4" type="video/mp4" /> */}
        </video>
      </div>

      <h1 className="font-harmond condensed font-semibold text-7xl sm:text-[12vw] text-center max-sm:px-10">
        Built Different
      </h1>
    </section>
  );
}

export default AboutHero;
