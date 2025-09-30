"use client";

import React, { useState, useRef, useEffect } from "react";

interface HwawWinProps {
  text?: string;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  timeline?: GSAPTimeline | undefined;
}

interface Vertex {
  0: number;
  1: number;
}

interface BoundingBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Triangle {
  0: number;
  1: number;
  2: number;
}

class Fragment {
  v0: Vertex;
  v1: Vertex;
  v2: Vertex;
  box: BoundingBox;
  image: HTMLCanvasElement;
  centroid: [number, number] = [0, 0];
  canvas: HTMLCanvasElement;

  constructor(
    v0: Vertex,
    v1: Vertex,
    v2: Vertex,
    box: DOMRect,
    image: HTMLCanvasElement
  ) {
    this.v0 = v0;
    this.v1 = v1;
    this.v2 = v2;
    this.box = {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
    };
    this.image = image;

    this.computeBoundingBox();
    this.computeCentroid();
    this.canvas = this.createCanvas();
    this.clip();
  }

  computeBoundingBox(): void {
    const xMin = Math.min(this.v0[0], this.v1[0], this.v2[0]);
    const xMax = Math.max(this.v0[0], this.v1[0], this.v2[0]);
    const yMin = Math.min(this.v0[1], this.v1[1], this.v2[1]);
    const yMax = Math.max(this.v0[1], this.v1[1], this.v2[1]);

    this.box = {
      x: xMin,
      y: yMin,
      w: xMax - xMin,
      h: yMax - yMin,
    };
  }

  computeCentroid(): void {
    const x = (this.v0[0] + this.v1[0] + this.v2[0]) / 3;
    const y = (this.v0[1] + this.v1[1] + this.v2[1]) / 3;
    this.centroid = [x, y];
  }

  createCanvas(): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = this.box.w;
    canvas.height = this.box.h;
    canvas.style.width = this.box.w + "px";
    canvas.style.height = this.box.h + "px";
    canvas.style.left = this.box.x + "px";
    canvas.style.top = this.box.y + "px";
    canvas.style.position = "absolute";
    return canvas;
  }

  clip(): void {
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;

    ctx.translate(-this.box.x, -this.box.y);
    ctx.beginPath();
    ctx.moveTo(this.v0[0], this.v0[1]);
    ctx.lineTo(this.v1[0], this.v1[1]);
    ctx.lineTo(this.v2[0], this.v2[1]);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(this.image, 0, 0);
  }
}

const HwawWin: React.FC<HwawWinProps> = ({
  text = "WIN",
  backgroundColor = "#070707",
  textColor = "#fff",
  fontSize = "10vw",
  timeline,
}) => {
  const [shattered, setShattered] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const fragmentsRef = useRef<Fragment[]>([]);

  // Utility functions
  const randomRange = (min: number, max: number): number => {
    return min + (max - min) * Math.random();
  };

  const clamp = (x: number, min: number, max: number): number => {
    return x < min ? min : x > max ? max : x;
  };

  const shatter = (): void => {
    // Don't allow shattering again while animation is in progress
    if (shattered || !containerRef.current || !textRef.current) return;
    setShattered(true);

    const textElement = textRef.current;
    const container = containerRef.current;
    const box = textElement.getBoundingClientRect();
    const boxWidth = box.width;
    const boxHeight = box.height;
    const TWO_PI = Math.PI * 2;

    // Create canvas for text content
    const canvas = document.createElement("canvas");
    canvas.width = boxWidth;
    canvas.height = boxHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw the text div to canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, boxWidth, boxHeight);
    ctx.fillStyle = textColor;
    ctx.font = `bold ${fontSize} "Neue Montreal", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, boxWidth / 2, boxHeight / 2);

    // Hide the original text
    textElement.style.visibility = "hidden";

    // Get click position (center of element)
    const clickPosition: [number, number] = [boxWidth / 2, boxHeight / 2];

    // Create vertices
    const vertices: Array<[number, number]> = [];
    vertices.push([clickPosition[0], clickPosition[1]]); // center

    // Create rings of vertices
    const rings = [
      { r: boxWidth * 0.25, c: 8 }, // inner ring
      { r: boxWidth * 0.45, c: 12 }, // middle ring
      { r: boxWidth * 0.9, c: 16 }, // outer ring
    ];

    // Add vertices in rings
    rings.forEach((ring) => {
      const radius = ring.r;
      const count = ring.c;
      const variance = radius * 0.15;

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * TWO_PI;
        const x =
          Math.cos(angle) * radius +
          clickPosition[0] +
          randomRange(-variance, variance);
        const y =
          Math.sin(angle) * radius +
          clickPosition[1] +
          randomRange(-variance, variance);
        vertices.push([x, y]);
      }
    });

    // Add corner vertices to maintain rectangular shape
    vertices.push([0, 0]); // top-left
    vertices.push([boxWidth, 0]); // top-right
    vertices.push([boxWidth, boxHeight]); // bottom-right
    vertices.push([0, boxHeight]); // bottom-left

    // Add extra vertices along edges for better triangulation
    const edgePointCount = 3; // number of extra points per edge

    // Top edge
    for (let i = 1; i < edgePointCount; i++) {
      vertices.push([boxWidth * (i / edgePointCount), 0]);
    }

    // Right edge
    for (let i = 1; i < edgePointCount; i++) {
      vertices.push([boxWidth, boxHeight * (i / edgePointCount)]);
    }

    // Bottom edge
    for (let i = 1; i < edgePointCount; i++) {
      vertices.push([boxWidth * (i / edgePointCount), boxHeight]);
    }

    // Left edge
    for (let i = 1; i < edgePointCount; i++) {
      vertices.push([0, boxHeight * (i / edgePointCount)]);
    }

    // Ensure vertices are within bounds
    vertices.forEach((v) => {
      v[0] = clamp(v[0], 0, boxWidth);
      v[1] = clamp(v[1], 0, boxHeight);
    });

    // Create triangles
    const triangles: Array<[number, number, number]> = [];
    const centerIdx = 0; // index of center vertex

    // Connect center to first ring
    for (let i = 1; i <= rings[0].c; i++) {
      const nextI = i < rings[0].c ? i + 1 : 1;
      triangles.push([centerIdx, i, nextI]);
    }

    // Connect rings
    let ringStart = 1;
    let totalVertices = 0;
    rings.forEach((ring) => (totalVertices += ring.c));

    for (let r = 0; r < rings.length - 1; r++) {
      const innerRingSize = rings[r].c;
      const outerRingSize = rings[r + 1].c;
      const outerRingStart = ringStart + innerRingSize;

      // Make sure we don't exceed the number of vertices
      if (outerRingStart + outerRingSize > vertices.length) {
        console.error("Not enough vertices for triangulation");
        return;
      }

      for (let i = 0; i < innerRingSize; i++) {
        const innerIdx = ringStart + i;
        const nextInnerIdx = ringStart + ((i + 1) % innerRingSize);

        // Calculate indices in outer ring
        const segmentRatio = outerRingSize / innerRingSize;
        const outerBaseIdx = Math.floor(i * segmentRatio);
        const nextOuterBaseIdx = Math.floor(
          ((i + 1) % innerRingSize) * segmentRatio
        );

        const outerIdx1 = outerRingStart + outerBaseIdx;
        const outerIdx2 =
          outerRingStart +
          (outerBaseIdx + 1 >= outerRingSize ? 0 : outerBaseIdx + 1);
        const outerIdx3 = outerRingStart + nextOuterBaseIdx;

        // Always validate indices before creating triangles
        if (
          innerIdx < vertices.length &&
          nextInnerIdx < vertices.length &&
          outerIdx1 < vertices.length
        ) {
          triangles.push([innerIdx, nextInnerIdx, outerIdx1]);
        }

        if (
          nextInnerIdx < vertices.length &&
          outerIdx3 < vertices.length &&
          outerIdx1 < vertices.length
        ) {
          triangles.push([nextInnerIdx, outerIdx3, outerIdx1]);
        }

        // Add extra triangles to fill gaps if needed
        if (segmentRatio > 1 && outerIdx2 !== outerIdx3) {
          if (
            outerIdx1 < vertices.length &&
            outerIdx2 < vertices.length &&
            outerIdx3 < vertices.length
          ) {
            triangles.push([outerIdx1, outerIdx2, outerIdx3]);
          }
        }
      }

      ringStart += innerRingSize;
    }

    // Keep track of fragments to clean up later
    fragmentsRef.current = [];

    // Create fragments
    triangles.forEach((triangle) => {
      const v0 = vertices[triangle[0]];
      const v1 = vertices[triangle[1]];
      const v2 = vertices[triangle[2]];

      if (!v0 || !v1 || !v2) return; // Skip if any vertex is undefined

      // Create a fragment
      const fragment = new Fragment(v0, v1, v2, box, canvas);
      fragmentsRef.current.push(fragment);

      // Add the fragment's canvas to the container
      if (fragment.canvas) {
        container.appendChild(fragment.canvas);

        // Calculate animation values
        const dx = fragment.centroid[0] - clickPosition[0];
        const dy = fragment.centroid[1] - clickPosition[1];
        const distance = Math.sqrt(dx * dx + dy * dy);
        const direction =
          distance > 0
            ? [dx / distance, dy / distance]
            : [randomRange(-1, 1), randomRange(-1, 1)];

        // Random rotations
        const rx = randomRange(-30, 30);
        const ry = randomRange(-30, 30);
        const rz = randomRange(-30, 30);

        // Animation delay based on distance from center
        const delay = distance * 0.003 * randomRange(0.5, 1);

        // Animation distance based on how far from center
        const flyDistance = randomRange(100, 300);

        // Set initial styles
        fragment.canvas.style.transition =
          "transform 1.5s ease-out, opacity 1.5s ease-out";
        fragment.canvas.style.transitionDelay = `${delay}s`;

        // Trigger animation after a small delay (to ensure initial state is rendered)
        setTimeout(() => {
          if (fragment.canvas) {
            fragment.canvas.style.transform = `translate(${
              direction[0] * flyDistance
            }px, ${
              direction[1] * flyDistance
            }px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;
            fragment.canvas.style.opacity = "0";
          }
        }, 50);
      }
    });

    // Reset after animation completes
    setTimeout(() => {
      fragmentsRef.current.forEach((fragment) => {
        if (fragment.canvas.parentNode) {
          container.removeChild(fragment.canvas);
        }
      });
      fragmentsRef.current = [];
      textElement.style.visibility = "visible";
      setShattered(false);
    }, 2500);
  };

  return (
    <div className="w-full h-screen relative bg-background overflow-hidden">
      <div
        ref={containerRef}
        className="relative w-1/2 h-1/2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          // width: `${width}px`,
          // height: `${height}px`,
          perspective: "800px",
        }}
      >
        <div
          ref={textRef}
          onClick={shatter}
          className="w-full h-full -translate-y-[4%] text-[10vw] bg-background text-white flex justify-center items-center font-bold cursor-pointer select-none"
          // style={{
          //   fontSize: `${fontSize}px`,
          //   color: textColor,
          //   backgroundColor: backgroundColor,
          // }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};

export default HwawWin;
