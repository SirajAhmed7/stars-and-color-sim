import Matter, { IRenderDefinition } from "matter-js";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";

// TypeScript interfaces
interface BoxData {
  text: string;
  x: number;
  width: number;
  height: number;
  stringLength: number;
  url: string;
  internalLink?: boolean;
}

interface BoxWithBody extends BoxData {
  body: Matter.Body;
  hoverProgress: number; // 0 to 1 for smooth transitions
}

const HangingBoxes: React.FC = () => {
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const boxesRef = useRef<BoxWithBody[]>([]);
  const constraintsRef = useRef<Matter.Constraint[]>([]);
  const anchorsRef = useRef<Matter.Body[]>([]);
  const mouseConstraintRef = useRef<Matter.MouseConstraint | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const intervalIdRef = useRef<number | null>(null);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const hoveredBoxRef = useRef<number | null>(null); // Track which box is hovered
  const router = useRouter();

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 800,
    height: typeof window !== "undefined" ? window.innerHeight : 600,
  });

  // Configuration
  const stringY = 0;
  const boxData: BoxData[] = [
    {
      text: "LinkedIn",
      x: 200,
      stringLength: 200,
      url: "https://www.linkedin.com/company/rare-design-studios/",
      width: 120,
      height: 60,
    },
    {
      text: "Dribbble",
      x: 400,
      stringLength: 150,
      url: "https://dribbble.com/akshayhooda",
      width: 120,
      height: 60,
    },
    {
      text: "WhatsApp",
      x: 650,
      stringLength: 230,
      url: "https://wa.me/message/3ZB5MAT7XSWJD1",
      width: 120,
      height: 60,
    },
    {
      text: "Let's get on a call",
      x: 950,
      stringLength: 170,
      internalLink: true,
      // url: "https://calendly.com/raredesignlabs/30min",
      url: "/contact",
      width: 120,
      height: 60,
    },
  ];

  const customFont = {
    family: "Harmond",
    url: "/fonts/Harmond/Harmond-VF.ttf",
    normalWeight: "400",
    mediumWeight: "500",
    size: "2vw",
    color: "#fff",
  };

  // Helper function to interpolate between colors
  const interpolateColor = useCallback((progress: number) => {
    // Interpolate from current color to white
    const startR = 6,
      startG = 6,
      startB = 6; // #060606
    const endR = 255,
      endG = 255,
      endB = 255; // #ffffff

    const r = Math.round(startR + (endR - startR) * progress);
    const g = Math.round(startG + (endG - startG) * progress);
    const b = Math.round(startB + (endB - startB) * progress);

    return `rgb(${r}, ${g}, ${b})`;
  }, []);

  // Helper function to interpolate text color
  const interpolateTextColor = useCallback((progress: number) => {
    // Interpolate from white to black for better contrast
    const startR = 255,
      startG = 255,
      startB = 255; // #ffffff
    const endR = 0,
      endG = 0,
      endB = 0; // #000000

    const r = Math.round(startR + (endR - startR) * progress);
    const g = Math.round(startG + (endG - startG) * progress);
    const b = Math.round(startB + (endB - startB) * progress);

    return `rgb(${r}, ${g}, ${b})`;
  }, []);

  // Helper function to interpolate font weight
  const interpolateFontWeight = useCallback((progress: number) => {
    // Interpolate from normal (400) to medium (500)
    const startWeight = parseInt(customFont.normalWeight);
    const endWeight = parseInt(customFont.mediumWeight);
    const weight = Math.round(
      startWeight + (endWeight - startWeight) * progress
    );
    return weight.toString();
  }, []);

  const measureTextDims = useCallback(
    (
      text: string,
      fontWeight: string = customFont.normalWeight
    ): { width: number; height: number } => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d")!;
      context.font = `${fontWeight} ${customFont.size} ${customFont.family}, sans-serif`;
      return {
        width: context.measureText(text).width,
        height:
          context.measureText(text).fontBoundingBoxAscent -
          context.measureText(text).fontBoundingBoxDescent,
      };
    },
    [customFont.family, customFont.size, customFont.normalWeight]
  );

  // Calculate box positions based on screen width
  const calculateBoxDims = useCallback(
    (width: number): BoxData[] => {
      const canvasWidthWPadding = width - width * 0.2;

      return boxData.map((box, i) => {
        const textDims = measureTextDims(box.text + " ↗");

        const horizontalPadding = 56;
        const verticalPadding = 48;

        const nextBoxWidth =
          i < boxData.length - 1
            ? measureTextDims(boxData[i + 1].text).width
            : 0;

        const x =
          (width * 0.2) / 2 +
          (canvasWidthWPadding / boxData.length) * (i + 0.5) -
          nextBoxWidth / 4;

        return {
          ...box,
          text: box.text + " ↗",
          x,
          width: textDims.width + horizontalPadding,
          height: textDims.height + verticalPadding,
        };
      });
    },
    [measureTextDims]
  );

  // Create physics engine
  const createEngine = useCallback(() => {
    const engine = Matter.Engine.create();
    engine.world.gravity.y = 0.8;
    engine.timing.timeScale = 1;
    engine.enableSleeping = true;
    return engine;
  }, []);

  // Create render instance
  const createRender = useCallback(
    (engine: Matter.Engine) => {
      if (!canvasRef.current) return null;

      return Matter.Render.create({
        canvas: canvasRef.current,
        engine: engine,
        options: {
          width: dimensions.width,
          height: dimensions.height,
          wireframes: false,
          background: "transparent",
          enabled: false,
        },
      } as IRenderDefinition);
    },
    [dimensions]
  );

  // Create hanging box
  const createHangingBox = useCallback(
    (data: BoxData, engine: Matter.Engine) => {
      const anchor = Matter.Bodies.circle(data.x, stringY, 2, {
        isStatic: true,
        render: { visible: false },
      });

      const box = Matter.Bodies.rectangle(
        data.x,
        stringY + data.stringLength,
        data.width || 120,
        data.height || 60,
        {
          render: {
            fillStyle: "rgba(0, 0, 0)",
            strokeStyle: "#fff",
            lineWidth: 2,
          },
          frictionAir: 0.02,
          restitution: 0.3,
          inertia: Infinity,
          sleepThreshold: 60,
          density: 0.001,
        }
      );

      const constraint = Matter.Constraint.create({
        bodyA: anchor,
        bodyB: box,
        length: data.stringLength,
        stiffness: 0.8,
        damping: 0.1,
        render: {
          strokeStyle: "#fff",
          lineWidth: 1,
          type: "line",
          anchors: false,
        },
      });

      Matter.World.add(engine.world, [anchor, box, constraint]);

      return { anchor, box, constraint };
    },
    []
  );

  // Setup mouse interaction
  const setupMouseInteraction = useCallback((engine: Matter.Engine) => {
    if (!canvasRef.current) return null;

    const mouse = Matter.Mouse.create(canvasRef.current);
    mouse.pixelRatio = window.devicePixelRatio || 1;

    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });

    Matter.World.add(engine.world, mouseConstraint);
    return mouseConstraint;
  }, []);

  // Custom render function with hover effects
  const customRender = useCallback(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Update hover progress for smooth transitions
    boxesRef.current.forEach((box, index) => {
      const isHovered = hoveredBoxRef.current === index;
      const targetProgress = isHovered ? 1 : 0;
      const speed = 0.15; // Transition speed

      if (box.hoverProgress < targetProgress) {
        box.hoverProgress = Math.min(box.hoverProgress + speed, targetProgress);
      } else if (box.hoverProgress > targetProgress) {
        box.hoverProgress = Math.max(box.hoverProgress - speed, targetProgress);
      }
    });

    // First, draw all constraints (strings)
    constraintsRef.current.forEach((constraint) => {
      if (constraint.bodyA && constraint.bodyB) {
        ctx.beginPath();
        ctx.moveTo(constraint.bodyA.position.x, constraint.bodyA.position.y);
        ctx.lineTo(constraint.bodyB.position.x, constraint.bodyB.position.y);
        ctx.strokeStyle = "rgba(81, 81, 91, 1)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    // Then, draw all boxes with hover effects
    boxesRef.current.forEach((box) => {
      const { body, hoverProgress } = box;
      ctx.save();
      ctx.translate(body.position.x, body.position.y);
      ctx.rotate(body.angle);

      // Draw glow effect if hovering
      if (hoverProgress > 0) {
        // const glowPadding = 40 * hoverProgress; // Bigger glow
        const glowPadding = 70 * hoverProgress; // Bigger glow
        const glowOpacity = 0.28 * hoverProgress;

        // Create elliptical glow that's bigger than the button
        const glowRadiusX = box.width / 2 + glowPadding;
        // const glowRadiusY = box.height / 2 + glowPadding * 0.7; // Proportional vertical glow
        const glowRadiusY = box.height / 2 + glowPadding * 0.6; // Proportional vertical glow

        // Save context for transformation
        ctx.save();

        // Scale the context to create an elliptical gradient
        ctx.scale(glowRadiusX / glowRadiusY, 1);

        // Create circular gradient in the scaled context
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowRadiusY);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${glowOpacity * 0.9})`);
        gradient.addColorStop(0.2, `rgba(255, 255, 255, ${glowOpacity * 0.7})`);
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${glowOpacity * 0.4})`);
        gradient.addColorStop(0.8, `rgba(255, 255, 255, ${glowOpacity * 0.1})`);
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        // Draw the glow as a circle in the scaled context (becomes ellipse)
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, glowRadiusY, 0, Math.PI * 2);
        ctx.fill();

        // Restore context
        ctx.restore();
      }

      // Draw box fill with color transition
      ctx.fillStyle = interpolateColor(hoverProgress);
      ctx.fillRect(-box.width / 2, -box.height / 2, box.width, box.height);

      // Draw box border
      if (hoverProgress < 1) {
        const gradient = ctx.createLinearGradient(
          0,
          -box.height / 2,
          0,
          box.height / 2
        );
        const alpha = 1 - hoverProgress;
        gradient.addColorStop(0, `rgba(62, 62, 66, ${alpha})`);
        gradient.addColorStop(1, `rgba(62, 62, 66, 0)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.strokeRect(-box.width / 2, -box.height / 2, box.width, box.height);
      }

      ctx.restore();
    });

    // Finally, draw text with color and font weight transitions
    boxesRef.current.forEach(({ body, text, hoverProgress, height }) => {
      ctx.save();
      ctx.translate(body.position.x, body.position.y);
      ctx.rotate(body.angle);

      // Text styling with color and font weight transitions
      const fontWeight = interpolateFontWeight(hoverProgress);
      ctx.font = `${fontWeight} ${customFont.size} ${customFont.family}, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = interpolateTextColor(hoverProgress);

      // Draw text
      // ctx.fillText(text, 0, 0);
      ctx.fillText(text, 0, 0.07 * height);

      ctx.restore();
    });
  }, [
    dimensions.width,
    dimensions.height,
    interpolateColor,
    interpolateFontWeight,
    customFont.size,
    customFont.family,
    interpolateTextColor,
  ]);

  // Animation loop
  const animate = useCallback(() => {
    if (!engineRef.current) return;

    Matter.Engine.update(engineRef.current);
    customRender();
    animationIdRef.current = requestAnimationFrame(animate);
  }, [customRender]);

  // Enhanced mouse move handler with hover detection
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const mouseDeltaX = mouseX - prevMouseRef.current.x;
    prevMouseRef.current = { x: mouseX, y: mouseY };

    let hovering = false;
    let hoveredIndex: number | null = null;

    boxesRef.current.forEach((box, index) => {
      const { body } = box;
      const { x, y } = body.position;
      const { width, height } = box;

      // Check if hovering over box
      if (
        mouseX >= x - width / 2 &&
        mouseX <= x + width / 2 &&
        mouseY >= y - height / 2 &&
        mouseY <= y + height / 2
      ) {
        hovering = true;
        hoveredIndex = index;
      }

      // Apply physics force based on mouse proximity and movement
      const distance = Math.sqrt(
        Math.pow(box.x - mouseX, 2) + Math.pow(stringY - mouseY, 2)
      );

      if (distance < box.stringLength && Math.abs(mouseDeltaX) > 1) {
        let forceDirection = mouseX > box.x ? -1 : 1;
        forceDirection *= mouseDeltaX > 0 ? 1 : -1;
        forceDirection *= (box.stringLength - Math.abs(mouseX - box.x)) * 0.01;

        const force =
          ((forceDirection * (0.01 * distance)) / box.stringLength) *
          Math.abs(mouseDeltaX * 0.05);
        const angle = Math.atan2(stringY - mouseY, box.x - mouseX);

        Matter.Body.applyForce(body, body.position, {
          x: Math.cos(angle) * force,
          y: Math.sin(angle) * force,
        });
      }
    });

    // Update hovered box
    hoveredBoxRef.current = hoveredIndex;

    if (canvasRef.current) {
      canvasRef.current.style.cursor = hovering ? "pointer" : "default";
    }
  }, []);

  // Handle click
  const handleClick = useCallback((event: MouseEvent) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    boxesRef.current.forEach((box) => {
      const { body, url, width, height, internalLink } = box;
      const { x, y } = body.position;

      if (
        mouseX >= x - width / 2 &&
        mouseX <= x + width / 2 &&
        mouseY >= y - height / 2 &&
        mouseY <= y + height / 2
      ) {
        if (internalLink) {
          router.push(url);
        } else window.open(url, "_blank");
      }
    });
  }, []);

  // Handle resize
  const handleResize = useCallback(() => {
    const newDimensions = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    setDimensions(newDimensions);
  }, []);

  // Initialize physics world
  const initializePhysicsWorld = useCallback(async () => {
    try {
      const engine = createEngine();
      engineRef.current = engine;

      const render = createRender(engine);
      renderRef.current = render;

      // Clear existing arrays
      boxesRef.current = [];
      constraintsRef.current = [];
      anchorsRef.current = [];

      // Create physics objects
      const positionedBoxData = calculateBoxDims(dimensions.width);

      positionedBoxData.forEach((data) => {
        const { anchor, box, constraint } = createHangingBox(data, engine);

        boxesRef.current.push({
          ...data,
          body: box,
          hoverProgress: 0, // Initialize hover progress
        });
        constraintsRef.current.push(constraint);
        anchorsRef.current.push(anchor);
      });

      // Setup mouse interaction
      // const mouseConstraint = setupMouseInteraction(engine);
      // mouseConstraintRef.current = mouseConstraint;

      // Start animation
      animate();

      // Add random motion
      intervalIdRef.current = window.setInterval(() => {
        boxesRef.current.forEach(({ body }) => {
          if (Math.random() < 0.1) {
            Matter.Body.applyForce(body, body.position, {
              x: (Math.random() - 0.5) * 0.0001,
              y: 0,
            });
          }
        });
      }, 2000);

      setIsLoading(false);
    } catch (error) {
      console.error("Failed to initialize physics world:", error);
      setIsLoading(false);
    }
  }, [
    createEngine,
    createRender,
    calculateBoxDims,
    dimensions,
    createHangingBox,
    animate,
  ]);

  // Setup event listeners
  useEffect(() => {
    if (window.innerWidth < 768) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);
    window.addEventListener("resize", handleResize);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleMouseMove, handleClick, handleResize]);

  // Initialize on mount and when dimensions change
  useEffect(() => {
    if (window.innerWidth < 768) return;

    initializePhysicsWorld();

    return () => {
      // Cleanup
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
      if (renderRef.current) {
        Matter.Render.stop(renderRef.current);
      }
      if (engineRef.current) {
        Matter.Engine.clear(engineRef.current);
      }
    };
  }, [initializePhysicsWorld]);

  return (
    <canvas
      ref={canvasRef}
      // width={dimensions.width}
      // height={dimensions.height}
      className="hidden md:block absolute top-0 left-0 w-full h-full"
      style={{ cursor: "default" }}
    />
  );
};

export default HangingBoxes;
