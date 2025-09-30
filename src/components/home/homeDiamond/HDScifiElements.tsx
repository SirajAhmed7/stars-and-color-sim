"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

function HDScifiElements() {
  useGSAP(() => {
    const bars = gsap.utils.toArray<HTMLDivElement>(".hd-moving-bars");

    const tl = gsap.timeline({ paused: true });

    bars.forEach((bar) => {
      const delay = Math.random() * 0.3;
      tl.to(
        bar,
        {
          xPercent: 400 + Math.random() * 300,
          ease: "back.inOut(3)",
          duration: 1.2 + Math.max(0.2, Math.random() * 0.6),
          delay,
          repeat: -1,
          repeatDelay: delay,
          yoyo: true,
        },
        "<"
      );
    });

    tl.to(
      ".hd-bottom-middle-line",
      {
        xPercent: 70,
        ease: "power2.inOut",
        // duration: 1.2 + gsap.utils.clamp(0.2, Math.random() * 0.6, 0.6),
        duration: 0.8,
        delay: 0.2,
        repeat: -1,
        repeatDelay: 0.2,
        yoyo: true,
      },
      "<"
    );

    tl.to(
      ".hd-plus",
      {
        rotate: 270,
        ease: "power3.inOut",
        delay: 0.1,
        duration: 1.2,
        repeat: -1,
        repeatDelay: 0.1,
        yoyo: true,
      },
      "<"
    );

    tl.to(
      ".hd-top-left-vertical",
      {
        yPercent: 50,
        ease: "power2.inOut",
        // delay: 0.1,
        duration: 1,
        repeat: -1,
        repeatDelay: 0.1,
        yoyo: true,
      },
      "<"
    );

    tl.to(
      ".hd-top-left-horizontal",
      {
        xPercent: 50,
        ease: "power2.inOut",
        delay: 0.3,
        duration: 1,
        repeat: -1,
        repeatDelay: 0.3,
        yoyo: true,
      },
      "<"
    );

    const st = ScrollTrigger.create({
      trigger: ".home-diamond",
      start: "top bottom+=10%",
      end: "bottom top",
      onToggle: (self) => {
        if (self.isActive) {
          tl.play();
        } else {
          tl.pause();
        }
      },
    });

    return () => {
      st.kill();
      tl.kill();
    };
  });

  return (
    <div className="hd-scifi-el-container absolute inset-0 h-full w-full -z-20 pointer-events-none overflow-hidden">
      {/* Top left */}
      {/* <div className="hd-top-left-vertical absolute top-20 left-0 -translate-x-1/3 h-1p w-96 bg-gray-800 rotate-90"></div> */}
      <div className="hd-top-left-vertical absolute top-20 left-16 w-1p h-56 bg-gray-800"></div>
      <div className="hd-top-left-horizontal absolute top-1/3 left-0 w-56 h-1p bg-gray-800"></div>

      {/* Plus bottom left */}
      <div className="absolute bottom-20 left-6 w-24 h-[1px] bg-gray-800"></div>
      <div className="absolute bottom-20 left-6 w-24 h-[1px] bg-gray-800 rotate-90"></div>

      {/* Bottom line middle */}
      <div className="hd-bottom-middle-line absolute bottom-20 left-[30%] w-80 h-[1px] bg-gray-800"></div>

      {/* Bottom right */}
      {/* <div className="absolute bottom-0 right-0 aspect-square w-96"> */}
      <div className="absolute right-0 translate-x-1/3 bottom-20 h-1p w-96 bg-gray-800"></div>
      <div className="absolute right-0 translate-x-1/3 bottom-20 h-1p w-96 bg-gray-800 rotate-90"></div>
      <Image
        src={"/images/home/hd-plus.svg"}
        alt="Plus"
        width={60}
        height={60}
        // className="absolute right-[2.8%] bottom-20 translate-y-1/2 aspect-square w-14"
        className="hd-plus absolute right-0 -translate-x-[65%] bottom-20 translate-y-1/2 aspect-square w-14"
      />

      {/* Top right */}
      <div className="absolute right-0 translate-x-1/4 top-20 h-1p w-64 bg-gray-800"></div>
      <div className="absolute right-0 translate-x-1/4 top-20 h-1p w-64 bg-gray-800 rotate-90"></div>

      {/* <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1p w-full bg-gray-800 rotate-90"></div> */}

      {/* Moving bars */}
      <div className="hd-moving-bars absolute top-20 -translate-y-1/2 -left-[5%] w-16 h-3 bg-gray-800"></div>
      <div className="hd-moving-bars absolute top-20 -translate-y-1/2 left-[42%] w-10 h-3 bg-gray-800"></div>
      <div className="hd-moving-bars absolute top-20 -translate-y-1/2 left-[70%] w-12 h-3 bg-gray-800"></div>

      <div className="hd-moving-bars absolute bottom-20 translate-y-1/2 left-[40%] w-12 h-3 bg-gray-800"></div>

      <Image
        src={"/images/home/hd-stroked-line.svg"}
        alt="Stroked line"
        height={22}
        width={720}
        className="absolute -left-48 bottom-20 h-5"
      />
    </div>
    // <div className="absolute inset-0 h-full w-full -z-20">
    //   <video
    //     src="videos/BG01.mp4"
    //     autoPlay
    //     loop
    //     muted
    //     className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[150%] -z-20 pointer-events-none object-fill opacity-10"
    //   />
    // </div>
  );
}

export default HDScifiElements;
