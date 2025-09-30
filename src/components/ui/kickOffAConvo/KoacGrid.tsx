"use client";

import TypedText from "@/components/interactions/TypedText";
import { ContextSafeFunc, useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef, useState } from "react";
import DigitalClock from "../DigitalClock";
import KoacCTADynamic from "./KoacCTADynamic";
import KoacPointsAnimation from "./KoacPointsAnimation";
import Waves from "./Waves";

function KoacGrid({
  textLeft,
  textRight,
  headingRef,
}: {
  textLeft: string[];
  textRight: string[];
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  // const tlRef = useRef<GSAPTimeline | null>(null);
  const [tlText, setTlText] = useState<GSAPTimeline | null>(null);
  const gridWrapperRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const ctaWrapperRef = useRef<HTMLDivElement>(null);

  useGSAP((context: gsap.Context, contextSafe?: ContextSafeFunc) => {
    if (!contextSafe) return;

    const delayedAnimation = contextSafe(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const gridPin = ScrollTrigger.create({
          trigger: gridWrapperRef.current,
          start: "top top",
          end: "+=300%",
          // end: "+=90%",
          pin: true,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: gridWrapperRef.current,
            start: "top top",
            end: "+=100%",
            scrub: true,
          },
        });
        tl.to(gridRef.current, {
          opacity: 1,
          pointerEvents: "auto",
          visibility: "visible",
          duration: 0.0001,
        });
        tl.to(
          gridRef.current,
          {
            scale: 1,
            duration: 1,
          },
          "scaleEnd"
        );
        tl.to(
          ctaWrapperRef.current,
          {
            yPercent: -50,
            opacity: 1,
            duration: 0.2,
            ease: "power3.inOut",
          },
          ">-0.2"
        );

        const tlTextTrigger = gsap.timeline({
          scrollTrigger: {
            trigger: ".koac-video-grid",
            start: "top bottom",
            end: "+=2%",
          },
        });

        setTlText(tlTextTrigger);
      });

      mm.add("(max-width: 1023px)", () => {
        // const gridPin = ScrollTrigger.create({
        //   trigger: gridWrapperRef.current,
        //   start: "top top",
        //   end: "+=150%",
        //   // end: "+=90%",
        //   pin: true,
        // });

        gsap.to(ctaWrapperRef.current, {
          scrollTrigger: {
            trigger: gridWrapperRef.current,
            start: "top 20%",
            end: "top top",
            scrub: true,
          },
          yPercent: -90,
          opacity: 1,
        });
      });
    });

    const timeout = setTimeout(delayedAnimation, 100);

    return () => {
      clearTimeout(timeout);
    };
  });

  return (
    <div
      ref={gridWrapperRef}
      className="koac-grid-wrapper top-0 left-0 w-full h-screen z-10 md:z-auto"
    >
      {/* <div className="koac-grid-wrapper w-full h-screen -translate-y-[90%] py-[var(--sg-frame-size)]"> */}
      <div
        ref={gridRef}
        className="koac-grid w-full h-full grid grid-cols-1 grid-rows-[1fr_3.5fr_1fr] lg:grid-cols-[1fr_2.5fr_1fr] lg:grid-rows-[1fr_2.7fr_1fr] relative z-10 lg:scale-[200%] lg:opacity-0 lg:pointer-events-none lg:invisible"
      >
        <div className="bg-gray-980 pl-[20%] lg:pl-[30%] hidden lg:flex items-center">
          {/* <div className="aspect-square w-[30%] relative">
            <Image
              src={"/images/home/koac-grid-barcode.png"}
              alt="Kick off a convo"
              fill
              className="object-contain"
            />
          </div> */}

          <div className="space-y-1 font-extralight">
            <p className="text-gray-400 text-xs">/title</p>
            <p className="text-gray-100 text-base">First draft in 24 hrs </p>
          </div>
        </div>

        <div className="bg-gray-980 justify-items-center content-center relative border-x  border-gray-900 pt-[var(--sg-frame-element-size)] lg:pt-0 z-10">
          <div className="absolute bottom-0 left-1/2 translate-y-full -translate-x-1/2 w-[88%] md:w-2/3 h-[var(--sg-frame-stroke-size)] bg-gray-800 frame-element-top overflow-y-clip frame-stroke"></div>
          <div className="absolute bottom-0 left-1/2 translate-y-full -translate-x-1/2 w-[88%] md:w-2/3 h-[var(--sg-frame-size)] bg-gray-980 frame-element-top overflow-y-clip"></div>

          <div className="absolute bottom-0 left-0 aspect-square w-[var(--sg-frame-stroke-size)] translate-y-full bg-gray-800 frame-grid-corner-piece-top"></div>
          <div className="absolute bottom-0 left-0 aspect-square w-[var(--sg-frame-size)] translate-y-full bg-gray-980 frame-grid-corner-piece-top"></div>

          <div className="hidden lg:block absolute bottom-0 right-0 aspect-square w-[var(--sg-frame-stroke-size)] translate-y-full bg-gray-800 frame-grid-corner-piece-top rotate-90"></div>
          <div className="hidden lg:block absolute bottom-0 right-0 aspect-square w-[var(--sg-frame-size)] translate-y-full bg-gray-980 frame-grid-corner-piece-top rotate-90"></div>

          <h2
            ref={headingRef}
            className="koac-heading text-3xl sm:text-4xl font-extralight text-center text-transparent bg-gray-700 bg-clip-text capitalize"
          >
            Unlock your rare session
          </h2>
        </div>

        <div className="bg-gray-980 pr-[20%] lg:pr-[30%] content-center hidden lg:block">
          <div className="space-y-1 font-extralight text-right">
            <p className="text-gray-400 text-xs">/current_status</p>
            <p className="text-gray-100 text-base">Slots left: 02 / 05</p>
          </div>
        </div>

        <div className="bg-gray-980 pl-[20%] lg:pl-[30%] content-center relative border-y  border-gray-900 z-10 hidden lg:block">
          <div className="absolute -right-[1px] top-1/2 translate-x-full -translate-y-1/2 h-1/2 w-[var(--sg-frame-size)] bg-gray-800 frame-element-left overflow-x-clip frame-stroke"></div>
          <div className="absolute right-0 top-1/2 translate-x-full -translate-y-1/2 h-1/2 w-[var(--sg-frame-size)] bg-gray-980 frame-element-left overflow-x-clip"></div>

          <KoacPointsAnimation />
          <div className="text-sm sm:text-base font-extralight text-gray-100 space-y-1">
            {/* <p>We only take a few</p> */}
            {textLeft.map((text: string, i: number) => (
              <p key={`koac-text-left-${text.slice(0, 5)}`}>
                <TypedText
                  text={text}
                  timeline={tlText}
                  tlPosition={`koac-text-${text.slice(0, 5)}-${i}`}
                />
              </p>
            ))}
          </div>
        </div>

        <div className="max-lg:row-start-2 relative border border-gray-900 z-0">
          {/* <div className="block lg:hidden absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-[var(--sg-frame-size)] bg-gray-980 frame-element-bottom overflow-y-clip z-10 mix-blend-hard-light"></div> */}
        </div>

        <div className="bg-gray-980 pr-[20%] lg:pr-[30%] content-center justify-items-end border-y border-gray-900 relative hidden lg:block">
          <div className="absolute -left-[1px] top-1/2 -translate-x-full -translate-y-1/2 h-1/2 w-[var(--sg-frame-size)] bg-gray-800 frame-element-right overflow-x-clip frame-stroke"></div>
          <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 h-1/2 w-[var(--sg-frame-size)] bg-gray-980 frame-element-right overflow-x-clip"></div>

          <div className="w-1/3 relative">
            <Waves />
          </div>
          <div className="text-sm sm:text-base font-extralight text-gray-100 text-right space-y-1">
            {textRight.map((text: string, i: number) => (
              <p key={`koac-text-right-${text.slice(0, 5)}`}>
                <TypedText
                  text={text}
                  timeline={tlText}
                  tlPosition={`koac-text-${textLeft[i].slice(0, 5)}-${i}`}
                  rtl
                />
              </p>
            ))}
          </div>
        </div>

        <div className="bg-gray-980 pl-[20%] lg:pl-[30%] content-center hidden lg:block">
          <div className="w-full relative -translate-y-[10%]">
            <DigitalClock />
          </div>
        </div>

        <div className="bg-background lg:bg-gray-980 border-x border-gray-900 relative z-10 content-center max-lg:flex justify-center items-center">
          <div className="hidden lg:block absolute top-0 left-1/2 -translate-y-full -translate-x-1/2 w-[88%] md:w-2/3 h-[var(--sg-frame-stroke-size)] bg-gray-800 frame-element-bottom overflow-y-clip frame-stroke"></div>
          <div className="hidden lg:block absolute top-0 left-1/2 -translate-y-full -translate-x-1/2 w-[88%] md:w-2/3 h-[var(--sg-frame-size)] bg-gray-980 frame-element-bottom overflow-y-clip"></div>

          <div className="hidden lg:block absolute top-0 left-0 aspect-square w-[var(--sg-frame-stroke-size)] -translate-y-full bg-gray-800 frame-grid-corner-piece-bottom"></div>
          <div className="absolute top-0 left-0 aspect-square w-[var(--sg-frame-size)] -translate-y-full bg-gray-980 frame-grid-corner-piece-bottom"></div>

          <div className="hidden lg:block absolute top-0 right-0 aspect-square w-[var(--sg-frame-stroke-size)] -translate-y-full bg-gray-800 frame-grid-corner-piece-bottom -rotate-90"></div>
          <div className="absolute top-0 right-0 aspect-square w-[var(--sg-frame-size)] -translate-y-full bg-gray-980 frame-grid-corner-piece-bottom -rotate-90"></div>

          {/* <KoacCTA /> */}

          <KoacCTADynamic ctaWrapperRef={ctaWrapperRef} />

          <a
            href={"https://calendly.com/raredesignlabs/30min"}
            target="_blank"
            className="flex lg:hidden justify-center items-center w-[80%] py-4 px-5 bg-white text-gray-900 font-harmond condensed font-semibold text-lg"
          >
            Book a call
          </a>
        </div>

        <div className="hidden lg:block bg-gray-980 pr-[20%] lg:pr-[30%] content-center justify-items-end">
          <div className="aspect-video w-[38%] relative -translate-y-[10%]">
            <Image
              src={"/images/home/koac-grid-bottom-right.png"}
              alt="Kick off a convo"
              fill
              className="object-contain object-right"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default KoacGrid;
