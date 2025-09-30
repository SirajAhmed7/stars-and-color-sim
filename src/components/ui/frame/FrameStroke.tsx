"use client";

import { cn } from "@/utils/utils";
import Image from "next/image";
import { useState } from "react";

function FrameStroke({ bgColor }: { bgColor: string }) {
  const [logoDims, setLogoDims] = useState({ width: 0, height: 0 });
  const [navDims, setNavDims] = useState({ width: 0, height: 0 });
  const [textDims, setTextDims] = useState({ width: 0, height: 0 });
  const [ctaDims, setCtaDims] = useState({ width: 0, height: 0 });

  return (
    <>
      <div className="frame-el fixed top-0 left-0 w-screen h-svh z-[47] pointer-events-none">
        <div
          className={cn(
            "absolute top-[calc(var(--frame-stroke-size)-0.5px)] right-[calc(var(--frame-stroke-size)-0.5px)] translate-x-1/2 -translate-y-1/2 rotate-45 aspect-square w-[calc(var(--frame-stroke-size)-0.5px)] frame-corner-right",
            bgColor
          )}
        ></div>
        <div
          className={cn(
            "absolute bottom-[calc(var(--frame-stroke-size)-0.5px)] right-[calc(var(--frame-stroke-size)-0.5px)] translate-x-1/2 translate-y-1/2 rotate-45 aspect-square w-[calc(var(--frame-stroke-size)-0.5px)] frame-corner-right",
            bgColor
          )}
        ></div>
        <div className="absolute top-[1.1vw] sm:top-[0.8vw] lg:top-[0.5vw] right-[1.1vw] sm:right-[0.8vw] lg:right-[0.5vw] aspect-square w-[2.3vw] sm:w-[1.6vw] lg:w-[1.1vw] frame-border-right">
          <Image
            src={"/images/corner-diamond.svg"}
            alt="Diamond"
            fill
            className="w-full h-full inset-0 object-contain"
          />
        </div>
        <div className="absolute bottom-[1.1vw] sm:bottom-[0.8vw] lg:bottom-[0.5vw] right-[1.1vw] sm:right-[0.8vw] lg:right-[0.5vw] aspect-square w-[2.3vw] sm:w-[1.6vw] lg:w-[1.1vw] frame-border-right">
          <Image
            src={"/images/corner-diamond.svg"}
            alt="Diamond"
            fill
            className="w-full h-full inset-0 object-contain"
          />
        </div>
      </div>

      <div className="frame-el fixed top-0 left-0 w-screen h-screen z-[47] pointer-events-none">
        <div
          className={cn(
            "absolute top-0 left-0 w-full h-[var(--frame-stroke-size)]",
            bgColor
          )}
        ></div>
        <div
          className={cn(
            "absolute top-0 right-0 w-[var(--frame-stroke-size)] h-full frame-border-right",
            bgColor
          )}
        ></div>
        <div
          className={cn(
            "absolute bottom-0 left-0 w-full h-[var(--frame-stroke-size)]",
            bgColor
          )}
        ></div>
        <div
          className={cn(
            "absolute top-0 left-0 w-[var(--frame-stroke-size)] h-full",
            bgColor
          )}
        ></div>

        <div
          className={cn(
            "absolute top-[calc(var(--frame-stroke-size)-0.5px)] left-[calc(var(--frame-stroke-size)-0.5px)] -translate-x-1/2 -translate-y-1/2 rotate-45 aspect-square w-[calc(var(--frame-stroke-size)-0.5px)]",
            bgColor
          )}
        ></div>

        <div
          className={cn(
            "absolute bottom-[calc(var(--frame-stroke-size)-0.5px)] left-[calc(var(--frame-stroke-size)-0.5px)] -translate-x-1/2 translate-y-1/2 rotate-45 aspect-square w-[calc(var(--frame-stroke-size)-0.5px)]",
            bgColor
          )}
        ></div>

        <div className="absolute top-[1.1vw] sm:top-[0.8vw] lg:top-[0.5vw] left-[1.1vw] sm:left-[0.8vw] lg:left-[0.5vw] aspect-square w-[2.3vw] sm:w-[1.6vw] lg:w-[1.1vw]">
          <Image
            src={"/images/corner-diamond.svg"}
            alt="Diamond"
            fill
            className="w-full h-full inset-0 object-contain"
          />
        </div>

        <div className="absolute bottom-[1.1vw] sm:bottom-[0.8vw] lg:bottom-[0.5vw] left-[1.1vw] sm:left-[0.8vw] lg:left-[0.5vw] aspect-square w-[2.3vw] sm:w-[1.6vw] lg:w-[1.1vw]">
          <Image
            src={"/images/corner-diamond.svg"}
            alt="Diamond"
            fill
            className="w-full h-full inset-0 object-contain"
          />
        </div>
      </div>
    </>
  );
}

export default FrameStroke;
