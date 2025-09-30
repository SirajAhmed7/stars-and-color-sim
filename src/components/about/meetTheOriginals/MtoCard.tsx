"use client";

import { cn } from "@/utils/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";

function MtoCard({
  heading,
  text,
  imgFront,
  className,
}: {
  heading: string;
  text: string;
  imgFront: string;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(max-width: 640px)", () => {
      gsap.set(cardRef.current, {
        xPercent: 0,
        translate: "0 0",
        x: 0,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 80%",
          end: "top 20%",
          scrub: true,
        },
      });

      tl.to(
        backRef.current,
        {
          // transform: "rotateY(-180deg)",
          rotationY: 180,
        },
        "<"
      );
      tl.to(
        frontRef.current,
        {
          rotationY: 360,
        },
        "<"
      );
    });
  });

  return (
    <div
      ref={cardRef}
      className={cn(
        // "mto-card absolute top-0 left-1/2 -translate-x-1/2 aspect-card w-[20%]",
        "mto-card sm:absolute sm:top-0 sm:left-1/2 aspect-mto-card w-[80%] sm:w-[25%]",
        className
      )}
      style={{
        // transformStyle: "preserve-3d",
        perspective: "150rem",
        translate: "-50% 0",
        // transform: "translateX(-50%) rotateY(70deg)",
      }}
    >
      <div
        ref={backRef}
        className="mto-card-back absolute top-0 left-0 w-full h-full pointer-events-none bg-gray-900 z-10"
        style={{
          backfaceVisibility: "hidden",
          // transform: "rotateY(0deg)",
        }}
      >
        <Image
          // src={"/images/about/card-back-about.png"}
          src={"/images/card-back.png"}
          alt="Card 1"
          sizes="(max-width: 768px) 80vw, 20vw"
          fill
          className="w-full h-full"
        />
        {/* <p className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-[5%]">
          Card back
        </p> */}
      </div>

      <div
        ref={frontRef}
        className="mto-card-front absolute top-0 left-0 w-full h-full flex items-end"
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
        }}
      >
        <div className="w-[89.2%] h-[20%] mx-auto mb-[5.2%] flex flex-col justify-center items-center gap-[0.8vw] sm:gap-[0.4vw] bg-black/5 backdrop-blur-lg relative z-30">
          <div className="text-center text-[3vw] sm:text-[1.1vw] font-extralight">
            {text}
          </div>
          <h3 className="text-center text-[8.8vw] sm:text-[3.2vw] leading-none font-harmond font-semibold condensed">
            {heading}
          </h3>
        </div>
        <Image
          src={`/images/about/${imgFront}.png`}
          alt="Card 1"
          sizes="(max-width: 768px) 80vw, 20vw"
          fill
          className="w-full h-full object-cover z-20"
        />
      </div>
    </div>
  );
}

export default MtoCard;
