"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);
const Intro = () => {
  const introSection = useRef<HTMLElement>(null);
  const headlines = useRef<HTMLDivElement[]>([]);

  useGSAP(() => {
    const pinTl = gsap.timeline({
      scrollTrigger: {
        trigger: introSection.current,
        start: "-10% 10%",
        end: "-10% 10%",
        toggleActions: "play none none reverse",
      },
    });

    pinTl.to(introSection.current, {
      scale: 1,
      borderRadius: 0,
      duration: 0.25,
      ease: "power1.inOut",
    });

    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: introSection.current,
        start: "top 70%",
        end: "70% 70%",
        scrub: 5,
      },
    });

    scrollTl.to(headlines.current, {
      xPercent: 101,
      stagger: 0.5,
      ease: "power1.inOut",
    });
  }, []);

  return (
    <>
      {/* <div className="h-screen w-full"></div> */}
      <section
        ref={introSection}
        className="intro relative z-20 bg-zinc-950 rounded-t-[3rem] p-[5vw] h-screen w-full scale-[0.9] overflow-hidden"
      >
        <h1 className="text-[7vw] relative text-center leading-[120%] w-fit">
          <span className="whitespace-nowrap">
            We&apos;re a coalition of{" "}
            <span className="font-harmond italic underline uppercase">
              original
            </span>
          </span>
          <div
            ref={(crr) => {
              if (crr) headlines.current.push(crr);
            }}
            className="h-full w-[110vw] absolute top-0 right-0 flex"
          >
            <div className="bg-gradient-to-r from-transparent to-zinc-950 w-[30vw] h-full backdrop-blur-sm"></div>
            <div className="h-full w-full bg-zinc-950 -ml-3"></div>
          </div>
        </h1>
        <h1 className="text-[7vw] relative text-center leading-[120%] w-fit">
          <span className="whitespace-nowrap">
            <span className="font-harmond italic underline uppercase">
              geniuses
            </span>{" "}
            in design & dev,
          </span>
          <div
            ref={(crr) => {
              if (crr) headlines.current.push(crr);
            }}
            className="h-full w-[110vw] absolute top-0 right-0 flex"
          >
            <div className="bg-gradient-to-r from-transparent to-zinc-950 w-[30vw] h-full backdrop-blur-sm"></div>
            <div className="h-full w-full bg-zinc-950 -ml-3"></div>
          </div>
        </h1>
        <h1 className="text-[7vw] relative text-center leading-[120%] w-fit">
          <span className="whitespace-nowrap">
            propelling your vision into the
          </span>
          <div
            ref={(crr) => {
              if (crr) headlines.current.push(crr);
            }}
            className="h-full w-[110vw] absolute top-0 right-0 flex"
          >
            <div className="bg-gradient-to-r from-transparent to-zinc-950 w-[30vw] h-full backdrop-blur-sm"></div>
            <div className="h-full w-full bg-zinc-950 -ml-3"></div>
          </div>
        </h1>
        <h1 className="text-[7vw] relative text-center leading-[120%] w-fit">
          <span className="whitespace-nowrap">digital stratosphere.</span>
          <div
            ref={(crr) => {
              if (crr) headlines.current.push(crr);
            }}
            className="h-full w-[110vw] absolute top-0 right-0 flex"
          >
            <div className="bg-gradient-to-r from-transparent to-zinc-950 w-[30vw] h-full backdrop-blur-sm"></div>
            <div className="h-full w-full bg-zinc-950 -ml-3"></div>
          </div>
        </h1>
      </section>
    </>
  );
};

export default Intro;
