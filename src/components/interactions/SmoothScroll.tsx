"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  // const lenisRef = useRef<any>(null);

  // useEffect(() => {
  //   // if (!lenisRef.current?.lenis) return;

  //   function update(time: number) {
  //     lenisRef.current?.lenis?.raf(time * 1000);
  //   }

  //   // console.log("update");

  //   gsap.ticker.add(update);

  //   return () => gsap.ticker.remove(update);
  // }, []);

  useGSAP(() => {
    const scroller = ScrollSmoother.create({
      content: "#content",
      smooth: 2, // how long (in seconds) it takes to "catch up" to the native scroll position
      effects: true, // looks for data-speed and data-lag attributes on elements
      // smoothTouch: 0.1, // much shorter smoothing time on touch devices (default is NO smoothing on touch devices)
      normalizeScroll: true,
    });

    return () => {
      scroller.kill();
    };
  });

  // return (
  //   <ReactLenis
  //     // options={{
  //     //   easing: "easeInOutCubic",
  //     // }}
  //     options={{ autoRaf: false }}
  //     ref={lenisRef}
  //     root
  //   >
  //     {children}
  //   </ReactLenis>
  // );
  return <>{children}</>;
};

export default SmoothScroll;
