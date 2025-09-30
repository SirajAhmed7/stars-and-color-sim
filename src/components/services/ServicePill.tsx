"use client";

import React, { useEffect, useRef, useState } from "react";
import Matter, {
  Engine,
  Render,
  Runner,
  Bodies,
  Body,
  Composite,
  Events,
  IEventCollision,
} from "matter-js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// interface CustomBody extends Matter.Body {
//   position: any;
//   velocity: any;
//   render: any;
//   vertices(vertices: any, mousePosition: { x: number; y: number }): unknown;
//   angle(angle: any): unknown;
//   label: string;
//   pillWidth: number;
//   pillHeight: number;
// }

interface CustomBody extends Matter.Body {
  label: string;
  pillWidth: number;
  pillHeight: number;
}

interface PillData {
  service: string;
  width: number;
  height: number;
}

type ServicePillProps = {
  services: string[];
};

const ServicePills: React.FC<ServicePillProps> = ({ services }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const fontLoadedRef = useRef(false);
  const iconImageRef = useRef<HTMLImageElement | null>(null);
  const hasDroppedRef = useRef(false);

  // const services: string[] = ;

  const customFont = {
    family: "Neue Montreal",
    url: "/fonts/NeueMontreal/Regular.otf",
    weight: "400",
    size: "3vw",
    color: "#fff",
  };

  useEffect(() => {
    const icon = new Image();
    icon.src = "/images/corner-diamond.svg"; // replace with your actual path
    icon.onload = () => {
      iconImageRef.current = icon;
    };
  }, []);

  useEffect(() => {
    if (fontLoadedRef.current) return;

    const link = document.createElement("link");
    link.href = customFont.url;
    link.rel = "stylesheet";
    document.head.appendChild(link);

    fontLoadedRef.current = true;

    return () => {
      document.head.removeChild(link);
    };
  }, [customFont.url]);

  useEffect(() => {
    let engine: Matter.Engine;
    let render: Matter.Render;
    let runner: Matter.Runner;
    const cleanupFunctions: (() => void)[] = [];
    let mousePosition = { x: 0, y: 0 };

    const initPhysics = async () => {
      if (!containerRef.current || !canvasRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      canvasRef.current.width = width;
      canvasRef.current.height = height;

      engine = Engine.create();
      // engine.gravity.y = 0.98;
      engine.gravity.y = 0;

      render = Render.create({
        canvas: canvasRef.current,
        engine,
        options: {
          width,
          height,
          wireframes: false,
          background: "transparent",
        },
      });

      runner = Runner.create({
        isFixed: true,
        delta: 1000 / 60,
      });

      const wallOptions = {
        isStatic: true,
        render: {
          fillStyle: "transparent",
          strokeStyle: "transparent",
        },
        restitution: 0.4,
      };

      const walls = [
        Bodies.rectangle(width / 2, -30, width, 60, wallOptions),
        Bodies.rectangle(width / 2, height + 30, width, 60, wallOptions),
        Bodies.rectangle(-30, height / 2, 60, height, wallOptions),
        Bodies.rectangle(width + 30, height / 2, 60, height, wallOptions),
      ];

      const measureTextDims = (
        text: string
      ): { width: number; height: number } => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d")!;
        context.font = `${customFont.weight} ${customFont.size} ${customFont.family}, sans-serif`;
        // console.log(context.measureText(text).fontBoundingBoxDescent);
        return {
          width: context.measureText(text).width,
          height:
            context.measureText(text).fontBoundingBoxAscent -
            context.measureText(text).fontBoundingBoxDescent,
        };
      };

      const iconSize = 24;
      const spacing = 8;
      const horizontalPadding = 48;
      const verticalPadding = 48;

      const pillData: PillData[] = services.map((service) => {
        const textDims = measureTextDims(service);
        return {
          service,
          width: iconSize + spacing + textDims.width + horizontalPadding,
          height: textDims.height + verticalPadding,
        };
      });

      // let currentX =
      //   (width - pillData.reduce((sum, p) => sum + p.width + 10, -10)) / 2;

      // console.log(currentX);

      // const pills: CustomBody[] = pillData.map((pill) => {
      //   const body = Bodies.rectangle(
      //     currentX + pill.width / 2,
      //     -40,
      //     pill.width,
      //     pill.height,
      //     {
      //       chamfer: { radius: pill.height / 2 },
      //       restitution: 0.4,
      //       friction: 0.01,
      //       frictionAir: 0.002,
      //       label: pill.service,
      //       render: {
      //         fillStyle: "#FFFFFF00",
      //         strokeStyle: "#ffffff00",
      //         lineWidth: 2,
      //       },
      //     }
      //   ) as CustomBody;

      //   body.pillWidth = pill.width;
      //   body.pillHeight = pill.height;

      //   Body.setVelocity(body, {
      //     x: 0,
      //     y: 2 + Math.random(),
      //   });

      //   currentX += pill.width + 10;
      //   return body;
      // });

      // To place the pills in a grid
      const pills: CustomBody[] = [];
      let currentX = 0;
      let currentY = 40; // Start from top margin
      const rowSpacing = 10;
      const colSpacing = 10;
      const rowHeight = Math.max(...pillData.map((p) => p.height)); // max pill height

      pillData.forEach((pill) => {
        if (currentX + pill.width > width) {
          // Move to next row
          currentX = 0;
          currentY += rowHeight + rowSpacing;
        }

        const body = Bodies.rectangle(
          currentX + pill.width / 2,
          currentY,
          pill.width,
          pill.height,
          {
            chamfer: { radius: pill.height / 2 },
            restitution: 0.4,
            friction: 0.01,
            frictionAir: 0.002,
            label: pill.service,
            render: {
              fillStyle: "#FFFFFF00",
              strokeStyle: "#ffffff00",
              lineWidth: 2,
            },
          }
        ) as CustomBody;

        body.pillWidth = pill.width;
        body.pillHeight = pill.height;

        Body.setVelocity(body, { x: 0, y: 0 }); // initially frozen
        pills.push(body);

        currentX += pill.width + colSpacing;
      });

      Composite.add(engine.world, [...walls, ...pills]);

      // Initially freeze pills (no gravity or movement)
      engine.gravity.y = 0;

      pills.forEach((pill) => {
        Body.setVelocity(pill, { x: 0, y: 0 });
      });

      // Trigger drop when canvas enters viewport
      if (containerRef.current && !hasDroppedRef.current) {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top 80%", // or adjust like "center bottom"
          once: true,
          onEnter: () => {
            hasDroppedRef.current = true;

            // Enable gravity and drop pills
            engine.gravity.y = 0.98;

            pills.forEach((pill) => {
              Body.setVelocity(pill, {
                x: 0,
                y: 2 + Math.random() * 2,
              });
            });
          },
        });
      }

      const handleMouseMove = (e: MouseEvent) => {
        const rect = containerRef.current!.getBoundingClientRect();
        mousePosition = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      };

      containerRef.current.addEventListener("mousemove", handleMouseMove);
      cleanupFunctions.push(() =>
        containerRef.current?.removeEventListener("mousemove", handleMouseMove)
      );

      const handleTouchMove = (e: TouchEvent) => {
        if (e.touches && e.touches[0]) {
          const rect = containerRef.current!.getBoundingClientRect();
          mousePosition = {
            x: e.touches[0].clientX - rect.left,
            y: e.touches[0].clientY - rect.top,
          };
          e.preventDefault();
        }
      };

      containerRef.current.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      cleanupFunctions.push(() =>
        containerRef.current?.removeEventListener("touchmove", handleTouchMove)
      );

      const updatePillsBasedOnMouse = () => {
        const influenceRadius = 200;
        const maxForce = 5;

        pills.forEach((pill) => {
          const dx = pill.position.x - mousePosition.x;
          const dy = pill.position.y - mousePosition.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < influenceRadius) {
            const forceFactor = 1 - (distance / influenceRadius) ** 2;
            const force = maxForce * forceFactor;
            const angle = Math.atan2(dy, dx);

            Body.applyForce(pill, pill.position, {
              x: Math.cos(angle) * force,
              y: Math.sin(angle) * force,
            });

            const currentVelocity = Math.sqrt(
              pill.velocity.x ** 2 + pill.velocity.y ** 2
            );
            const maxVelocity = 7;

            if (currentVelocity > maxVelocity) {
              const scale = maxVelocity / currentVelocity;
              Body.setVelocity(pill, {
                x: pill.velocity.x * scale,
                y: pill.velocity.y * scale,
              });
            }
          }
        });
      };

      const checkBoundaries = () => {
        pills.forEach((pill) => {
          const hw = pill.pillWidth / 2;
          const hh = pill.pillHeight / 2;

          if (pill.position.x - hw < 0) {
            Body.setPosition(pill, { x: hw, y: pill.position.y });
            Body.setVelocity(pill, {
              x: Math.abs(pill.velocity.x) * 0.3,
              y: pill.velocity.y,
            });
          } else if (pill.position.x + hw > width) {
            Body.setPosition(pill, { x: width - hw, y: pill.position.y });
            Body.setVelocity(pill, {
              x: -Math.abs(pill.velocity.x) * 0.3,
              y: pill.velocity.y,
            });
          }

          if (pill.position.y - hh < 0) {
            Body.setPosition(pill, { x: pill.position.x, y: hh });
            Body.setVelocity(pill, {
              x: pill.velocity.x,
              y: Math.abs(pill.velocity.y) * 0.3,
            });
          } else if (pill.position.y + hh > height) {
            Body.setPosition(pill, { x: pill.position.x, y: height - hh });
            Body.setVelocity(pill, {
              x: pill.velocity.x,
              y: -Math.abs(pill.velocity.y) * 0.3,
            });
          }
        });
      };

      Events.on(render, "afterRender", () => {
        const context = render.context;
        let hovered: CustomBody | null = null;

        // pills.forEach((pill) => {
        //   pill.render.strokeStyle = "#fff";
        //   pill.render.lineWidth = 2;
        // });

        // for (let pill of pills) {
        //   if (Matter.Vertices.contains(pill.vertices, mousePosition)) {
        //     hovered = pill;
        //     break;
        //   }
        // }

        // if (hovered) {
        //   hovered.render.strokeStyle = "#fff";
        //   hovered.render.lineWidth = 2;
        // }

        pills.forEach((pill) => {
          if (pill.label) {
            context.save();
            context.translate(pill.position.x, pill.position.y);
            context.rotate(pill.angle);

            const radius = pill.pillHeight / 2;
            const pillWidth = pill.pillWidth;
            const pillHeight = pill.pillHeight;

            // Create horizontal gradient
            const gradient = context.createLinearGradient(
              -pillWidth / 2,
              0,
              pillWidth / 2,
              0
            );
            gradient.addColorStop(0, "#3E3E42ff"); // violet
            gradient.addColorStop(1, "#3E3E4200"); // blue

            // Draw gradient border
            context.strokeStyle = gradient;
            context.lineWidth = 2;

            // Optional: transparent or black fill inside
            context.fillStyle = "#00000000";

            // Rounded rect (modern browser support)
            if (context.roundRect) {
              context.beginPath();
              context.roundRect(
                -pillWidth / 2,
                -pillHeight / 2,
                pillWidth,
                pillHeight,
                radius
              );
              context.fill();
              context.stroke();
            } else {
              // Fallback rounded rect
              const r = radius;
              const w = pillWidth;
              const h = pillHeight;
              context.beginPath();
              context.moveTo(-w / 2 + r, -h / 2);
              context.lineTo(w / 2 - r, -h / 2);
              context.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
              context.lineTo(w / 2, h / 2 - r);
              context.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
              context.lineTo(-w / 2 + r, h / 2);
              context.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
              context.lineTo(-w / 2, -h / 2 + r);
              context.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
              context.closePath();
              context.fill();
              context.stroke();
            }

            context.font = `${customFont.weight} ${customFont.size} ${customFont.family}, sans-serif`;
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillStyle = customFont.color;
            // context.fillText(pill.label, 0, 0);

            const iconSize = 24;
            const spacing = 8;
            const textOffsetX = (iconSize + spacing) / 2;

            const textDims = measureTextDims(pill.label);

            // Draw icon (centered vertically)
            if (iconImageRef.current) {
              context.drawImage(
                iconImageRef.current,
                -(textDims.width / 2) - spacing - iconSize / 2, // fine-tune this if needed
                // -48,
                -iconSize / 2,
                iconSize,
                iconSize
              );
            }

            // Draw text
            context.fillText(pill.label, textOffsetX, 0);

            context.restore();
          }
        });

        context.beginPath();
        context.arc(mousePosition.x, mousePosition.y, 16, 0, 2 * Math.PI);
        context.fillStyle = "rgba(96, 165, 250, 0.0)";
        context.fill();
      });

      Events.on(engine, "beforeUpdate", updatePillsBasedOnMouse);
      Events.on(engine, "afterUpdate", checkBoundaries);

      window.addEventListener("resize", () => location.reload());

      Render.run(render);
      Runner.run(runner, engine);

      setIsLoaded(true);
    };

    initPhysics();

    return () => {
      if (runner) Runner.stop(runner);
      if (render) Render.stop(render);
      if (engine) Engine.clear(engine);
      cleanupFunctions.forEach((fn) => fn());
    };
  }, [services]);

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden rounded-lg"
      ref={containerRef}
    >
      <canvas ref={canvasRef} className="w-full h-full" />

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white">Loading physics...</div>
        </div>
      )}

      {/* {isLoaded && (
        <div className="absolute bottom-2 right-2 text-sm text-white opacity-70 pointer-events-none">
          Move cursor to interact
        </div>
      )} */}
    </div>
  );
};

export default ServicePills;
