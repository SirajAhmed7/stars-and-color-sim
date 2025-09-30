"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useState } from "react";
import OoFirst from "./OoFirst";
import OoSecond from "./OoSecond";

function OutrunOrdinary() {
  const [tl, setTl] = useState<GSAPTimeline | null>(null);

  useGSAP(() => {
    let timeout: number;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isLg: "(min-width: 1024px)",
        isSm: "(max-width: 1023px)",
      },
      (context: gsap.Context, contextSafe?: gsap.ContextSafeFunc) => {
        if (!contextSafe) return;

        const delayedAnimation = contextSafe(() => {
          const isLg = context.conditions?.isLg;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: ".outrun-ordinary",
              start: isLg ? "top bottom" : "top 30%",
              toggleActions: "play none none reset",
              // markers: true,
            },
          });

          setTl(tl);
        });

        timeout = setTimeout(delayedAnimation, 130);
      }
    );

    return () => {
      clearTimeout(timeout);
    };
  });

  return (
    <div className="outrun-ordinary w-full h-screen relative overflow-hidden">
      <OoFirst tl={tl} />
      <OoSecond tl={tl} />
    </div>
  );
}

export default OutrunOrdinary;
