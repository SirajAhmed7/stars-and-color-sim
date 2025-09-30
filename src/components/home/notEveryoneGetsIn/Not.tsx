"use client";

import useLenisInstance from "@/hooks/useLenisInstance";
import { snapScrollTo } from "@/utils/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { useRef } from "react";
import SplitType from "split-type";

// gsap.registerPlugin(Observer);

function Not({
  lenisInstance,
  timeline,
}: {
  lenisInstance: any;
  timeline: GSAPTimeline | undefined;
}) {
  const isAnimating = useRef(false);
  const timeRef = useRef(new Date());

  useGSAP(() => {
    const letterMiddle = new SplitType(".not-middle", {
      types: "chars",
    });

    const letterTop = new SplitType(".not-top", {
      types: "chars",
    });

    const letterBottom = new SplitType(".not-bottom", {
      types: "chars",
    });

    const duration: number = 0.25;

    // const tl = gsap.timeline({
    //   scrollTrigger: {
    //     trigger: ".negi-not",
    //     start: "top 15%",
    //     // start: "top top",
    //     // end: "top -85%",
    //     toggleActions: "play reverse play reverse",
    //     once: false,
    //     onEnter: () => {
    //       // isAnimating.current = true;
    //       lenisInstance?.stop();
    //       timeRef.current = new Date();
    //     },
    //     // onEnterBack: () => {
    //     //   isAnimating.current = true;
    //     // },
    //   },
    // });

    timeline?.fromTo(
      letterMiddle.chars,
      {
        xPercent: 50,
        opacity: 0,
      },
      {
        xPercent: 0,
        opacity: 1,
        stagger: 0.1,
        duration,
        ease: "power2.inOut",
      }
    );
    timeline?.to(
      letterMiddle.chars,
      {
        textShadow: "unset",
        color: "#131316",
        stagger: 0.1,
        duration,
        ease: "power2.inOut",
      },
      0.25
    );

    timeline?.fromTo(
      letterTop.chars,
      {
        xPercent: 150,
        opacity: 0,
      },
      {
        xPercent: 0,
        opacity: 1,
        stagger: 0.03,
        duration,
        ease: "power2.inOut",
      },
      0.2
    );
    timeline?.to(
      letterTop.chars,
      {
        textShadow:
          "1px 1px 0 #131316, -1px -1px 0 #131316, 1px -1px 0 #131316, -1px 1px 0 #131316",
        color: "#fff",
        stagger: 0.1,
        duration,
        ease: "power2.inOut",
      },
      0.2
    );

    timeline
      ?.fromTo(
        letterBottom.chars,
        {
          xPercent: 150,
          opacity: 0,
        },
        {
          xPercent: 0,
          opacity: 1,
          stagger: 0.03,
          duration,
          ease: "power2.inOut",
        },
        0.2
      )
      ?.to(
        letterBottom.chars,
        {
          textShadow:
            "1px 1px 0 #131316, -1px -1px 0 #131316, 1px -1px 0 #131316, -1px 1px 0 #131316",
          color: "#fff",
          stagger: 0.1,
          duration,
          ease: "power2.inOut",
          // onComplete: () => {
          //   // // isAnimating.current = false;
          //   // console.log("timeRef", new Date() - timeRef.current);
          //   // gsap.to(window, {
          //   //   scrollTo: {
          //   //     y: ".negi-everyone",
          //   //     offsetY: 0,
          //   //     autoKill: false,
          //   //   },
          //   //   delay: 0.3,
          //   //   duration: 0,
          //   // });
          //   timeline.to(".negi-not", {
          //     opacity: 0,
          //     pointerEvents: "none",
          //     duration: 0,
          //     delay: 0.3,
          //   });
          // },
        },
        0.2
      );

    timeline?.to(".negi-not", {
      opacity: 0,
      pointerEvents: "none",
      duration: 0,
      delay: 0.3,
    });

    // function scrollToNext() {
    //   lenisInstance?.stop();
    //   if (isAnimating.current) return;
    //   gsap.to(window, {
    //     scrollTo: {
    //       y: ".negi-everyone",
    //       offsetY: 0,
    //       autoKill: false,
    //     },
    //     duration: 0,
    //     onComplete: () => {
    //       lenisInstance?.start();
    //     },
    //   });
    // }

    // function scrollToPrev() {
    //   lenisInstance?.stop();
    //   if (isAnimating.current) return;
    //   gsap.to(window, {
    //     scrollTo: {
    //       y: ".hero",
    //       offsetY: 0,
    //       autoKill: false,
    //     },
    //     duration: 0.5,
    //     ease: "power2",
    //     onComplete: () => {
    //       lenisInstance?.start();
    //     },
    //   });
    // }

    // const obsMouse = Observer.create({
    //   target: ".negi-not",
    //   type: "wheel",
    //   onDown: () =>
    //     snapScrollTo(".negi-everyone", lenisInstance, isAnimating.current, 0),
    //   onUp: () => snapScrollTo(".hero", lenisInstance, isAnimating.current),
    // });

    // const obsTouch = Observer.create({
    //   target: ".negi-not",
    //   type: "touch",
    //   onUp: () =>
    //     snapScrollTo(".negi-everyone", lenisInstance, isAnimating.current, 0),
    //   onDown: () => snapScrollTo(".hero", lenisInstance, isAnimating.current),
    // });

    return () => {
      // obsMouse.kill();
      // obsTouch.kill();
    };
  }, [lenisInstance, timeline]);

  return (
    <div className="negi-not absolute inset-0 w-full h-screen flex justify-center items-center bg-white z-[4]">
      <div className="text-[10vw] leading-none text-gray-950 font-black uppercase flex flex-col gap-[5%] items-center justify-center">
        <p className="word-not not-top">not</p>
        <p className="word-not not-middle text-white text-outline-black">not</p>
        <p className="word-not not-bottom">not</p>
      </div>
    </div>
  );
}

export default Not;
