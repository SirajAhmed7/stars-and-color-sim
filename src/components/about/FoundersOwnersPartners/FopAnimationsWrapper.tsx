"use client";

import { scramble } from "@/utils/utils";
import { ContextSafeFunc, useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

function FopAnimationsWrapper({ children }: { children: React.ReactNode }) {
  useGSAP((context: gsap.Context, contextSafe?: ContextSafeFunc) => {
    // const textTop = [
    //   "Customer pain is compass.",
    //   "Vision wired into code.",
    //   "Sync to your heartbeat.",
    // ];
    // const textBottom = [
    //   "Solutions scale from day one.",
    //   "Every release elevates user delight.",
    //   "Momentum compounds daily.",
    // ];

    if (!contextSafe) return;

    const wideText = [
      ["Customer pain is compass.", "Solutions scale from day one."],
      ["Vision wired into code.", "Every release elevates user delight."],
      ["Sync to your heartbeat.", "Momentum compounds daily."],
    ];

    const delayedAnimation = contextSafe(() => {
      const textWideEls = document.querySelectorAll(".fop-wide-text");

      const [lower1, lower2, lower3] = new Array(3).fill(1).map(
        (_, i) =>
          new SplitType(`.fop-lower-word-${i + 1}`, {
            types: "chars,words",
            // charClass: "origin-bottom scale-y-0",
          })
      );

      if (!lower1.chars || !lower2.chars || !lower3.chars) {
        return;
      }

      const mm = gsap.matchMedia();

      gsap.set([...lower1.chars, ...lower2.chars, ...lower3.chars], {
        scaleY: 0,
        transformOrigin: "bottom",
      });

      ScrollTrigger.create({
        trigger: ".fop-video-container-outer",
        start: "top top",
        end: "+=500%",
        pin: true,
      });

      ScrollTrigger.create({
        trigger: ".fop-content-wrapper",
        start: "top top",
        end: "+=500%",
        pin: true,
      });

      const stagger = 0.017;
      const duration = 0.55;
      const tlStagger = duration - stagger;

      const tl1 = gsap.timeline({
        scrollTrigger: {
          trigger: ".founders-owners-partners",
          start: "top 40%",
          toggleActions: "play none none reverse",
          onEnter: () => {
            textWideEls.forEach((el: Element, i: number) => {
              scramble(wideText[0][i], el);
            });
          },
        },
      });

      tl1.to(".fop-wide-text-top", {
        backgroundPosition: "0% 0%",
        duration: 0.65,
        ease: "none",
      });

      tl1.to(
        ".fop-wide-text-bottom",
        {
          backgroundPosition: "0% 0%",
          duration: 0.65,
          ease: "none",
        },
        "<"
      );

      tl1.to(
        lower1.chars,
        {
          scaleY: 1,
          stagger,
          duration,
          ease: "power3.inOut",
        },
        "<"
      );

      tl1.to(
        ".fop-subheading",
        {
          yPercent: -100,
          duration: 0.6,
          ease: "power2.inOut",
        },
        0.2
      );

      const tl2 = gsap.timeline({
        scrollTrigger: {
          trigger: ".founders-owners-partners",
          start: "top top-=100%",
          toggleActions: "play none none reverse",
          onEnter: () => {
            textWideEls.forEach((el: Element, i: number) =>
              scramble(wideText[1][i], el)
            );
          },
          onLeaveBack: () => {
            textWideEls.forEach((el: Element, i: number) =>
              scramble(wideText[0][i], el)
            );
          },
        },
      });

      tl2.set(lower1.chars, {
        transformOrigin: "top",
        scaleY: 1,
      });

      tl2.to(lower1.chars, {
        scaleY: 0,
        stagger,
        duration,
        ease: "power3.inOut",
      });
      tl2.to(
        lower2.chars,
        {
          scaleY: 1,
          stagger,
          duration,
          ease: "power3.inOut",
        },
        "<"
      );

      tl2.to(
        ".fop-subheading",
        {
          yPercent: -200,
          duration: 0.6,
          ease: "power2.inOut",
        },
        0.2
      );

      const tl3 = gsap.timeline({
        scrollTrigger: {
          trigger: ".founders-owners-partners",
          start: "top top-=200%",
          toggleActions: "play none none reverse",
          onEnter: () => {
            textWideEls.forEach((el: Element, i: number) =>
              scramble(wideText[2][i], el)
            );
          },
          onLeaveBack: () => {
            textWideEls.forEach((el: Element, i: number) =>
              scramble(wideText[1][i], el)
            );
          },
        },
      });

      tl3.set(lower2.chars, {
        transformOrigin: "top",
        scaleY: 1,
      });

      tl3.to(lower2.chars, {
        scaleY: 0,
        stagger,
        duration,
        ease: "power3.inOut",
      });

      tl3.to(
        lower3.chars,
        {
          scaleY: 1,
          stagger,
          duration,
          ease: "power3.inOut",
        },
        `<`
      );

      tl3.to(
        ".fop-subheading",
        {
          yPercent: -300,
          duration: 0.6,
          ease: "power2.inOut",
        },
        0.2
      );

      mm.add("(min-width: 1024px)", () => {
        gsap.set(".fop-video", {
          y: "35vh",
          z: 200,
        });

        gsap.to(".fop-video", {
          scrollTrigger: {
            trigger: ".fop-video-container-outer",
            start: "top 50%",
            end: "top top",
            scrub: true,
          },
          z: 0,
          y: 0,
        });

        const koacTransition = gsap.timeline({
          scrollTrigger: {
            trigger: ".founders-owners-partners",
            start: "bottom bottom-=1px",
            end: "+=200%",
            // pin: true,
            pinSpacing: false,
            scrub: true,
          },
        });
        koacTransition.to(
          [".fop-video-container-outer", ".fop-content-wrapper"],
          {
            duration: 1,
          }
        );
        koacTransition.to(
          [".fop-video-container-outer", ".fop-content-wrapper"],
          {
            z: -500,
            scale: 0.5,
            // scale: 0.35,
            duration: 1,
          }
        );
      });
    });

    const timeout = setTimeout(delayedAnimation, 100);

    return () => {
      clearTimeout(timeout);
    };
  });
  return <>{children}</>;
}

export default FopAnimationsWrapper;
