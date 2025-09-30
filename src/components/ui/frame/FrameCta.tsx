"use client";

import { hoverBtnAudio } from "@/components/Audio/audio";
import HoverTextScramble from "@/components/interactions/HoverTextScramble";
import { cn } from "@/utils/utils";
import Link from "next/link";
import { useState } from "react";

function FrameCta({ bgColor }: { bgColor: string }) {
  const [isMouseOver, setIsMouseOver] = useState(false);

  function handleMouseEnter() {
    setIsMouseOver(true);
    hoverBtnAudio.play();
  }

  function handleMouseLeave() {
    setIsMouseOver(false);
  }

  return (
    <>
      <div
        className={cn(
          "hidden md:flex frame-el frame-cta fixed bottom-0 right-1/2 max-md:translate-x-1/2 md:right-[8vw] h-[var(--frame-element-stroke-size)] px-4 py-2 gap-9 items-center z-40 text-sm md:text-base text-white font-medium uppercase frame-element-bottom bg-gray-800 frame-stroke"
        )}
      >
        Let&apos;s Talk
      </div>
      <Link
        href={"/contact"}
        // target="_blank"
        className={cn(
          "hidden md:flex frame-el frame-cta fixed bottom-0 right-1/2 max-md:translate-x-1/2 md:right-[8vw] h-[var(--frame-element-size)] px-4 py-2 gap-9 items-center z-50 text-sm md:text-base text-white font-medium uppercase frame-element-bottom drop-shadow-md shadow-white",
          bgColor
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[20%] bg-white/60 blur w-4/5 h-1/6 rounded-full -z-10"></div>

        <span className="inline-block md:-translate-y-0.5">
          <HoverTextScramble externalHover={isMouseOver}>
            Let&apos;s Talk
          </HoverTextScramble>
        </span>
      </Link>
    </>
  );
}

export default FrameCta;
