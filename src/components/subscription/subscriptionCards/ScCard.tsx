"use client";

import CardShimmer from "@/components/ui/CardShimmer";
import { cn } from "@/utils/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";

function ScCard({
  price,
  heading,
  points,
  className,
  cardFrontImg,
}: {
  price: string;
  heading: string;
  points: string[];
  cardFrontImg: string;
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
        // "tra-card absolute top-0 left-1/2 -translate-x-1/2 aspect-card w-[20%]",
        "sc-card sm:absolute sm:top-0 sm:left-1/2 aspect-subscription-card w-[80%] sm:w-[25%]",
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
        className="sc-card-back absolute top-0 left-0 w-full h-full pointer-events-none"
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
        className="sc-card-front absolute top-0 left-0 w-full h-full pointer-events-none bg-gray-950"
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          // transform: "rotateY(0deg)",
        }}
      >
        <div className="absolute w-full top-[8%] z-10 text-white font-extralight text-center">
          <h4 className="text-[3.8vw] sm:text-[1.5vw] leading-none mb-[7%]">
            {heading}
          </h4>

          {/* <p className="w-full text-gray-200 text-[3.2vw] sm:text-[1.1vw] tracking-wide leading-none font-thin mb-[8%]">
            {subheading}
          </p> */}

          <h3 className="font-harmond condensed font-semibold text-[18vw] sm:text-[6.2vw] leading-none mb-[3.8%]">
            ${price}
            <span className="font-roboto-flex font-extralight text-[1.9vw] sm:text-[0.75vw]">
              /month
            </span>
          </h3>

          <div className="w-full pl-[8%] sm:pl-[10%] space-y-[4%] text-left">
            {points.map((p: string, i: number) => (
              <div
                key={p.slice(p.length - 11, p.length - 1)}
                className="flex items-center gap-[2%]"
              >
                <div className="w-[15%] shrink-0 flex items-center">
                  <div className="w-full h-1p bg-gradient-to-l from-gray-500 to bg-gray-500/0"></div>

                  <div className="relative aspect-square w-[2.7vw] sm:w-[1vw] -translate-x-[1.85vw] sm:-translate-x-[0.5vw]">
                    <Image
                      src={"/images/subscription/card-star.svg"}
                      fill
                      alt="Star"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>

                <p className="text-[2.45vw] sm:text-[0.8vw] leading-none font-extralight">
                  {p}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* <CardShimmer colors={["#E8FAFD", "#50DDF6", "#3E5BD9"]} ref={cardRef} /> */}
        {/* <CardShimmer colors={["#F3FCEA", "#A6EF67", "#7DEF1A"]} ref={cardRef} /> */}
        <CardShimmer colors={["#EAF0FC", "#93B7FF", "#528BFF"]} ref={cardRef} />

        <Image
          src={`/images/subscription/${cardFrontImg}.png`}
          alt="Card 1"
          sizes="(max-width: 768px) 80vw, 20vw"
          fill
          className="w-full h-full z-0"
        />
      </div>
    </div>
  );
}

export default ScCard;
