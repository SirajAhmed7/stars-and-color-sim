"use client";

import { useScrollSmoother } from "@/contexts/ScrollSmootherContext";
import { cn } from "@/utils/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";

gsap.registerPlugin(useGSAP, Observer);

function SectionContainer({
  curSecClassName,
  prevSecClassName,
  nextSecClassName,
  className,
  speed,
  lag,
  scrollToPrev,
  scrollToNext,
  children,
}: {
  curSecClassName: string;
  prevSecClassName?: string;
  nextSecClassName?: string;
  className?: string;
  speed?: number;
  lag?: number;
  scrollToPrev?: number;
  scrollToNext?: number;
  children: React.ReactNode;
}) {
  const { scroller } = useScrollSmoother();

  // useGSAP(() => {
  //   const obsMouse = Observer.create({
  //     target: `.${curSecClassName}`,
  //     type: "wheel",
  //     tolerance: 100,
  //     preventDefault: true,
  //     onDown: () => {
  //       if (nextSecClassName) {
  //         scroller?.scrollTo(`.${nextSecClassName}`, true);
  //       }
  //     },
  //     onUp: () => {
  //       if (prevSecClassName) {
  //         scroller?.scrollTo(`.${prevSecClassName}`, true);
  //       }
  //     },
  //   });

  //   const obsTouch = Observer.create({
  //     target: `.${curSecClassName}`,
  //     type: "touch",
  //     tolerance: 100,
  //     preventDefault: true,
  //     onUp: () => {
  //       if (nextSecClassName) {
  //         scroller?.scrollTo(`.${nextSecClassName}`, true);
  //       }
  //     },
  //     onDown: () => {
  //       if (prevSecClassName) {
  //         scroller?.scrollTo(`.${prevSecClassName}`, true);
  //       }
  //     },
  //   });

  //   return () => {
  //     obsMouse.kill();
  //     obsTouch.kill();
  //   };
  // }, [scroller]);

  // useGSAP(() => {
  //   let isScrolling = false;

  //   const scrollToSection = (scrollTo: string | number) => {
  //     if (isScrolling) return;

  //     if (!scrollTo || scrollTo === ".undefined") return;

  //     isScrolling = true;

  //     scroller?.scrollTo(scrollTo, true);

  //     // prevent re-triggering for 1.2s (same as smooth duration)
  //     setTimeout(() => (isScrolling = false), 1600);
  //   };

  //   const commonOptions = {
  //     target: `.${curSecClassName}`,
  //     preventDefault: true,
  //     lockAxis: true,
  //     tolerance: 50,
  //   };

  //   const obsMouse = Observer.create({
  //     ...commonOptions,
  //     type: "wheel,touch",
  //     onDown: () => {
  //       scrollToSection(scrollToNext ? scrollToNext : `.${nextSecClassName}`);
  //     },
  //     onUp: () => {
  //       scrollToSection(scrollToPrev ? scrollToPrev : `.${prevSecClassName}`);
  //     },
  //   });

  //   return () => {
  //     obsMouse.kill();
  //   };
  // }, [scroller, scrollToPrev, scrollToNext]);

  return (
    <section
      className={cn(`${curSecClassName} h-screen w-full relative`, className)}
      data-speed={speed}
      data-lag={lag}
    >
      {children}
    </section>
  );
}

export default SectionContainer;
