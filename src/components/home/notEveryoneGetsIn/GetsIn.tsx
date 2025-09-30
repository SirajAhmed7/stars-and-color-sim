import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import SplitType, { TargetElement } from "split-type";

function GetsInWord({
  lenisInstance,
  timeline,
  i,
}: {
  lenisInstance: any | undefined;
  timeline: GSAPTimeline | undefined;
  i: number;
}) {
  const topRef = useRef<any>(null);
  const bottomRef = useRef<any>(null);

  useGSAP(() => {
    const lettersTop = new SplitType(topRef.current, {
      types: "chars",
      charClass: "gi-top-letter",
    });
    const lettersBottom = new SplitType(bottomRef.current, {
      types: "chars",
      charClass: "gi-bottom-letter",
    });

    gsap.set(".gi-top-letter", {
      transformOrigin: "50% 50% -20px",
    });

    gsap.set(".gi-bottom-letter", {
      transformOrigin: "50% 50% -20px",
      translateY: "20%",
      rotateX: -90,
      opacity: 0,
      pointerEvents: "none",
    });

    timeline?.to(
      lettersTop.chars,
      {
        translateY: "-5%",
        rotateX: 90,
        opacity: 0,
        duration: 0.4,
        stagger: 0.15,
        ease: "power2.inOut",
        pointerEvents: "none",
      },
      "<"
    );
    timeline?.to(
      lettersBottom.chars,
      {
        opacity: 1,
        pointerEvents: "auto",
        duration: 0.1,
        stagger: 0.15,
        // duration: 0.4,
      },
      "<"
    );
    timeline?.to(
      lettersBottom.chars,
      {
        translateY: 0,
        rotateX: 0,
        duration: 0.4,
        stagger: 0.15,
        ease: "power2.inOut",
        // duration: 0.4,
      },
      "<"
    );

    // if (i === 24) {
    //   lenisInstance?.start();
    //   timeline?.to(
    //     ".negi-gets-in",
    //     {
    //       opacity: 0,
    //       pointerEvents: "none",
    //       duration: 0,
    //     },
    //     ">"
    //   );
    // }
  }, [lenisInstance, timeline]);

  return (
    <div
      className="gets-in-word-container w-max relative"
      // style={{ transformStyle: "preserve-3d", perspective: 500 }}
    >
      <p
        ref={topRef}
        className="gets-in-word gets-in-top"
        style={{ transformStyle: "preserve-3d", perspective: 200 }}
      >
        Gets in
      </p>
      <p
        ref={bottomRef}
        className="gets-in-word gets-in-bottom absolute inset-0 w-full h-full"
        style={{ transformStyle: "preserve-3d", perspective: 200 }}
      >
        Gets in
      </p>
    </div>
  );
}

function GetsIn({
  lenisInstance,
  timeline,
}: {
  lenisInstance: any;
  timeline: GSAPTimeline | undefined;
}) {
  useGSAP(() => {
    timeline?.to(
      ".gets-in-grid",
      {
        scale: 0.95,
        duration: 1.3,
        ease: "power2.out",
      },
      "<"
    );

    timeline?.to(".negi-gets-in", {
      opacity: 0,
      delay: 0.2,
      pointerEvents: "none",
      duration: 0,
      // onComplete: () => {
      //   lenisInstance?.start();
      // },
    });
  }, [lenisInstance, timeline]);

  return (
    <div className="negi-gets-in absolute inset-0 w-full h-screen bg-white text-[3.5vw] text-gray-950 font-bold uppercase z-[2] overflow-hidden">
      <div className="gets-in-grid w-full h-full grid grid-cols-5 justify-items-center items-center scale-[150%]">
        {new Array(25).fill(1).map((_: any, i: number) => (
          <GetsInWord
            key={i}
            lenisInstance={lenisInstance}
            timeline={timeline}
            i={i}
          />
        ))}
      </div>
    </div>
  );
}

export default GetsIn;
