"use client";

import { useScrollSmoother } from "@/contexts/ScrollSmootherContext";
import useLenisInstance from "@/hooks/useLenisInstance";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

function ScpAnimationsWrapper({ children }: { children: React.ReactNode }) {
  // const { scroller } = useScrollSmoother();
  const lenis = useLenisInstance();

  useGSAP(
    () => {
      let timeout: number;

      const mm = gsap.matchMedia();

      mm.add(
        { isLg: "(min-width: 1024px)", isSm: "(max-width: 1023px)" },
        (context: gsap.Context, contextSafe?: gsap.ContextSafeFunc) => {
          if (!contextSafe) return;

          const delayedAnimation = contextSafe(() => {
            const isLg = context.conditions?.isLg;

            const videoSticky = ScrollTrigger.create({
              trigger: ".scp-video-sticky",
              start: "top top-=50%",
              end: isLg ? "+=400%" : "+=300%",
              // end: "bottom bottom-=50%",
              pin: true,
            });

            if (isLg) {
              gsap.set(".scp-video", {
                y: "27vh",
                z: 200,
              });

              gsap.to(".scp-video", {
                scrollTrigger: {
                  trigger: ".scp-video-sticky",
                  start: "top 50%",
                  end: "top top",
                  scrub: true,
                },
                z: 0,
                y: 0,
              });
            }

            // const contentPin = ScrollTrigger.create({
            //   trigger: ".scp-sticky",
            //   start: "top top",
            //   end: "+=400%",
            //   pin: true,
            // });

            // const subHeadings = [
            //   "Launch before your competitors finish their pitch decks.",
            //   "Unconventional thinking, beautifully executed.",
            //   "Because sloppy kills momentum—and trust.",
            // ];

            // const letters = new SplitType(".scp-heading-word", {
            //   types: "chars",
            //   charClass: "origin-bottom scale-y-0",
            // });

            const letters1 = new SplitType(".scp-heading-1", {
              types: "chars",
              // charClass: "origin-bottom scale-y-0 blur-xl opacity-0",
              charClass: "origin-bottom scale-y-0",
            });

            const letters2 = new SplitType(".scp-heading-2", {
              types: "chars",
              // charClass: "origin-bottom scale-y-0 blur-xl opacity-0",
              charClass: "origin-bottom scale-y-0",
            });

            const letters3 = new SplitType(".scp-heading-3", {
              types: "chars",
              // charClass: "origin-bottom scale-y-0 blur-xl opacity-0",
              charClass: "origin-bottom scale-y-0",
            });

            // const textEl = document.querySelector(".scp-text");

            // const tl1 = gsap.timeline({
            //   scrollTrigger: {
            //     trigger: ".speed-creativity-precision",
            //     start: "top top-=200%",
            //     // end: "top+=200vh top",
            //     toggleActions: "play none none reverse",
            //     // markers: true,
            //     // once: true,
            //     onEnter: () => {
            //       scramble(subHeadings[1], textEl!);
            //     },
            //     onLeaveBack: () => {
            //       // console.log("entered back");
            //       scramble(subHeadings[0], textEl!);
            //     },
            //   },
            // });

            const stSticky = ScrollTrigger.create({
              trigger: ".scp-content-sticky",
              start: "top top",
              end: isLg ? "+=450%" : "+=300%",
              // end: "top+=200vh top",
              pin: true,
              anticipatePin: 1,
            });

            const tl0 = gsap.timeline({
              scrollTrigger: {
                trigger: ".speed-creativity-precision",
                start: "top top-=50%",
                toggleActions: "play none none reverse",
              },
            });
            // tl0.to(letters1.chars, {
            //   scaleY: 1,
            //   stagger: 0.02,
            //   duration: 0.5,
            //   ease: "power2.inOut",
            // });
            tl0.to(letters1.chars, {
              scaleY: 1,
              // filter: "blur(0px)",
              // opacity: 1,
              stagger: 0.017,
              duration: 0.55,
              ease: "power3.inOut",
            });

            tl0.to(
              ".scp-corner-line-star",
              {
                opacity: 1,
                duration: 0.3,
                ease: "power1.out",
              },
              "<0.2"
            );

            tl0.to(
              ".scp-corner-line",
              {
                scaleX: 1,
                duration: 0.6,
                ease: "power3.inOut",
              },
              "<"
            );

            tl0.to(
              // [".scp-corner-diamond", ".scp-corner-text"],
              ".scp-corner-text",
              {
                yPercent: -105,
                duration: 0.3,
                ease: "power3.inOut",
                stagger: 0.05,
              },
              "<0.3"
            );
            tl0.to(
              ".scp-text",
              {
                yPercent: -100,
                duration: 0.25,
                ease: "power1.inOut",
              },
              "<"
            );

            tl0.to(
              ".scp-number-text",
              {
                yPercent: -105,
                duration: 0.4,
                ease: "power3.inOut",
              },
              "<0.3"
            );
            tl0.to(
              ".scp-nums",
              {
                yPercent: -33.3,
                duration: 0.4,
                ease: "power3.inOut",
              },
              "<0.15"
            );

            tl0.to(
              ".scp-number-line-star",
              {
                opacity: 1,
                duration: 0.3,
                ease: "power1.out",
              },
              ">-0.2"
            );

            tl0.to(
              ".scp-number-line",
              {
                scaleX: 1,
                duration: 0.6,
                ease: "power3.inOut",
              },
              "<"
            );

            const tl1 = gsap.timeline({
              scrollTrigger: {
                trigger: ".speed-creativity-precision",
                start: "top top-=150%",
                // end: "+=300%",
                // end: "top+=200vh top",
                // pin: true,
                toggleActions: "play none none reverse",
                // markers: true,
                // once: true,
                // onEnter: () => {
                //   scramble(subHeadings[1], textEl!);
                // },
                // onLeaveBack: () => {
                //   // console.log("entered back");
                //   scramble(subHeadings[0], textEl!);
                // },
              },
            });

            tl1.set(letters1.chars, {
              transformOrigin: "top",
              scaleY: 1,
              // filter: "blur(0px)",
              // opacity: 1,
            });

            tl1.set(".scp-nums", {
              yPercent: -33.3,
            });
            tl1.to(letters1.chars, {
              scaleY: 0,
              // filter: "blur(24px)",
              // opacity: 0,
              stagger: 0.017,
              duration: 0.55,
              ease: "power3.inOut",
            });
            tl1.to(
              letters2.chars,
              {
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
              ".scp-text",
              {
                yPercent: -200,
                duration: 0.6,
                ease: "power2.inOut",
              },
              "<0.25"
            );
            tl1.to(
              ".scp-nums",
              {
                yPercent: -66.7,
                duration: 0.4,
                ease: "power1.inOut",
              },
              "<0.2"
            );

            const tl2 = gsap.timeline({
              scrollTrigger: {
                trigger: ".speed-creativity-precision",
                start: "top top-=250%",
                // end: "top+=100% top",
                toggleActions: "play none none reverse",
                // once: true,
                // onEnter: () => {
                //   scramble(subHeadings[2], textEl!);
                // },
                // onLeaveBack: () => {
                //   scramble(subHeadings[1], textEl!);
                // },
              },
            });
            tl2.set(letters2.chars, {
              transformOrigin: "top",
              scaleY: 1,
              // filter: "blur(0px)",
              // opacity: 1,
            });
            tl2.set(".scp-nums", {
              yPercent: -66.7,
            });
            tl2.to(letters2.chars, {
              scaleY: 0,
              // filter: "blur(24px)",
              // opacity: 0,
              stagger: 0.017,
              duration: 0.55,
              ease: "power3.inOut",
            });
            tl2.to(
              letters3.chars,
              {
                scaleY: 1,
                // filter: "blur(0px)",
                // opacity: 1,
                stagger: 0.017,
                duration: 0.55,
                ease: "power3.inOut",
              },
              "<"
            );
            tl2.to(
              ".scp-text",
              {
                yPercent: -300,
                duration: 0.6,
                ease: "power2.inOut",
              },
              "<0.25"
            );
            tl2.to(
              ".scp-nums",
              {
                // yPercent: -66.6,
                yPercent: -100,
                duration: 0.4,
                ease: "power1.inOut",
              },
              "<0.2"
            );
          });

          timeout = setTimeout(delayedAnimation, 300);
        }
      );

      return () => {
        clearTimeout(timeout);
      };
    },
    { dependencies: [lenis], revertOnUpdate: true }
  );

  return <>{children}</>;
}

export default ScpAnimationsWrapper;
