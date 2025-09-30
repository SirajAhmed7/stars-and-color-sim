"use client";
import { cn } from "@/utils/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(Observer);

function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseCircleRef = useRef<HTMLDivElement>(null);
  const interacting = useRef(false);
  const [isTouch, setIsTouch] = useState(0);

  useGSAP(() => {
    const touch = Observer.isTouch ? Observer.isTouch : 0;

    setIsTouch(touch);
  });

  useEffect(() => {
    if (Observer.isTouch) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let points: { x: number; y: number }[] = [];
    let segments = 15;
    let mouse = {
      x: 0,
      y: 0,
    };

    const move = (event: MouseEvent) => {
      if (!event.target) return (interacting.current = false);

      const interactable =
        (event.target as HTMLElement).closest(".interactable") ||
        (event.target as HTMLElement).closest("a") ||
        (event.target as HTMLElement).closest("button");

      interacting.current = !!interactable;

      const x = event.clientX;
      const y = event.clientY;
      mouse.x = x;
      mouse.y = y;

      if (points.length === 0) {
        for (let i = 0; i < segments; i++) {
          points.push({
            x: x,
            y: y,
          });
        }
      }
    };

    const anim = () => {
      const mouseCircle = mouseCircleRef.current;
      if (!mouseCircle) return;

      const mcOffset = mouseCircle.offsetWidth / 2;

      mouseCircle.style.transform = `translate(${mouse.x - mcOffset}px, ${
        mouse.y - mcOffset
      }px)`;
      mouseCircle.style.opacity = interacting.current ? "1" : "0";

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let px = mouse.x;
      let py = mouse.y;

      points.forEach((p, index) => {
        p.x = px;
        p.y = py;
        let n = points[index + 1];
        if (n) {
          px = px - (p.x - n.x) * 0.13;
          py = py - (p.y - n.y) * 0.13;
        }
      });

      // Draw trail with tapering width
      for (let i = 0; i < points.length - 1; i++) {
        const current = points[i];
        const next = points[i + 1];

        // Calculate width (tapering from max to 0)
        // const maxWidth = 8;
        const maxWidth = 6;
        const width = maxWidth * (1 - i / (points.length - 1));

        // Calculate opacity (also fading)
        // const opacity = 1 - (i / points.length) * 0.7;
        const opacity = interacting.current ? 0 : 1 - (i / points.length) * 0.7;

        ctx.beginPath();
        ctx.moveTo(current.x, current.y);
        ctx.lineTo(next.x, next.y);
        ctx.strokeStyle = `rgba(244, 244, 245, ${opacity})`;
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
      }

      requestAnimationFrame(anim);
    };

    const resize = () => {
      const ww = window.innerWidth;
      const wh = window.innerHeight;
      canvas.width = ww;
      canvas.height = wh;
      canvas.style.width = ww + "px";
      canvas.style.height = wh + "px";
    };

    document.addEventListener("mousemove", move);
    window.addEventListener("resize", resize);
    anim();
    resize();

    return () => {
      document.removeEventListener("mousemove", move);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <div
        ref={mouseCircleRef}
        className={cn(
          "mouse-circle fixed top-0 left-0 pointer-events-none z-[99] aspect-square w-5 rounded-full shadow-gray-100 shadow-[inset_0_0px_4px_2px_var(--tw-shadow-color)] transition-opacity duration-300 ease-out opacity-0",
          isTouch ? "hidden" : ""
        )}
      ></div>
      <canvas
        ref={canvasRef}
        className={cn(
          "mouse-trail fixed top-0 left-0 pointer-events-none z-[99]",
          isTouch ? "hidden" : ""
        )}
      />
    </>
  );
}

export default MouseTrail;
