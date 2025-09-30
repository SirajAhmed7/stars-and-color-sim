"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import MtoCard from "./MtoCard";

function MtoCardsContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const floatContainerRef = useRef<HTMLDivElement>(null);
  const [stDims, setStDims] = useState({ windowHeight: 0, cardHeight: 0 });

  useEffect(() => {
    function setDims() {
      setStDims({
        windowHeight: window.innerHeight,
        cardHeight:
          document.querySelector(".mto-card")?.getBoundingClientRect().height ||
          0,
      });
    }

    setDims();

    window.addEventListener("resize", setDims);

    return () => {
      window.removeEventListener("resize", setDims);
    };
  }, []);

  useGSAP(
    (context: gsap.Context, contextSafe?: gsap.ContextSafeFunc) => {
      if (!contextSafe) return;

      const delayedAnimation = contextSafe(() => {
        const mm = gsap.matchMedia();

        mm.add("(min-width: 640px)", () => {
          gsap.to(floatContainerRef.current, {
            yPercent: -2.3,
            ease: "power1.inOut",
            duration: 2,
            repeat: -1,
            yoyo: true,
          });

          const cards = document.querySelectorAll(".mto-card");

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
          const cart33Percent = (0 * stDims.cardHeight) / 100;
          const card33PercentWindowPercent =
            (cart33Percent / stDims.windowHeight) * 100;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 50%",
              // end: "bottom bottom+=50px",
              // end: "+=300",
              // end: "+=62%",
              // end: "+=62%",
              end: `+=${80 + card33PercentWindowPercent - cardOffsetTop}%`,
              scrub: 0.5,
              // pin: true,
              // markers: true,
            },
          });

          const pinContaier = ScrollTrigger.create({
            trigger: containerRef.current,
            // start: "top top-=12%",
            // end: "+=100%",
            start: `top top-=${card33PercentWindowPercent - cardOffsetTop}%`,
            end: "+=33%",
            pin: true,
          });

          // gsap.to(".mto-cards-container", {
          //   y: -15,
          //   duration: 1.5,
          //   ease: "power1.inOut",
          //   repeat: -1,
          //   yoyo: true,
          // });

          const pos = [
            {
              x: "120%",
              y: "0%",
            },
            {
              x: "60%",
              y: "110%",
            },
            {
              x: "0%",
              y: "0%",
            },
            {
              x: "-60%",
              y: "110%",
            },
            {
              x: "-120%",
              y: "0%",
            },
          ];

          cardsArray.forEach((card: Element, i: number) => {
            const cardBack = card.querySelector(".mto-card-back");
            const cardFront = card.querySelector(".mto-card-front");

            tl.to(
              card,
              {
                x: pos[i].x,
                // y: pos[i].y,
                // rotationY: "-180deg",
                // y: "-33%",
              },
              i > 0 ? "<0.02" : "0"
            );
          });

          cardsArray.forEach((card: Element, i: number) => {
            const cardBack = card.querySelector(".mto-card-back");
            const cardFront = card.querySelector(".mto-card-front");

            tl.to(
              card,
              {
                // x: pos[i].x,
                y: pos[i].y,
                // rotationY: "-180deg",
                // y: "-33%",
              },
              i > 0 ? "<0.02" : ">"
            );
          });

          cardsArray.forEach((card: Element, i: number) => {
            const cardBack = card.querySelector(".mto-card-back");
            const cardFront = card.querySelector(".mto-card-front");

            tl.to(
              cardBack,
              {
                // transform: "rotateY(-180deg)",
                rotationY: 180,
              },
              // "<"
              i > 0 ? "<0.02" : ">"
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
      });

      const timeout = setTimeout(delayedAnimation, 180);

      return () => {
        clearTimeout(timeout);
      };
    },
    {
      dependencies: [stDims],
      revertOnUpdate: true,
    }
  );

  return (
    <div ref={containerRef} className="w-full min-h-[160vh] relative">
      <div
        ref={floatContainerRef}
        // className="relative sm:absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center gap-6 sm:block"
        className="relative sm:absolute top-0 left-0 w-full h-full grid grid-cols-1 justify-center justify-items-center gap-6 sm:block"
      >
        <MtoCard
          heading="Pooja Hooda"
          text="Code Ninja"
          imgFront="card-front-pooja"
        />
        <MtoCard
          heading="Siraj A. Khatri"
          text="Interaction Sorcerer"
          imgFront="card-front-siraj"
        />
        <MtoCard
          heading="Akshay Hooda"
          text="Creative Supreme"
          imgFront="card-front-akshay"
          className="row-start-2"
        />
        <MtoCard
          heading="Rohan Rajak"
          text="Backend Overlord"
          imgFront="card-front-rohan"
        />
        <MtoCard
          heading="Samruddhi Hardas"
          text="Product Wizard"
          imgFront="card-front-sam"
          className="row-start-3"
        />
      </div>
    </div>
  );
}

export default MtoCardsContainer;
