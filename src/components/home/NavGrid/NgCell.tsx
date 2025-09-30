"use client";

import HoverTextScramble from "@/components/interactions/HoverTextScramble";
import { cn } from "@/utils/utils";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

function NgCell({
  text,
  image,
  imageClass,
  className,
  href,
}: {
  text: string;
  image: string;
  imageClass?: string;
  className?: string;
  href: string;
}) {
  const [isMouseOver, setIsMouseOver] = useState(false);
  return (
    <div
      className={cn(
        "bg-gray-980 flex justify-center items-center relative",
        className
      )}
    >
      <Image
        src={image}
        alt={text}
        fill
        className={cn("w-full h-full object-contain", imageClass)}
        onLoad={() => {
          ScrollTrigger.refresh(true);
        }}
      />
      <Link
        href={href}
        className="text-7xl lg:text-8xl font-harmond condensed font-bold z-10"
        onMouseEnter={() => setIsMouseOver(true)}
        onMouseLeave={() => setIsMouseOver(false)}
      >
        <HoverTextScramble
          fontClass="font-harmond"
          // stayCentered
          externalHover={isMouseOver}
        >
          {text}
        </HoverTextScramble>
        <div className="absolute w-full h-full inset-0"></div>
      </Link>
    </div>
  );
}

export default NgCell;
