"use client";

import { cn } from "@/utils/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import TextPlugin from "gsap/TextPlugin";
import { usePathname } from "next/navigation";
import { useRef } from "react";

gsap.registerPlugin(TextPlugin);

function TypedText({
  text,
  className,
  speed,
  rtl,
  rightAligned,
  timeline,
  tlPosition = ">",
  duration = 1,
  cursorClassName,
}: {
  text: string;
  className?: string;
  speed?: number;
  rtl?: boolean;
  rightAligned?: boolean;
  timeline?: GSAPTimeline | null;
  tlPosition?: number | string;
  duration?: number;
  cursorClassName?: string;
}) {
  const textRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const cursorTl = gsap.timeline({ repeat: -1, paused: true });
      cursorTl
        .to(cursorRef.current, {
          opacity: 1,
          duration: 0.5,
          ease: "none",
          delay: 0.2,
        })
        .to(cursorRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: "none",
          delay: 0.2,
        });

      const killCursor = () => {
        gsap.to(cursorRef.current, {
          opacity: 0,
          duration: 0,
          ease: "none",
          onComplete: () => {
            cursorTl.kill();
          },
        });
      };

      if (timeline) {
        timeline.to(
          textRef.current,
          {
            text: {
              value: text,
              speed: speed || 1,
              // rtl,
            },
            duration,
            onStart: () => {
              cursorTl.resume();
            },
            onComplete: killCursor,
          },
          // "<0.25"
          tlPosition
        );
      } else {
        gsap.to(textRef.current, {
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 95%",
          },
          text: {
            value: text,
            speed: speed || 1,
            rtl,
          },
          duration,
          onStart: () => {
            cursorTl.resume();
          },
          onComplete: killCursor,
        });
      }
    },
    {
      dependencies: [timeline, pathname],
      revertOnUpdate: true,
    }
  );

  // return (
  //   <>
  //     {/* {rtl && (
  //       <span
  //         ref={cursorRef}
  //         className="inline-block select-none pointer-events-none h-[40%] w-1p bg-gray-400 text-transparent opacity-0"
  //       >
  //         {text[0]}
  //       </span>
  //     )} */}
  //     {rtl ? (
  //       <span className="justify-self-end inline-block relative">
  //         <span className="opacity-0 select-none pointer-events-none">
  //           {text}
  //         </span>
  //         <span
  //           className={cn("absolute top-0 left-0 h-full text-left text-nowrap")}
  //         >
  //           <span ref={textRef} className={cn(className)}></span>
  //           <span
  //             ref={cursorRef}
  //             className={cn(
  //               "inline-block select-none pointer-events-none h-max w-1p bg-gray-400 text-transparent opacity-0",
  //               cursorClassName
  //             )}
  //           >
  //             {text[0]}
  //           </span>
  //         </span>
  //       </span>
  //     ) : (
  //       <>
  //         <span ref={textRef} className={cn(className)}></span>
  //         <span
  //           ref={cursorRef}
  //           className={cn(
  //             "inline-block select-none pointer-events-none h-max w-1p bg-gray-400 text-transparent opacity-0",
  //             cursorClassName
  //           )}
  //         >
  //           {text[0]}
  //         </span>
  //       </>
  //     )}
  //     {/* {!rtl && ( */}

  //     {/* )} */}
  //   </>
  // );

  return (
    <>
      <span ref={textRef} className={cn(className)}></span>
      <span
        ref={cursorRef}
        className={cn(
          "inline-block select-none pointer-events-none h-max w-1p bg-gray-400 text-transparent opacity-0",
          cursorClassName
        )}
      >
        {text[0]}
      </span>
    </>
  );
}

export default TypedText;
