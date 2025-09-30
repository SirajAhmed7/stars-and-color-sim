"use client";

import { horizontalLoop } from "@/utils/interactionUtils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import PgRow from "./PgRow";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function PortfolioGallery() {
  const RelMouseX = useRef({ x: 0 });
  const galleryWrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // const loopTl: GSAPTimeline[] = [];
    // let enableInteraction = false;

    const galleryWrapper = galleryWrapperRef.current;

    if (!galleryWrapper) return;

    new Array(8).fill(1).forEach((_, i) => {
      horizontalLoop(`.pg-row-${i}`, {
        speed: gsap.utils.clamp(
          1,
          1.8,
          Number((Math.random() * 1.8).toFixed(2))
        ),
        reversed: i % 2 === 0,
        repeat: -1,
      });
    });

    const setGalleryX = gsap.quickTo(galleryWrapperRef.current, "xPercent", {
      duration: 4,
      ease: "power3.out",
    });

    const handleMouseMove = (e: MouseEvent) => {
      // if (!enableInteraction) return;

      const x = -((e.clientX / window.innerWidth) * 2 - 1);

      setGalleryX(x * 15 - 25);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  });

  return (
    <section className="portfolio-gallery w-full h-full relative overflow-hidden my-3">
      <div
        ref={galleryWrapperRef}
        className="w-[600vw] md:w-[400vw] space-y-3 translate-x-1/4"
      >
        {new Array(8).fill(1).map((_, i) => (
          <div key={"pg-row-" + i} className="flex">
            {new Array(2).fill(1).map((_, j) => (
              <div
                className={`pg-row ${"pg-row-" + i} flex gap-3 shrink-0 pr-3`}
                key={"pg-row-" + i + "-" + j}
              >
                {new Array(4).fill(1).map((_, k) => (
                  <PgRow
                    key={"pg-tile-1-" + i + "-" + k}
                    colNum={i * 4 + k + 1}
                  />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export default PortfolioGallery;
