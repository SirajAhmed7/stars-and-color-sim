"use client";
import { useScrollSmoother } from "@/contexts/ScrollSmootherContext";
import { makeSticky } from "@/utils/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import Image from "next/image";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollToPlugin);

const ScrollToExplore = () => {
  const parent = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLImageElement>(null);
  const arrow = useRef<HTMLDivElement>(null);
  const { scroller } = useScrollSmoother();

  useGSAP(() => {
    gsap.to(text.current, {
      rotate: 360,
      repeat: -1,
      ease: "none",
      duration: 4,
    });
  }, [parent, text, arrow]);

  useEffect(() => {
    if (parent.current && text.current && arrow.current) {
      makeSticky(parent.current, parent.current, 0.7);
      makeSticky(parent.current, text.current, 0.5);
      makeSticky(parent.current, arrow.current, 1.0);
    }
  }, []);

  return (
    <div className="text-sm mix-blend-exclusion z-20 absolute left-1/2 -translate-x-1/2 bottom-12 md:bottom-8 lg:bottom-16">
      <div
        ref={parent}
        className="sticky-btn relative grid place-items-center cursor-pointer"
        onClick={() => {
          // gsap.to(window, {
          //   scrollTo: {
          //     y: ".hero",
          //     offsetY: -document.querySelector(".hero")?.getBoundingClientRect()
          //       .height!,
          //     autoKill: false,
          //   },
          //   duration: 0.5,
          //   // ease: "power2.out",
          // });
          scroller?.scrollTo(".home-diamond", true);
        }}
      >
        <Image
          ref={text}
          className="size-20 pointer-events-none"
          src="/icons/scroll-to-explore.svg"
          alt=""
          width={80}
          height={80}
        />
        <div
          ref={arrow}
          className="size-20 pointer-events-none absolute grid place-items-center"
        >
          <Image
            src="/icons/arrow-narrow-down hard corners.svg"
            alt=""
            width={30}
            height={30}
          />
        </div>
      </div>
    </div>
  );
};

export default ScrollToExplore;
