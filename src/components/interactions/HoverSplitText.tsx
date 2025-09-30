"use client";

import { hoverLinkAudio } from "@/components/Audio/audio";
import gsap from "gsap";
import React, { useEffect, useRef } from "react";
import SplitType from "split-type";

const HoverSplitText = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const hoverDiv = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const downRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hoverDiv.current || !mainRef.current || !downRef.current) return;
    const hover = hoverDiv.current;
    // if (!hover) return;

    // const letters = hover.textContent?.split("") || [];
    // const firstParent = document.createElement("div");
    // const secondParent = document.createElement("div");
    // // console.log(letters);
    // // console.log(firstParent.style.fontSize)
    // firstParent.classList.add("relative");
    // secondParent.classList.add(
    //   // "flex",
    //   "absolute",
    //   "top-0",
    //   "left-0",
    //   "translate-y-[110%]",
    //   "scale-[1.15]",
    //   "origin-top-left"
    // );

    // letters.forEach((letter) => {
    //   firstParent.innerHTML += `<span class="letter inline-block">${letter}</span>`;
    //   secondParent.innerHTML += `<span class="letter font-harmond condensed italic inline-block">${letter}</span>`;
    // });

    // hover.textContent = "";
    // hover.appendChild(firstParent);
    // hover.appendChild(secondParent);

    // const spans = [
    //   [...$$(".letter", firstParent)],
    //   [...$$(".letter", secondParent)],
    // ];

    const letters1 = new SplitType(mainRef.current, {
      types: "chars",
    });
    const letters2 = new SplitType(downRef.current, {
      types: "chars",
    });

    const spans = [...letters1.chars!, ...letters2.chars!];

    const spanHoverTw = gsap.to(spans, {
      yPercent: -100,
      stagger: 0.015,
      duration: 0.25,
      ease: "power1.inOut",
      onStart: () => {
        hoverLinkAudio.play();
      },
      paused: true,
    });

    hover.addEventListener("mouseenter", () => spanHoverTw.play());
    hover.addEventListener("mouseleave", () => spanHoverTw.reverse());

    // Cleanup event listeners on unmount
    return () => {
      hover.removeEventListener("mouseenter", () => spanHoverTw.play());
      hover.removeEventListener("mouseleave", () => spanHoverTw.reverse());
    };
  }, []);

  return (
    <div ref={hoverDiv} className="relative overflow-y-hidden">
      <div ref={mainRef} className="relative">
        {children}
      </div>
      <div
        ref={downRef}
        className="absolute top-0 left-0 w-full h-full font-harmond text-lg condensed italic translate-y-[110%] origin-top-left"
      >
        {children}
      </div>
    </div>
  );
};

export default HoverSplitText;
