import { useGSAP } from "@gsap/react";

function HowWe({ timeline }: { timeline: GSAPTimeline | undefined }) {
  useGSAP(() => {
    timeline?.to(".how-we-main", {
      scale: 1,
      duration: 1,
      ease: "power3.inOut",
    });
    timeline?.to(".how-we", {
      opacity: 0,
      pointerEvents: "none",
      delay: 0.3,
      duration: 0,
    });
  }, [timeline]);

  return (
    <div className="how-we absolute inset-0 h-screen w-full bg-white z-[4]">
      <div className="h-full pt-[88px] text-[14vw] leading-none text-gray-950 font-bold uppercase flex items-center justify-center">
        <p className="how-we-main scale-50">How we</p>
      </div>
    </div>
  );
}

export default HowWe;
