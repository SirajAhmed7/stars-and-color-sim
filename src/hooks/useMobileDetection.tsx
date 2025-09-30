"use client";

import { useState, useEffect } from "react";

export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      let isMobileUA;

      if (navigator.userAgentData) {
        try {
          isMobileUA = navigator.userAgentData.mobile;
        } catch (error) {
          // Check both user agent and screen size
          const userAgent = navigator.userAgent.toLowerCase();
          isMobileUA =
            /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
              userAgent
            );
        }
      } else {
        const userAgent = navigator.userAgent.toLowerCase();
        isMobileUA =
          /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
            userAgent
          );
      }

      const isSmallScreen = window.innerWidth <= 768; // Adjust breakpoint as needed

      console.log("Is mobile", isMobileUA || isSmallScreen);

      return isMobileUA || isSmallScreen;
    };

    const handleResize = () => {
      setIsMobile(checkIsMobile());
    };

    // Initial check
    setIsMobile(checkIsMobile());
    setIsLoaded(true);

    // Listen for resize events
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { isMobile, isLoaded };
};
