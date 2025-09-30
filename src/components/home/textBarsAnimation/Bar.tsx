// "use client";

import { cn } from "@/utils/utils";
// import { useRef } from "react";

function Bar({
  text,
  barYPosition,
  barXPosition = "0",
  barPosRight = false,
  barAngle,
  textAnimationClass = "bar-text",
}: {
  text: string;
  barYPosition: string;
  barXPosition?: string;
  barPosRight?: boolean;
  barAngle: string;
  textAnimationClass?: string;
}) {
  // const textContainerRef = useRef<HTMLDivElement>(null);

  const zOffset = 144 / 2;

  const mainClassName =
    "absolute w-[210vw] h-36 top-0 left-0 bg-white text-gray-950 flex justify-end items-center text-9xl leading-none font-black uppercase text-gray-950 pointer-events-none";

  const rotateBy = 0;

  return (
    <div
      className="absolute origin-center w-full h-min"
      style={{
        transformStyle: "preserve-3d",
        perspective: 500,
        top: barYPosition,
        left: barPosRight ? undefined : barXPosition,
        right: barPosRight ? "0" : undefined,
        transform: barAngle,
      }}
    >
      {/* <div
        // className="absolute origin-center w-full h-min"
        style={{
          transformStyle: "preserve-3d",
          perspective: 500,
          transform: "rotateX(-90deg)",
        }}
      > */}
      {/* TOP */}
      <div
        className={cn(mainClassName, "bg-gray-950 text-white", "bar-top")}
        style={{
          transform: `translateZ(${zOffset}px) rotateX(${90 + rotateBy}deg)`,
          // transform: `translateZ(${zOffset}px) rotateX(90deg)`,
          transformOrigin: `center center -${zOffset}px`,
        }}
      >
        <div>
          <p className={`text-nowrap ${textAnimationClass}`}>
            {text}&ensp;{text}&ensp;{text}&ensp;{text}
            {/* <span className="mr-[5vw]">{text + ` `}</span>
            <span className="mr-[5vw]">{text + ` `}</span>
            <span className="mr-[5vw]">{text + ` `}</span>
            <span>{text + ` `}</span> */}
          </p>
        </div>
      </div>

      {/* BOTTOM */}
      <div
        className={cn(mainClassName, "bg-gray-950 text-white", "bar-bottom")}
        style={{
          transform: `translateZ(-${zOffset}px) rotateX(${90 + rotateBy}deg)`,
          // transform: `translateZ(-${zOffset}px) rotateX(90deg)`,
          transformOrigin: `center center ${zOffset}px`,
        }}
      >
        <div>
          <p className={`text-nowrap -scale-y-100 ${textAnimationClass}`}>
            {/* {text + " " + text + " " + text + " " + text} */}
            {text}&ensp;{text}&ensp;{text}&ensp;{text}
          </p>
        </div>
      </div>

      {/* FRONT */}
      <div
        className={cn(mainClassName, "bar-front")}
        style={{
          transform: `translateZ(${zOffset}px) rotateX(${rotateBy}deg)`,
          // transform: `translateZ(${zOffset}px)`,
          transformOrigin: `center center -${zOffset}px`,
        }}
      >
        <div>
          <p className={`text-nowrap ${textAnimationClass}`}>
            {/* {text + " " + text + " " + text + " " + text} */}
            {text}&ensp;{text}&ensp;{text}&ensp;{text}
          </p>
        </div>
      </div>

      {/* BACK */}
      <div
        className={cn(mainClassName, "bar-back")}
        style={{
          transform: `translateZ(-${zOffset}px) rotateX(${rotateBy}deg)`,
          // transform: `translateZ(-${zOffset}px)`,
          transformOrigin: `center center ${zOffset}px`,
        }}
      >
        <div>
          <p className={`text-nowrap -scale-y-100 ${textAnimationClass}`}>
            {/* {text + " " + text + " " + text + " " + text} */}
            {text}&ensp;{text}&ensp;{text}&ensp;{text}
          </p>
        </div>
      </div>

      {/* </div> */}
    </div>
  );
}

export default Bar;
