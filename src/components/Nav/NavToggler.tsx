"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { hoverBtnAudio } from "../Audio/audio";
import { isAbsolute } from "path";

gsap.registerPlugin(ScrollTrigger);

type NavTogglerProps = {
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  isActive: boolean;
};

const NavToggler: React.FC<NavTogglerProps> = ({ setIsActive, isActive }) => {
  const inActive = useRef<HTMLDivElement>(null);
  const toggler = useRef<HTMLDivElement>(null);
  const active = useRef<HTMLDivElement>(null);
  const dots = useRef<HTMLDivElement[]>([]);
  const clickTimeline = useRef<gsap.core.Timeline | null>(null);

  function click(isLinkClick?: boolean) {
    if (!active.current) return;

    const activeClickAnimationTl = gsap.timeline({ paused: true });
    activeClickAnimationTl
      .set(active.current, { opacity: 1 })
      .to(dots.current, {
        margin: -5,
        duration: 0.25,
        ease: "power1.inOut",
      })
      .to(
        active.current,
        {
          scale: 1.1,
          rotate: 90,
          duration: 0.75,
          ease: "back.inOut",
        },
        "-=50%"
      );

    clickTimeline.current = activeClickAnimationTl;

    const toggleClick = () => {
      let isActive: boolean =
        toggler.current?.getAttribute("data-isactive") === "true";
      isActive = !isActive;
      toggler.current?.setAttribute("data-isactive", isActive.toString());
      if (!isLinkClick) setIsActive((prev: boolean) => !prev);

      if (isActive) {
        activeClickAnimationTl.play();
      } else {
        activeClickAnimationTl.reverse();
      }
    };

    toggler.current?.addEventListener("click", toggleClick);

    return () => {
      toggler.current?.removeEventListener("click", toggleClick);
    };
  }

  useGSAP(() => {
    hover();
    click();
    scroll();
  }, []);

  useEffect(() => {
    if (!isActive && clickTimeline.current) clickTimeline.current.reverse();
    else clickTimeline.current?.play();
  }, [isActive]);

  function hover() {
    if (!toggler.current) return;

    const inActiveHoverEnterTl = gsap.timeline({ paused: true });
    inActiveHoverEnterTl
      .to(inActive.current, {
        onStart: () => {
          hoverBtnAudio.play();
        },
        rotation: 180,
        ease: "expo.inOut",
      })
      .to(
        toggler.current,
        {
          keyframes: {
            scale: [1, 1.1, 1],
            easeEach: "none",
          },
          ease: "power1.inOut",
        },
        "<"
      );

    const inActiveHoverLeaveTl = gsap.timeline({ paused: true });
    inActiveHoverLeaveTl.to(inActive.current, {
      rotation: 0,
      ease: "expo.inOut",
    });

    const handleMouseEnter = () => inActiveHoverEnterTl.restart();
    const handleMouseLeave = () => inActiveHoverLeaveTl.restart();

    toggler.current?.addEventListener("mouseenter", handleMouseEnter);
    toggler.current?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      toggler.current?.removeEventListener("mouseenter", handleMouseEnter);
      toggler.current?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }

  function scroll() {
    if (!dots.current) return;
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        scroller: "body",
        trigger: "main",
        start: "1%",
        toggleActions: "play none none reverse",
      },
    });

    scrollTl
      .to(dots.current, { y: 5, stagger: 0.1, ease: "back.in(10)" })
      .to(dots.current, { y: 0, stagger: 0.1, ease: "back.out(10)" });
  }

  return (
    <div
      ref={toggler}
      className="toggler relative z-20 cursor-pointer size-11 bg-white grid place-items-center"
      data-isactive="false"
    >
      <div
        ref={inActive}
        className="toggler_inActive size-full flex items-center justify-center gap-1"
      >
        <div
          ref={(crr) => {
            if (crr) dots.current.push(crr);
          }}
          className="dot size-[6px] rounded-full bg-black"
        ></div>
        <div
          ref={(crr) => {
            if (crr) dots.current.push(crr);
          }}
          className="dot size-[6px] rounded-full bg-black"
        ></div>
      </div>

      <div
        ref={active}
        className="toggler_active opacity-0 size-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black scale-0"
      >
        <div className="h-1 w-[50%] bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
        <div className="h-1 w-[50%] bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45"></div>
      </div>
    </div>
  );
};

export default NavToggler;
