"use client";

import { ContextSafeFunc, useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

function SdAnimationsWrapper({
  numOfDescriptions,
  children,
}: {
  numOfDescriptions: number;
  children: React.ReactNode;
}) {
  useGSAP((context: gsap.Context, contextSafe?: ContextSafeFunc) => {
    if (!contextSafe) return;

    const delayedAnimation = contextSafe(() => {
      const letters = new Array(numOfDescriptions).fill(1).map(
        (_, i) =>
          new SplitType(`.sd-heading-${i + 1}`, {
            types: "chars,words",
            charClass: "origin-bottom scale-y-0",
          })
      );

      const videoPin = ScrollTrigger.create({
        trigger: ".sd-video-container-outer",
        start: "top top",
        end: `+=${numOfDescriptions * 100}%`,
        pin: true,
      });

      const contentPin = ScrollTrigger.create({
        trigger: ".sd-content-wrapper",
        start: "top top",
        end: `+=${numOfDescriptions * 100}%`,
        pin: true,
      });

      const tl1 = gsap.timeline({
        scrollTrigger: {
          trigger: ".subscription-description",
          start: "top 30%",
          toggleActions: "play none none reverse",
        },
      });

      tl1.to(letters[0].chars, {
        scaleY: 1,
        // filter: "blur(0px)",
        // opacity: 1,
        stagger: 0.017,
        duration: 0.55,
        ease: "power3.inOut",
      });

      tl1.to(
        `.sd-why-rare`,
        {
          yPercent: -100,
          duration: 0.6,
          ease: "power2.inOut",
        },
        "<0.2"
      );

      tl1.to(
        ".sd-text-wrapper",
        {
          yPercent: -100,
          duration: 0.6,
          ease: "power2.inOut",
        },
        "<0.2"
      );

      tl1.to(
        ".sd-number-text",
        {
          yPercent: -105,
          duration: 0.4,
          ease: "power3.inOut",
        },
        "<0.3"
      );
      tl1.to(
        ".sd-nums",
        {
          yPercent: -(100 / numOfDescriptions),
          duration: 0.4,
          ease: "power3.inOut",
        },
        "<0.15"
      );

      tl1.to(
        ".sd-number-line-star",
        {
          opacity: 1,
          duration: 0.3,
          ease: "power1.out",
        },
        ">-0.2"
      );

      tl1.to(
        ".sd-number-line",
        {
          scaleX: 1,
          duration: 0.6,
          ease: "power3.inOut",
        },
        "<"
      );

      for (let i = 0; i < numOfDescriptions; i++) {
        if (i === 0) continue;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".subscription-description",
            start: `top top-=${i * 100}%`,
            toggleActions: "play none none reverse",
          },
        });

        tl.set(letters[i - 1].chars, {
          transformOrigin: "top",
          scaleY: 1,
        });

        tl.to(letters[i - 1].chars, {
          scaleY: 0,
          stagger: 0.017,
          duration: 0.55,
          ease: "power3.inOut",
        });

        tl.to(
          letters[i].chars,
          {
            scaleY: 1,
            stagger: 0.017,
            duration: 0.55,
            ease: "power3.inOut",
          },
          "<"
        );

        tl.to(
          ".sd-text-wrapper",
          {
            yPercent: -100 * (i + 1),
            duration: 0.6,
            ease: "power2.inOut",
          },
          "<0.2"
        );

        tl.to(
          ".sd-nums",
          {
            yPercent: -(100 / numOfDescriptions) * (i + 1),
            duration: 0.4,
            ease: "power2.inOut",
          },
          "<0.1"
        );
      }
    });

    setTimeout(delayedAnimation, 100);
  });

  return children;
}

export default SdAnimationsWrapper;
