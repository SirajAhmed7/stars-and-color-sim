"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SplitType from "split-type";

function ScHeading() {
  useGSAP(() => {
    const letters1 = new SplitType(".sc-heading-1", {
      types: "chars",
      charClass: "origin-bottom scale-y-0",
    });
    const letters2 = new SplitType(".sc-heading-2", {
      types: "chars",
      charClass: "origin-bottom scale-y-0",
    });

    const mm = gsap.matchMedia();

    mm.add(
      {
        isLg: "(min-width: 1024px)",
        isSm: "(max-width: 1023px)",
      },
      (context: gsap.Context) => {
        const isLg = context.conditions?.isLg;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".sc-heading-wrapper",
            start: isLg ? "top 55%" : "top 80%",
            toggleActions: "play none none reverse",
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
      }
    );
  });

  return (
    <div className="sc-heading-wrapper w-full text-[17vw] sm:text-[13vw] leading-none text-white font-harmond condensed font-bold px-[3vw] sm:px-[6vw]">
      {/* <h2 className="sc-heading-1 text-center sm:-translate-x-[24%]">Priced</h2>
      <h2 className="sc-heading-2 text-center sm:translate-x-[14%]">
        For Impact
      </h2> */}
      <h2 className="sc-heading-1 text-left">Priced</h2>
      <h2 className="sc-heading-2 text-right">For Impact</h2>
    </div>
  );
}

export default ScHeading;
