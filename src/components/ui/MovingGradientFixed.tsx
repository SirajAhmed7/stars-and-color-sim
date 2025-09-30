"use client";

import { useGSAP } from "@gsap/react";
import MovingGradient from "../Canvas/MovingGradient";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function MovingGradientFixed() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: ref.current,
      start: "top top",
      pin: true,
    });
  });

  return (
    <>
      <div ref={ref} className="absolute top-0 left-0 w-full h-full -z-10">
        <MovingGradient />
      </div>
    </>
  );
}

export default MovingGradientFixed;
