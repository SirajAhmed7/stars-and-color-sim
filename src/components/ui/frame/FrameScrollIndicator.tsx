"use client";

import { cn } from "@/utils/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function FrameScrollIndicator({ bgColor }: { bgColor: string }) {
  const pathname = usePathname();
  const diamondTopRef = useRef<HTMLDivElement>(null);
  const diamondBottomRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<GSAPTimeline | null>(null);

  useEffect(() => {
    if (pathname && tlRef.current) {
      tlRef.current.scrollTrigger?.refresh();
    }
  }, [pathname]);

  // useGSAP(() => {
  //   const mm = gsap.matchMedia();

  //   mm.add("(min-width: 768px)", () => {
  //     const tl = gsap.timeline({
  //       scrollTrigger: {
  //         scroller: "#wrapper",
  //         trigger: "#content",
  //         start: "top top",
  //         end: "bottom bottom",
  //         scrub: true,
  //       },
  //     });

  //     tl.to(diamondTopRef.current, {
  //       backgroundColor: "#ffffff",
  //       duration: 0.03,
  //     });
  //     tl.to(scrollProgressRef.current, {
  //       scaleY: 1,
  //     });
  //     tl.to(diamondBottomRef.current, {
  //       backgroundColor: "#ffffff",
  //       duration: 0.03,
  //     });

  //     tlRef.current = tl;
  //   });

  // });

  return (
    <>
      <div
        className={cn(
          "frame-el fixed left-0 top-1/2 -translate-y-1/2 w-[var(--frame-element-stroke-size)] h-[calc(30%+2px)] frame-element-left z-40 bg-gray-800 frame-stroke"
        )}
      ></div>
      <div
        className={cn(
          "frame-el fixed left-0 top-1/2 -translate-y-1/2 w-[var(--frame-element-size)] h-[30%] frame-element-left z-50",
          bgColor
        )}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-[90%] bg-gray-700">
          <div
            ref={diamondTopRef}
            className="absolute top-0 -translate-y-full left-1/2 -translate-x-1/2 aspect-square w-[3px] bg-gray-700 rotate-45"
          ></div>
          <div
            ref={diamondBottomRef}
            className="absolute bottom-0 translate-y-full left-1/2 -translate-x-1/2 aspect-square w-[3px] bg-gray-700 rotate-45"
          ></div>
        </div>
        <div
          ref={scrollProgressRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-[90%] bg-gray-100 z-10 origin-top scale-y-0"
        ></div>
      </div>
    </>
  );
}

export default FrameScrollIndicator;
