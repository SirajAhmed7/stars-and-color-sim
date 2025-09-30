"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import { Observer } from "gsap/Observer";
import { useLenis } from "lenis/react";
import { useEffect, useState, useRef } from "react";
import useLenisInstance from "./useLenisInstance";
import { usePathname } from "next/navigation";
import { useScrollSmoother } from "@/contexts/ScrollSmootherContext";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin, Observer);

function useScrollSnap(
  prevSecClassName: string,
  curSecClassName: string,
  nextSecClassName?: string,
  stopAfterSnap?: boolean
) {
  const pathname = usePathname();

  // Store lenis instance in state to ensure it's available after initialization
  // const lenisInstance = useLenisInstance();
  const { scroller } = useScrollSmoother();

  // Track if animation is in progress to prevent multiple triggers
  const isAnimatingRef = useRef(false);

  // Track if a section is currently snapped
  const isSnappedRef = useRef(false);

  // Track which section is currently snapped
  const snappedSectionRef = useRef<string | null>(null);

  // Refs to store Observer and ScrollTrigger instances for cleanup
  const observerRefs = useRef<any[]>([]);
  const scrollTriggerRefs = useRef<ScrollTrigger[]>([]);

  useGSAP(() => {
    // Only setup when lenis is available
    if (!scroller) return;

    // Get the elements
    const prevSection = document.querySelector(`.${prevSecClassName}`);
    const curSection = document.querySelector(`.${curSecClassName}`);
    const nextSection = nextSecClassName
      ? document.querySelector(`.${nextSecClassName}`)
      : null;

    if (!prevSection || !curSection) {
      console.warn(
        `Could not find elements with classes ${prevSecClassName} or ${curSecClassName}`
      );
      return;
    }

    // Clean up any existing ScrollTriggers and Observers
    scrollTriggerRefs.current.forEach((trigger) => {
      if (trigger) trigger.kill();
    });
    scrollTriggerRefs.current = [];

    observerRefs.current.forEach((observer) => {
      if (observer) observer.kill();
    });
    observerRefs.current = [];

    // Function to handle scrolling to current section
    const handleScrollToCurrent = () => {
      if (isAnimatingRef.current) return;

      isAnimatingRef.current = true;

      // lenisInstance?.stop();
      // scroller?.paused(true);

      setTimeout(() => {
        // gsap.to(window, {
        //   scrollTo: {
        //     y: `.${curSecClassName}`,
        //     offsetY: 0,
        //     autoKill: false,
        //   },
        //   duration: 0.8,
        //   ease: "power2.out",
        //   onComplete: () => {
        //     setTimeout(() => {
        //       if (stopAfterSnap) scroller?.paused(true);
        //       else scroller?.paused(false);
        //       isAnimatingRef.current = false;
        //       isSnappedRef.current = true;
        //       snappedSectionRef.current = curSecClassName;
        //     }, 50);
        //   },
        // });
        scroller.scrollTo(`.${curSecClassName}`, true);

        setTimeout(() => {
          if (stopAfterSnap) scroller?.paused(true);
          else scroller?.paused(false);
          isAnimatingRef.current = false;
          isSnappedRef.current = true;
          snappedSectionRef.current = curSecClassName;
        }, 50);
      }, 10);
    };

    // Function to handle scrolling to previous section
    const handleScrollToPrev = () => {
      if (isAnimatingRef.current) return;

      isAnimatingRef.current = true;

      // scroller?.paused(true);

      setTimeout(() => {
        // gsap.to(window, {
        //   scrollTo: {
        //     y: `.${curSecClassName}`,
        //     offsetY: curSection.getBoundingClientRect().height,
        //     autoKill: false,
        //   },
        //   duration: 0.8,
        //   ease: "power2.out",
        //   onComplete: () => {
        //     setTimeout(() => {
        //       scroller?.paused(false);
        //       isAnimatingRef.current = false;
        //       isSnappedRef.current = true;
        //       snappedSectionRef.current = prevSecClassName;
        //     }, 50);
        //   },
        // });
        scroller.scrollTo(`.${prevSecClassName}`, true);

        setTimeout(() => {
          scroller?.paused(false);
          isAnimatingRef.current = false;
          isSnappedRef.current = true;
          snappedSectionRef.current = prevSecClassName;
        }, 50);
      }, 10);
    };

    // Function to handle scrolling to next section (if available)
    const handleScrollToNext = () => {
      if (!nextSection || isAnimatingRef.current) return;

      isAnimatingRef.current = true;

      scroller?.paused(true);

      setTimeout(() => {
        // gsap.to(window, {
        //   scrollTo: {
        //     y: `.${nextSecClassName}`,
        //     offsetY: 0,
        //     autoKill: false,
        //   },
        //   duration: 0.8,
        //   ease: "power2.out",
        //   onComplete: () => {
        //     setTimeout(() => {
        //       scroller?.paused(false);
        //       isAnimatingRef.current = false;
        //       isSnappedRef.current = true;
        //       snappedSectionRef.current = nextSecClassName ?? null;
        //     }, 50);
        //   },
        // });

        scroller.scrollTo(`.${nextSecClassName}`, true);

        setTimeout(() => {
          scroller?.paused(false);
          isAnimatingRef.current = false;
          isSnappedRef.current = true;
          snappedSectionRef.current = nextSecClassName ?? null;
        }, 50);
      }, 10);
    };

    // ScrollTrigger for initial snap when scrolling into sections
    const stEnterFromPrev = ScrollTrigger.create({
      trigger: `.${curSecClassName}`,
      start: "top 99%",
      // end: "top top-=99%",
      toggleActions: "play none reverse none",
      once: false,
      onEnter: handleScrollToCurrent,
    });
    scrollTriggerRefs.current.push(stEnterFromPrev);

    const stEnterFromNext = ScrollTrigger.create({
      trigger: `.${curSecClassName}`,
      start: "bottom bottom+=1%",
      end: "bottom 1%",
      // markers: true,
      toggleActions: "none none play none",
      once: false,
      onEnterBack: handleScrollToCurrent,
    });
    scrollTriggerRefs.current.push(stEnterFromNext);

    // Create Observer for current section to handle snap out for mouse events
    const currentSectionObserverMouse = Observer.create({
      target: `.${curSecClassName}`,
      type: "wheel",
      onDown: () => {
        // Only proceed if currently snapped to this section and not animating
        if (
          isSnappedRef.current &&
          snappedSectionRef.current === curSecClassName &&
          !isAnimatingRef.current &&
          nextSection
        ) {
          handleScrollToNext();
        }
      },
      onUp: () => {
        // Only proceed if currently snapped to this section and not animating
        if (
          isSnappedRef.current &&
          snappedSectionRef.current === curSecClassName &&
          !isAnimatingRef.current
        ) {
          handleScrollToPrev();
        }
      },
    });
    observerRefs.current.push(currentSectionObserverMouse);

    // Create Observer for current section to handle snap out for touch events
    const currentSectionObserverTouch = Observer.create({
      target: `.${curSecClassName}`,
      type: "touch",
      onDown: () => {
        // Only proceed if currently snapped to this section and not animating
        if (
          isSnappedRef.current &&
          snappedSectionRef.current === curSecClassName &&
          !isAnimatingRef.current
        ) {
          handleScrollToPrev();
        }
      },
      onUp: () => {
        // Only proceed if currently snapped to this section and not animating
        if (
          isSnappedRef.current &&
          snappedSectionRef.current === curSecClassName &&
          !isAnimatingRef.current &&
          nextSection
        ) {
          handleScrollToNext();
        }
      },
    });
    observerRefs.current.push(currentSectionObserverTouch);

    // Clean up function
    return () => {
      scrollTriggerRefs.current.forEach((trigger) => {
        if (trigger) trigger.kill();
      });
      observerRefs.current.forEach((observer) => {
        if (observer) observer.kill();
      });
    };
  }, [scroller, prevSecClassName, curSecClassName, nextSecClassName, pathname]);

  // return { lenisInstance };
}

export default useScrollSnap;
