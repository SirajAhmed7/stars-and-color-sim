import { ForwardedRef, forwardRef, useEffect, useRef } from "react";

type CardShimmerProps = {
  colors?: string[];
};

const CardShimmer = forwardRef(function CardShimmer(
  { colors = ["#e0f2fe", "#7dd3fc", "#0ea5e9"] }: CardShimmerProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    interface PixelAnimationOptions {
      colors?: string[];
      gap?: number;
      speed?: number;
      noFocus?: boolean;
      container?: HTMLElement;
    }

    type AnimationFunction = "appear" | "disappear";

    class Pixel {
      private width: number;
      private height: number;
      private ctx: CanvasRenderingContext2D;
      private x: number;
      private y: number;
      private color: string;
      private speed: number;
      private size: number;
      private sizeStep: number;
      private minSize: number;
      private maxSizeInteger: number;
      private maxSize: number;
      private delay: number;
      private counter: number;
      private counterStep: number;
      public isIdle: boolean;
      private isReverse: boolean;
      private isShimmer: boolean;
      private shimmerCycles: number; // Track shimmer cycles
      private maxShimmerCycles: number; // Limit shimmer cycles

      constructor(
        canvas: HTMLCanvasElement,
        context: CanvasRenderingContext2D,
        x: number,
        y: number,
        color: string,
        speed: number,
        delay: number
      ) {
        this.width = canvas.width;
        this.height = canvas.height;
        this.ctx = context;
        this.x = x;
        this.y = y;
        this.color = color;
        this.speed = this.getRandomValue(0.1, 0.9) * speed;
        this.size = 0;
        this.sizeStep = Math.random() * 0.4;
        this.minSize = 0.5;
        this.maxSizeInteger = 2;
        this.maxSize = this.getRandomValue(this.minSize, this.maxSizeInteger);
        this.delay = delay;
        this.counter = 0;
        this.counterStep =
          Math.random() * 4 + (this.width + this.height) * 0.01;
        this.isIdle = false;
        this.isReverse = false;
        this.isShimmer = false;
        this.shimmerCycles = 0;
        this.maxShimmerCycles = this.getRandomValue(2, 5); // Random cycles between 2-5
      }

      private getRandomValue(min: number, max: number): number {
        return Math.random() * (max - min) + min;
      }

      private draw(): void {
        const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5;

        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(
          this.x + centerOffset,
          this.y + centerOffset,
          this.size,
          this.size
        );
      }

      public appear(): void {
        this.isIdle = false;

        if (this.counter <= this.delay) {
          this.counter += this.counterStep;
          return;
        }

        if (this.size >= this.maxSize && !this.isShimmer) {
          this.isShimmer = true;
          this.shimmerCycles = 0; // Reset cycle counter
        }

        if (this.isShimmer) {
          if (this.shimmerCycles >= this.maxShimmerCycles) {
            // Stop shimmering and stay at a stable size
            this.isShimmer = false;
            this.size = this.maxSize * 0.8; // Set to a stable size
            this.isIdle = true;
          } else {
            this.shimmer();
          }
        } else {
          this.size += this.sizeStep;
          // Clamp size to prevent overshooting
          this.size = Math.min(this.size, this.maxSize);
        }

        this.draw();
      }

      public disappear(): void {
        this.isShimmer = false;
        this.counter = 0;
        this.shimmerCycles = 0; // Reset shimmer cycles

        if (this.size <= 0) {
          this.isIdle = true;
          this.size = 0; // Ensure size doesn't go negative
          return;
        } else {
          this.size -= 0.1;
          // Clamp size to prevent going negative
          this.size = Math.max(this.size, 0);
        }

        this.draw();
      }

      private shimmer(): void {
        // More controlled shimmer with proper bounds
        if (this.size >= this.maxSize && !this.isReverse) {
          this.isReverse = true;
        } else if (this.size <= this.minSize && this.isReverse) {
          this.isReverse = false;
          this.shimmerCycles++; // Increment cycle count when completing a full cycle
        }

        // Apply size change with bounds checking
        if (this.isReverse) {
          this.size -= this.speed;
          this.size = Math.max(this.size, this.minSize); // Prevent going below minimum
        } else {
          this.size += this.speed;
          this.size = Math.min(this.size, this.maxSize); // Prevent going above maximum
        }
      }

      // Reset method for restarting animation
      public reset(): void {
        this.size = 0;
        this.counter = 0;
        this.isIdle = false;
        this.isReverse = false;
        this.isShimmer = false;
        this.shimmerCycles = 0;
      }
    }

    class PixelAnimation {
      private canvas: HTMLCanvasElement;
      private ctx: CanvasRenderingContext2D;
      private container: HTMLElement;
      private colors: string[];
      private gap: number;
      private speed: number;
      private noFocus: boolean;
      private pixels: Pixel[];
      private timeInterval: number;
      private timePrevious: number;
      private animation: number | null;
      private reducedMotion: boolean;
      private resizeObserver: ResizeObserver | null;
      private currentAnimation: AnimationFunction | null; // Track current animation
      private boundHandlers: {
        mouseenter: () => void;
        mouseleave: () => void;
        focusin: (e: FocusEvent) => void;
        focusout: (e: FocusEvent) => void;
      };

      constructor(
        canvas: HTMLCanvasElement,
        options: PixelAnimationOptions = {}
      ) {
        // Validate canvas context
        const context = canvas.getContext("2d");
        if (!context) {
          throw new Error("Unable to get 2D context from canvas");
        }

        this.canvas = canvas;
        this.ctx = context;
        this.container =
          options.container || canvas.parentElement || document.body;

        // Configuration options
        this.colors = options.colors || ["#f8fafc", "#f1f5f9", "#cbd5e1"];
        this.gap = this.clamp(options.gap || 5, 4, 50);
        this.speed = this.calculateSpeed(options.speed || 35);
        this.noFocus = options.noFocus || false;

        // Animation properties
        this.pixels = [];
        this.timeInterval = 1000 / 60;
        this.timePrevious = performance.now();
        this.animation = null;
        this.currentAnimation = null;
        this.reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;
        this.resizeObserver = null;

        // Initialize bound handlers
        this.boundHandlers = {
          mouseenter: () => {
            this.handleAnimation("appear");
          },
          mouseleave: () => this.handleAnimation("disappear"),
          focusin: (e: FocusEvent) => {
            if (this.container.contains(e.relatedTarget as Node)) return;
            this.handleAnimation("appear");
          },
          focusout: (e: FocusEvent) => {
            if (this.container.contains(e.relatedTarget as Node)) return;
            this.handleAnimation("disappear");
          },
        };

        this.init();
        this.setupEventListeners();
        this.setupResizeObserver();
      }

      private clamp(value: number, min: number, max: number): number {
        if (value <= min) return min;
        if (value >= max) return max;
        return parseInt(value.toString());
      }

      private calculateSpeed(value: number): number {
        const min = 0;
        const max = 100;
        const throttle = 0.001;

        if (value <= min || this.reducedMotion) {
          return min;
        } else if (value >= max) {
          return max * throttle;
        } else {
          return parseInt(value.toString()) * throttle;
        }
      }

      private init(): void {
        const rect = this.canvas.getBoundingClientRect();
        const width = Math.floor(rect.width);
        const height = Math.floor(rect.height);

        this.pixels = [];
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
        this.createPixels();
      }

      private getDistanceToCanvasCenter(x: number, y: number): number {
        const dx = x - this.canvas.width / 2;
        const dy = y - this.canvas.height / 2;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance;
      }

      private createPixels(): void {
        for (let x = 0; x < this.canvas.width; x += this.gap) {
          for (let y = 0; y < this.canvas.height; y += this.gap) {
            const color =
              this.colors[Math.floor(Math.random() * this.colors.length)];
            const delay = this.reducedMotion
              ? 0
              : this.getDistanceToCanvasCenter(x, y);

            this.pixels.push(
              new Pixel(this.canvas, this.ctx, x, y, color, this.speed, delay)
            );
          }
        }
      }

      private setupEventListeners(): void {
        this.container.addEventListener(
          "mouseenter",
          this.boundHandlers.mouseenter
        );
        this.container.addEventListener(
          "mouseleave",
          this.boundHandlers.mouseleave
        );

        if (!this.noFocus) {
          this.container.addEventListener(
            "focusin",
            this.boundHandlers.focusin
          );
          this.container.addEventListener(
            "focusout",
            this.boundHandlers.focusout
          );
        }
      }

      private setupResizeObserver(): void {
        this.resizeObserver = new ResizeObserver(() => this.init());
        this.resizeObserver.observe(this.canvas);
      }

      private handleAnimation(name: AnimationFunction): void {
        // Prevent redundant animations
        if (this.currentAnimation === name) return;

        this.currentAnimation = name;

        if (this.animation) {
          cancelAnimationFrame(this.animation);
        }

        // Reset pixels if switching from disappear to appear
        if (name === "appear") {
          this.pixels.forEach((pixel) => {
            if (pixel.isIdle) {
              pixel.reset();
            }
          });
        }

        this.animate(name);
      }

      private animate(fnName: AnimationFunction): void {
        this.animation = requestAnimationFrame(() => this.animate(fnName));

        const timeNow = performance.now();
        const timePassed = timeNow - this.timePrevious;

        if (timePassed < this.timeInterval) return;

        this.timePrevious = timeNow - (timePassed % this.timeInterval);

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.pixels.length; i++) {
          this.pixels[i][fnName]();
        }

        // Check if all pixels are idle and stop animation
        if (this.pixels.every((pixel) => pixel.isIdle)) {
          cancelAnimationFrame(this.animation);
          this.animation = null;
          this.currentAnimation = null;
        }
      }

      // Public methods for manual control
      public appear(): void {
        this.handleAnimation("appear");
      }

      public disappear(): void {
        this.handleAnimation("disappear");
      }

      // Getter methods for accessing configuration
      public getColors(): string[] {
        return [...this.colors];
      }

      public getGap(): number {
        return this.gap;
      }

      public getSpeed(): number {
        return this.speed;
      }

      public isAnimating(): boolean {
        return this.animation !== null;
      }

      // Update methods for dynamic configuration
      public updateColors(colors: string[]): void {
        this.colors = colors;
        this.init(); // Reinitialize with new colors
      }

      public updateGap(gap: number): void {
        this.gap = this.clamp(gap, 4, 50);
        this.init(); // Reinitialize with new gap
      }

      public updateSpeed(speed: number): void {
        this.speed = this.calculateSpeed(speed);
        // Update existing pixels
        this.pixels.forEach((pixel) => {
          // Note: This requires making speed property public in Pixel class
          // or adding a method to update it
        });
      }

      // Cleanup method
      public destroy(): void {
        if (this.animation) {
          cancelAnimationFrame(this.animation);
          this.animation = null;
        }

        if (this.resizeObserver) {
          this.resizeObserver.disconnect();
          this.resizeObserver = null;
        }

        this.container.removeEventListener(
          "mouseenter",
          this.boundHandlers.mouseenter
        );
        this.container.removeEventListener(
          "mouseleave",
          this.boundHandlers.mouseleave
        );

        if (!this.noFocus) {
          this.container.removeEventListener(
            "focusin",
            this.boundHandlers.focusin
          );
          this.container.removeEventListener(
            "focusout",
            this.boundHandlers.focusout
          );
        }

        this.pixels = [];
        this.currentAnimation = null;
      }
    }

    if (!canvasRef.current) return;

    const canvas = canvasRef.current;

    let container: HTMLElement | undefined;

    if (ref && typeof ref !== "function" && ref.current) {
      // Now you can safely use ref.current
      container = ref.current;
    }

    const pixelAnimation = new PixelAnimation(canvas, {
      // colors: ["#e0f2fe", "#7dd3fc", "#0ea5e9"],
      colors,
      gap: 8,
      speed: 50,
      noFocus: false,
      container,
    });

    // Cleanup function
    return () => {
      pixelAnimation.destroy();
    };
  }, [ref, colors]);

  return (
    <div className="absolute inset-0">
      <div className="absolute top-[6%] bottom-[36%] inset-x-[14.5%] bg-background/90 z-0 blur-xl"></div>
      <canvas ref={canvasRef} className="block w-full h-full"></canvas>
    </div>
  );
});

export default CardShimmer;
