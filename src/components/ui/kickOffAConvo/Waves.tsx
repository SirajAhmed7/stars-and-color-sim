"use client";

import React, { useEffect, useRef } from "react";

const Waves: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number | null>(null);
  const counterRef = useRef<number>(0);

  const colors: string[] = ["#4C4C4C", "#343434", "#A7A7A7"];
  const width: number = 400;
  const amp: number = 10;
  const freq: number = 10;
  const speed: number = 3;

  const setPoints = (): string => {
    let points: number[] = [];
    let step: number = 0;

    for (let x = 0; x <= width; x++) {
      x < width / 2 ? step++ : step--;
      const y =
        (step / 100) * amp * Math.sin(((x + counterRef.current) / 100) * freq);
      points.push(x, y);
    }

    return points.join(" ");
  };

  const animateWaves = (): void => {
    if (!svgRef.current) return;

    const lines = svgRef.current.querySelectorAll("polyline");
    const points: string = setPoints();

    lines.forEach((line) => line.setAttribute("points", points));
    counterRef.current += speed;

    animationRef.current = requestAnimationFrame(animateWaves);
  };

  useEffect(() => {
    animateWaves();

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full aspect-[2/1]">
      <svg ref={svgRef} id="wave" viewBox="0 0 400 200">
        {colors.map((color: string, index: number) => (
          <polyline
            key={index}
            stroke={color}
            style={{
              transform: `translateY(${(index + 2) * 15}%)`,
            }}
          />
        ))}
      </svg>

      <style jsx>{`
        .container svg {
          overflow: visible;
        }

        polyline {
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 6;
        }
      `}</style>
    </div>
  );
};

export default Waves;
