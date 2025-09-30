"use client";

import { cn } from "@/utils/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

function BlinkingStar({
  variant = "fill",
  className,
  dataSpeed = 1,
}: {
  variant?: "fill" | "outline";
  className?: string;
  dataSpeed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;

    gsap.to(el, {
      scale: 1,
      duration: 0.8,
      ease: "power1.in",
      delay: (Math.random() * 1.5).toFixed(2),
      repeat: -1,
      yoyo: true,
    });
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
      className={cn("absolute aspect-square scale-0", className)}
      data-speed={dataSpeed}
      // onMouseEnter={handleMouseEnter}
    >
      <Image src={src} alt="star" fill className="object-contain" />
    </div>
  );
}

export default BlinkingStar;
