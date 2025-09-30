"use client";

import { cn } from "@/utils/utils";
import { useState, useEffect } from "react";

export default function DigitalClock({ className }: { className?: string }) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      // Format time (HH:MM:SS)
      const timeString = now.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      // Format date
      const dateString = now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      setTime(timeString);
      setDate(dateString);
    };

    // Update immediately
    updateTime();

    // Update every second
    const interval = setInterval(updateTime, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={cn(
        "font-dseg-light text-[1.3vw] leading-none font-bold text-gray-300 tracking-wider",
        className
      )}
      // style={{
      //   textShadow: "0 0 20px currentColor, 0 0 40px currentColor",
      // }}
    >
      {time || "88:88:88"}
    </div>
  );
}
