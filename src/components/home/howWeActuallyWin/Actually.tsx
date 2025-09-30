import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import SplitType from "split-type";

function ActuallyWord({
  timeline,
  i,
}: {
  timeline: GSAPTimeline | undefined;
  i: number;
}) {
  const topRef = useRef<any>(null);
  const bottomRef = useRef<any>(null);

  useGSAP(() => {
    const lettersTop = new SplitType(topRef.current, {
      types: "chars",
    });
    const lettersBottom = new SplitType(bottomRef.current, {
      types: "chars",
    });

    // new Array(5).fill(1).forEach((_: number, i: number) => {
    timeline?.to(
      lettersTop.chars,
      {
        yPercent: -210,
        duration: 0.6,
        stagger: 0.07,
        ease: "power3.inOut",
      },
      "<0.1"
    );

    timeline?.to(
      lettersBottom.chars,
      {
        yPercent: -210,
        duration: 0.6,
        stagger: 0.07,
        ease: "power3.inOut",
      },
      "<0.1"
    );
    // });
  }, [timeline]);

  return (
    <div
      className={`actually-container-${i} shrink-0 relative overflow-hidden`}
    >
      <div
        ref={topRef}
        className="actually-word actually-outline text-outline-white text-background"
      >
        actually
      </div>
      <div
        ref={bottomRef}
        className="actually-word actually-fill absolute inset-0 translate-y-[110%]"
      >
        actually
      </div>
    </div>
  );
}

function Actually({ timeline }: { timeline: GSAPTimeline | undefined }) {
  return (
    <div className="hwaw-actually absolute inset-0 h-screen w-full bg-background z-[3] overflow-hidden flex justify-center">
      <div className="w-full h-full text-[10vw] leading-none font-bold uppercase flex flex-col items-center justify-center">
        {new Array(5).fill(0).map((_: number, i: number) => (
          <ActuallyWord timeline={timeline} i={i} key={`actually-${i}`} />
        ))}
      </div>
    </div>
  );
}

export default Actually;
