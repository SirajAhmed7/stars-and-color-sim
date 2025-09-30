"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);


function NormalizeScroll() {
  useGSAP(() => {
    ScrollTrigger.normalizeScroll(true);
  });
  
  return null;
}

export default NormalizeScroll;
