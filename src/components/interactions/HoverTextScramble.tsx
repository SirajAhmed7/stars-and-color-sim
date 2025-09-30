"use client";

import { cn } from "@/utils/utils";
import { useCallback, useEffect, useRef } from "react";

function HoverTextScramble({
  fontClass = "font-roboto-flex",
  stayCentered,
  externalHover,
  children,
}: {
  fontClass?: string;
  stayCentered?: boolean;
  externalHover?: boolean;
  children: React.ReactNode;
}) {
  const spanRef = useRef<HTMLSpanElement>(null);

  const text = children?.toString() || "";
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  const scramble = useCallback(
    function scramble() {
      if (externalHover !== undefined && !externalHover) return;

      let prefix = "";
      let suffix = randomChars(text.length);

      function scrambleIteration() {
        let nextChar = text.charAt(prefix.length);

        prefix = prefix + nextChar;
        suffix = randomChars(text.length - prefix.length);
        if (spanRef.current) {
          spanRef.current.innerHTML = prefix + suffix;
        }
      }

      for (let i = 0; i < text.length; i++) {
        setTimeout(() => {
          scrambleIteration();
        }, 50 * i);
      }
    },
    [externalHover, text]
  );

  useEffect(
    function () {
      if (externalHover) scramble();
    },
    [externalHover, scramble]
  );

  function randomChars(length: number) {
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += `${charset[randomIndex]}`;
    }
    return result;
  }

  return (
    <div onMouseEnter={scramble} className="relative overflow-visible">
      <div className={`opacity-0 text-nowrap ${fontClass}`}>{children}</div>
      <span
        ref={spanRef}
        className={cn(
          "absolute inset-0 text-inherit text-nowrap",
          fontClass,
          stayCentered
            ? "inset-auto top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
            : ""
        )}
      >
        {text}
      </span>
    </div>
  );
}

export default HoverTextScramble;
