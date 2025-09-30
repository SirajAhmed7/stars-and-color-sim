"use client";

import StarWarp from "@/components/Canvas/StarWarp";
import TypedText from "@/components/interactions/TypedText";
import { useScrollSmoother } from "@/contexts/ScrollSmootherContext";
import { cn } from "@/utils/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SplitType from "split-type";
import DigitalClock from "../DigitalClock";
import styles from "./PreLoader.module.css";
import { useLenis } from "lenis/react";
import useLenisInstance from "@/hooks/useLenisInstance";

gsap.registerPlugin(useGSAP);

function PreLoader() {
  const pageLoaderRef = useRef<HTMLDivElement>(null);
  const zoomOutDivRef = useRef<HTMLDivElement>(null);
  const plCenterDivRef = useRef<HTMLDivElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const fullCycleRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLDivElement>(null);
  const [terminalTl, setTerminalTl] = useState<GSAPTimeline | null>(null);
  const onLoadTl = useRef<GSAPTimeline | null>(null);
  const { scroller } = useScrollSmoother();
  const [preloaderComplete, setPreloaderComplete] = useState(false);
  const pathname = usePathname();
  const [navigationCount, setNavigationCount] = useState(0);
  const lenis = useLenisInstance();
  // const navigationCount = useRef(0);
  // const lenis = useLenis();

  useGSAP(
    () => {
      // scroller?.paused(true);
      lenis?.stop();

      if (pathname !== "/" || navigationCount > 1) return;

      if (!fullCycleRef.current || !percentRef.current) return;

      const percentLetters = new SplitType(percentRef.current, {
        types: "chars",
      });

      gsap.set(percentRef.current, {
        opacity: 1,
        delay: 0.3,
      });

      gsap.fromTo(
        percentLetters.chars,
        {
          scaleY: 0,
          transformOrigin: "bottom",
        },
        {
          scaleY: 1,
          stagger: 0.017,
          duration: 0.55,
          ease: "power3.inOut",
        }
      );

      const fullCycleLetters = new SplitType(fullCycleRef.current, {
        types: "chars,words",
      });

      gsap.set(fullCycleRef.current, {
        opacity: 1,
        delay: 0.3,
      });

      gsap.fromTo(
        fullCycleLetters.chars,
        {
          scaleY: 0,
          transformOrigin: "bottom",
        },
        {
          scaleY: 1,
          stagger: 0.017,
          duration: 0.55,
          ease: "power3.inOut",
        }
      );

      const tTl = gsap.timeline({
        delay: 0.7,
      });

      setTerminalTl(tTl);

      onLoadTl.current = gsap.timeline({
        paused: true,
      });

      // onLoadTl.current.to(plCenterDivRef.current, {
      //   // translateZ: -50,
      //   scale: 0.3,
      //   yPercent: -60,
      //   duration: 0.8,
      //   ease: "power3.in",
      // });
      // onLoadTl.current.to(
      //   plCenterDivRef.current,
      //   {
      //     opacity: 0,
      //     duration: 0.2,
      //     ease: "power3.in",
      //   },
      //   "<0.6"
      // );

      const movingGradientWrapper = document.querySelector(
        ".moving-gradient-wrapper"
      );

      const tempParent = document.createElement("div");
      tempParent.style.position = "fixed";
      tempParent.style.top = "0";
      tempParent.style.left = "0";
      tempParent.style.width = "100%";
      tempParent.style.height = "100%";
      tempParent.style.zIndex = "100";
      tempParent.style.pointerEvents = "none";
      tempParent.classList.add("temp-parent");

      const frameEl1 = document.querySelector(".frame-el");

      const frameEls = document.querySelectorAll(".frame-el");

      onLoadTl.current.add(() => {
        frameEl1?.parentElement?.insertBefore(tempParent, frameEl1);

        frameEls.forEach((el) => {
          tempParent.appendChild(el);
        });
      });

      onLoadTl.current.to(".pl-plus-lines", {
        scaleY: 0,
        duration: 1,
        ease: "power3.inOut",
      });

      onLoadTl.current.to(
        ".pl-circle-star",
        {
          scale: 0,
          duration: 0.4,
          ease: "power3.inOut",
        },
        "<"
      );

      onLoadTl.current.to(
        ".pl-outer-circle",
        {
          scaleY: 0,
          duration: 1,
          ease: "power3.inOut",
        },
        "<"
      );

      onLoadTl.current.to(
        ".pl-inner-circle",
        {
          scaleX: 0,
          duration: 1,
          ease: "power3.inOut",
        },
        "<0.4"
      );

      onLoadTl.current.to(
        percentRef.current,
        {
          opacity: 0,
          duration: 0.5,
          ease: "power3.in",
        },
        "<0.2"
      );

      onLoadTl.current.to(
        zoomOutDivRef.current,
        {
          scale: 2.6,
          duration: 0.5,
          ease: "power3.in",
        },
        "<0.3"
      );

      onLoadTl.current.to(pageLoaderRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power3.in",
        onComplete: () => {
          if (!pageLoaderRef.current) return;

          pageLoaderRef.current.style.display = "none";
        },
      });

      onLoadTl.current.fromTo(
        ".hero-heading",
        {
          z: 300,
          y: "28vh",
          rotateX: "30deg",
          // z: 0,
          // y: 0,
          // rotateX: 0,
          duration: 0.8,
          ease: "power3.inOut",
        },
        {
          z: 0,
          y: 0,
          rotateX: 0,
        },
        "<0.2"
      );

      onLoadTl.current.from(
        tempParent,
        {
          scale: 1.3,
          duration: 0.6,
          ease: "power3.out",
          onComplete: () => {
            frameEls.forEach((el) => {
              movingGradientWrapper?.insertAdjacentElement("afterend", el);
            });

            const newTempParent = document.querySelector(".temp-parent");
            if (newTempParent) {
              newTempParent.remove();
            }

            // document.body.style.maxHeight = "unset";
            // document.body.classList.remove("md:!max-h-screen");
            // document.body.style.overflow = "auto";

            // // Resize lenis
            // lenis?.resize();

            // // Dispatch custom event to notify other components
            // const preloaderCompleteEvent = new CustomEvent(
            //   "preloader-complete"
            // );
            // window.dispatchEvent(preloaderCompleteEvent);

            // // Comprehensive ScrollTrigger refresh strategy
            // const refreshScrollTriggers = () => {
            //   // Initial refresh
            //   requestAnimationFrame(() => {
            //     ScrollTrigger.refresh();

            //     // Additional refreshes with increasing delays for production
            //     setTimeout(() => {
            //       ScrollTrigger.refresh();
            //     }, 200);

            //     setTimeout(() => {
            //       ScrollTrigger.refresh();
            //     }, 500);

            //     setTimeout(() => {
            //       ScrollTrigger.refresh();
            //     }, 1000);

            //     // Final comprehensive refresh
            //     setTimeout(() => {
            //       ScrollTrigger.refresh();
            //     }, 1500);
            //   });
            // };

            // // Execute refresh strategy after a delay to ensure scroller is ready
            // setTimeout(refreshScrollTriggers, 100);

            setPreloaderComplete(true);
          },
        },
        "<0.6"
      );

      onLoadTl.current.to(movingGradientWrapper, {
        opacity: 1,
        duration: 1,
        onComplete: () => {
          setTimeout(() => {
            ScrollTrigger.refresh(true);
          }, 350);

          // Unpause scroller first
          // scroller?.paused(false);
          lenis?.start();
        },
      });

      onLoadTl.current.from(
        ".gradient-blur",
        {
          yPercent: 100,
          duration: 0.5,
          ease: "power3.inOut",
        },
        "<"
      );
    },
    {
      dependencies: [lenis, pathname, navigationCount],
      revertOnUpdate: true,
    }
  );

  useEffect(() => {
    // if (pathname !== "/" || navigationCount.current > 0) return;

    let percentGrowInterval: NodeJS.Timeout;

    const growTime = 12;

    if (pathname === "/" && navigationCount === 0) {
      const percentDiv = percentRef.current;

      if (!percentDiv) return;

      let grow = 0;

      setTimeout(() => {
        percentGrowInterval = setInterval(function () {
          if (grow < 100) {
            percentDiv.innerHTML = String(grow).padStart(2, "0");
            grow++;
          } else {
            percentDiv.innerHTML = String(grow);
            clearInterval(percentGrowInterval);

            setTimeout(() => {
              onLoadTl.current?.play();
            }, 1000);
          }
        }, growTime);
      }, 650);
    } else {
      // console.log("On load tl", onLoadTl.current?.endTime());

      const heightFullTimeout =
        pathname === "/" ? 650 + 100 / 12 + 1000 + 3900 : 0;

      // setTimeout(() => {
      //   document.body.style.maxHeight = "unset";
      //   document.body.classList.remove("md:!max-h-screen");
      //   document.body.style.overflow = "auto";
      //   scroller?.paused(false);
      // }, 300);

      if (pathname === "/" && navigationCount > 1) {
        setTimeout(() => {
          ScrollTrigger.refresh(true);
        }, 4800);
        // scroller?.paused(false);
        lenis?.start();
      }

      // // Enhanced refresh for non-homepage routes
      // const refreshScrollTriggers = () => {
      //   // Multiple refresh attempts for production reliability
      //   requestAnimationFrame(() => {
      //     ScrollTrigger.refresh();

      //     // Staggered refreshes for different loading scenarios
      //     setTimeout(() => {
      //       ScrollTrigger.refresh();
      //     }, 200);

      //     setTimeout(() => {
      //       ScrollTrigger.refresh();
      //     }, 500);

      //     setTimeout(() => {
      //       ScrollTrigger.refresh();
      //     }, 1000);

      //     // Extended delay for production asset loading
      //     setTimeout(() => {
      //       ScrollTrigger.refresh();
      //     }, 2000);
      //   });
      // };

      // // Execute refresh with longer delay for non-homepage routes
      // setTimeout(refreshScrollTriggers, 300);

      if (pathname !== "/") {
        const movingGradientWrapper: HTMLDivElement | null =
          document.querySelector(".moving-gradient-wrapper");

        if (!movingGradientWrapper) return;

        movingGradientWrapper.style.opacity = "1";

        onLoadTl.current?.kill();
        onLoadTl.current = null;
        // scroller?.paused(false);
        lenis?.start();
      }

      // setPreloaderComplete(true);
    }

    // navigationCount.current += 1;

    return () => {
      clearInterval(percentGrowInterval);
    };
  }, [lenis, navigationCount, pathname, scroller]);

  useEffect(() => {
    setNavigationCount((prev) => prev + 1);
    // navigationCount.current += 1;
  }, [pathname]);

  // if (pathname !== "/" || navigationCount > 1) return null;
  if (pathname !== "/" || navigationCount > 1) return null;

  return (
    <div
      ref={pageLoaderRef}
      className="fixed top-0 left-0 w-full max-w-[100vw] h-screen bg-background flex justify-center items-center z-[150]"
      // style={{
      //   transformStyle: "preserve-3d",
      //   perspective: "200px",
      // }}
    >
      <div
        // ref={canvasWrapperRef}
        className="absolute top-0 left-0 w-full h-full"
      >
        <StarWarp preloaderComplete={preloaderComplete} />
      </div>

      {/* <div className="absolute top-0 left-0 w-full h-full bg-background/5 backdrop-blur-sm"></div> */}

      <div ref={zoomOutDivRef} className="absolute inset-0">
        <div className="absolute top-0 w-full pt-10 sm:pt-8 px-9 sm:px-8 flex gap-8 max-sm:justify-between items-start">
          <p className="font-extralight text-xs sm:text-sm uppercase">Earth</p>
          <p className="font-extralight text-xs sm:text-sm uppercase">
            28° 30′ 0.0619″N
          </p>
          <p className="font-extralight text-xs sm:text-sm uppercase">
            77° 05′ 0.5052″E
          </p>

          <div className="hidden lg:block ml-auto">
            <DigitalClock />
          </div>
        </div>

        <div
          className={cn(
            styles.terminal,
            "absolute top-20 max-sm:inset-x-9 sm:left-8 sm:w-1/2 sm:max-w-sm h-36 sm:h-40 bg-gray-800/45 backdrop-blur-sm p-4 text-sm space-y-3 font-extralight tracking-wide"
          )}
        >
          <p>
            <TypedText
              text={`$ accessing_Gibson_mainframe`}
              timeline={terminalTl}
              cursorClassName="w-1"
              duration={0.6}
              speed={2.5}
            />
          </p>
          <p>
            <TypedText
              text={`$ launching_daVinci_virus`}
              timeline={terminalTl}
              cursorClassName="w-1"
              duration={0.6}
              speed={2.5}
            />
          </p>
          <p>
            <TypedText
              text={`$ decoding_rotating_ciphers`}
              timeline={terminalTl}
              cursorClassName="w-1"
              duration={0.6}
              speed={2.5}
            />
          </p>
        </div>

        <div
          ref={fullCycleRef}
          className="absolute bottom-16 left-1/2 sm:left-16 -translate-x-1/2 sm:translate-x-0 text-4xl sm:text-5xl max-w-60 font-harmond condensed font-semibold uppercase text-center sm:text-left opacity-0"
        >
          Full cycle product design lab
        </div>

        <div className="hidden md:block absolute bottom-44 right-16 text-2xl font-extralight uppercase text-right">
          <p>
            <TypedText
              text={`Crafting`}
              timeline={terminalTl}
              duration={0.4}
              rtl
            />
          </p>
          <p>
            <TypedText
              text={`Immersive`}
              timeline={terminalTl}
              duration={0.5}
              rtl
            />
          </p>
          <p>
            <TypedText
              text={`Digital`}
              timeline={terminalTl}
              duration={0.4}
              rtl
            />
          </p>
          <p>
            <TypedText text={`Experiences`} timeline={terminalTl} rtl />
          </p>
        </div>
      </div>

      <div
        ref={plCenterDivRef}
        className="relative aspect-square w-[60%] sm:w-[35%] md:w-1/4 flex justify-center items-center"
      >
        <div
          className={cn(
            styles.plusLines,
            // "aspect-square w-[83%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            "aspect-square w-[94%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          )}
        >
          <Image
            src={"/images/preloader-center-plus-lines.svg"}
            alt="Preloader"
            fill
            className="pl-plus-lines object-contain"
          />
        </div>

        <div
          className={cn(
            styles.strokeCircle,
            "absolute top-1/2 left-1/2 aspect-square w-[59%]"
          )}
        >
          <Image
            src={"/images/preloader-center-inner-circle.svg"}
            // src={"/images/preloader-center-sm-star.svg"}
            alt="Preloader"
            fill
            className="pl-inner-circle object-contain"
          />
        </div>
        <div
          className={cn(
            styles.centerCircle,
            "absolute top-1/2 left-1/2 w-full h-full"
          )}
        >
          <Image
            src={"/images/preloader-center-outer-circle.svg"}
            // src={"/images/preloader-center-sm-star.svg"}
            alt="Preloader"
            fill
            className="pl-outer-circle object-contain"
          />
        </div>
        <div
          className={cn(
            styles.centerCircle,
            "absolute top-1/2 left-1/2 w-full h-full"
          )}
        >
          <Image
            src={"/images/preloader-center-circle-star.svg"}
            // src={"/images/preloader-center-sm-star.svg"}
            alt="Preloader"
            fill
            className="pl-circle-star object-contain"
          />
        </div>
        {/* <div
          className={cn(
            styles.centerCircle,
            "absolute top-1/2 left-1/2 w-full h-full"
          )}
        >
          <Image
            src={"/images/preloader-center.svg"}
            // src={"/images/preloader-center-sm-star.svg"}
            alt="Preloader"
            fill
            className="object-contain"
          />
        </div> */}

        {/* <div
          className={cn(styles.gyro, "absolute top-1/2 left-1/2 w-full h-full")}
        >
          <GyroscopeRings ringColor="#51525c" />
        </div> */}

        <div
          ref={percentRef}
          className="aspect-square w-[35%] flex items-center justify-center z-10 font-harmond text-[10vw] md:text-[5vw] leading-none condensed font-semibold tracking-wider translate-y-2 opacity-0 tabular-nums text-white"
        >
          00
        </div>
      </div>
    </div>
  );
}

export default PreLoader;
