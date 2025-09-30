"use client";

import HoverTextScramble from "@/components/interactions/HoverTextScramble";
import { cn } from "@/utils/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import FrameNavPanel from "./FrameNavPanel";
import { useMobileDetection } from "@/hooks/useMobileDetection";

function FrameMenu({ bgColor }: { bgColor: string }) {
  const [isActive, setIsActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  // const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const btnAnimationTl = useRef<GSAPTimeline | null>(null);
  const { isLoaded, isMobile } = useMobileDetection();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      let tl: GSAPTimeline;

      mm.add(
        {
          lg: "(min-width: 1024px)",
          rest: "(max-width: 1023px) and (min-width: 768px)",
        },
        (context: gsap.Context) => {
          if (!isLoaded) return;

          const frameBorderRight = gsap.utils.toArray(".frame-border-right");
          const frameCornerRight = gsap.utils.toArray(".frame-corner-right");

          let xPos: number;

          if (context.conditions?.["lg"]) {
            xPos = 30;
          }
          //  else if (context.conditions?.lg) {
          //   xPos = 50;
          // }
          else {
            xPos = 100;
          }

          tl = gsap.timeline({ paused: true });
          tl.to(".frame-nav", {
            yPercent: -100,
            ease: "power4.inOut",
            duration: 1,
          });
          tl.to(
            ".frame-cta",
            {
              yPercent: 100,
              ease: "power4.inOut",
              duration: 1,
            },
            "<"
          );
          tl.to(
            [containerRef.current, ".frame-stroke-right", ...frameBorderRight],
            {
              x:
                // (-document.documentElement.getBoundingClientRect().width * xPos) /
                (-document.documentElement.getBoundingClientRect().width *
                  xPos) /
                100,
              // xPercent: -40,
              // ease: "expo.inOut",
              ease: "power4.inOut",
              // delay: 0.2,
              duration: 1,
            },
            "<"
          );
          tl.to(
            frameCornerRight,
            {
              x:
                (-document.documentElement.getBoundingClientRect().width *
                  xPos) /
                  100 +
                (document.documentElement.getBoundingClientRect().width * 0.6) /
                  100,
              // xPercent: -40,
              // ease: "expo.inOut",
              ease: "power4.inOut",
              duration: 1,
            },
            "<"
          );

          btnAnimationTl.current = tl;
        }
      );

      return () => {
        tl?.kill();
        btnAnimationTl.current = null;
        mm.kill();
      };
    },
    {
      dependencies: [isLoaded],
      revertOnUpdate: true,
    }
  );

  useEffect(() => {
    if (isActive) {
      // gsap.delayedCall(0.097, () => {
      //   btnAnimationTl.current?.play();
      // });
      btnAnimationTl.current?.play();
    } else {
      // gsap.delayedCall(0.43, () => {
      //   btnAnimationTl.current?.reverse();
      // });
      btnAnimationTl.current?.reverse();
    }
  }, [isActive]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  if (isMobile || !isLoaded)
    return (
      <>
        <div
          className={cn(
            "frame-el fixed right-0 top-1/2 -translate-y-1/2 w-[var(--frame-element-stroke-size)] h-[calc(30%+2px)] frame-element-right z-40 bg-gray-800 frame-stroke"
          )}
        ></div>
        <div
          className={cn(
            "frame-el fixed right-0 top-1/2 -translate-y-1/2 w-[var(--frame-element-size)] h-[30%] frame-element-right z-50",
            bgColor
          )}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-[90%] bg-gray-700">
            <div className="absolute top-0 -translate-y-full left-1/2 -translate-x-1/2 aspect-square w-[3px] bg-gray-700 rotate-45"></div>
            <div className="absolute bottom-0 translate-y-full left-1/2 -translate-x-1/2 aspect-square w-[3px] bg-gray-700 rotate-45"></div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-[90%] bg-gray-100 z-10 origin-top scale-y-0"></div>
        </div>
      </>
    );

  return (
    <>
      <div
        className={cn(
          "frame-el frame-stroke-right fixed right-0 top-1/2 -translate-y-1/2 w-[var(--frame-element-stroke-size)] h-1/4 frame-element-right z-40 flex flex-col items-center justify-center gap-7 bg-gray-800 frame-stroke"
        )}
      ></div>
      <div
        ref={containerRef}
        className="frame-el fixed h-svh w-[var(--frame-size)] right-0 top-0 z-[51]"
      >
        <button
          // className={cn(
          //   "fixed right-0 top-1/2 -translate-y-1/2 w-[var(--frame-element-size)] h-1/5 frame-element-right z-50 flex flex-col items-center justify-center gap-3 text-gray-400",
          //   bgColor
          // )}
          className={cn(
            "interactable absolute right-0 top-1/2 -translate-y-1/2 w-[var(--frame-element-size)] h-1/4 frame-element-right z-50 flex flex-col items-center justify-center gap-7 text-gray-400",
            bgColor
          )}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => setIsActive((prev) => !prev)}
        >
          <div
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 -z-20 w-1/3 h-[130%]",
              bgColor
            )}
          ></div>
          {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] min-h-[90%] bg-gray-700 -z-10">
          <div className="absolute top-0 -translate-y-full left-1/2 -translate-x-1/2 aspect-square w-[3px] bg-gray-700 rotate-45"></div>
          <div className="absolute bottom-0 translate-y-full left-1/2 -translate-x-1/2 aspect-square w-[3px] bg-gray-700 rotate-45"></div>
        </div> */}
          <div className="relative basis-full w-full overflow-hidden z-10">
            {/* <Image
            src={"/images/frame-menu-pattern.svg"}
            alt="Menu pattern"
            fill
            className="absolute top-0 left-0 w-full h-full object-contain"
          /> */}

            {/* <div className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-0.5 rotate-45 bg-gray-400"></div> */}

            <div className="absolute bottom-[80%] left-1/2 -translate-x-1/2 h-1p w-[13%] bg-gray-400"></div>
            <div className="absolute bottom-[60%] left-1/2 -translate-x-1/2 h-1p w-[24%] bg-gray-400"></div>
            <div className="absolute bottom-[40%] left-1/2 -translate-x-1/2 h-1p w-[35%] bg-gray-400"></div>
            <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 h-1p w-[48%] bg-gray-400"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1p w-[60%] bg-gray-400"></div>
          </div>
          <div
            className={cn(
              "uppercase text-xs sm:text-sm font-medium rotate-90 px-3",
              bgColor
            )}
          >
            <HoverTextScramble externalHover={isHovered}>
              menu
            </HoverTextScramble>
          </div>
          <div className="relative basis-full w-full overflow-hidden z-10 rotate-180">
            {/* <Image
            src={"/images/frame-menu-pattern.svg"}
            alt="Menu pattern"
            fill
            className="absolute top-0 left-0 w-full h-full object-contain"
          /> */}

            <div className="absolute bottom-[80%] left-1/2 -translate-x-1/2 h-1p w-[13%] bg-gray-400"></div>
            <div className="absolute bottom-[60%] left-1/2 -translate-x-1/2 h-1p w-[24%] bg-gray-400"></div>
            <div className="absolute bottom-[40%] left-1/2 -translate-x-1/2 h-1p w-[35%] bg-gray-400"></div>
            <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 h-1p w-[48%] bg-gray-400"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1p w-[60%] bg-gray-400"></div>
          </div>
        </button>

        {/* <NavSection isActive={isActive} setIsActive={setIsActive} /> */}
        <FrameNavPanel
          bgColor={bgColor}
          isActive={isActive}
          setIsActive={setIsActive}
        />
      </div>
    </>
  );
}

export default FrameMenu;
