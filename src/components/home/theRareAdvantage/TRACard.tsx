"use client";

import CardShimmer from "@/components/ui/CardShimmer";
import { cn } from "@/utils/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { Fragment, useRef } from "react";

function TRACard({
  heading,
  text,
  className,
  subheading,
  cardFrontImg,
}: {
  heading: string;
  subheading?: string;
  text: string[];
  cardFrontImg: string;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
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
        // "tra-card absolute top-0 left-1/2 -translate-x-1/2 aspect-card w-[20%]",
        "tra-card sm:absolute sm:top-0 sm:left-1/2 aspect-tra-card w-[80%] sm:w-[20%]",
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
        className="tra-card-back absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{
          backfaceVisibility: "hidden",
          // transform: "rotateY(-180deg)",
          // transform: "rotateY(0deg)",
        }}
      >
        <Image
          src={"/images/card-back.png"}
          alt="Card 1"
          sizes="(max-width: 768px) 80vw, 20vw"
          fill
          className="w-full h-full"
        />
      </div>

      <div
        ref={frontRef}
        className="tra-card-front absolute top-0 left-0 w-full h-full pointer-events-none bg-gray-950"
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          // transform: "rotateY(0deg)",
        }}
      >
        <h3 className="absolute top-[14%] left-1/2 -translate-x-1/2 w-[80%] px-[6%] text-center z-10 text-[8.8vw] sm:text-[2.3vw] leading-none font-harmond font-bold mb-[9%]">
          {heading}
        </h3>

        <div className="absolute top-[24%] left-1/2 -translate-x-1/2 w-[80%] px-[4%] text-center z-10">
          {/* <h4 className="w-full text-[2vw] leading-none font-extralight mb-[10%] text-center">
            {subheading}
          </h4> */}

          <div className="w-full text-center space-y-[5%]">
            <div className="w-full h-0.5 relative">
              <Image
                src={"/images/card-dotted-line.svg"}
                alt="Plus"
                fill
                className="object-fill w-full h-full"
              />
            </div>
            {text.map((t: string) => (
              <Fragment key={t}>
                <div className="text-[3.85vw] sm:text-[1vw] leading-none font-extralight flex items-center justify-center gap-[6%]">
                  <div className="aspect-square w-[6.5%] sm:w-[5%] relative">
                    <Image
                      src={"/images/card-plus-icon.svg"}
                      alt="Plus"
                      fill
                      className="object-contain w-full h-full"
                    />
                  </div>
                  {t}
                  <div className="aspect-square w-[6.5%] sm:w-[5%] relative">
                    <Image
                      src={"/images/card-plus-icon.svg"}
                      alt="Plus"
                      fill
                      className="object-contain w-full h-full"
                    />
                  </div>
                </div>

                <div className="w-full h-0.5 relative">
                  <Image
                    src={"/images/card-dotted-line.svg"}
                    alt="Plus"
                    fill
                    className="object-fill w-full h-full"
                  />
                </div>
              </Fragment>
            ))}
          </div>
        </div>
        <CardShimmer ref={cardRef} colors={["#FDF6FD", "#DE6723", "#6A363C"]} />
        <Image
          src={`/images/home/${cardFrontImg}.png`}
          alt="Card 1"
          sizes="(max-width: 768px) 80vw, 20vw"
          fill
          className="w-full h-full z-0"
        />
      </div>
    </div>
  );
}

export default TRACard;
