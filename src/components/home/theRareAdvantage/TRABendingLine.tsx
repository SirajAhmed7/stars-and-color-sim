"use client";

import { cn } from "@/utils/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

function TRABendingLine({
  lineClassName,
  initTl,
}: {
  lineClassName?: string;
  initTl?: GSAPTimeline | null;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const starRef = useRef<SVGSVGElement | null>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    const pathWidth = pathRef.current?.getBoundingClientRect().width;

    mm.add("(min-width: 640px)", () => {
      const el = ref.current;

      if (initTl) {
        initTl.to(el, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          ease: "power3.out",
          delay: 0.7,
          duration: 0.8,
        });
      }

      const cursor = {
        x: el?.offsetWidth! / 2,
        y: el?.offsetHeight! / 2,
      };

      function handleMouseMove(e: MouseEvent) {
        cursor.x = e.offsetX;
        cursor.y = e.offsetY;
      }
      function handleMouseLeave() {
        gsap.to(cursor, {
          x: el?.offsetWidth! / 2,
          y: el?.offsetHeight! / 2,
          ease: "elastic.out(1,0.3)",
        });
      }

      el?.addEventListener("mousemove", handleMouseMove);
      el?.addEventListener("mouseleave", handleMouseLeave);

      function tick() {
        if (!el) return;

        const x = cursor.x / el.offsetWidth;
        const y = -(cursor.y / el.offsetHeight - 0.5);

        if (starRef.current) {
          // starRef.current.style.transform = `translate(8px, ${
          //   -0 - y * 138
          // }px) rotate(${y * 90}deg)`;
          if (!pathWidth) return;

          starRef.current.style.transform = `translate(${
            pathWidth * 0.025
          }px, ${-0 - y * pathWidth * 0.46}px) rotate(${y * 90}deg)`;
        }

        pathRef.current?.setAttribute(
          "d",
          `M0,${200 - y * 200} Q80,${200 - y * 40} 400,200`
        );

        requestAnimationFrame(tick);
      }

      if (window.innerWidth > 640) {
        tick();
      }
    });
  }, [initTl]);

  return (
    <div
      ref={ref}
      // className="w-full hidden sm:flex justify-end items-center -mt-36 relative z-10"
      className="w-full hidden sm:flex justify-end items-center relative z-10"
      style={{
        marginTop: pathRef.current?.getBoundingClientRect()
          ? -pathRef.current?.getBoundingClientRect().width / 2 + 8 + "px"
          : "-36px",
        clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
      }}
    >
      <svg
        ref={starRef}
        width="24"
        height="24"
        viewBox="0 0 84 84"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        // className="aspect-square w-5 translate-x-1 origin-right pointer-events-none"
        className="aspect-square w-5 origin-right pointer-events-none"
      >
        <path
          d="M42.0009 0C40.907 40.0021 40.0217 40.8889 0.00012207 41.9801C40.0213 43.0728 40.9067 43.9582 42.0009 83.9603C43.0936 43.9582 43.9801 43.0728 84.0001 41.9801C43.9801 40.8889 43.0932 40.0021 42.0009 0Z"
          fill="white"
        />
      </svg>

      <div className={cn("w-full max-h-full", lineClassName)}>
        <svg
          viewBox="0 0 400 400"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full stroke-gray-400 fill-none"
        >
          <path ref={pathRef} d="M0,200 Q80,200 400,200" strokeWidth={1} />
        </svg>
      </div>
    </div>
  );
}

export default TRABendingLine;
