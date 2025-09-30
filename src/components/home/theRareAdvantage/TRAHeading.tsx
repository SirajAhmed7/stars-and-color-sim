"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SplitType from "split-type";

function TRAHeading() {
  useGSAP(() => {
    const letters1 = new SplitType(".tra-heading-1", {
      types: "chars",
      charClass: "origin-bottom scale-y-0",
    });
    const letters2 = new SplitType(".tra-heading-2", {
      types: "chars",
      charClass: "origin-bottom scale-y-0",
    });

    const mm = gsap.matchMedia();

    mm.add(
      {
        isLg: "(min-width: 1024px)",
        isSm: "(max-width: 1023px)",
      },
      (context: gsap.Context, contextSafe?: gsap.ContextSafeFunc) => {
        const isLg = context.conditions?.isLg;

        if (!contextSafe) return;

        const delayedAnimation = contextSafe(() => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: ".tra-heading-wrapper",
              start: isLg ? "top 55%" : "top 80%",
              toggleActions: "play none none reverse",
              // markers: true,
            },
          });

          tl.to(letters1.chars, {
            scaleY: 1,
            // filter: "blur(0px)",
            // opacity: 1,
            stagger: 0.017,
            duration: 0.55,
            ease: "power3.inOut",
          });

          tl.to(
            letters2.chars,
            {
              scaleY: 1,
              // filter: "blur(0px)",
              // opacity: 1,
              stagger: 0.017,
              duration: 0.55,
              ease: "power3.inOut",
            },
            "<0.05"
          );
        });

        setTimeout(delayedAnimation, 100);
      }
    );
  });

  return (
    <div className="tra-heading-wrapper w-full text-[17vw] sm:text-[13vw] leading-none text-white font-harmond condensed font-bold px-[3vw] sm:px-[6vw]">
      {/* <h2 className="tra-heading-1 text-center -translate-x-[18%]">The Rare</h2>
      <h2 className="tra-heading-2 text-center translate-x-[16%]">Advantage</h2> */}
      <h2 className="tra-heading-1 text-left">The Rare</h2>
      <h2 className="tra-heading-2 text-right">Advantage</h2>
    </div>
  );
}

export default TRAHeading;
