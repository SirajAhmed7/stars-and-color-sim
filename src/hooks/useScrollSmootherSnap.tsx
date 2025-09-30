import { useEffect, useRef } from "react";
import { ScrollTrigger, gsap } from "gsap/all";
import { Observer } from "gsap/Observer";
import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";
import { useScrollSmoother } from "@/contexts/ScrollSmootherContext";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, Observer, ScrollToPlugin);

export function useScrollSmootherSnap({
  prevSectionClass,
  currentSectionClass,
  nextSectionClass,
  stopAfterSnap = false,
}: {
  prevSectionClass: string;
  currentSectionClass: string;
  nextSectionClass?: string;
  stopAfterSnap?: boolean;
}) {
  const isAnimatingRef = useRef(false);
  const isSnappedRef = useRef(false);
  const snappedSectionRef = useRef<string | null>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  const pathname = usePathname();

  const { scroller } = useScrollSmoother();

  useGSAP(() => {
    if (!scroller) return;

    const prevSection = document.querySelector(
      `.${prevSectionClass}`
    ) as HTMLElement;
    const currentSection = document.querySelector(
      `.${currentSectionClass}`
    ) as HTMLElement;
    const nextSection = nextSectionClass
      ? (document.querySelector(`.${nextSectionClass}`) as HTMLElement)
      : null;

    if (!currentSection || !prevSection) return;

    // const createScrollTrigger = () => {
    //   const trigger = ScrollTrigger.create({
    //     trigger: currentSection,
    //     start: "top 99%",
    //     onEnter: () => scrollToSection(currentSection),
    //     onEnterBack: () => scrollToSection(currentSection),
    //   });

    //   triggerRef.current = trigger;
    // };
    // createScrollTrigger();

    const scrollToSection = (element: HTMLElement, offset = 0) => {
      if (!scroller) return;

      // if (triggerRef.current) {
      //   triggerRef.current.disable();
      //   // triggerRef.current = null;
      // }

      // console.log(snappedSectionRef.current, element.className.split(" ")[0]);

      if (
        (snappedSectionRef.current === prevSectionClass ||
          snappedSectionRef.current === nextSectionClass) &&
        currentSectionClass === element.className.split(" ")[0]
      ) {
        return;
      }

      isAnimatingRef.current = true;
      scroller.paused(true); // 🚫 disable scroll input

      scroller.scrollTo(element, true);
      // gsap.to(scroller, {
      //   scrollTop: scroller.offset(element),
      //   duration: 0.8,
      //   ease: "power2.out",
      //   onComplete: () => {
      //     scroller.paused(false);
      //     // other reset logic
      //   },
      // });

      // console.log(element.className);

      setTimeout(() => {
        isAnimatingRef.current = false;
        isSnappedRef.current = true;
        snappedSectionRef.current = element.className.split(" ")[0];

        console.log("no animating");

        if (!stopAfterSnap) {
          scroller.paused(false); // ✅ re-enable scroll input
          // triggerRef.current?.enable();
        }

        // createScrollTrigger();
      }, 500); // match scroll duration
    };

    const toPrev = () => {
      if (!isAnimatingRef.current && isSnappedRef.current) {
        scrollToSection(prevSection, 0);
      }
    };

    const toNext = () => {
      // console.log(isAnimatingRef.current);
      if (!nextSection || isAnimatingRef.current) return;
      // console.log("next");
      scrollToSection(nextSection, 0);
    };

    // Snap when this section is entered
    const stEnter = ScrollTrigger.create({
      trigger: currentSection,
      start: "top 99%",
      // end: "bottom 99%",
      // once: false,
      toggleActions: "play none none none",
      onEnter: () => {
        // triggerRef.current = st;
        scrollToSection(currentSection);
      },
      // onLeaveBack: () => {
      //   // triggerRef.current = st;
      //   scrollToSection(currentSection);
      // },
    });
    const stEnterBack = ScrollTrigger.create({
      trigger: currentSection,
      start: "bottom bottom+=1%",
      // end: "bottom 1%",
      // end: "bottom 99%",
      // once: false,
      toggleActions: "none none play none",
      onEnterBack: () => {
        // triggerRef.current = st;
        scrollToSection(currentSection);
      },
    });

    // Observer for up/down scroll
    const observer = Observer.create({
      target: currentSection,
      type: "wheel,touch",
      onDown: () => {
        if (snappedSectionRef.current === currentSectionClass) {
          console.log("down");
          toNext();
        }
      },
      onUp: () => {
        if (snappedSectionRef.current === currentSectionClass) {
          console.log("up");
          toPrev();
        }
      },
    });

    return () => {
      // st.kill();
      stEnter.kill();
      stEnterBack.kill();
      observer.kill();
    };
  }, [scroller, pathname]);
}
