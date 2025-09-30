"use client";

import ScrollSnapWrapper from "@/components/interactions/ScrollSnapWrapper";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function NowLetsStart() {
  const numDups = 13;

  useGSAP(() => {
    const dups = document.querySelectorAll(".nls-dups");

    const dupsArray = Array.from(dups);
    dupsArray.reverse();

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".now-lets-start",
        start: "top 7%",
        toggleActions: "play reverse play reverse",
        once: false,
      },
    });

    tl.to(".nls-main", {
      rotate: 0,
      duration: 0.7,
      ease: "expo.inOut",
    });
    tl.to(
      ".dup-mask",
      {
        rotate: "-180deg",
        ease: "expo.inOut",
        duration: 0.7,
      },
      "<"
    );

    return () => {
      tl.kill();
    };
  });

  return (
    <ScrollSnapWrapper
      curSecClassName="now-lets-start"
      prevSecClassName="home-diamond"
      nextSecClassName="home-steps"
    >
      <section className="now-lets-start h-screen relative bg-background overflow-hidden snap-start snap-section">
        <div className="w-full h-full text-[10vw] text-white font-bold uppercase flex justify-center items-center relative">
          <div className="absolute top-0 left-0 w-full h-1/2 z-10 overflow-hidden">
            <div className="dup-mask absolute bottom-0 left-0 h-[200%] w-full bg-background origin-bottom"></div>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-1/2 z-10 overflow-hidden">
            <div className="dup-mask absolute top-0 left-0 h-[200%] w-full bg-background origin-top"></div>
          </div>

          <div className="relative">
            <h2 className="nls-main relative z-10 rotate-180">
              Now let&apos;s start
            </h2>
            {new Array(numDups).fill(1).map((_: any, i: number) => (
              <p
                key={"nls-" + i}
                className={`nls-dups absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-full h-full text-center text-background text-outline-white origin-center z-0 ${
                  i === 0 ? "opacity-0" : ""
                }`}
                style={{
                  transform: `rotate(${(180 / numDups) * i}deg)`,
                  // transform: `rotate(${90}deg)`,
                }}
              >
                now let&apos;s start
              </p>
            ))}
          </div>
        </div>
      </section>
    </ScrollSnapWrapper>
  );
}

export default NowLetsStart;
