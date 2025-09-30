"use client";

import { cn } from "@/utils/utils";
import Link from "next/link";
import HoverTextScramble from "../interactions/HoverTextScramble";
import { useState } from "react";
import { hoverBtnAudio } from "../Audio/audio";

interface ButtonProps {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  type?: "submit" | "button";
  onClick?: () => void;
  asLink?: boolean;
  href?: string;
  target?: "_self" | "_blank";
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

function Button({
  variant = "primary",
  type = "submit",
  size = "md",
  onClick,
  asLink,
  href,
  target = "_self",
  className,
  disabled,
  children,
}: ButtonProps) {
  const [isMouseOver, setIsMouseOver] = useState(false);

  const variantClasses = {
    primary: "bg-white",
    secondary: "bg-gray-800 text-white",
    outline: "bg-transparent border border-white",
  };

  const sizeClasses = {
    sm: "",
    md: "px-8 py-2",
    lg: "px-10 py-4 text-2xl",
  };

  function handleMouseEnter() {
    setIsMouseOver(true);
    hoverBtnAudio.play();
  }

  function handleMouseLeave() {
    setIsMouseOver(false);
  }

  if (asLink)
    return (
      <Link
        className={cn(
          "text-xl text-gray-950 font-harmond font-extrabold flex items-center gap-5 overflow-hidden",
          "px-8 py-2 justify-center",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        href={href!}
        target={target}
      >
        <HoverTextScramble
          fontClass="font-harmond"
          // stayCentered
          externalHover={isMouseOver}
        >
          {children}
        </HoverTextScramble>

        {/* {Icon ? (
          <div
            className={cn(
              "flex items-center justify-center aspect-square rounded-full shrink-0 h-7 lg:h-9",
              iconWrapperClasses[variant]
            )}
          >
            {Icon}
          </div>
        ) : null} */}
      </Link>
    );

  return (
    <button
      className={cn(
        "text-xl text-gray-950 font-harmond font-extrabold flex items-center gap-5 overflow-hidden",
        "px-8 py-2 justify-center",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      <HoverTextScramble
        fontClass="font-harmond"
        // stayCentered
        externalHover={isMouseOver}
      >
        {children}
      </HoverTextScramble>
      {/* {Icon ? (
        <div
          className={cn(
            "flex items-center justify-center aspect-square rounded-full shrink-0 h-9",
            iconWrapperClasses[variant]
          )}
        >
          {Icon}
        </div>
      ) : null} */}
    </button>
  );
}

export default Button;
