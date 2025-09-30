"use client";

import { cn } from "@/utils/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function PageHeadingWithVideo({
  sectionClassName,
  className,
  heading,
  video,
}: {
  sectionClassName: string;
  className?: string;
  heading: string;
  video: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // let timeout: number;

    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 768px)",
      (context: gsap.Context, contextSafe?: gsap.ContextSafeFunc) => {
        // if (!contextSafe) return;

        // const delayedAnimation = contextSafe(() => {
        const tl0 = gsap.timeline({
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top top",
            end: "100%",
            scrub: true,
            pin: true,
            anticipatePin: 1,
          },
        });

        tl0.set(".sg-grid-item", {
          opacity: 1,
          visibility: "visible",
        });

        tl0.to(".scroll-grid", {
          scale: 1,
          // duration: 0.5,
        });
        // });

        // timeout = setTimeout(delayedAnimation, 100);
      }
    );

    // return () => {
    //   clearTimeout(timeout);
    // };
  });

  return (
    <div
      ref={wrapperRef}
      className={cn(
        `scroll-grid-wrapper w-full h-screen bg-background`,
        sectionClassName
      )}
    >
      <div
        className={`scroll-grid w-full h-screen grid grid-cols-1 md:grid-cols-[1.1fr_6fr_1.1fr] grid-rows-[8fr_2fr] md:grid-rows-[1.3fr_6fr_1.3fr] md:scale-150 border-b border-[1.5px] border-gray-900`}
      >
        <div className="hidden md:block sg-grid-item opacity-0 invisible bg-gray-980"></div>

        <div className="hidden md:block sg-grid-item justify-items-center content-center opacity-0 invisible bg-gray-980 border-x  border-[1.5px] border-gray-900 relative z-10 overflow-x-clip">
          <div className="absolute bottom-0 left-1/2 translate-y-full -translate-x-1/2 w-2/3 h-[var(--sg-frame-stroke-size)] bg-gray-800 frame-element-top overflow-y-clip frame-stroke"></div>
          <div className="absolute bottom-0 left-1/2 translate-y-full -translate-x-1/2 w-2/3 h-[var(--sg-frame-size)] bg-gray-980 frame-element-top overflow-y-clip"></div>

          <div className="absolute bottom-0 left-0 aspect-square w-[var(--sg-frame-stroke-size)] translate-y-full bg-gray-800 frame-grid-corner-piece-top"></div>
          <div className="absolute bottom-0 left-0 aspect-square w-[var(--sg-frame-size)] translate-y-full bg-gray-980 frame-grid-corner-piece-top"></div>

          <div className="absolute bottom-0 right-0 aspect-square w-[var(--sg-frame-stroke-size)] translate-y-full bg-gray-800 frame-grid-corner-piece-top rotate-90"></div>
          <div className="absolute bottom-0 right-0 aspect-square w-[var(--sg-frame-size)] translate-y-full bg-gray-980 frame-grid-corner-piece-top rotate-90"></div>
        </div>

        <div className="hidden md:block sg-grid-item md:opacity-0 md:invisible bg-gray-980"></div>

        <div className="hidden md:block sg-grid-item justify-items-center content-center opacity-0 invisible bg-gray-980 border-y  border-[1.5px] border-gray-900 relative z-10">
          <div className="absolute right-0 top-1/2 translate-x-full -translate-y-1/2 h-1/2 w-[calc(var(--sg-frame-size)-0.2px)] bg-gray-800 frame-element-left overflow-x-clip frame-stroke"></div>
          <div className="absolute right-1p top-1/2 translate-x-full -translate-y-1/2 h-1/2 w-[var(--sg-frame-size)] bg-gray-980 frame-element-left overflow-x-clip"></div>
        </div>

        <div
          className={cn(
            "relative border-[1.5px] border-gray-900 overflow-hidden row-span-2 md:row-span-1"
          )}
        >
          <div className="absolute w-full h-full top-0 left-0 pointer-events-none">
            <video
              muted
              autoPlay
              loop
              controls={false}
              // src="/videos/home-diamond-2.mp4"
              className="w-full h-full object-cover"
              playsInline
            >
              <source
                src={`/videos/${video}`}
                type={"video/" + video.split(".").at(1)}
              />
              {/* <source src="/videos/home-diamond-2.mp4" type="video/mp4" /> */}
            </video>
          </div>

          <div className="w-full h-full min-h-0 flex justify-center items-center relative">
            <h1 className="text-6xl lg:text-[106px] font-harmond condensed font-semibold text-center lg:leading-none">
              {heading}
            </h1>
          </div>
        </div>

        <div className="hidden md:block sg-grid-item justify-items-center content-center opacity-0 invisible bg-gray-980 border-y  border-[1.5px] border-gray-900 relative z-10">
          <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 h-1/2 w-[calc(var(--sg-frame-size)-0.2px)] bg-gray-800 frame-element-right overflow-x-clip frame-stroke"></div>
          <div className="absolute left-1p top-1/2 -translate-x-full -translate-y-1/2 h-1/2 w-[var(--sg-frame-size)] bg-gray-980 frame-element-right overflow-x-clip"></div>
        </div>

        <div className="hidden md:block sg-grid-item opacity-0 invisible bg-gray-980"></div>

        <div
          className={cn(
            "hidden md:block sg-grid-item md:opacity-0 md:invisible bg-gray-980 border-x border-[1.5px] border-gray-900 grow-0 relative z-10"
          )}
        >
          <div className="hidden md:block absolute top-0 left-1/2 -translate-y-full -translate-x-1/2 w-2/3 h-[var(--sg-frame-stroke-size)] bg-gray-800 frame-element-bottom overflow-y-clip frame-stroke"></div>
          <div className="hidden md:block absolute top-0 left-1/2 -translate-y-full -translate-x-1/2 w-2/3 h-[var(--sg-frame-size)] bg-gray-980 frame-element-bottom overflow-y-clip"></div>

          <div className="absolute top-0 left-0 aspect-square w-[var(--sg-frame-stroke-size)] -translate-y-full bg-gray-800 frame-grid-corner-piece-bottom"></div>
          <div className="absolute top-0 left-0 aspect-square w-[var(--sg-frame-size)] -translate-y-full bg-gray-980 frame-grid-corner-piece-bottom"></div>

          <div className="absolute top-0 right-0 aspect-square w-[var(--sg-frame-stroke-size)] -translate-y-full bg-gray-800 frame-grid-corner-piece-bottom -rotate-90"></div>
          <div className="absolute top-0 right-0 aspect-square w-[var(--sg-frame-size)] -translate-y-full bg-gray-980 frame-grid-corner-piece-bottom -rotate-90"></div>
        </div>

        <div className="hidden md:block sg-grid-item opacity-0 invisible bg-gray-980"></div>
      </div>
    </div>
  );
}

export default PageHeadingWithVideo;
