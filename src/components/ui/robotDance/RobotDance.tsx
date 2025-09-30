"use client";

import TypedText from "@/components/interactions/TypedText";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import PoppingStarsAnimation from "../PoppingStarsAnimation";
import KickOffAConvo from "../kickOffAConvo/KickOffAConvo";

function RobotDance({ video }: { video: string }) {
  const pathname = usePathname();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [tlText, setTlText] = useState<GSAPTimeline | null>(null);
  const boxesRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      if (!wrapperRef.current) return;

      const tlBlink = gsap.timeline({ repeat: -1, paused: true });
      tlBlink.to(".rd-box-left", {
        backgroundColor: "#1A1A1E",
        duration: 0,
        delay: 0.5,
      });
      tlBlink.to(
        ".rd-box-right",
        {
          backgroundColor: "#F4F4F5",
          duration: 0,
        },
        "<"
      );
      tlBlink.to(".rd-box-left", {
        backgroundColor: "#F4F4F5",
        duration: 0,
        delay: 0.5,
      });
      tlBlink.to(
        ".rd-box-right",
        {
          backgroundColor: "#1A1A1E",
          duration: 0,
        },
        "<"
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top 95%",
        },
        onComplete: () => {
          gsap.to(boxesRef.current, {
            opacity: 1,
            duration: 0.6,
          });
          tlBlink.play();
        },
      });

      setTlText(tl);

      const wrapper = wrapperRef.current;

      const circles = gsap.utils
        .toArray(".rd-circle")
        .reverse()
        .map((el: any, i: number) => follower(el, 0.3 + i * 0.1));

      function follower(target: HTMLElement, duration: number) {
        let xTo = gsap.quickTo(target, "x", {
            duration: duration,
            ease: "power3.out",
          }),
          yTo = gsap.quickTo(target, "y", {
            duration: duration,
            ease: "power3.out",
          });
        return (x: number, y: number) => {
          xTo(x);
          yTo(y);
        };
      }

      // const cursorWindow = {
      //   x: window.innerWidth / 2,
      //   y: window.innerHeight / 2,
      // };
      const cursor = {
        x: window.innerWidth / 1.3,
        y: window.innerHeight / 1.5,
      };

      let timer: NodeJS.Timeout;

      function handleMouseMove(event: MouseEvent) {
        cursor.x = event.offsetX;
        cursor.y = event.offsetY;
        setIsHovered(true);

        clearTimeout(timer);

        timer = setTimeout(() => {
          setIsHovered(false);
        }, 500);
      }

      function handleMouseLeave() {
        gsap.to(cursor, {
          x: window.innerWidth / 1.3,
          y: window.innerHeight / 1.5,
          ease: "elastic.out(1,0.3)",
        });
      }

      const tick = () => {
        if (!wrapper) return;
        const x = cursor.x - wrapper.offsetWidth / 2;
        const y = cursor.y - wrapper.offsetHeight / 2;

        circles.forEach((circle: any) => circle(x, y));

        requestAnimationFrame(tick);
      };

      tick();

      // window.addEventListener("mousemove", handleWindowMouseMove);
      wrapper.addEventListener("mousemove", handleMouseMove);
      wrapper.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        wrapper.removeEventListener("mousemove", handleMouseMove);
        wrapper.removeEventListener("mouseleave", handleMouseLeave);
      };
    });
  }, [pathname]);

  return (
    // <SectionContainer
    //   curSecClassName="robot-dance"
    //   prevSecClassName="nav-grid"
    //   nextSecClassName="book-a-call"
    //   className="bg-background overflow-hidden"
    // >

    <>
      <KickOffAConvo
        textLeft={[""]}
        textRight={[""]}
        className="block md:hidden"
        video="/videos/one-hand-waving.mp4"
        videoClassName="scale-[2.8] lg:scale-150 object-cover lg:object-top translate-y-[80%] lg:translate-y-[20%]"
      />
      <div
        ref={wrapperRef}
        className="hidden md:block robot-dance w-full h-screen relative bg-background overflow-hidden"
      >
        {/* <DiamondCorners /> */}

        <div className="w-full flex justify-center overflow-hidden">
          {/* <div className="w-[180%] md:w-full h-screen mx-auto pt-[88px] pb-14 shrink-0"> */}
          <div className="w-[180%] md:w-full h-screen mx-auto shrink-0">
            <video
              muted
              autoPlay
              loop
              controls={false}
              // src="/videos/home-diamond-2.mp4"
              // className="w-full h-full mx-auto object-contain"
              className="w-full h-full mx-auto object-cover"
              playsInline
            >
              <source src={video} type={`video/${video.split(".")[1]}`} />
              {/* <source src="/videos/home-diamond-2.mp4" type="video/mp4" /> */}
            </video>
          </div>
        </div>

        <PoppingStarsAnimation wrapperClassName="robot-dance" />

        <div className="absolute top-[8vw] left-[8vw] font-extralight">
          <h3 className="font-harmond font-semibold text-4xl mb-4">
            <TypedText text="Get on the waitlist" timeline={tlText} />
          </h3>
          <p className="text-2xl mb-1">
            <TypedText text="We're letting in a few more." timeline={tlText} />
          </p>
          <p className="text-2xl mb-5">
            <TypedText text="Maybe you. Maybe not." timeline={tlText} />
          </p>

          <div ref={boxesRef} className="flex gap-0.5 w-14 h-4 opacity-0">
            <div className="rd-box-left h-full basis-full bg-gray-100"></div>
            <div className="rd-box-right h-full basis-full bg-gray-900"></div>
          </div>
        </div>

        <Link
          href={"https://calendly.com/raredesignlabs/30min"}
          target="_blank"
          className="absolute top-0 left-0 w-full h-full group/robot-dance"
        >
          {new Array(12).fill(1).map((_: any, i: number) => (
            <div
              key={`rd-${i}`}
              className="rd-circle aspect-square w-56 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex justify-center items-center pointer-events-none cursor-pointer"
              style={{
                opacity: i * 0.1,
              }}
            >
              <div
                className="absolute top-0 left-0 w-full h-full rounded-full bg-gray-400/20 border z-0 transition-opacity duration-500 ease-in-out"
                style={{
                  opacity: isHovered ? 1 : 0,
                }}
              ></div>
              <div className="absolute top-0 left-0 w-full h-full rounded-full">
                <Image
                  src={"/images/gradient-stroke-circle.svg"}
                  alt="Gradient stroke circle"
                  fill
                  className="object-contain pointer-events-none"
                />
              </div>
            </div>
          ))}

          <div className="rd-circle aspect-square w-56 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex justify-center items-center pointer-events-none cursor-pointer">
            <div
              className="absolute top-0 left-0 w-full h-full rounded-full bg-gray-950/20 backdrop-blur-lg z-0 transition-all duration-300 ease-in-out"
              style={{
                boxShadow: isHovered ? "0 0 85px 20px #70707B20" : "none",
                backgroundColor: isHovered ? "#F4F4F5" : "#13131633",
              }}
            ></div>

            <div className="absolute top-0 left-0 w-full h-full rounded-full z-20">
              <Image
                src={"/images/gradient-stroke-circle.svg"}
                alt="Gradient stroke circle"
                fill
                className="object-contain pointer-events-none"
              />
            </div>

            <p
              className="font-harmond condensed font-bold text-3xl z-20 transition-all duration-300 ease-in-out"
              style={{
                color: isHovered ? "#1A1A1E" : "#FFFFFF",
              }}
            >
              Book a call
            </p>

            {/* <div className="absolute top-0 left-0 w-full h-full -z-10">
            <ParticleAnimation
              isActive={isHovered}
              particleCount={20}
              particleColor="hsl(0 0% 90%)"
              transitionDuration="0.25s"
            />
          </div> */}
          </div>
        </Link>
      </div>
    </>
  );
}

export default RobotDance;
