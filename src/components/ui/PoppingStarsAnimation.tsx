"use client";

import { useEffect, useRef } from "react";

function PoppingStarsAnimation({
  wrapperClassName,
}: {
  wrapperClassName?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrapper: HTMLElement | null = document.querySelector(
      `.${wrapperClassName}`
    );

    const canvas = canvasRef.current;
    if (!canvas || !wrapper) return;

    canvas.width = wrapper.offsetWidth;
    canvas.height = wrapper.offsetHeight;

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    let stars: Star[] = [];
    let frameCount: number = 0;

    // Utility functions to replace p5.js functions
    function random(min: number, max?: number): number {
      if (max === undefined) {
        max = min;
        min = 0;
      }
      return Math.random() * (max - min) + min;
    }

    function cos(angle: number): number {
      return Math.cos(angle);
    }

    function sin(angle: number): number {
      return Math.sin(angle);
    }

    const TWO_PI = Math.PI * 2;

    // Star class
    class Star {
      x: number;
      y: number;
      radius: number;
      alpha: number;
      angle: number;
      speed: number;
      markForRemoval?: boolean;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.radius = random(1, 3.5);
        this.alpha = 255;
        this.angle = random(TWO_PI);
        this.speed = random(1, 3);
      }

      update(): void {
        this.x += cos(this.angle) * this.speed;
        this.y += sin(this.angle) * this.speed;
        this.alpha -= 5;
        if (this.alpha <= 0) {
          this.markForRemoval = true;
        }
      }

      display(): void {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(frameCount * 0.02);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha / 255})`;

        this.drawStar(0, 0, this.radius * 2.5, this.radius * 0.8, 4);

        ctx.restore();
      }

      drawStar(
        x: number,
        y: number,
        radius1: number,
        radius2: number,
        npoints: number
      ): void {
        const angle = TWO_PI / npoints;
        const halfAngle = angle / 2.0;

        ctx.beginPath();
        for (let a = 0; a < TWO_PI; a += angle) {
          let sx = x + cos(a) * radius2;
          let sy = y + sin(a) * radius2;
          if (a === 0) {
            ctx.moveTo(sx, sy);
          } else {
            ctx.lineTo(sx, sy);
          }
          sx = x + cos(a + halfAngle) * radius1;
          sy = y + sin(a + halfAngle) * radius1;
          ctx.lineTo(sx, sy);
        }
        ctx.closePath();
        ctx.fill();
      }
    }

    // Animation loop (replaces p5.js draw function)
    function animate(): void {
      if (!canvas) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update stars
      for (let i = 0; i < stars.length; i++) {
        stars[i].update();
      }

      // Remove stars marked for removal
      stars = stars.filter((star) => !star.markForRemoval);

      // Display remaining stars
      for (let i = 0; i < stars.length; i++) {
        stars[i].display();
      }

      frameCount++;
      requestAnimationFrame(animate);
    }

    // Mouse move event handler
    wrapper.addEventListener("mousemove", function (e: MouseEvent): void {
      // const rect = canvas.getBoundingClientRect();
      // const rect = {
      //   left: canvas.offsetLeft,
      //   top: canvas.offsetTop,
      // };
      // const mouseX = e.clientX - rect.left;
      // const mouseY = e.clientY - rect.top;
      const mouseX = e.offsetX;
      const mouseY = e.offsetY;

      if (
        mouseX >= 0 &&
        mouseY >= 0 &&
        mouseX <= canvas.width &&
        mouseY <= canvas.height
      ) {
        for (let i = 0; i < 3; i++) {
          const star = new Star(mouseX, mouseY);
          stars.push(star);
        }
      }
    });

    // Start the animation
    animate();
  }, [wrapperClassName]);

  return (
    <div className="absolute top-0 left-0 w-full h-full">
      <canvas
        className="absolute top-0 left-0 w-full h-full"
        ref={canvasRef}
      ></canvas>
    </div>
  );
}

export default PoppingStarsAnimation;
