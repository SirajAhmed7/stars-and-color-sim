import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

interface SplitEffectProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  type: "image" | "video";
  className?: string;
  // Video specific props
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  poster?: string;
}

const SplitEffect: React.FC<SplitEffectProps> = ({
  src,
  type,
  className = "",
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  poster,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const enterTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const leaveTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // Initialize the layout and GSAP setup
  useGSAP(
    () => {
      // Set initial states
      if (bottomRef.current) {
        gsap.set(bottomRef.current, { transformOrigin: "50% 50%" });
      }
      if (topRef.current) {
        gsap.set(topRef.current, {
          willChange: "clip-path",
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        });
      }
    },
    { scope: containerRef }
  );

  const handleMouseEnter = (): void => {
    if (leaveTimelineRef.current) {
      leaveTimelineRef.current.kill();
    }

    enterTimelineRef.current = gsap
      .timeline({
        defaults: {
          duration: 0.8,
          ease: "power4",
        },
      })
      .set(bottomRef.current, { transformOrigin: "50% 50%" })
      .set(topRef.current, { willChange: "clip-path" })
      .fromTo(
        topRef.current,
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        },
        {
          clipPath: "polygon(100% 0%, 100% 0%, 0% 100%, 0% 100%)",
        },
        0
      )
      .fromTo(
        bottomRef.current,
        {
          skewX: 15,
          scale: 2,
          filter: "brightness(600%)",
        },
        {
          skewX: 0,
          scale: 1.1,
          filter: "brightness(100%)",
        },
        0
      );
  };

  const handleMouseLeave = (): void => {
    if (enterTimelineRef.current) {
      enterTimelineRef.current.kill();
    }

    leaveTimelineRef.current = gsap
      .timeline({
        defaults: {
          duration: 0.8,
          ease: "power4",
        },
      })
      .set(topRef.current, { willChange: "clip-path" })
      .to(
        topRef.current,
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        },
        0
      )
      .to(
        bottomRef.current,
        {
          filter: "brightness(600%)",
          skewX: 15,
          scale: 2,
          onComplete: (): void => {
            if (bottomRef.current) {
              gsap.set(bottomRef.current, {
                filter: "brightness(0%)",
              });
            }
          },
        },
        0
      );
  };

  const renderMedia = () => {
    if (type === "video") {
      return (
        <video
          className="w-full h-full object-cover"
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline={playsInline}
          // poster={poster}
          controls={false}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }

    return (
      <div
        className="w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${src})` }}
      />
    );
  };

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 cursor-pointer overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div ref={bottomRef} className="absolute inset-0">
        {renderMedia()}
      </div>
      <div ref={topRef} className="absolute inset-0">
        {renderMedia()}
      </div>
    </div>
  );
};

export default SplitEffect;
