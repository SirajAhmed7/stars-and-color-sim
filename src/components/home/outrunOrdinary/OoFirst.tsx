"use client";

import useLenisInstance from "@/hooks/useLenisInstance";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { Fragment, useRef } from "react";

function OoFirst({ tl }: { tl: GSAPTimeline | null }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lenis = useLenisInstance();

  useGSAP(
    () => {
      if (!tl) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        tl.fromTo(
          ".oo-first-left",
          {
            // xPercent: 10,
            xPercent: 15,
          },
          {
            // xPercent: -10,
            xPercent: 5,
            duration: 1.2,
            ease: "none",
          }
        );
        tl.fromTo(
          ".oo-first-right",
          {
            // xPercent: -10,
            xPercent: -15,
          },
          {
            // xPercent: 10,
            xPercent: -5,
            duration: 1.2,
            ease: "none",
          },
          "<"
        );

        tl.to(
          wrapperRef.current,
          {
            opacity: 0,
            duration: 0,
            pointerEvents: "none",
            onComplete: () => {
              lenis?.start();
            },
          },
          ">-0.2"
        );
      });
    },
    {
      dependencies: [tl, lenis],
      revertOnUpdate: true,
    }
  );

  return (
    <div
      ref={wrapperRef}
      className="hidden md:block absolute top-0 left-0 w-full h-screen bg-white z-20"
    >
      <div className="oo-first absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white  flex flex-col gap-0 -rotate-[15deg] origin-center z-20">
        {new Array(6).fill(1).map((_, i) => (
          <div
            // className={`flex gap-[4vw] text-[7vw] font-harmond font-black uppercase text-gray-900 leading-none ${
            className={`flex items-center gap-[0.5vw] text-[15vw] md:text-[7vw] font-bold uppercase -tracking-[0.3vw] text-gray-900 leading-none ${
              "oo-first-line-" + i
            } ${i % 2 === 0 ? "oo-first-left" : "oo-first-right"}`}
            key={`outrun-ordinary-${i}`}
          >
            {new Array(5).fill(1).map((_, i) => {
              return (
                <Fragment key={`oo-first-${i}`}>
                  <div className="shrink-0">
                    <div className="oo-first-letters-1">
                      Outrun &nbsp;ordinary
                    </div>
                    <div className="oo-first-letters-2 absolute top-0 left-0 w-full h-full">
                      Outrun &nbsp;ordinary
                    </div>
                  </div>
                  <div className="relative aspect-square w-[5vw] shrink-0">
                    <Image
                      src={"/images/star-black.svg"}
                      fill
                      alt="Star"
                      className="object-contain w-full h-full"
                    />
                  </div>
                </Fragment>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default OoFirst;
