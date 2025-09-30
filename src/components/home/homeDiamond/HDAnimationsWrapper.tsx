"use client";

import { scramble } from "@/utils/utils";
import { ContextFunc, ContextSafeFunc, useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrambleTextPlugin from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextPlugin from "gsap/TextPlugin";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrambleTextPlugin, TextPlugin);

function HDAnimationsWrapper({ children }: { children: React.ReactNode }) {
  useGSAP((context: gsap.Context, contextSafe?: ContextSafeFunc) => {
    if (!contextSafe) return;

    const delayedAnimation = contextSafe(() => {
      const letters1 = new SplitType(".home-diamond-heading-letters-1", {
        types: "chars",
        // lineClass: "overflow-y-hidden",
        // charClass: "origin-bottom scale-y-0 blur-xl opacity-0",
        charClass: "origin-bottom scale-y-0",
      });
      const letters2 = new SplitType(".home-diamond-heading-letters-2", {
        types: "chars",
        // lineClass: "overflow-y-hidden",
        // charClass: "origin-bottom scale-y-0 blur-xl opacity-0",
        charClass: "origin-bottom scale-y-0",
      });

      const textElemets = document.querySelectorAll(".home-diamond-text");
      const text1 = [
        "Designers who break the grid",
        "Developers who hack the system",
      ];
      const text2 = [
        "We move like co-founders, not contractors",
        "We ask better questions, ship faster answers",
      ];

      const mm = gsap.matchMedia();

      mm.add(
        {
          isLg: "(min-width: 1024px)",
          isSm: "(max-width: 1023px)",
        },
        (context: gsap.Context) => {
          const isLg = context.conditions?.isLg;

          const enterScrollTrigger = ScrollTrigger.create({
            trigger: ".home-diamond",
            start: "top top",
            toggleActions: "play none none reverse",
            onEnter: () => {
              textElemets.forEach((el: Element, i: number) =>
                scramble(text1[i], el)
              );
            },
          });

          // console.log(letters);

          // const subHeadings = document.querySelectorAll(".home-diamond-sub-heading");

          if (isLg) {
            gsap.set(".home-diamond-video", {
              y: "20vh",
              z: 200,
            });

            gsap.to(".home-diamond-video", {
              scrollTrigger: {
                trigger: ".hd-video-container-outer",
                start: "top 50%",
                end: "top top",
                scrub: true,
              },
              z: 0,
              y: 0,
            });
          }

          const videoSticky = ScrollTrigger.create({
            trigger: ".hd-video-container-outer",
            start: "top 1%",
            end: isLg ? "+=251%" : "+=151%",
            pin: true,
            // markers: true,
          });

          const stickyTrigger = ScrollTrigger.create({
            trigger: ".home-diamond-sticky",
            start: "top 1%",
            end: isLg ? "+=251%" : "+=151%",
            pin: true,
            // markers: true,
          });

          // const stickyTrigger = ScrollTrigger.create({
          //   trigger: ".home-diamond",
          //   start: "top 1%",
          //   // end: isLg ? "+=51%" : "+=151%",
          //   end: "+=151%",
          //   pin: true,
          //   markers: true,
          // });

          const tl1 = gsap.timeline({
            scrollTrigger: {
              trigger: ".home-diamond",
              start: "top 15%",

              toggleActions: "play none none reverse",
            },
          });

          tl1.to(
            ".home-diamond-text",
            {
              backgroundPosition: "0% 0%",
              duration: 0.65,
              ease: "none",
            },
            "<"
          );

          if (letters1)
            tl1.to(
              letters1.chars,
              {
                // yPercent: -115,
                scaleY: 1,
                // filter: "blur(0px)",
                // opacity: 1,
                stagger: 0.017,
                duration: 0.55,
                ease: "power3.inOut",
              },
              "<"
            );

          tl1.to(
            // subHeadings,
            ".home-diamond-sub-heading-wrapper",
            {
              yPercent: -115,
              duration: 0.6,
              ease: "power2.inOut",
            },
            0.2
          );

          const tl2 = gsap.timeline({
            scrollTrigger: {
              trigger: ".home-diamond",
              start: isLg ? "top top-=75%" : "top top-=85%",
              // end: "top top-=51%",
              toggleActions: "play none none reverse",
              onEnter: () => {
                // setTimeout(() => {
                textElemets.forEach((el: Element, i: number) =>
                  scramble(text2[i], el)
                );
              },
              onLeaveBack: () => {
                // setTimeout(() => {
                textElemets.forEach((el: Element, i: number) =>
                  scramble(text1[i], el)
                );
                // }, 500);
              },
            },
          });

          if (letters1 && letters2) {
            tl2.set(letters1.chars, {
              transformOrigin: "top",
              // filter: "blur(0px)",
              // opacity: 1,
              scaleY: 1,
            });
            tl2.to(
              letters1.chars,
              {
                // yPercent: -115,
                scaleY: 0,
                // filter: "blur(24px)",
                // opacity: 0,
                stagger: 0.017,
                duration: 0.55,
                ease: "power3.inOut",
              },
              "<"
            );

            tl2.to(
              letters2.chars,
              {
                // yPercent: -115,
                scaleY: 1,
                // filter: "blur(0px)",
                // opacity: 1,
                stagger: 0.017,
                duration: 0.55,
                ease: "power3.inOut",
              },
              "<"
            );
          }

          tl2.to(
            // subHeadings,
            ".home-diamond-sub-heading-wrapper",
            {
              yPercent: -230,
              duration: 0.6,
              ease: "power2.inOut",
            },
            0.2
          );
        }
      );

      mm.add("(min-width: 1024px)", () => {
        const koacTransition = gsap.timeline({
          scrollTrigger: {
            trigger: ".home-diamond",
            start: "bottom bottom-=1px",
            end: "+=200%",
            // pin: true,
            // pinSpacing: false,
            scrub: true,
            // markers: true,
          },
        });
        koacTransition.to(
          [".hd-video-container-outer", ".home-diamond-sticky"],
          {
            duration: 1,
          }
        );
        koacTransition.to(
          [".hd-video-container-outer", ".home-diamond-sticky"],
          {
            z: -500,
            scale: 0.5,
            // scale: 0.35,
            duration: 1,
          }
        );
      });
    });

    const timeout = setTimeout(delayedAnimation, 500);

    return () => {
      clearTimeout(timeout);
    };
  });

  return <>{children}</>;
}

export default HDAnimationsWrapper;
