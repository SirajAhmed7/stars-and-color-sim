"use client";

import { cn } from "@/utils/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

function Star({
  variant = "fill",
  className,
  dataSpeed = 1,
}: {
  variant?: "fill" | "outline";
  className?: string;
  dataSpeed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP((context: gsap.Context, contextSafe?: gsap.ContextSafeFunc) => {
    if (!contextSafe) return;

    const delayedAnimation = contextSafe(() => {
      // const timeout = setTimeout(() => {
      // const el = ref.current;
      // if (!el) return;

      // Scroll animation
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom+=5%",
          end: "bottom top-=5%",
          // toggleActions: "play reset none reset",
          scrub: 1,
        },
      });

      scrollTl.to(ref.current, {
        rotate: "+=270",
        scale: 1,
        // duration: 0.8,
        ease: "power1.in",
      });
      scrollTl.fromTo(
        ref.current,
        {
          scale: 1,
        },
        {
          rotate: "+=270",
          scale: 0,
          ease: "power1.out",
        }
      );
    });

    const timeout = setTimeout(delayedAnimation, 450);

    // }, 50);

    return () => {
      clearTimeout(timeout);
    };
  });

  // const { contextSafe } = useGSAP();

  // const handleMouseEnter = contextSafe(() => {
  //   gsap.to(ref.current, {
  //     rotate: "+=360",
  //     duration: 1,
  //     ease: "power1.inOut",
  //   });
  // });

  const src = `/images/star-${variant}.svg`;

  return (
    <div
      ref={ref}
      className={cn(
        "hidden md:block absolute aspect-square scale-0",
        className
      )}
      data-speed={dataSpeed}
      // onMouseEnter={handleMouseEnter}
    >
      <Image src={src} alt="star" fill className="object-contain" />
    </div>
  );
}

export default Star;
