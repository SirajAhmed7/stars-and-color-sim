"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef } from "react";

function starWarp(canvas: HTMLCanvasElement) {
  // Setup canvas and context
  // const canvas = document.getElementById("space"');
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  // Starfield settings
  const numStars = 1900;
  const focalLength = canvas.width * 2;
  let centerX = canvas.width / 2;
  let centerY = canvas.height / 2;
  const baseTrailLength = 2;
  const maxTrailLength = 30;
  // Stars array
  let stars: {
    x: number;
    y: number;
    z: number;
    o: number;
    trail: {
      x: number;
      y: number;
    }[];
  }[] = [];
  // Animation control
  let warpSpeed = 0;
  let animationActive = true;
  let animationId: number | null = null;

  // Initialize stars
  function initializeStars() {
    stars = [];
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * canvas.width,
        o: 0.5 + Math.random() * 0.5,
        trail: [],
      });
    }
  }
  // Update star positions
  function moveStars() {
    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      // Move star based on warp speed - always forward
      const speed = 1 + warpSpeed * 50;
      star.z -= speed;
      // Reset star position when it passes the viewer
      if (star.z < 1) {
        star.z = canvas.width;
        star.x = Math.random() * canvas.width;
        star.y = Math.random() * canvas.height;
        star.trail = [];
      }
    }
  }
  // Draw stars and their trails
  function drawStars() {
    if (!ctx) return;

    // Resize canvas if needed
    if (
      canvas.width !== canvas.offsetWidth ||
      canvas.height !== canvas.offsetHeight
    ) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      centerX = canvas.width / 2;
      centerY = canvas.height / 2;
    }
    // Calculate trail length based on warp speed
    const trailLength = Math.floor(
      baseTrailLength + warpSpeed * (maxTrailLength - baseTrailLength)
    );
    // Clear canvas with fade effect based on warp speed
    const clearAlpha = 1 - warpSpeed * 0.8;
    ctx.fillStyle = `rgba(6,6,6,${clearAlpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Draw stars and trails
    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      // Calculate screen position with perspective
      const px = (star.x - centerX) * (focalLength / star.z) + centerX;
      const py = (star.y - centerY) * (focalLength / star.z) + centerY;
      // Add position to trail
      star.trail.push({
        x: px,
        y: py,
      });
      if (star.trail.length > trailLength) {
        star.trail.shift();
      }
      // Draw trail
      if (star.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(star.trail[0].x, star.trail[0].y);
        for (let j = 1; j < star.trail.length; j++) {
          ctx.lineTo(star.trail[j].x, star.trail[j].y);
        }
        ctx.strokeStyle = `rgba(255,255,255,${star.o})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      // Draw star
      ctx.fillStyle = `rgba(255,255,255,${star.o})`;
      ctx.fillRect(px, py, 1, 1);
    }
  }
  // Animation loop
  function animate() {
    if (!animationActive) return;

    animationId = requestAnimationFrame(animate);
    moveStars();
    drawStars();
  }

  // Initialize and start animation
  initializeStars();

  let grow = 0;
  setTimeout(() => {
    animate();

    const growInterval = setInterval(() => {
      if (grow <= 1) {
        warpSpeed = grow += 0.01;
      } else {
        warpSpeed = 0;
        clearInterval(growInterval);
      }
      // else (grow > 100) {
      //   grow = 0;
      // }
    }, 12);
  }, 650);

  const handleResize = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
  };

  // Handle window resize
  window.addEventListener("resize", handleResize);

  return () => {
    animationActive = false;
    if (animationId) cancelAnimationFrame(animationId);

    window.removeEventListener("resize", handleResize);
  };
}

gsap.registerPlugin(useGSAP);

function StarWarp({ preloaderComplete }: { preloaderComplete: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useGSAP(() => {
    gsap.to(canvasRef.current, {
      opacity: 1,
      duration: 0.25,
      delay: 0.65,
    });
  });

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || preloaderComplete) return;

    const stopAnimation = starWarp(canvas);

    return stopAnimation;
  }, [preloaderComplete]);

  return (
    <div className="absolute top-0 left-0 w-full h-screen">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full opoacity-0"
      ></canvas>
    </div>
  );
}

export default StarWarp;
