"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Hook to ensure ScrollTrigger is properly initialized in production environments
 * Handles timing issues that can occur when assets load differently than in development
 */
export function useScrollTriggerInit() {
  useEffect(() => {
    let refreshTimeouts: NodeJS.Timeout[] = [];
    let intervalId: NodeJS.Timeout;

    const clearAllTimeouts = () => {
      refreshTimeouts.forEach(clearTimeout);
      refreshTimeouts = [];
      if (intervalId) clearInterval(intervalId);
    };

    // Enhanced ScrollTrigger initialization for production
    const initScrollTrigger = () => {
      // Clear any existing refresh attempts
      clearAllTimeouts();

      // Initial refresh after DOM is ready
      refreshTimeouts.push(setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100));

      // Additional refreshes to handle different loading scenarios
      refreshTimeouts.push(setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500));

      refreshTimeouts.push(setTimeout(() => {
        ScrollTrigger.refresh();
      }, 1000));

      // Extended refresh for slow loading assets in production
      refreshTimeouts.push(setTimeout(() => {
        ScrollTrigger.refresh();
      }, 2000));

      // Periodic refresh for the first few seconds to handle dynamic content
      let refreshCount = 0;
      intervalId = setInterval(() => {
        if (refreshCount < 5) {
          ScrollTrigger.refresh();
          refreshCount++;
        } else {
          clearInterval(intervalId);
        }
      }, 1000);
    };

    // Listen for custom preloader complete event
    const handlePreloaderComplete = () => {
      // Delay to ensure ScrollSmoother is unpaused
      refreshTimeouts.push(setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100));

      refreshTimeouts.push(setTimeout(() => {
        ScrollTrigger.refresh();
      }, 300));

      refreshTimeouts.push(setTimeout(() => {
        ScrollTrigger.refresh();
      }, 600));
    };

    // Multiple initialization strategies for different loading states
    if (document.readyState === "complete") {
      initScrollTrigger();
    } else if (document.readyState === "interactive") {
      // DOM is loaded but resources might still be loading
      refreshTimeouts.push(setTimeout(initScrollTrigger, 100));
    } else {
      // Still loading
      window.addEventListener("DOMContentLoaded", initScrollTrigger);
      window.addEventListener("load", initScrollTrigger);
    }

    // Listen for ScrollSmoother ready event
    const handleScrollSmootherReady = () => {
      refreshTimeouts.push(setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100));
    };

    // Listen for custom events
    window.addEventListener("preloader-complete", handlePreloaderComplete);
    window.addEventListener("scrollsmoother-ready", handleScrollSmootherReady);
    
    // Also listen for navigation events
    const handleNavigation = () => {
      refreshTimeouts.push(setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200));
    };

    window.addEventListener("popstate", handleNavigation);

    // Cleanup
    return () => {
      clearAllTimeouts();
      window.removeEventListener("DOMContentLoaded", initScrollTrigger);
      window.removeEventListener("load", initScrollTrigger);
      window.removeEventListener("preloader-complete", handlePreloaderComplete);
      window.removeEventListener("scrollsmoother-ready", handleScrollSmootherReady);
      window.removeEventListener("popstate", handleNavigation);
    };
  }, []);
}