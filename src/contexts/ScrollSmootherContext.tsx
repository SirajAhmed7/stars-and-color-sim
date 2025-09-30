"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ReactLenis from "lenis/react";
import { createContext, useContext, useEffect, useRef, useState } from "react";

type ScrollSmootherContextType = {
  scroller: ScrollSmoother | null;
};

const ScrollSmootherContext = createContext<ScrollSmootherContextType>({
  scroller: null,
});

gsap.registerPlugin(
  Observer,
  ScrollTrigger,
  ScrollSmoother,
  useGSAP,
  ScrollToPlugin
);

function ScrollSmootherProvider({ children }: { children: React.ReactNode }) {
  const [scroller, setScroller] = useState<ScrollSmoother | null>(null);
  const lenisRef = useRef<any>(null);
  // const isMobile = useMediaQuery("(max-width: 639px)");

  // useGSAP(() => {
  //   const mm = gsap.matchMedia();

  //   mm.add("(min-width: 640px)", () => {
  //     let scroller: ScrollSmoother | null;
  //     // // if (!Observer.isTouch) {
  //     scroller = ScrollSmoother.create({
  //       wrapper: "#wrapper",
  //       content: "#content",
  //       smooth: 1.5, // how long (in seconds) it takes to "catch up" to the native scroll position
  //       effects: true, // looks for data-speed and data-lag attributes on elements
  //       smoothTouch: 0.05, // much shorter smoothing time on touch devices (default is NO smoothing on touch devices)
  //     });
  //     // scroller.paused(true);
  //     setScroller(scroller);
  //     // // Dispatch event when ScrollSmoother is ready
  //     // setTimeout(() => {
  //     //   const scrollSmootherReadyEvent = new CustomEvent("scrollsmoother-ready");
  //     //   window.dispatchEvent(scrollSmootherReadyEvent);
  //     // }, 100);
  //   });

  //   return () => {
  //     if (scroller)
  //       // st.kill();
  //       scroller.kill();

  //     // normalizer?.kill();
  //   };
  // });

  useEffect(() => {
    // if (isMobile) return;
    // if (!lenisRef.current?.lenis) return;

    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    // console.log("update");

    gsap.ticker.add(update);

    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <ScrollSmootherContext.Provider value={{ scroller }}>
      <ReactLenis
        root
        options={{
          autoRaf: false,
        }}
        ref={lenisRef}
      />
      {children}
    </ScrollSmootherContext.Provider>
  );
}

export function useScrollSmoother() {
  const context = useContext(ScrollSmootherContext);

  if (context === undefined) {
    throw new Error(
      "ScrollSmootherContext was used outside the ScrollSmootherProvider"
    );
  }

  return context;
}

export default ScrollSmootherProvider;
