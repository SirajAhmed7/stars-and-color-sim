"use client";

import DiamondCorners from "@/components/ui/DiamondCorners";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import NgCell from "./NgCell";
import useLenisInstance from "@/hooks/useLenisInstance";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function NavGrid() {
  const lenis = useLenisInstance();

  useGSAP(
    () => {
      let timeout: number;

      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 1024px)",
        (context: gsap.Context, contextSafe?: gsap.ContextSafeFunc) => {
          if (!contextSafe) return;

          const delayedAnimation = contextSafe(() => {
            const tl = gsap.timeline({
              scrollTrigger: {
                // trigger: ".nav-grid-grid",
                trigger: ".nav-grid",
                start: "top bottom",
                end: "+=200%",
                pin: true,
                scrub: true,
                // pinSpacing: false,
              },
            });
            tl.to(".nav-grid-grid", {
              opacity: 1,
              pointerEvents: "auto",
              duration: 0.0001,
            });
            tl.to(".cell-left", {
              x: 0,
            });
            tl.to(
              ".cell-center",
              {
                y: 0,
              },
              "<0.15"
            );
            tl.to(
              ".cell-right",
              {
                y: 0,
              },
              "<0.15"
            );
            tl.to(".nav-grid-grid", {
              backgroundColor: "#060606",
              duration: 0.001,
            });

            // const lineTl = gsap.timeline({
            //   scrollTrigger: {
            //     trigger: ".nav-grid",
            //     start: "top top",
            //     end: "+=100%",
            //     scrub: true,
            //     pin: true,
            //   },
            // });

            tl.to(".ng-line-vertical", {
              scaleY: 1,
              stagger: 0.1,
            });
            tl.to(
              ".ng-line-horizontal",
              {
                scaleX: 1,
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
    {
      dependencies: [lenis],
      revertOnUpdate: true,
    }
  );

  return (
    // <section className="nav-grid w-full min-h-screen relative z-30">
    <section className="nav-grid w-full relative z-30">
      <DiamondCorners />
      {/* <Container> */}
      <div className="hidden lg:block absolute top-0 left-0 w-full h-screen z-40 -translate-y-full pointer-events-none">
        <div className="ng-line-vertical absolute top-0 left-[33.33%] -translate-x-1/2 w-0.5 h-full bg-gray-800 origin-top scale-y-0"></div>
        <div className="ng-line-vertical absolute top-0 left-[66.66%] -translate-x-1/2 w-0.5 h-full bg-gray-800 origin-top scale-y-0"></div>
        <div className="ng-line-horizontal absolute top-1/2 -translate-y-1/2 left-[33.33%] w-[66.66%] h-0.5 bg-gray-800 origin-left scale-x-0"></div>
      </div>
      {/* <div className="w-full h-screen pt-36 pb-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-2"> */}
      <div className="nav-grid-grid absolute top-0 left-0 nav-grid-grid w-full h-screen grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 bg-background/0 lg:-translate-y-full lg:opacity-0">
        <NgCell
          className="lg:row-span-2 col-start-1 lg:-translate-x-full cell-left max-lg:border border-b border-gray-800"
          text="Services"
          image="/images/home/ng-services-robot.png"
          imageClass="md:object-cover contrast-[1.07] saturate-[0.5]"
          href="/services"
        />
        <NgCell
          className="lg:-translate-y-full lg:border-l border-b border-gray-800 sm:border-background cell-center"
          text="Subscription"
          image="/images/home/ng-pricing-dollar.png"
          href="/subscription"
        />
        <NgCell
          className="lg:-translate-y-full lg:border-l border-b border-gray-800 sm:border-background cell-right"
          text="Portfolio"
          image="/images/home/ng-work-diamond.png"
          href="/portfolio"
        />
        <NgCell
          className="lg:translate-y-full max-lg:border-b lg:border-l border-gray-800 sm:border-background cell-center"
          text="About us"
          image="/images/home/ng-about-person.png"
          href="/about"
        />
        <NgCell
          className="lg:translate-y-full max-lg:border-b lg:border-l border-gray-800 sm:border-background cell-right"
          text="FAQ"
          image="/images/home/ng-faq-question-mark.png"
          href="/f-a-q"
        />
      </div>
    </section>
  );
}

export default NavGrid;
