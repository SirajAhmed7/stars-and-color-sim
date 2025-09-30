"use client";

import MovingGradient from "@/components/Canvas/MovingGradient";
import Scene from "@/components/Canvas/Scene";
import BookACall from "@/components/ui/bookACall/BookACall";
import CheckOS from "@/components/ui/CheckOS";
import Footer from "@/components/ui/Footer";
import Frame from "@/components/ui/frame/Frame";
import GradientBlur from "@/components/ui/GradientBlur";
import MouseTrail from "@/components/ui/MouseTrail";
import PreLoader from "@/components/ui/preloader/PreLoader";
import ScrollTopOnNav from "@/components/ui/ScrollTopOnNav";
import ScrollSmootherProvider from "@/contexts/ScrollSmootherContext";
import VideoScrollProvider from "@/contexts/VideoScrollContext";
import "@/css/font.css";
import { useMobileDetection } from "@/hooks/useMobileDetection";
import { useScrollTriggerInit } from "@/hooks/useScrollTriggerInit";
import MobileHomePage from "../mobileHomePage/MobileHomePage";
import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ConditionalComponents({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isMobile, isLoaded } = useMobileDetection();

  // // Initialize ScrollTrigger for production environments
  // useScrollTriggerInit();

  useEffect(() => {
    setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 1500);
  }, []);

  // Show loading state until detection is complete
  if (!isLoaded) {
    return (
      <div className="w-full h-screen flex items-center justify-center min-h-screen bg-background">
        {/* <div className="text-2xl font-extralight text-white">
          Loading the rare experience...
        </div> */}

        {/* <div className="aspect-square w-6 bg-gray-100 rounded-full">
          <div className="aspect-square w-6 bg-gray-100 animate-ping rounded-full"></div>
        </div> */}

        {/* <div className="flex gap-2 animate-spin">
          {new Array(3).fill(0).map((_, i) => (
            <div key={i} className="size-2 bg-gray-600 rounded-full"></div>
          ))}
        </div> */}
      </div>
    );
  }

  // // Mobile layout - simplified
  // if (isMobile) {
  return (
    <>
      <Scene />
      <div className="moving-gradient-wrapper fixed top-0 left-0 h-svh w-[100vw] z-10">
        {/* <div className="absolute inset-[var(--frame-size)]"> */}
        <div className="absolute inset-0">
          <MovingGradient />
        </div>
      </div>
      {/* <Frame /> */}
      {/* <div className="bg-black text-white min-h-svh">
        <MobileHomePage />
      </div> */}
    </>
  );
  // }

  // // Desktop layout - full experience
  // return (
  //   <ScrollSmootherProvider>
  //     <VideoScrollProvider>
  //       {/* <div> */}
  //       <CheckOS />
  //       <ScrollTopOnNav />
  //       <Scene />
  //       <div className="moving-gradient-wrapper fixed top-0 left-0 h-screen w-[100vw] z-10 opacity-0">
  //         <div className="absolute inset-[var(--frame-size)]">
  //           <MovingGradient />
  //         </div>
  //       </div>
  //       <Frame />
  //       <MouseTrail />
  //       <PreLoader />
  //       {/* <div id="wrapper" className="relative z-20">
  //           <div id="content"> */}
  //       <main className="relative z-20">
  //         {children}
  //         <BookACall />
  //       </main>
  //       <Footer />
  //       {/* </div>
  //         </div> */}
  //       <GradientBlur />
  //       {/* </div> */}
  //     </VideoScrollProvider>
  //   </ScrollSmootherProvider>
  // );
}
