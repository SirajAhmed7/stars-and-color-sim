"use client";

// import React, { useEffect, useRef, useCallback } from "react";

// // Type definitions
// interface SegmentPosition {
//   [key: string]: [number, number, number, number]; // [x, y, width, height]
// }

// interface DigitPattern {
//   [key: string]: string[];
// }

// interface CornerClockProps {
//   className?: string;
//   color?: string;
//   backgroundColor?: string;
//   style?: React.CSSProperties;
// }

// class CornerClockEngine {
//   private canvas: HTMLCanvasElement;
//   private ctx: CanvasRenderingContext2D;
//   private scale: number;
//   private digitHeight: number;
//   private x: number;
//   private y: number;
//   private animationId: number | null = null;
//   private resizeTimeout: number | null = null;
//   private color: string;
//   private backgroundColor: string;
//   private resizeObserver: ResizeObserver | null = null;

//   constructor(
//     canvas: HTMLCanvasElement,
//     color: string = "#D1D1D6",
//     backgroundColor: string = "#1A1A1E"
//   ) {
//     this.canvas = canvas;

//     const context = canvas.getContext("2d");
//     if (!context) {
//       throw new Error("Could not get 2D rendering context");
//     }
//     this.ctx = context;

//     this.scale = 1;
//     this.digitHeight = 12;
//     this.x = 0;
//     this.y = 0;
//     this.color = color;
//     this.backgroundColor = backgroundColor;

//     this.resize();
//     this.setupResize();
//     this.animate();
//   }

//   private resize = (): void => {
//     const parent = this.canvas.parentElement;
//     if (!parent) {
//       console.warn("Canvas has no parent element");
//       return;
//     }

//     // const rect = parent.getBoundingClientRect();
//     const rect = {
//       width: parent.offsetWidth,
//       height: parent.offsetHeight,
//     };

//     // Set canvas size with device pixel ratio for crisp rendering
//     const dpr = window.devicePixelRatio || 1;
//     this.canvas.width = rect.width * dpr;
//     this.canvas.height = rect.height * dpr;

//     // Scale the context to match device pixel ratio
//     this.ctx.scale(dpr, dpr);

//     // Set CSS size
//     this.canvas.style.width = `${rect.width}px`;
//     this.canvas.style.height = `${rect.height}px`;

//     this.scale = Math.min(rect.width / 280, rect.height / 50);
//     this.digitHeight = 12 * this.scale;
//     this.x = rect.width / 2 - 130 * this.scale;
//     this.y = rect.height / 2;
//   };

//   private setupResize(): void {
//     // Use ResizeObserver for better performance in React
//     if (window.ResizeObserver) {
//       this.resizeObserver = new ResizeObserver(() => {
//         if (this.resizeTimeout) {
//           clearTimeout(this.resizeTimeout);
//         }
//         this.resizeTimeout = window.setTimeout(this.resize, 100);
//       });

//       const parent = this.canvas.parentElement;
//       if (parent) {
//         this.resizeObserver.observe(parent);
//       }
//     } else {
//       // Fallback to window resize
//       window.addEventListener("resize", this.resize);
//     }
//   }

//   private drawDigit(digit: string, x: number, y: number): void {
//     const w: number = 2 * this.scale;
//     const h: number = this.digitHeight;
//     const gap: number = 1 * this.scale;

//     this.ctx.fillStyle = this.color;

//     // Segment positions
//     const segments: SegmentPosition = {
//       a: [x + gap, y - h, h - 2 * gap, w], // top
//       b: [x + h, y - h + gap, w, h - 2 * gap], // top right
//       c: [x + h, y + gap, w, h - 2 * gap], // bottom right
//       d: [x + gap, y + h, h - 2 * gap, w], // bottom
//       e: [x, y + gap, w, h - 2 * gap], // bottom left
//       f: [x, y - h + gap, w, h - 2 * gap], // top left
//       g: [x + gap, y, h - 2 * gap, w], // middle
//     };

//     const patterns: DigitPattern = {
//       "0": ["a", "b", "c", "d", "e", "f"],
//       "1": ["b", "c"],
//       "2": ["a", "b", "g", "e", "d"],
//       "3": ["a", "b", "g", "c", "d"],
//       "4": ["f", "g", "b", "c"],
//       "5": ["a", "f", "g", "c", "d"],
//       "6": ["a", "f", "g", "e", "d", "c"],
//       "7": ["a", "b", "c"],
//       "8": ["a", "b", "c", "d", "e", "f", "g"],
//       "9": ["a", "b", "c", "d", "f", "g"],
//     };

//     const pattern = patterns[digit];
//     if (pattern) {
//       pattern.forEach((seg: string) => {
//         const segmentData = segments[seg];
//         if (segmentData) {
//           const [sx, sy, sw, sh] = segmentData;
//           this.ctx.fillRect(sx, sy, sw, sh);
//         }
//       });
//     }
//   }

//   private drawColon(x: number, y: number): void {
//     const size: number = 1.5 * this.scale;
//     const offset: number = 3 * this.scale;
//     this.ctx.fillStyle = this.color;
//     this.ctx.fillRect(x, y - offset, size, size);
//     this.ctx.fillRect(x, y + offset, size, size);
//   }

//   private drawDot(x: number, y: number): void {
//     const size: number = 2 * this.scale;
//     this.ctx.fillStyle = this.color;
//     this.ctx.fillRect(x, y + 2 * this.scale, size, size);
//   }

//   private animate = (): void => {
//     const now: Date = new Date();
//     const hours: string = String(now.getHours()).padStart(2, "0");
//     const minutes: string = String(now.getMinutes()).padStart(2, "0");
//     const seconds: string = String(now.getSeconds()).padStart(2, "0");
//     const milliseconds: string = String(now.getMilliseconds()).padStart(3, "0");

//     // Clear canvas
//     const rect = this.canvas.parentElement?.getBoundingClientRect();
//     if (rect) {
//       this.ctx.fillStyle = this.backgroundColor;
//       this.ctx.fillRect(0, 0, rect.width, rect.height);
//     }

//     // Draw time
//     let x: number = this.x;
//     const digitWidth: number = 15 * this.scale;
//     const colonWidth: number = 6 * this.scale;
//     const dotWidth: number = 8 * this.scale;

//     // Hours
//     this.drawDigit(hours[0], x, this.y);
//     x += digitWidth;
//     this.drawDigit(hours[1], x, this.y);
//     x += digitWidth;

//     // Colon
//     this.drawColon(x + 2 * this.scale, this.y);
//     x += colonWidth;

//     // Minutes
//     this.drawDigit(minutes[0], x, this.y);
//     x += digitWidth;
//     this.drawDigit(minutes[1], x, this.y);
//     x += digitWidth;

//     // Colon
//     this.drawColon(x + 2 * this.scale, this.y);
//     x += colonWidth;

//     // Seconds
//     this.drawDigit(seconds[0], x, this.y);
//     x += digitWidth;
//     this.drawDigit(seconds[1], x, this.y);
//     x += digitWidth;

//     // Dot separator for milliseconds
//     this.drawDot(x + 2 * this.scale, this.y);
//     x += dotWidth;

//     // Milliseconds (3 digits)
//     this.drawDigit(milliseconds[0], x, this.y);
//     x += digitWidth;
//     this.drawDigit(milliseconds[1], x, this.y);
//     x += digitWidth;
//     this.drawDigit(milliseconds[2], x, this.y);

//     this.animationId = requestAnimationFrame(this.animate);
//   };

//   public setColor(color: string): void {
//     this.color = color;
//   }

//   public setBackgroundColor(backgroundColor: string): void {
//     this.backgroundColor = backgroundColor;
//   }

//   public destroy(): void {
//     if (this.animationId) {
//       cancelAnimationFrame(this.animationId);
//       this.animationId = null;
//     }
//     if (this.resizeTimeout) {
//       clearTimeout(this.resizeTimeout);
//       this.resizeTimeout = null;
//     }
//     if (this.resizeObserver) {
//       this.resizeObserver.disconnect();
//       this.resizeObserver = null;
//     } else {
//       window.removeEventListener("resize", this.resize);
//     }
//   }
// }

// // React Hook for using the corner clock
// export const useCornerClock = (
//   canvasRef: React.RefObject<HTMLCanvasElement>,
//   color: string = "#D1D1D6",
//   backgroundColor: string = "#1A1A1E"
// ) => {
//   const clockRef = useRef<CornerClockEngine | null>(null);

//   const initClock = useCallback(() => {
//     if (canvasRef.current && !clockRef.current) {
//       try {
//         clockRef.current = new CornerClockEngine(
//           canvasRef.current,
//           color,
//           backgroundColor
//         );
//       } catch (error) {
//         console.error("Failed to initialize corner clock:", error);
//       }
//     }
//   }, [canvasRef, color, backgroundColor]);

//   const destroyClock = useCallback(() => {
//     if (clockRef.current) {
//       clockRef.current.destroy();
//       clockRef.current = null;
//     }
//   }, []);

//   useEffect(() => {
//     initClock();
//     return destroyClock;
//   }, [initClock, destroyClock]);

//   // Update colors when props change
//   useEffect(() => {
//     if (clockRef.current) {
//       clockRef.current.setColor(color);
//       clockRef.current.setBackgroundColor(backgroundColor);
//     }
//   }, [color, backgroundColor]);

//   return clockRef.current;
// };

import { useRef, useEffect, useCallback, useState } from "react";

// Type definitions
interface SegmentPosition {
  [key: string]: [number, number, number, number]; // [x, y, width, height]
}

interface DigitPattern {
  [key: string]: string[];
}

interface CornerClockOptions {
  color?: string;
  backgroundColor?: string;
  format?: "12h" | "24h";
  showSeconds?: boolean;
}

interface CornerClockMethods {
  stop: () => void;
  start: () => void;
  setColor: (color: string) => void;
  setBackgroundColor: (backgroundColor: string) => void;
  getCurrentTime: () => string;
  isRunning: () => boolean;
}

// Enhanced CornerClock class for React
class CornerClockEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private scale: number;
  private digitHeight: number;
  private x: number;
  private y: number;
  private animationId: number | null = null;
  private resizeTimeout: number | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private color: string;
  private backgroundColor: string;
  private format: "12h" | "24h";
  private showSeconds: boolean;
  private isDestroyed: boolean = false;

  constructor(canvas: HTMLCanvasElement, options: CornerClockOptions = {}) {
    this.canvas = canvas;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Could not get 2D rendering context from canvas");
    }
    this.ctx = context;

    // Initialize options
    this.color = options.color || "#D1D1D6";
    this.backgroundColor = options.backgroundColor || "#1A1A1E";
    this.format = options.format || "24h";
    this.showSeconds = options.showSeconds !== false; // default true

    // Initialize properties
    this.scale = 1;
    this.digitHeight = 10;
    this.x = 0;
    this.y = 0;

    this.resize();
    this.setupResize();
    this.animate();
  }

  private resize = (): void => {
    if (this.isDestroyed) return;

    const parent = this.canvas.parentElement;
    if (!parent) {
      console.warn("Canvas has no parent element");
      return;
    }

    // const rect: DOMRect = parent.getBoundingClientRect();
    const rect = {
      width: parent.offsetWidth,
      height: parent.offsetHeight,
    };

    // Handle device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    // Scale context
    this.ctx.scale(dpr, dpr);

    // Set CSS size
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;

    // Calculate display metrics
    const baseWidth = this.showSeconds ? 160 : 110;
    this.scale = Math.min(rect.width / baseWidth, rect.height / 40);
    this.digitHeight = 10 * this.scale;

    const clockWidth = this.showSeconds ? 60 * this.scale : 40 * this.scale;
    this.x = rect.width / 2 - clockWidth;
    this.y = rect.height / 2;
  };

  private setupResize(): void {
    // Use ResizeObserver for better performance
    if (window.ResizeObserver && this.canvas.parentElement) {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.resizeTimeout) {
          clearTimeout(this.resizeTimeout);
        }
        this.resizeTimeout = window.setTimeout(this.resize, 100);
      });

      this.resizeObserver.observe(this.canvas.parentElement);
    } else {
      // Fallback to window resize
      window.addEventListener("resize", this.resize);
    }
  }

  private drawDigit(digit: string, x: number, y: number): void {
    const w: number = 2 * this.scale;
    const h: number = this.digitHeight;
    const gap: number = 1 * this.scale;

    this.ctx.fillStyle = this.color;

    // Segment positions
    const segments: SegmentPosition = {
      a: [x + gap, y - h, h - 2 * gap, w], // top
      b: [x + h, y - h + gap, w, h - 2 * gap], // top right
      c: [x + h, y + gap, w, h - 2 * gap], // bottom right
      d: [x + gap, y + h, h - 2 * gap, w], // bottom
      e: [x, y + gap, w, h - 2 * gap], // bottom left
      f: [x, y - h + gap, w, h - 2 * gap], // top left
      g: [x + gap, y, h - 2 * gap, w], // middle
    };

    const patterns: DigitPattern = {
      "0": ["a", "b", "c", "d", "e", "f"],
      "1": ["b", "c"],
      "2": ["a", "b", "g", "e", "d"],
      "3": ["a", "b", "g", "c", "d"],
      "4": ["f", "g", "b", "c"],
      "5": ["a", "f", "g", "c", "d"],
      "6": ["a", "f", "g", "e", "d", "c"],
      "7": ["a", "b", "c"],
      "8": ["a", "b", "c", "d", "e", "f", "g"],
      "9": ["a", "b", "c", "d", "f", "g"],
    };

    const pattern = patterns[digit];
    if (pattern) {
      pattern.forEach((seg: string) => {
        const segmentData = segments[seg];
        if (segmentData) {
          const [sx, sy, sw, sh] = segmentData;
          this.ctx.fillRect(sx, sy, sw, sh);
        }
      });
    }
  }

  private drawColon(x: number, y: number): void {
    const size: number = 1.5 * this.scale;
    const offset: number = 3 * this.scale;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(x, y - offset, size, size);
    this.ctx.fillRect(x, y + offset, size, size);
  }

  private formatTime(date: Date): {
    hours: string;
    minutes: string;
    seconds: string;
  } {
    let hours = date.getHours();

    if (this.format === "12h") {
      hours = hours % 12 || 12; // Convert to 12-hour format
    }

    return {
      hours: String(hours).padStart(2, "0"),
      minutes: String(date.getMinutes()).padStart(2, "0"),
      seconds: String(date.getSeconds()).padStart(2, "0"),
    };
  }

  private animate = (): void => {
    if (this.isDestroyed) return;

    const now: Date = new Date();
    const { hours, minutes, seconds } = this.formatTime(now);

    // Clear canvas
    const rect = this.canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      this.ctx.fillStyle = this.backgroundColor;
      this.ctx.fillRect(0, 0, rect.width, rect.height);
    }

    // Draw time
    let x: number = this.x;
    const digitWidth: number = 15 * this.scale;
    const colonWidth: number = 6 * this.scale;

    // Hours
    this.drawDigit(hours[0], x, this.y);
    x += digitWidth;
    this.drawDigit(hours[1], x, this.y);
    x += digitWidth;

    // Colon
    this.drawColon(x + 2 * this.scale, this.y);
    x += colonWidth;

    // Minutes
    this.drawDigit(minutes[0], x, this.y);
    x += digitWidth;
    this.drawDigit(minutes[1], x, this.y);
    x += digitWidth;

    // Seconds (if enabled)
    if (this.showSeconds) {
      // Colon
      this.drawColon(x + 2 * this.scale, this.y);
      x += colonWidth;

      // Seconds
      this.drawDigit(seconds[0], x, this.y);
      x += digitWidth;
      this.drawDigit(seconds[1], x, this.y);
    }

    this.animationId = requestAnimationFrame(this.animate);
  };

  // Public methods
  public stop(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  public start(): void {
    if (!this.animationId && !this.isDestroyed) {
      this.animate();
    }
  }

  public setColor(color: string): void {
    this.color = color;
  }

  public setBackgroundColor(backgroundColor: string): void {
    this.backgroundColor = backgroundColor;
  }

  public setFormat(format: "12h" | "24h"): void {
    this.format = format;
  }

  public setShowSeconds(show: boolean): void {
    this.showSeconds = show;
    this.resize(); // Recalculate layout
  }

  public getCurrentTime(): string {
    const now = new Date();
    const { hours, minutes, seconds } = this.formatTime(now);
    return this.showSeconds
      ? `${hours}:${minutes}:${seconds}`
      : `${hours}:${minutes}`;
  }

  public isRunning(): boolean {
    return this.animationId !== null;
  }

  public destroy(): void {
    this.isDestroyed = true;
    this.stop();

    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = null;
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    } else {
      window.removeEventListener("resize", this.resize);
    }
  }
}

// Custom React Hook
export function useCornerClock(
  options: CornerClockOptions = {}
): [React.RefObject<HTMLCanvasElement | null>, CornerClockMethods | null, boolean] {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clockRef = useRef<CornerClockEngine | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize clock
  const initializeClock = useCallback(() => {
    if (canvasRef.current && !clockRef.current) {
      try {
        clockRef.current = new CornerClockEngine(canvasRef.current, options);
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to initialize corner clock:", error);
        setIsInitialized(false);
      }
    }
  }, [options]);

  // Cleanup clock
  const destroyClock = useCallback(() => {
    if (clockRef.current) {
      clockRef.current.destroy();
      clockRef.current = null;
      setIsInitialized(false);
    }
  }, []);

  // Effect for initialization and cleanup
  useEffect(() => {
    initializeClock();
    return destroyClock;
  }, [initializeClock, destroyClock]);

  // Update options when they change
  useEffect(() => {
    if (clockRef.current) {
      if (options.color) {
        clockRef.current.setColor(options.color);
      }
      if (options.backgroundColor) {
        clockRef.current.setBackgroundColor(options.backgroundColor);
      }
      if (options.format) {
        clockRef.current.setFormat(options.format);
      }
      if (options.showSeconds !== undefined) {
        clockRef.current.setShowSeconds(options.showSeconds);
      }
    }
  }, [
    options.color,
    options.backgroundColor,
    options.format,
    options.showSeconds,
  ]);

  // Create methods object
  const methods: CornerClockMethods | null = clockRef.current
    ? {
        stop: () => clockRef.current?.stop(),
        start: () => clockRef.current?.start(),
        setColor: (color: string) => clockRef.current?.setColor(color),
        setBackgroundColor: (backgroundColor: string) =>
          clockRef.current?.setBackgroundColor(backgroundColor),
        getCurrentTime: () => clockRef.current?.getCurrentTime() || "",
        isRunning: () => clockRef.current?.isRunning() || false,
      }
    : null;

  return [canvasRef, methods, isInitialized];
}

// Additional hook for simple time display
export function useCornerClockTime(
  options: CornerClockOptions = {}
): [React.RefObject<HTMLCanvasElement | null>, string, boolean] {
  const [canvasRef, methods, isInitialized] = useCornerClock(options);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    if (!methods) return;

    const updateTime = () => {
      setCurrentTime(methods.getCurrentTime());
    };

    // Update time immediately
    updateTime();

    // Update time every second
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [methods]);

  return [canvasRef, currentTime, isInitialized];
}

// Hook for clock with custom controls
export function useCornerClockWithControls(
  initialOptions: CornerClockOptions = {}
): [
  React.RefObject<HTMLCanvasElement | null>,
  CornerClockMethods | null,
  boolean,
  {
    toggleFormat: () => void;
    toggleSeconds: () => void;
    changeColor: (color: string) => void;
    currentOptions: CornerClockOptions;
  }
] {
  const [options, setOptions] = useState<CornerClockOptions>(initialOptions);
  const [canvasRef, methods, isInitialized] = useCornerClock(options);

  const toggleFormat = useCallback(() => {
    setOptions((prev) => ({
      ...prev,
      format: prev.format === "12h" ? "24h" : "12h",
    }));
  }, []);

  const toggleSeconds = useCallback(() => {
    setOptions((prev) => ({
      ...prev,
      showSeconds: !prev.showSeconds,
    }));
  }, []);

  const changeColor = useCallback((color: string) => {
    setOptions((prev) => ({
      ...prev,
      color,
    }));
  }, []);

  const controls = {
    toggleFormat,
    toggleSeconds,
    changeColor,
    currentOptions: options,
  };

  return [canvasRef, methods, isInitialized, controls];
}

export default useCornerClock;
