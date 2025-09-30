"use client";

import { closeGateAudio, openGateAudio } from "@/components/Audio/audio";
import HoverSplit3DRotateText from "@/components/interactions/HoverSplit3DRotateText";
import { useScrollSmoother } from "@/contexts/ScrollSmootherContext";
import useLenisInstance from "@/hooks/useLenisInstance";
import { cn } from "@/utils/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import CSSPlugin from "gsap/CSSPlugin";
import Link from "next/link";
import React, { useEffect, useRef } from "react";

gsap.registerPlugin(CSSPlugin);

type FrameNavPanelProps = {
  bgColor: string;
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
};

const FrameNavPanel: React.FC<FrameNavPanelProps> = ({
  bgColor,
  isActive,
  setIsActive,
}) => {
  // const lenis: any = useLenisContext();
  // const lenis = useLenisInstance();
  // const { scroller } = useScrollSmoother();
  const lenis = useLenisInstance();
  // const links = [
  //   "home",
  //   "services",
  //   "work",
  //   "pricing",
  //   "who We Are",
  //   "contact",
  // ];
  const links = [
    {
      name: "home",
      href: "/",
    },
    {
      name: "services",
      href: "/services",
    },
    {
      name: "subscription",
      href: "/subscription",
    },
    {
      name: "portfolio",
      href: "/portfolio",
    },
    {
      name: "who we are",
      href: "/about",
    },
    {
      name: "let's talk",
      href: "/contact",
    },
    {
      name: "FAQs",
      href: "/f-a-q",
    },
  ];
  const navPage = useRef<HTMLElement>(null);
  const navPageLinks = useRef<HTMLAnchorElement[]>([]);
  const activeClickAnimationTl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    activeClickAnimationTl.current = gsap.timeline({ paused: true });

    activeClickAnimationTl.current
      // .to(
      //   navPage.current,
      //   {
      //     // clipPath: "polygon(100% 0%, 0% 0%, 0% 100%, 100% 100%)",
      //     xPercent: -100,
      //     ease: "expo.inOut",
      //     duration: 1,
      //   },
      //   "<"
      // )
      .fromTo(
        navPageLinks.current,
        {
          xPercent: 100,
        },
        {
          xPercent: 0,
          duration: 1,
          stagger: 0.05,
          ease: "power4.inOut",
        },
        "<-0.1"
      );

    // activeClickAnimationTl.current?.fromTo(
    //   ".nav-social",
    //   {
    //     borderColor: "#1A1A1E00",
    //   },
    //   {
    //     borderColor: "#1A1A1E",
    //     duration: 0.1,
    //   },
    //   ">-0.5"
    // );

    // activeClickAnimationTl.current?.fromTo(
    //   ".nav-social-link-item",
    //   {
    //     yPercent: 110,
    //   },
    //   {
    //     yPercent: 0,
    //     duration: 0.4,
    //     stagger: 0.05,
    //     ease: "power3.inOut",
    //   },
    //   "<0.1"
    // );

    activeClickAnimationTl.current?.fromTo(
      ".nav-contact-link",
      {
        yPercent: 110,
      },
      {
        yPercent: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: "power3.inOut",
      },
      ">-0.2"
    );

    activeClickAnimationTl.current?.fromTo(
      ".nav-close-btn",
      {
        scale: 0,
      },
      {
        scale: 1,
        duration: 0.5,
        ease: "power3.inOut",
      },
      ">-0.5"
    );
    activeClickAnimationTl.current?.fromTo(
      ".nav-x",
      {
        rotate: 0,
      },
      {
        rotate: 360,
        duration: 0.5,
        ease: "power3.inOut",
      },
      "<"
    );

    // activeClickAnimationTl.current?.fromTo(
    //   ".nav-social-link",
    //   {
    //     yPercent: 110,
    //   },
    //   {
    //     yPercent: 0,
    //     duration: 0.4,
    //     ease: "power3.inOut",
    //   }
    // );

    // activeClickAnimationTl.current?.fromTo(
    //   ".nav-views",
    //   {
    //     yPercent: 110,
    //   },
    //   {
    //     yPercent: 0,
    //     duration: 0.4,
    //     ease: "power3.inOut",
    //   },
    //   "<0.2"
    // );

    // activeClickAnimationTl.current?.fromTo(
    //   ".nav-followers",
    //   {
    //     yPercent: 110,
    //   },
    //   {
    //     yPercent: 0,
    //     duration: 0.4,
    //     ease: "power3.inOut",
    //   },
    //   "<0.15"
    // );

    // navPageLinks.current.forEach((link) => {
    //   const nonItalicLinks = $$(".non-italic", link);
    //   activeClickAnimationTl.current?.fromTo(
    //     nonItalicLinks,
    //     {
    //       xPercent: 100,
    //       opacity: 0,
    //       scaleX: 0,
    //     },
    //     {
    //       xPercent: 0,
    //       opacity: 1,
    //       scaleX: 1,
    //       stagger: 0.05,
    //       duration: 1,
    //       ease: "power4.inOut",
    //     },
    //     "<"
    //   );
    // });
  }, []);

  useEffect(() => {
    // if (!scroller) return;
    if (isActive) {
      gsap.delayedCall(0.5, () => openGateAudio.play());
      activeClickAnimationTl.current?.play();
      // scroller?.paused(true);
      lenis?.stop();
    } else {
      // gsap.delayedCall(0.5, () => closeGateAudio.play());
      closeGateAudio.play();
      activeClickAnimationTl.current?.reverse();
      // scroller?.paused(false);
      lenis?.start();
    }
  }, [isActive, lenis]);

  return (
    <nav
      ref={navPage}
      // className="nav-page fixed top-0 right-0 h-screen w-full lg:w-1/2 2xl:w-[40%] bg-[#f1edeb] text-[#212121] flex items-center justify-center flex-col gap-[1vh]"
      className={cn(
        "absolute top-1/2 -translate-y-1/2 right-0 translate-x-full h-screen w-screen lg:w-[30vw] text-gray-100 flex flex-col justify-start md:justify-center items-stretch md:items-center gap-10 py-20 md:py-[10vh] px-16 3xl:px-16 z-50",
        bgColor
      )}
      // style={{ clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)" }}
    >
      <button
        className="nav-close-btn absolute top-10 3xl:top-16 right-10 3xl:right-16 aspect-square w-10 md:w-12 z-30 bg-white"
        style={{
          clipPath:
            "polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)",
        }}
        onClick={() => setIsActive(false)}
      >
        <div className="nav-x absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-1/2 h-[1.5px] bg-gray-700 origin-center -rotate-45"></div>
          <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-1/2 h-[1.5px] bg-gray-700 origin-center rotate-45"></div>
        </div>
      </button>

      <div className="space-y-6 3xl:space-y-8 md:-translate-y-[8%]">
        {links.map((elem, i) => {
          const index = "0" + (i + 1).toString();
          return (
            <Link
              key={elem.name}
              href={elem.href}
              ref={(crr) => {
                if (crr) navPageLinks.current.push(crr);
              }}
              onClick={() => {
                setIsActive(false);
              }}
              className="interactable block"
            >
              <HoverSplit3DRotateText
                index={index}
                // textClassName="font-roboto-flex font-extralight uppercase"
                textClassName="font-harmond font-semibold condensed"
              >
                {elem.name}
              </HoverSplit3DRotateText>
            </Link>
          );
        })}
      </div>

      {/* <div className="text-2xl font-extralight space-y-4">
        <div className="nav-social px-6 py-4 border border-gray-900 relative hover:bg-gray-800 hover:border-gray-800 transition-all duration-300">
          <div className="overflow-hidden flex gap-6">
            <a
              href=""
              className="nav-social-link nav-social-link-item mr-auto after:absolute after:top-0 after:left-0 after:w-full after:h-full"
            >
              Dribbble
            </a>

            <div className="nav-views nav-social-link-item text-xl flex items-center gap-1.5">
              <div className="aspect-square w-6 relative">
                <Image
                  src={"/images/eye.svg"}
                  alt="eye"
                  fill
                  className="object-contain"
                />
              </div>
              <div>5.6M+</div>
            </div>

            <div className="nav-followers nav-social-link-item text-xl flex items-center gap-1.5">
              <div className="aspect-square w-6 relative">
                <Image
                  src={"/images/users.svg"}
                  alt="users"
                  fill
                  className="object-contain"
                />
              </div>
              <div>5.6M+</div>
            </div>
          </div>
        </div>

        <div className="nav-social px-6 py-4 border border-gray-900 relative hover:bg-gray-800 hover:border-gray-800 transition-all duration-300">
          <div className="overflow-hidden flex gap-6">
            <a
              href=""
              className="nav-social-link nav-social-link-item mr-auto after:absolute after:top-0 after:left-0 after:w-full after:h-full"
            >
              Linkedin
            </a>

            <div className="nav-views nav-social-link-item text-xl flex items-center gap-1.5">
              <div className="aspect-square w-6 relative">
                <Image
                  src={"/images/eye.svg"}
                  alt="eye"
                  fill
                  className="object-contain"
                />
              </div>
              <div>5.6M+</div>
            </div>

            <div className="nav-followers nav-social-link-item text-xl flex items-center gap-1.5">
              <div className="aspect-square w-6 relative">
                <Image
                  src={"/images/users.svg"}
                  alt="users"
                  fill
                  className="object-contain"
                />
              </div>
              <div>5.6M+</div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="absolute inset-x-12 3xl:inset-x-16 bottom-12 md:bottom-6 3xl:bottom-16 mt-auto grid grid-cols-1 md:grid-cols-[1.5fr_0.7fr] gap-1 3xl:gap-2 -translate-x-[1vw]">
        <div className="overflow-hidden">
          <a
            href="mailto:raredesignlabs@gmail.com"
            className="text-xl 3xl:text-xl nav-contact-link font-extralight flex items-center gap-2"
          >
            raredesignlabs@gmail.com
          </a>
        </div>

        <div className="overflow-hidden md:justify-self-end">
          <a
            href="https://dribbble.com/akshayhooda"
            className="text-xl 3xl:text-xl nav-contact-link font-extralight flex items-center gap-2"
          >
            Dribbble
          </a>
        </div>

        <div className="overflow-hidden">
          <a
            href="tel:+918660359255"
            className="text-xl 3xl:text-xl nav-contact-link font-extralight flex items-center gap-2"
          >
            +91 8660359255
          </a>
        </div>

        <div className="overflow-hidden md:justify-self-end">
          <a
            href="https://www.linkedin.com/company/rare-design-studios/"
            className="text-xl 3xl:text-xl nav-contact-link font-extralight flex items-center gap-2"
          >
            Linkedin
          </a>
        </div>
      </div>

      {/* <FrameNavPanelDetails isActive={isActive} /> */}
    </nav>
  );
};

export default FrameNavPanel;
