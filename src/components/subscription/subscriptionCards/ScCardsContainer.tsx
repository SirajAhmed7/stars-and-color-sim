"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import ScCard from "./ScCard";

function ScCardsContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const floatContainerRef = useRef<HTMLDivElement>(null);
  const [stDims, setStDims] = useState({ windowHeight: 0, cardHeight: 0 });

  useEffect(() => {
    function setDims() {
      setStDims({
        windowHeight: window.innerHeight,
        cardHeight:
          document.querySelector(".sc-card")?.getBoundingClientRect().height ||
          0,
      });
    }

    setDims();

    window.addEventListener("resize", setDims);

    return () => {
      window.removeEventListener("resize", setDims);
    };
  }, []);

  // useGSAP(
  //   () => {
  //     const mm = gsap.matchMedia();

  //     mm.add("(min-width: 640px)", () => {
  //       gsap.to(floatContainerRef.current, {
  //         yPercent: -2.3,
  //         ease: "power1.inOut",
  //         duration: 2,
  //         repeat: -1,
  //         yoyo: true,
  //       });

  //       const cards = document.querySelectorAll(".sc-card");

  //       const cardsArray = Array.from(cards);
  //       cardsArray.reverse();

  //       cardsArray.forEach((card: Element, i: number) => {
  //         const setFactor = 2 - i - 1;
  //         const xPosStart = 15 * setFactor;
  //         const yPosStart = 15 * setFactor;

  //         // gsap.set(card, {
  //         //   x: xPosStart,
  //         //   y: yPosStart,
  //         // });
  //         gsap.set(card, {
  //           // translate: "-50% 0",
  //           xPercent: -50,
  //           // transform: `translate(${xPosStart}px, ${yPosStart}px)`,
  //           translateX: xPosStart,
  //           translateY: yPosStart,
  //         });
  //       });

  //       const cardHeightPercent =
  //         (stDims.cardHeight / stDims.windowHeight) * 100;
  //       const cardOffsetTop = (100 - cardHeightPercent) / 2;
  //       const cart33Percent = (0 * stDims.cardHeight) / 100;
  //       const card33PercentWindowPercent =
  //         (cart33Percent / stDims.windowHeight) * 100;

  //       const tl = gsap.timeline({
  //         scrollTrigger: {
  //           trigger: containerRef.current,
  //           start: "top 50%",
  //           end: `+=${80 + card33PercentWindowPercent - cardOffsetTop}%`,
  //           scrub: 0.5,
  //         },
  //       });

  //       const pinContaier = ScrollTrigger.create({
  //         trigger: containerRef.current,
  //         // start: "top top-=12%",
  //         // end: "+=100%",
  //         start: `top top-=${card33PercentWindowPercent - cardOffsetTop}%`,
  //         end: `+=39%`,
  //         pin: true,
  //       });

  //       // gsap.to(".tra-cards-container", {
  //       //   y: -15,
  //       //   duration: 1.5,
  //       //   ease: "power1.inOut",
  //       //   repeat: -1,
  //       //   yoyo: true,
  //       // });
  //       const pos = [
  //         {
  //           x: "115%",
  //           y: "110%",
  //         },
  //         {
  //           x: "115%",
  //           y: "00%",
  //         },
  //         {
  //           x: "0%",
  //           y: "110%",
  //         },
  //         {
  //           x: "0%",
  //           y: "0%",
  //         },
  //         {
  //           x: "-115%",
  //           y: "110%",
  //         },
  //         {
  //           x: "-115%",
  //           y: "0%",
  //         },
  //       ];

  //       cardsArray.forEach((card: Element, i: number) => {
  //         tl.to(
  //           card,
  //           {
  //             // x: xPosEnd[i as keyof typeof xPosEnd],
  //             x: pos[i].x,
  //             y: pos[i].y,
  //           },
  //           i > 0 ? "<0.02" : "0"
  //         );
  //       });

  //       cardsArray.forEach((card: Element, i: number) => {
  //         const cardBack = card.querySelector(".sc-card-back");
  //         const cardFront = card.querySelector(".sc-card-front");

  //         tl.to(
  //           cardBack,
  //           {
  //             // transform: "rotateY(-180deg)",
  //             rotationY: 180,
  //           },
  //           // "<"
  //           i > 0 ? "<0.02" : ">"
  //         );
  //         tl.to(
  //           cardFront,
  //           {
  //             rotationY: 360,
  //           },
  //           "<"
  //         );
  //       });
  //     });
  //   },
  //   {
  //     dependencies: [stDims],
  //     revertOnUpdate: true,
  //   }
  // );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 640px)", () => {
        gsap.to(floatContainerRef.current, {
          yPercent: -2.3,
          ease: "power1.inOut",
          duration: 2,
          repeat: -1,
          yoyo: true,
        });

        const cards = document.querySelectorAll(".sc-card");

        const cardsArray = Array.from(cards);
        cardsArray.reverse();

        cardsArray.forEach((card: Element, i: number) => {
          const setFactor = 2 - i - 1;
          const xPosStart = 15 * setFactor;
          const yPosStart = 15 * setFactor;

          // gsap.set(card, {
          //   x: xPosStart,
          //   y: yPosStart,
          // });
          gsap.set(card, {
            // translate: "-50% 0",
            xPercent: -50,
            // transform: `translate(${xPosStart}px, ${yPosStart}px)`,
            translateX: xPosStart,
            translateY: yPosStart,
          });
        });

        const cardHeightPercent =
          (stDims.cardHeight / stDims.windowHeight) * 100;
        const cardOffsetTop = (100 - cardHeightPercent) / 2;
        const cart33Percent = (33 * stDims.cardHeight) / 100;
        const card33PercentWindowPercent =
          (cart33Percent / stDims.windowHeight) * 100;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 40%",
            end: `+=${50 + card33PercentWindowPercent - cardOffsetTop}%`,
            scrub: 0.5,
          },
        });

        const pinContaier = ScrollTrigger.create({
          trigger: containerRef.current,
          // start: "top top-=12%",
          // end: "+=100%",
          start: `top top-=${card33PercentWindowPercent - cardOffsetTop}%`,
          end: `+=100%`,
          pin: true,
        });

        // gsap.to(".tra-cards-container", {
        //   y: -15,
        //   duration: 1.5,
        //   ease: "power1.inOut",
        //   repeat: -1,
        //   yoyo: true,
        // });

        cardsArray.forEach((card: Element, i: number) => {
          const cardBack = card.querySelector(".sc-card-back");
          const cardFront = card.querySelector(".sc-card-front");

          // const xPosEnd = {
          //   0: "155%",
          //   1: "52%",
          //   2: "-52%",
          //   3: "-155%",
          // };
          const xPosEnd = {
            0: "110%",
            1: "0%",
            2: "-110%",
          };

          tl.to(
            card,
            {
              x: xPosEnd[i as keyof typeof xPosEnd],
              y: "33%",
              // rotationY: "-180deg",
              // y: "-33%",
            },
            i > 0 ? "<0.02" : "0"
          );
          tl.to(
            cardBack,
            {
              // transform: "rotateY(-180deg)",
              rotationY: 180,
            },
            "<"
          );
          tl.to(
            cardFront,
            {
              rotationY: 360,
            },
            "<"
          );
        });
      });
    },
    {
      dependencies: [stDims],
      revertOnUpdate: true,
    }
  );

  return (
    <div
      ref={containerRef}
      className="sc-cards-container w-full sm:h-[120vh] relative flex flex-col justify-center items-center gap-6 sm:block"
    >
      <div
        ref={floatContainerRef}
        className="relative sm:absolute top-0 left-0 w-full h-full grid grid-cols-1 justify-center justify-items-center gap-6 sm:block"
      >
        <ScCard
          price="9,990"
          heading="Everything Design"
          points={[
            "End-to-End Immersive Brand Design",
            "Dashboard UX mapped end-to-end",
            "3D + Micro-Interactions driven delight",
            "World-class UI/UX with tokenised system",
            "Launch kit- copy, assets, hand-off files",
          ]}
          cardFrontImg="subscription-card-front"
        />

        <ScCard
          price="14,990"
          heading="Everything Development"
          points={[
            "Next.js + React Query + TS stack",
            "React Native + Expo or Flutter 3.x",
            "GSAP-powered animation & scroll magic",
            "Scalable service & DB architecture (AWS)",
            "End-to-end tests, error tracking, Sentry",
          ]}
          cardFrontImg="subscription-card-front"
        />

        <ScCard
          price="24,980"
          heading="Design + Development"
          points={[
            "All things in “Everything Design” Card",
            "All things in “Everything Dev.” Card",
            "Surpassing Founder Vision via synergies",
            "Rigorous Design-Dev Handoff Reviews",
            "Enhanced UX & 100% Fidelity rendering",
          ]}
          cardFrontImg="subscription-card-front"
        />
      </div>
    </div>
  );
}

export default ScCardsContainer;
