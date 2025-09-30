"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function SdVideo() {
  useGSAP(() => {
    let timeout: number;

    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 1024px)",
      (context: gsap.Context, contextSafe?: gsap.ContextSafeFunc) => {
        if (!contextSafe) return;

        const delayedAnimation = contextSafe(() => {
          gsap.set(".sd-video", {
            y: "25vh",
            z: 200,
          });

          gsap.to(".sd-video", {
            scrollTrigger: {
              trigger: ".sd-video-container-outer",
              start: "top 50%",
              end: "top top",
              scrub: true,
            },
            z: 0,
            y: 0,
          });
        });

        timeout = setTimeout(delayedAnimation, 300);
      }
    );

    return () => {
      clearTimeout(timeout);
    };
  });

  return (
    <div className="sd-video-container-outer absolute top-0 left-0 h-screen w-full">
      <div
        className="absolute w-4/5 md:w-full h-[50%] md:h-[60%] lg:h-[80%] top-[20%] md:top-1/2 left-1/2 md:left-0 max-md:-translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          transformStyle: "preserve-3d",
          perspective: 200,
        }}
      >
        <video
          muted
          autoPlay
          loop
          controls={false}
          // src="/videos/home-diamond-2.mp4"
          className="sd-video w-full h-full object-contain"
          playsInline
          // style={{
          //   transform: "translate3d(0, 25vh, 200px)",
          // }}
        >
          <source src="/videos/home-diamond-2.webm" type="video/webm" />
          <source src="/videos/home-diamond-2.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}

export default SdVideo;
