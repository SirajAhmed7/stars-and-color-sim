"use client";

import { cn } from "@/utils/utils";
import { useRef } from "react";
import KoacGrid from "./KoacGrid";
import KoacVideo from "./KoacVideo";

function KickOffAConvo({
  textLeft,
  textRight,
  video,
  className,
  videoClassName,
  nextSectionClassName,
  instantSnap = false,
}: {
  textLeft: string[];
  textRight: string[];
  video: string;
  className?: string;
  nextSectionClassName?: string;
  videoClassName?: string;
  instantSnap?: boolean;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  return (
    // <section className="kick-off-a-convo w-full relative pt-[50vh]">
    <section className={cn("kick-off-a-convo w-full relative", className)}>
      <KoacGrid
        textLeft={textLeft}
        textRight={textRight}
        headingRef={headingRef}
      />
      <KoacVideo
        headingRef={headingRef}
        video={video}
        videoClassName={videoClassName}
        nextSectionClassName={nextSectionClassName}
        instantSnap={instantSnap}
      />
    </section>
  );
}

export default KickOffAConvo;
