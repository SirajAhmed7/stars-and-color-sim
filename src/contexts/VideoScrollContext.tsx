"use client";

import useLenisInstance from "@/hooks/useLenisInstance";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import Snap from "lenis/snap";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";

gsap.registerPlugin(useGSAP, Observer, ScrollTrigger);

type VideoScrollContextProps = {
  scrollDirection: "up" | "down";
};

const VideoScrollContext = createContext<VideoScrollContextProps>({
  scrollDirection: "down",
});

function VideoScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const scrollDirectionRef = useRef<"up" | "down">("down");
  // const lenisInstance = useLenisInstance();

  // useEffect(
  //   function () {
  //     if (lenisInstance === null) return;

  //     console.log("update");
  //     const snap = new Snap(lenisInstance, {
  //       easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  //       // duration: 1,
  //     });
  //     snap.add(document.querySelector(".hero")?.getBoundingClientRect().top);
  //     snap.add(document.querySelector(".negi")?.getBoundingClientRect().top);
  //     snap.add(
  //       document.querySelector(".home-diamond")?.getBoundingClientRect().top
  //     );
  //   },
  //   [lenisInstance]
  // );

  useGSAP(() => {
    const observer = Observer.create({
      target: window,
      type: "scroll",
      onDown: () => {
        if (scrollDirectionRef.current !== "down") {
          // console.log("down");
          scrollDirectionRef.current = "down";
          setScrollDirection("down");
        }
      },
      onUp: () => {
        if (scrollDirectionRef.current !== "up") {
          // console.log("up");
          scrollDirectionRef.current = "up";
          setScrollDirection("up");
        }
      },
    });

    ScrollTrigger.config({
      autoRefreshEvents: "DOMContentLoaded,load",
      limitCallbacks: true,
    });
    window.history.scrollRestoration = "manual"; // <-- important

    return () => {
      observer.kill();
    };
  }, [pathname]);

  return (
    <VideoScrollContext.Provider value={{ scrollDirection }}>
      {children}
    </VideoScrollContext.Provider>
  );
}

export function useVideoScroll() {
  const context = useContext(VideoScrollContext);

  if (context === undefined) {
    throw new Error(
      "VideoScrollContext was used outside the VideoScrollProvider"
    );
  }

  return context;
}

export default VideoScrollProvider;
