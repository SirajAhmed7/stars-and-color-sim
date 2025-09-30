"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/utils/utils";

interface ParticleAnimationProps {
  /** Number of particles to generate */
  particleCount?: number;
  /** Custom CSS class for styling */
  className?: string;
  /** Whether the animation should be active */
  isActive?: boolean;
  /** Custom particle color (CSS color value) */
  particleColor?: string;
  /** Size of the particle container relative to parent */
  containerSize?: string;
  /** Mask style for the particle area */
  maskStyle?: string;
  /** Animation transition duration */
  transitionDuration?: string;
}

const ParticleAnimation: React.FC<ParticleAnimationProps> = ({
  particleCount = 20,
  className = "",
  isActive = false,
  particleColor = "hsl(0 0% 90%)",
  containerSize = "200%",
  maskStyle = "radial-gradient(white, transparent 75%)",
  transitionDuration = "0.25s",
}) => {
  const particlesRef = useRef<SVGSVGElement[]>([]);

  useEffect(() => {
    const RANDOM = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1) + min);

    particlesRef.current.forEach((particle) => {
      if (particle) {
        particle.setAttribute(
          "style",
          `
          --x: ${RANDOM(20, 80)};
          --y: ${RANDOM(20, 80)};
          --duration: ${RANDOM(6, 20)};
          --delay: ${RANDOM(1, 10)};
          --alpha: ${RANDOM(40, 90) / 100};
          --origin-x: ${
            Math.random() > 0.5 ? RANDOM(300, 800) * -1 : RANDOM(300, 800)
          }%;
          --origin-y: ${
            Math.random() > 0.5 ? RANDOM(300, 800) * -1 : RANDOM(300, 800)
          }%;
          --size: ${RANDOM(40, 90) / 100};
        `
        );
      }
    });
  }, []);

  // Clear the particles array when component unmounts or particleCount changes
  useEffect(() => {
    particlesRef.current = [];
  }, [particleCount]);

  const particleStyle = {
    "--active": isActive ? "1" : "0",
    "--play-state": isActive ? "running" : "paused",
    "--transition": transitionDuration,
    "--container-size": containerSize,
    "--mask-style": maskStyle,
    "--particle-color": particleColor,
  } as React.CSSProperties;

  return (
    <>
      <style jsx>{`
        .particle-container {
          position: absolute;
          width: var(--container-size);
          aspect-ratio: 1;
          top: 50%;
          left: 50%;
          translate: -50% -50%;
          -webkit-mask: var(--mask-style);
          mask: var(--mask-style);
          z-index: -1;
          opacity: var(--active, 0);
          transition: opacity var(--transition);
          pointer-events: none;
        }

        .particle {
          fill: var(--particle-color);
          width: calc(var(--size, 0.25) * 1rem);
          aspect-ratio: 1;
          position: absolute;
          top: calc(var(--y) * 1%);
          left: calc(var(--x) * 1%);
          opacity: var(--alpha, 1);
          animation: particle-float-out calc(var(--duration, 1) * 1s)
            calc(var(--delay) * -1s) infinite linear;
          transform-origin: var(--origin-x, 1000%) var(--origin-y, 1000%);
          z-index: -1;
          animation-play-state: var(--play-state, paused);
        }

        .particle path {
          fill: var(--particle-color);
          stroke: none;
        }

        .particle:nth-of-type(even) {
          animation-direction: reverse;
        }

        @keyframes particle-float-out {
          to {
            rotate: 360deg;
          }
        }
      `}</style>

      <span
        aria-hidden="true"
        className={cn("particle-container", className)}
        style={particleStyle}
      >
        {new Array(particleCount).fill(1).map((_, i) => (
          <svg
            ref={(el) => {
              if (el && !particlesRef.current.includes(el)) {
                particlesRef.current.push(el);
              }
            }}
            className="particle"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            key={`particle-${i}`}
          >
            <path
              d="M6.937 3.846L7.75 1L8.563 3.846C8.77313 4.58114 9.1671 5.25062 9.70774 5.79126C10.2484 6.3319 10.9179 6.72587 11.653 6.936L14.5 7.75L11.654 8.563C10.9189 8.77313 10.2494 9.1671 9.70874 9.70774C9.1681 10.2484 8.77413 10.9179 8.564 11.653L7.75 14.5L6.937 11.654C6.72687 10.9189 6.3329 10.2494 5.79226 9.70874C5.25162 9.1681 4.58214 8.77413 3.847 8.564L1 7.75L3.846 6.937C4.58114 6.72687 5.25062 6.3329 5.79126 5.79226C6.3319 5.25162 6.72587 4.58214 6.936 3.847L6.937 3.846Z"
              fill="currentColor"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ))}
      </span>
    </>
  );
};

export default ParticleAnimation;
