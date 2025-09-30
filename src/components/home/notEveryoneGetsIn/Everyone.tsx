import useLenisInstance from "@/hooks/useLenisInstance";
import { cn, snapScrollTo } from "@/utils/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { useRef } from "react";

function Everyone({
  lenisInstance,
  timeline,
}: {
  lenisInstance: any;
  timeline: GSAPTimeline | undefined;
}) {
  // const lenisInstance = useLenisInstance();
  const isAnimating = useRef(false);

  useGSAP(() => {
    const words = document.querySelectorAll(".e-glitch");

    const wordsArray = Array.from(words);
    wordsArray.reverse();

    // console.log(wordsArray);

    // const tl = gsap.timeline({
    //   scrollTrigger: {
    //     trigger: ".negi-everyone",
    //     start: "top 15%",
    //     // end: "top -85%",
    //     toggleActions: "play reverse play reverse",
    //     once: false,
    //     onEnter: () => {
    //       isAnimating.current = true;
    //     },
    //     onEnterBack: () => {
    //       isAnimating.current = true;
    //     },
    //   },
    // });

    // gsap.to('.everyone-2', {

    // })
    timeline?.to(".everyone-2", {
      scale: 1,
      duration: 2,
      ease: "power2.out",
    });

    wordsArray.forEach((el: Element, i: number) => {
      timeline?.to(
        el,
        {
          opacity: 1,
          duration: 0,
          delay: 0.12 * i,
          // stagger: -0.1,
          // ease: "power2.inOut",
        },
        "<"
        // "<0.3"
      );
      timeline?.to(
        el,
        {
          textShadow:
            "1px 1px 0 #ffffff, -1px -1px 0 #ffffff, 1px -1px 0 #ffffff, -1px 1px 0 #ffffff",
          color: "#131316",
          duration: 0,
          // stagger: -0.1,
        },
        "<0.12"
      );
      timeline?.to(
        el,
        {
          opacity: 0,
          duration: 0,
          // stagger: -0.1,
        },
        "<0.12"
      );
      if (i === 3) {
        // gsap.to(window, {
        //   scrollTo: {
        //     y: ".home-diamond",
        //     offsetY: 0,
        //     autoKill: false,
        //   },
        //   delay: 0.3,
        //   duration: 0.5,
        //   ease: "power2",
        //   onComplete: () => {
        //     isAnimating.current = false;
        //     lenisInstance?.start();
        //   },
        // });
        // console.log("complete");
        timeline?.to(".negi-everyone", {
          opacity: 0,
          pointerEvents: "none",
          duration: 0,
          // onStart: () => {
          //   console.log("start");
          // },
        });
        // isAnimating.current = false;
      }
    });

    // const obsMouse = Observer.create({
    //   target: ".negi-everyone",
    //   type: "wheel",
    //   // onDown: () =>
    //   //   snapScrollTo(".negi-gets-in", lenisInstance, isAnimating.current, 0),
    //   onDown: () =>
    //     snapScrollTo(".home-diamond", lenisInstance, isAnimating.current),
    //   // onUp: () =>
    //   //   snapScrollTo(".negi-not", lenisInstance, isAnimating.current, 0),
    //   onUp: () => snapScrollTo(".hero", lenisInstance, isAnimating.current, 0),
    // });

    // const obsTouch = Observer.create({
    //   target: ".negi-everyone",
    //   type: "touch",
    //   // onUp: () =>
    //   //   snapScrollTo(".negi-gets-in", lenisInstance, isAnimating.current, 0),
    //   onUp: () =>
    //     snapScrollTo(".home-diamond", lenisInstance, isAnimating.current),
    //   // onDown: () =>
    //   //   snapScrollTo(".negi-not", lenisInstance, isAnimating.current, 0),
    //   onDown: () =>
    //     snapScrollTo(".hero", lenisInstance, isAnimating.current, 0),
    // });

    // return () => {
    //   obsMouse.kill();
    //   obsTouch.kill();
    // };
  }, [lenisInstance, timeline]);

  return (
    <div className="negi-everyone absolute inset-0 h-screen w-full bg-background z-[3]">
      <div className="h-full pt-[88px] text-[8vw] leading-none text-white font-bold uppercase flex flex-col gap-[0] items-center justify-center">
        {new Array(5).fill(0).map((_: number, i: number) => (
          <p
            key={`everyone-${i}`}
            // className={cn(
            //   `word-everyone everyone-${i} -mt-3 ${
            //     i === 4 ? "text-outline-white text-background" : ""
            //   }`,
            //   i === 2 ? "scale-[120%]" : ""
            // )}
            className={`word-everyone everyone-${i} -mb-3 ${
              i === 2 ? "scale-[120%]" : ""
            } ${i !== 2 ? "e-glitch" : ""} ${
              // i !== 2 && i !== 4 ? "opacity-0" : ""
              i !== 2 ? "opacity-0" : ""
            }`}
          >
            Everyone
          </p>
        ))}
      </div>
    </div>
  );
}

export default Everyone;
