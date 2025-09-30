"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DiamondCorners from "../../ui/DiamondCorners";
import HeroTagline from "./HeroTagline";

gsap.registerPlugin(useGSAP, ScrollTrigger, Observer);

const Hero = () => {
  useGSAP(() => {
    const obs = Observer.create({
      target: window,
      type: "wheel",
      tolerance: 1,
      onDown: (self) => {
        const angle = (self.velocityY * 0.01 * 1.6).toFixed(3);
        // console.log((self.velocityY * 0.01).toFixed(3));
        const tl = gsap.timeline();
        tl.to(".hero-heading", {
          rotateX: angle + "deg",
          ease: "power1.inOut",
          duration: 0.25,
          onComplete: () => {
            gsap.to(".hero-heading", {
              rotateX: 0,
              ease: "power1.inOut",
              duration: 0.35,
            });
          },
        });
      },
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        // end: "bottom top",
        end: "+=100%",
        // pin: true,
        scrub: true,
      },
    });
    tl.fromTo(
      ".hero-heading",
      {
        z: 0,
        y: 0,
        rotateX: 0,
      },
      {
        z: -900,
        y: "-15vh",
        // opacity: 0,
      }
    );
  });

  return (
    <section
      className="hero w-full h-screen relative top-0 snap-section mix-blend-exclusion"
      style={{
        transformStyle: "preserve-3d",
        perspective: 200,
      }}
    >
      {/* <div className="w-full h-[200%]"> */}
      <div className="hero-z-wrapper w-full h-screen">
        {/* <MovingGradient /> */}
        <HeroTagline />

        <DiamondCorners />
      </div>
    </section>
  );
};

export default Hero;
