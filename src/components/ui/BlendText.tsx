"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

function BlendText({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const portalTarget = document.getElementById("blend-text-container");
  if (!portalTarget) return null;

  return createPortal(
    <div
      className={`absolute mix-blend-exclusion pointer-events-auto ${className}`}
      style={style}
    >
      {children}
    </div>,
    portalTarget
  );
}

export default BlendText;
