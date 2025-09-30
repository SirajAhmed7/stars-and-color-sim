"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import HangingSocials from "../hangingSocials/HangingSocials";
import fluidSimulation from "./fluidSimulation.js";
import fluidSimulationGyro from "./fluidSimulationGyro.js";

// Type definitions
type CleanupFunction = () => void;

type SimulationFunction = (
  wrapper: HTMLElement,
  canvas: HTMLCanvasElement
) => CleanupFunction;

type Breakpoint = "desktop" | "mobile";

interface FluidSimProps {
  className?: string;
}

const FluidSim: React.FC<FluidSimProps> = ({ className = "" }) => {
  const cleanupRef = useRef<CleanupFunction | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentBreakpointRef = useRef<Breakpoint | null>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to determine which simulation to use
  const getSimulationFunction = useCallback((): SimulationFunction | null => {
    if (typeof window === "undefined") return null;
    return window.innerWidth >= 768 ? fluidSimulation : fluidSimulationGyro; // mobileFluidSimulation
  }, []);

  // Function to initialize the appropriate simulation
  const initializeSimulation = useCallback((): void => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;

    if (!wrapper || !canvas) {
      console.warn("Wrapper or canvas element not found");
      return;
    }

    // Clean up existing simulation first
    if (cleanupRef.current) {
      try {
        cleanupRef.current();
        cleanupRef.current = null;
      } catch (error) {
        console.error("Error during cleanup:", error);
      }
    }

    const simulationFunction = getSimulationFunction();
    const currentBreakpoint: Breakpoint =
      typeof window !== "undefined" && window.innerWidth >= 768
        ? "desktop"
        : "mobile";

    if (simulationFunction) {
      try {
        // Initialize the simulation and store the cleanup function
        cleanupRef.current = simulationFunction(wrapper, canvas);
        currentBreakpointRef.current = currentBreakpoint;

        console.log(`Initialized ${currentBreakpoint} fluid simulation`);
      } catch (error) {
        console.error("Failed to initialize fluid simulation:", error);
        cleanupRef.current = null;
      }
    } else {
      // For mobile, you might want to show a static version or different content
      currentBreakpointRef.current = currentBreakpoint;
      console.log("Mobile simulation not available, showing static version");
    }
  }, [getSimulationFunction]);

  // Debounced resize handler
  const handleResize = useCallback((): void => {
    if (typeof window === "undefined") return;

    const currentBreakpoint: Breakpoint =
      window.innerWidth >= 768 ? "desktop" : "mobile";

    // Only reinitialize if the breakpoint actually changed
    if (currentBreakpointRef.current !== currentBreakpoint) {
      console.log(
        `Breakpoint changed from ${currentBreakpointRef.current} to ${currentBreakpoint}`
      );
      initializeSimulation();
    }
  }, [initializeSimulation]);

  // Debounced resize effect
  useEffect(() => {
    const debouncedResize = (): void => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(handleResize, 250);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", debouncedResize);
    }

    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", debouncedResize);
      }
    };
  }, [handleResize]);

  // Main initialization effect
  useEffect(() => {
    // Small delay to ensure DOM is ready
    initTimeoutRef.current = setTimeout(initializeSimulation, 100);

    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
    };
  }, [initializeSimulation]);

  // Cleanup effect on unmount
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        console.log("Cleaning up fluid simulation on unmount");
        try {
          cleanupRef.current();
          cleanupRef.current = null;
        } catch (error) {
          console.error("Error during unmount cleanup:", error);
        }
      }
    };
  }, []);

  // Visibility change handler (cleanup when tab becomes hidden)
  useEffect(() => {
    const handleVisibilityChange = (): void => {
      if (typeof document === "undefined") return;

      if (document.hidden && cleanupRef.current) {
        // Optionally pause or cleanup when tab is hidden for performance
        console.log("Tab hidden, consider pausing simulation");
        // Uncomment below if you want to fully cleanup when hidden
        // cleanupRef.current();
        // cleanupRef.current = null;
      } else if (!document.hidden && !cleanupRef.current) {
        // Reinitialize when tab becomes visible again
        initializeSimulation();
      }
    };

    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    return () => {
      if (typeof document !== "undefined") {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      }
    };
  }, [initializeSimulation]);

  return (
    <div
      className={`fluid-sim interactable absolute top-0 left-0 w-full h-full bg-background max-md:-z-10 ${className}`}
    >
      <div
        ref={wrapperRef}
        id="fluid-sim-wrapper"
        className="absolute max-md:h-[calc(100vh-(var(--frame-size)*2))] left-[var(--frame-size)] right-[var(--frame-size)] md:top-0 bottom-[var(--frame-size)] overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          id="fluid-sim-canvas"
          className="absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-1/2 md:-translate-x-[53%] md:-translate-y-[43%]"
          aria-label="Interactive fluid simulation canvas"
        />
        <HangingSocials />
      </div>

      <div className="hidden md:block absolute w-[100%] h-[22%] md:h-[41%] bottom-0 left-1/2 -translate-x-1/2 -translate-y-[7%] pointer-events-none">
        <Image
          src="/images/diamond-obstacle-top.png"
          alt="rare studio logo"
          fill
          className="w-full h-full object-contain"
          priority
        />
      </div>
    </div>
  );
};

export default FluidSim;
