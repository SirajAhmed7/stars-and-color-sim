"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef } from "react";

interface PureTextEffectProps {
  text?: string;
  backgroundColor?: string;
  strokeColor?: string;
  tl?: GSAPTimeline | null;
}

const PureTextEffect: React.FC<PureTextEffectProps> = ({
  text = "Pure",
  backgroundColor = "#2f2f2f",
  strokeColor = "#2f2f2f",
  tl,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  const colors: string[] = [
    "#fff8ec",
    "#feb944",
    "#fe6842",
    "#df5584",
    "#5a5ca8",
    "#feb944",
    "#fe6842",
    "#fff8ec",
    "#5a5ca8",
  ];

  useGSAP(() => {
    const container = containerRef.current;
    const textElements = textRefs.current;

    let startInteraction = false;

    if (!container || textElements.length === 0) return;

    // Initial setup
    gsap.set(textElements, {
      scale: (i: number) => 1 - 0.05 * i,
      zIndex: (i: number) => 5 - i,
      opacity: 0,
    });

    function transformer(target: HTMLElement, duration: number) {
      let rotate = gsap.quickTo(target, "rotation", {
          duration,
          ease: "none",
        }),
        yTo = gsap.quickTo(target, "y", {
          duration,
          ease: "none",
        });
      return (degree: number, y: number) => {
        rotate(degree);
        yTo(y);
      };
    }
    const transformElements = textElements.map((el: any, i: number) =>
      transformer(el, 0.2)
    );

    const revTextElements = textElements.toReversed();

    tl?.to(revTextElements, {
      opacity: 1,
      duration: (i: number) => (i > 0 ? 0.4 : 0.1),
      stagger: 0.05,
      onComplete: () => {
        startInteraction = true;
      },
    });

    const cursor = {
      x: 0.85,
      y: 0,
    };

    function handleMouseMove(event: MouseEvent) {
      if (!startInteraction) return;

      cursor.x = (event.clientX / window.innerWidth) * 2 - 1;
      cursor.y = (event.clientY / window.innerHeight) * 2 - 1;
    }

    function tick() {
      transformElements.forEach((transformer: any, i: number) =>
        transformer(cursor.x * Math.PI * 3.5 * i, cursor.y * i * 20)
      );

      requestAnimationFrame(tick);
    }

    container.addEventListener("mousemove", handleMouseMove);

    tick();

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, [tl]);

  return (
    <div
      ref={containerRef}
      className="relative w-screen h-screen flex items-center justify-center overflow-hidden"
    >
      {colors.map((color: string, index: number) => (
        <div
          key={index}
          ref={(el) => {
            if (el) textRefs.current[index] = el;
          }}
          className="absolute select-none font-medium leading-none uppercase -tracking-[0.4vw]"
          style={{
            color: `rgba(${index > 0 ? "160,160,171" : "255,255,255"},${
              index > 0 ? 1 - 0.3 - index * 0.09 : 1
            })`,
            fontSize: "8vw",
            // WebkitTextStroke: `0.25vw ${strokeColor}`,
            // textStroke: `0.25vw ${strokeColor}`,
            // transition: `all ${index * 0.05}s ease`,
            // transform: `translateY(${(index + 1) * 10}%)`,
            // zIndex: colors.length - index,
          }}
        >
          {index === 0 && (
            <span className="absolute top-0 left-0 w-full h-full -z-10 blur-2xl opacity-50">
              outrun ordinary.
            </span>
          )}
          {text}
        </div>
      ))}
    </div>
  );
};

export default PureTextEffect;
