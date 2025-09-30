"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

function KoacPointsAnimation() {
  const pointsRef = useRef<HTMLDivElement[]>([]);

  useGSAP(() => {
    const timeout = setTimeout(() => {
      // const points = gsap.utils.toArray<HTMLDivElement[]>();
      // const points = Array.from(pointsRef.current);

      const tl = gsap.timeline({
        repeat: -1,
      });

      pointsRef.current.forEach((point, i) => {
        tl.to(point, {
          width: 12,
          backgroundColor: "#70707B00",
          duration: 0.8,
          ease: "power3.inOut",
        });

        tl.to(
          pointsRef.current[i < pointsRef.current.length - 1 ? i + 1 : 0],
          {
            width: 36,
            backgroundColor: "#70707B",
            duration: 0.8,
            ease: "power3.inOut",
          },
          "<"
        );
      });
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  });

  return (
    <div className="koac-points-animation w-1/2 relative mb-4 flex justify-start items-center gap-1">
      {new Array(4).fill(1).map((_, i) => (
        <div
          key={`koac-points-animation-${i}`}
          ref={(crr) => {
            if (crr) pointsRef.current?.push(crr);
          }}
          className={`koac-point ${
            i > 0 ? "w-3 bg-gray-500/0" : "w-9 bg-gray-500"
          } h-3 border border-gray-500 rounded-full`}
        ></div>
      ))}
    </div>
  );
}

export default KoacPointsAnimation;
