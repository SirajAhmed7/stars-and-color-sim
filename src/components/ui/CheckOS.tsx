"use client";

import { useLayoutEffect, useState } from "react";

function CheckOS() {
  const [detectedOS, setOS] = useState("");

  useLayoutEffect(() => {
    const detectOS = async () => {
      // Modern approach with User-Agent Client Hints
      if (navigator.userAgentData) {
        try {
          const platformInfo =
            await navigator.userAgentData.getHighEntropyValues(["platform"]);
          const platform = platformInfo.platform?.toLowerCase();

          if (!platform) return;

          if (platform.includes("mac")) {
            setOS("mac");
            // detectedOS = "mac";
            document.body.classList.add("mac-os");
          } else if (platform.includes("win")) {
            setOS("windows");
            // detectedOS = "windows";
            document.body.classList.add("windows-os");
          } else if (platform.includes("linux")) {
            setOS("linux");
            // detectedOS = "linux";
            document.body.classList.add("linux-os");
          }
        } catch (error) {
          // Fallback if permission denied
          fallbackDetection();
        }
      } else {
        // Fallback for browsers that don't support userAgentData
        fallbackDetection();
      }
    };

    const fallbackDetection = () => {
      const userAgent = navigator.userAgent.toLowerCase();

      if (userAgent.includes("mac")) {
        setOS("mac");
        // detectedOS = "mac";
        document.body.classList.add("mac-os");
      } else if (userAgent.includes("win")) {
        setOS("windows");
        // detectedOS = "windows";
        document.body.classList.add("windows-os");
      } else if (userAgent.includes("linux")) {
        setOS("linux");
        // detectedOS = "linux";
        document.body.classList.add("linux-os");
      }
    };

    detectOS();
  }, []);

  useLayoutEffect(
    function () {
      document.documentElement.style.setProperty(
        "--is-mac",
        detectedOS === "mac" ? "1" : "0"
      );
    },
    [detectedOS]
  );

  return null;
}

export default CheckOS;
