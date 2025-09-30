"use client";

import { cn } from "@/utils/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import SgMarquee from "./SgMarquee";

gsap.registerPlugin(ScrollTrigger);

function ScrollGrid({
  wrapperClassName,
  heading,
  className,
  xBg,
  xBgWrapperClassName,
  xBgClassName,
  hideBottomMount = false,
  services,
  children,
}: {
  wrapperClassName?: string;
  heading?: string;
  className?: string;
  xBg?: string;
  xBgWrapperClassName?: string;
  xBgClassName?: string;
  hideBottomMount?: boolean;
  services?: string[];
  children: React.ReactNode;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      if (heading) {
        gsap.set(headingRef.current, {
          backgroundImage:
            "linear-gradient(to right, #3F3F46 10%, #D1D1D6 50%, #3F3F46 90%)",
          backgroundSize: "200% 100%",
          backgroundPosition: "100% 0",
        });

        gsap.to(headingRef.current, {
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top top",
            end: "+=100%",
            scrub: true,
            pin: true,
          },
          backgroundPosition: "0% 0",
        });
      }
    });
  });

  return (
    <div
      ref={wrapperRef}
      className={`${wrapperClassName} scroll-grid-wrapper w-full h-screen`}
    >
      <div
        className={`scroll-grid w-full h-screen grid grid-cols-1 md:grid-cols-[1.1fr_6fr_1.1fr] grid-rows-[8fr_2fr] md:grid-rows-[1.3fr_6fr_1.3fr] md:scale-150 border-b border-gray-900 ${className}`}
      >
        <div className="hidden md:block sg-grid-item opacity-0 invisible bg-gray-980"></div>

        <div className="hidden md:block sg-grid-item justify-items-center content-center opacity-0 invisible bg-gray-980 border-x  border-gray-900 relative z-10 overflow-x-clip">
          <div className="absolute bottom-0 left-1/2 translate-y-full -translate-x-1/2 w-2/3 h-[var(--sg-frame-stroke-size)] bg-gray-800 frame-element-top overflow-y-clip frame-stroke"></div>
          <div className="absolute bottom-0 left-1/2 translate-y-full -translate-x-1/2 w-2/3 h-[var(--sg-frame-size)] bg-gray-980 frame-element-top overflow-y-clip"></div>

          <div className="absolute bottom-0 left-0 aspect-square w-[var(--sg-frame-stroke-size)] translate-y-full bg-gray-800 frame-grid-corner-piece-top"></div>
          <div className="absolute bottom-0 left-0 aspect-square w-[var(--sg-frame-size)] translate-y-full bg-gray-980 frame-grid-corner-piece-top"></div>

          <div className="absolute bottom-0 right-0 aspect-square w-[var(--sg-frame-stroke-size)] translate-y-full bg-gray-800 frame-grid-corner-piece-top rotate-90"></div>
          <div className="absolute bottom-0 right-0 aspect-square w-[var(--sg-frame-size)] translate-y-full bg-gray-980 frame-grid-corner-piece-top rotate-90"></div>

          {heading && (
            <h2
              ref={headingRef}
              className="text-4xl font-extralight text-center bg-clip-text bg-gray-700 text-transparent capitalize translate-y-1/4"
            >
              {heading}
            </h2>
          )}
        </div>

        <div className="hidden md:block sg-grid-item md:opacity-0 md:invisible bg-gray-980"></div>

        <div className="hidden md:block sg-grid-item justify-items-center content-center opacity-0 invisible bg-gray-980 border-y  border-gray-900 relative z-10">
          <div className="absolute right-0 top-1/2 translate-x-full -translate-y-1/2 h-1/2 w-[calc(var(--sg-frame-size)-0.6px)] bg-gray-800 frame-element-left overflow-x-clip frame-stroke"></div>
          <div className="absolute right-1p top-1/2 translate-x-full -translate-y-1/2 h-1/2 w-[var(--sg-frame-size)] bg-gray-980 frame-element-left overflow-x-clip"></div>

          {xBg && (
            <div
              className={cn(
                "relative h-[95%] w-[90%] translate-x-[10%] -scale-x-100",
                xBgWrapperClassName
              )}
            >
              <Image
                src={xBg}
                alt=""
                fill
                className={cn("object-contain w-full h-full", xBgClassName)}
              />
            </div>
          )}
        </div>

        <div
          className={cn(
            "relative border border-gray-900 overflow-hidden",
            !services ? "row-span-2 md:row-span-1" : ""
          )}
        >
          {children}
        </div>

        <div className="hidden md:block sg-grid-item justify-items-center content-center opacity-0 invisible bg-gray-980 border-y  border-gray-900 relative z-10">
          <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 h-1/2 w-[calc(var(--sg-frame-size)-0.2px)] bg-gray-800 frame-element-right overflow-x-clip frame-stroke"></div>
          <div className="absolute left-1p top-1/2 -translate-x-full -translate-y-1/2 h-1/2 w-[var(--sg-frame-size)] bg-gray-980 frame-element-right overflow-x-clip"></div>

          {xBg && (
            <div
              className={cn(
                "relative h-[95%] w-[90%] -translate-x-[10%]",
                xBgWrapperClassName
              )}
            >
              <Image
                src={xBg}
                alt=""
                fill
                className={cn("object-contain w-full h-full", xBgClassName)}
              />
            </div>
          )}
        </div>

        <div className="hidden md:block sg-grid-item opacity-0 invisible bg-gray-980"></div>

        <div
          className={cn(
            "sg-grid-item md:opacity-0 md:invisible bg-gray-980 border-x border-gray-900 grow-0 relative z-10",
            !services ? "hidden md:block" : ""
          )}
        >
          {!hideBottomMount && (
            <>
              <div className="hidden md:block absolute top-0 left-1/2 -translate-y-full -translate-x-1/2 w-2/3 h-[var(--sg-frame-stroke-size)] bg-gray-800 frame-element-bottom overflow-y-clip frame-stroke"></div>
              <div className="hidden md:block absolute top-0 left-1/2 -translate-y-full -translate-x-1/2 w-2/3 h-[var(--sg-frame-size)] bg-gray-980 frame-element-bottom overflow-y-clip"></div>
            </>
          )}

          <div className="absolute top-0 left-0 aspect-square w-[var(--sg-frame-stroke-size)] -translate-y-full bg-gray-800 frame-grid-corner-piece-bottom"></div>
          <div className="absolute top-0 left-0 aspect-square w-[var(--sg-frame-size)] -translate-y-full bg-gray-980 frame-grid-corner-piece-bottom"></div>

          <div className="absolute top-0 right-0 aspect-square w-[var(--sg-frame-stroke-size)] -translate-y-full bg-gray-800 frame-grid-corner-piece-bottom -rotate-90"></div>
          <div className="absolute top-0 right-0 aspect-square w-[var(--sg-frame-size)] -translate-y-full bg-gray-980 frame-grid-corner-piece-bottom -rotate-90"></div>

          {services && <SgMarquee services={services} />}
        </div>

        <div className="hidden md:block sg-grid-item opacity-0 invisible bg-gray-980"></div>
      </div>
    </div>
  );
}

export default ScrollGrid;
