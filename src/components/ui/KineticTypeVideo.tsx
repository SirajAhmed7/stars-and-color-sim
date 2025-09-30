"use client";

import { useScrollSmoother } from "@/contexts/ScrollSmootherContext";
import { useVideoScroll } from "@/contexts/VideoScrollContext";
import useLenisInstance from "@/hooks/useLenisInstance";
import { snapScrollTo } from "@/utils/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

type KineticTypeVideoProps = {
  src: string;
  type: string;
  prevSecClassName: string;
  curSecClassName: string;
  nextSecClassName: string;
};

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin, Observer);

const KineticTypeVideo: React.FC<KineticTypeVideoProps> = ({
  src,
  type,
  prevSecClassName,
  curSecClassName,
  nextSecClassName,
}) => {
  // const lenisInstance = useLenisInstance();
  const { scroller } = useScrollSmoother();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollDirection } = useVideoScroll();

  useEffect(
    function () {
      if (videoRef.current === null) return;

      const videoEl = videoRef.current;

      // videoEl.onplay = () => {
      //   // lenisInstance?.stop();
      //   scroller?.paused(true);
      //   // setCanScroll(false);
      // };

      videoEl.onended = function () {
        // lenisInstance?.stop();
        // scroller?.paused(true);
        if (scrollDirection === "down") {
          // snapScrollTo(`.${nextSecClassName}`, scroller, false, 0.8);
          scroller?.scrollTo(`.${nextSecClassName}`, true);
          setTimeout(() => {
            videoEl.pause();
            videoEl.currentTime = 0;
            scroller?.paused(false);
          }, 1500);
        } else {
          // snapScrollTo(`.${prevSecClassName}`, scroller, false, 0.8);
          scroller?.paused(false);
          // scroller?.scrollTo(`.${prevSecClassName}`, true);
          // scroller?.paused(false);
        }
        // setCanScroll(true);
      };

      return () => {
        if (!videoEl) return;

        videoEl.onplay = null;
        videoEl.onended = null;
      };
    },
    [scroller, nextSecClassName, prevSecClassName, scrollDirection]
  );

  useGSAP(() => {
    const scrollTrigger = ScrollTrigger.create({
      trigger: `.${curSecClassName}`,
      start: "top 50%",
      end: "bottom 50%",
      once: false,
      onEnter: () => {
        if (videoRef.current) videoRef.current.play();
      },
      // onEnterBack: () => {
      //   // if (videoRef.current) videoRef.current.play();
      //   if (videoRef.current) {
      //     videoRef.current.pause();
      //     videoRef.current.currentTime = 0;
      //   }
      // },
    });

    return () => {
      scrollTrigger.kill();
    };
  }, [curSecClassName]);

  return (
    <div className={`absolute w-full h-full top-0 left-0 pointer-events-none`}>
      <video
        ref={videoRef}
        muted
        autoPlay
        // loop
        controls={false}
        // src="/videos/home-diamond-2.mp4"
        className="w-full h-full object-cover"
      >
        <source src={src} type={type} />
        {/* <source src="/videos/home-diamond-2.mp4" type="video/mp4" /> */}
      </video>
    </div>
  );
};

export default KineticTypeVideo;
