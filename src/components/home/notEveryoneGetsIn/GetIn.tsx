import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { forwardRef, MutableRefObject, RefObject } from "react";
import SplitType from "split-type";

function GetIn({
  lenisInstance,
  timeline,
  setCanScroll,
}: {
  lenisInstance: any;
  timeline: GSAPTimeline | undefined;
  setCanScroll: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  useGSAP(() => {
    const lettersTop = new SplitType(".get-in-top", {
      types: "chars",
      charClass: "get-in-letter-top",
    });
    const lettersBottom = new SplitType(".get-in-bottom", {
      types: "chars",
      charClass: "get-in-letter-bottom",
    });

    gsap.set(".get-in-letter-top", {
      transformOrigin: "50% 50% -80px",
    });

    gsap.set(".get-in-letter-bottom", {
      transformOrigin: "50% 50% -80px",
      translateY: "30%",
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

    timeline?.to(
      ".get-in-container",
      {
        scale: 1,
        duration: 1,
        ease: "power3.inOut",
        // onComplete: () => {
        //   // lenisInstance?.start();
        //   // ref.current = true;
        //   setCanScroll(true);
        // },
      },
      "<"
    );
  }, [lenisInstance, timeline]);

  return (
    <div className="negi-get-in absolute inset-0 bg-background z-[1] flex justify-center items-center">
      <div className="get-in-container text-[10vw] leading-none text-white font-bold uppercase relative scale-50">
        <p
          className="get-in-top"
          style={{ transformStyle: "preserve-3d", perspective: 500 }}
        >
          get in!
        </p>
        <p
          className="get-in-bottom absolute inset-0 w-full h-full"
          style={{ transformStyle: "preserve-3d", perspective: 500 }}
        >
          get in!
        </p>
      </div>
    </div>
  );
}

export default GetIn;
