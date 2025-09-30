// components/ScrollToTop.js
"use client";
import { useScrollSmoother } from "@/contexts/ScrollSmootherContext";
import useLenisInstance from "@/hooks/useLenisInstance";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollTopOnNav() {
  const pathname = usePathname();
  // const { scroller } = useScrollSmoother();
  const lenis = useLenisInstance();

  // useEffect(() => {
  //   scroller?.paused(true);
  //   scroller?.scrollTo(0);
  //   scroller?.paused(false);
  // }, [scroller]);

  useEffect(() => {
    // scroller?.paused(true);
    // scroller?.scrollTo(0);
    // scroller?.paused(false);
    // lenis?.stop();
    // lenis?.scrollTo(0);
    // lenis?.start();
    window.scrollTo(0, 0);

    // console.log("ScrollTopOnNav");

    ScrollTrigger.refresh();
  }, [lenis, pathname]);

  useEffect(() => {
    // if (typeof window !== "undefined") {
    window.history.scrollRestoration = "manual";
    // }

    setTimeout(() => {
      ScrollTrigger.refresh(true);
      // router.refresh();
    }, 4000);
  }, []);

  return null;
}
