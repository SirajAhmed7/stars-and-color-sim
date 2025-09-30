"use client";

import { useScrollSmoother } from "@/contexts/ScrollSmootherContext";
import useLenisInstance from "@/hooks/useLenisInstance";
import { cn } from "@/utils/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollToPlugin);

function KoacVideo({
  headingRef,
  video,
  videoClassName,
  nextSectionClassName,
  instantSnap = false,
}: {
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  video: string;
  videoClassName?: string;
  nextSectionClassName?: string;
  instantSnap?: boolean;
}) {
  // const { scroller } = useScrollSmoother();
  const videoGridRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mountTopRef = useRef<HTMLDivElement>(null);
  const mountLeftRef = useRef<HTMLDivElement>(null);
  const [videoClipPath, setVideoClipPath] = useState(
    "polygon(0 0, 100% 0, 100% 100%, 0% 100%)"
  );
  const pathname = usePathname();
  const lenis = useLenisInstance();

  useEffect(() => {
    if (!containerRef.current || !mountTopRef.current || !mountLeftRef.current)
      return;

    const y4Percent = (2 / containerRef.current?.offsetHeight) * 100;
    const x4Percent = (2 / containerRef.current?.offsetWidth) * 100;

    const yWidthPercent =
      ((mountTopRef.current?.offsetWidth + 2) /
        containerRef.current?.offsetWidth) *
      100;

    const yHeightPercent =
      ((mountTopRef.current?.offsetHeight + 2) /
        containerRef.current?.offsetHeight) *
      100;

    const xWidthPercent =
      ((mountLeftRef.current?.offsetWidth + 2) /
        containerRef.current?.offsetWidth) *
      100;

    const xHeightPercent =
      ((mountLeftRef.current?.offsetHeight + 2) /
        containerRef.current?.offsetHeight) *
      100;

    // const yMountSlant = (containerRef.current.offsetWidth+2) * 0.0023;
    // const xMountSlant = (containerRef.current.offsetWidth+2) * 0.0052;
    const yMountSlant =
      ((mountTopRef.current.offsetHeight + 2) /
        containerRef.current?.offsetWidth) *
      100;
    const xMountSlant =
      ((mountLeftRef.current.offsetWidth + 2) /
        containerRef.current?.offsetHeight) *
      100;

    const yLeft = (100 - yWidthPercent) / 2;
    const yRight = yLeft + yWidthPercent;

    const xTop = (100 - xHeightPercent) / 2;
    const xBottom = xTop + xHeightPercent;

    const topPath = `${yMountSlant}% ${y4Percent}%, ${
      yLeft - yMountSlant
    }% 0, ${yLeft}% ${yHeightPercent}%, ${yRight}% ${yHeightPercent}%, ${
      yRight + yMountSlant
    }% 0, ${100 - yMountSlant}% ${y4Percent}%`;

    const rightPath = `${100 - x4Percent}% ${xMountSlant}%, 100% ${
      xTop - xMountSlant
    }%, ${100 - xWidthPercent}% ${xTop}%, ${
      100 - xWidthPercent
    }% ${xBottom}%, 100% ${xBottom + xMountSlant}%, ${100 - x4Percent}% ${
      100 - xMountSlant
    }%`;

    const bottomPath = `${100 - yMountSlant}% ${100 - y4Percent}%, ${
      yRight + yMountSlant
    }% 100%, ${yRight}% ${100 - yHeightPercent}%, ${yLeft}% ${
      100 - yHeightPercent
    }%, ${yLeft - yMountSlant}% 100%, ${yMountSlant}% ${100 - y4Percent}%`;

    const leftPath = `${x4Percent}% ${100 - xMountSlant}%, 0 ${
      xBottom + xMountSlant
    }%, ${xWidthPercent}% ${xBottom}%, ${xWidthPercent}% ${xTop}%, 0 ${
      xTop - xMountSlant
    }%, ${x4Percent}% ${xMountSlant}%`;

    const clipPath = `polygon(${topPath}, ${rightPath}, ${bottomPath}, ${leftPath})`;

    setVideoClipPath(clipPath);
  }, []);

  useGSAP(
    () => {
      let isScrolling = false;

      const scrollToSection = (selector: string | undefined) => {
        if (isScrolling || !selector) return;
        console.log("scroll to");
        isScrolling = true;
        // scroller?.scrollTo(selector, true);
        lenis?.scrollTo(selector);
        // prevent re-triggering for 1.2s (same as smooth duration)
        setTimeout(() => {
          isScrolling = false;
          lenis?.start();
        }, 1600);
      };

      const mm = gsap.matchMedia();

      gsap.set(".koac-heading", {
        backgroundImage:
          "linear-gradient(to right, #3F3F46 10%, #D1D1D6 50%, #3F3F46 90%)",
        backgroundSize: "200% 100%",
        backgroundPosition: "100% 0",
      });

      mm.add("(min-width: 1024px)", () => {
        gsap.set(containerRef.current, {
          scale: 0.75,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: videoGridRef.current,
            start: "top top",
            end: "+=150%",
            scrub: true,
            pin: true,
          },
        });

        tl.fromTo(
          containerRef.current,
          {
            scale: 0.75,
          },
          {
            scale: 1,
            duration: 0.5,
          }
        );

        tl.to(headingRef.current, {
          duration: 1,
          backgroundPosition: "0% 0",
          onComplete: () => {
            if (nextSectionClassName) {
              // scroller?.paused(true);
              lenis?.stop();
            }
            // obs.enable();
            if (instantSnap) {
              if (!nextSectionClassName) return;

              // scroller?.scrollTo(nextSectionClassName as string);
              // lenis?.scrollTo(nextSectionClassName as string, {
              //   duration: 0.05,
              // });
              // gsap.to(window, {
              //   // duration: 0.01,
              //   ease: "none",
              //   scrollTo: nextSectionClassName,
              // });
              const nextSectionY =
                document.querySelector<HTMLElement>(
                  nextSectionClassName
                )?.offsetTop;

              if (nextSectionY) window.scrollTo(0, nextSectionY);

              setTimeout(() => {
                lenis?.start();
              }, 800);
            } else scrollToSection(nextSectionClassName);
          },
        });
      });
    },
    {
      dependencies: [headingRef.current, videoClipPath, pathname, lenis],
      revertOnUpdate: true,
    }
  );

  return (
    // <div className="koac-video-grid w-full h-screen grid grid-cols-[1fr_2.5fr_1fr] grid-rows-[1fr_2.7fr_1fr] relative -z-10">
    <div
      ref={videoGridRef}
      className="koac-video-grid absolute top-0 left-0 w-full h-screen grid grid-cols-1 grid-rows-[1fr_3.5fr_1fr] lg:grid-cols-[1fr_2.5fr_1fr] lg:grid-rows-[1fr_2.7fr_1fr] z-0 md:-z-10 lg:translate-y-[150vh]"
    >
      {/* <div></div>
      <div></div>
      <div></div>
      <div></div> */}
      {/* Try removing all divs and use col/row start to position the video */}
      <div
        ref={containerRef}
        className="koac-video-wrapper relative overflow-hidden lg:scale-75 max-lg:col-span-2 max-lg:col-start-1 max-lg:row-start-2 row-start-2 col-start-2"
        style={{
          clipPath: videoClipPath,
        }}
      >
        <div
          ref={mountTopRef}
          className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[var(--sg-frame-size)] bg-black frame-element-top overflow-y-clip z-10 mix-blend-hard-light"
        ></div>

        <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 h-1/2 w-[var(--sg-frame-size)] bg-black frame-element-right overflow-x-clip z-10 mix-blend-hard-light"></div>

        <div className="hidden lg:block absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-[var(--sg-frame-size)] bg-black frame-element-bottom overflow-y-clip z-10 mix-blend-hard-light"></div>

        <div
          ref={mountLeftRef}
          className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 h-1/2 w-[var(--sg-frame-size)] bg-black frame-element-left overflow-x-clip z-10 mix-blend-hard-light"
        ></div>

        <div className="absolute inset-0.5 overflow-hidden">
          <video
            muted
            autoPlay
            loop
            controls={false}
            // src="/videos/home-diamond-2.mp4"
            // className="absolute top-0 left-1/2 w-[80%] h-full -translate-x-1/2 object-contain"
            // className="absolute top-0 left-0 w-full h-full object-cover scale-[160%] -translate-x-[23%] translate-y-[28%]"
            // className="absolute top-0 left-0 w-full h-full object-cover object-bottom"
            className={cn(
              "absolute inset-0 object-cover object-top",
              videoClassName
            )}
            playsInline
            // className="absolute inset-0 scale-150 object-cover object-top translate-y-[20%]"
          >
            <source src={video} type={`video/${video.split(".")[1]}`} />
            {/* <source src="/videos/home-diamond-2.mp4" type="video/mp4" /> */}
          </video>
        </div>
      </div>
      {/* <div></div>
      <div></div>
      <div></div>
      <div></div> */}
    </div>
  );
}

export default KoacVideo;
