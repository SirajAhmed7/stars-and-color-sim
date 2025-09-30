"use client";

import { cn } from "@/utils/utils";
import Image from "next/image";
import { useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

interface TooltipProps {
  text: string;
  className?: string;
}

gsap.registerPlugin(ScrollTrigger);

function Tooltip({ text, className = "" }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(true);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    let timer: NodeJS.Timeout;
    let hasTriggered = false;

    if (tooltipRef.current) {
      // ScrollTrigger.create({
      //   trigger: tooltipRef.current,
      //   start: "top center",
      //   onEnter: () => {
      //     if (!hasTriggered) {
      //       hasTriggered = true;
      //       timer = setTimeout(() => {
      //         setIsVisible(false);
      //       }, 5000);
      //     }
      //   },
      //   onEnterBack: () => {
      //     if (!hasTriggered) {
      //       hasTriggered = true;
      //       timer = setTimeout(() => {
      //         setIsVisible(false);
      //       }, 5000);
      //     }
      //   },
      // });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: tooltipRef.current,
          start: "top center",
          end: "+=150%",
          toggleActions: "play reset play reset",
        },
      });

      tl.to(tooltipRef.current, {
        duration: 5,
      });

      tl.to(tooltipRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power1.out",
      });
    }

    // return () => {
    //   if (timer) clearTimeout(timer);
    // };
  });

  if (!isVisible) return null;

  return (
    <div
      ref={tooltipRef}
      className={cn(
        "flex items-center gap-2 p-2 bg-white/10 backdrop-blur-2xl z-10 max-w-lg",
        className
      )}
    >
      <Image
        src={"/images/info-circle.svg"}
        alt="info"
        width={20}
        height={20}
      />

      <p className="text-base font-light basis-full">{text}</p>

      <button
        onClick={() => setIsVisible(false)}
        aria-label="Close tooltip"
        type="button"
      >
        <Image src={"/images/x-close.svg"} alt="Close" width={20} height={20} />
      </button>
    </div>
  );
}

export default Tooltip;
