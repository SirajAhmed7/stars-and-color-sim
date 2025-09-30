"use client";

import { useScrollSmoother } from "@/contexts/ScrollSmootherContext";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import TRACard from "./TRACard";

function TRACardsContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const floatContainerRef = useRef<HTMLDivElement>(null);
  // const { scroller } = useScrollSmoother();
  const [stDims, setStDims] = useState({ windowHeight: 0, cardHeight: 0 });

  useEffect(() => {
    function setDims() {
      setStDims({
        windowHeight: window.innerHeight,
        cardHeight:
          document.querySelector(".tra-card")?.getBoundingClientRect().height ||
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

      let timeout: number;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 640px)", () => {
        const delayedAnimation = contextSafe(() => {
          gsap.to(floatContainerRef.current, {
            yPercent: -2.3,
            ease: "power1.inOut",
            duration: 2,
            repeat: -1,
            yoyo: true,
          });

          const cards = document.querySelectorAll(".tra-card");

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
              start: "top 50%",
              // end: "bottom bottom+=50px",
              // end: "+=300",
              // end: "+=62%",
              // end: "+=62%",
              end: `+=${50 + card33PercentWindowPercent - cardOffsetTop}%`,
              scrub: true,
              immediateRender: false,
              // pin: true,
              // markers: true,
            },
          });

          const pinContaier = ScrollTrigger.create({
            trigger: containerRef.current,
            // start: "top top-=12%",
            // end: "+=100%",
            start: `top top-=${card33PercentWindowPercent - cardOffsetTop}%`,
            end: "+=100%",
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
            const cardBack = card.querySelector(".tra-card-back");
            const cardFront = card.querySelector(".tra-card-front");

            const setFactor = 2 - i - 1;
            const xPosStart = 15 * setFactor;
            const yPosStart = 15 * setFactor;

            // const xPosEnd = {
            //   0: "155%",
            //   1: "52%",
            //   2: "-52%",
            //   3: "-155%",
            // };
            const xPosEnd = {
              0: "165%",
              1: "55%",
              2: "-55%",
              3: "-165%",
            };

            tl.fromTo(
              card,
              {
                x: xPosStart,
                y: yPosStart,
              },
              {
                x: xPosEnd[i as keyof typeof xPosEnd],
                y: "33%",
                // rotationY: "-180deg",
                // y: "-33%",
              },
              i > 0 ? "<0.02" : "0"
            );
            tl.fromTo(
              cardBack,
              {
                rotationY: 0,
              },
              {
                // transform: "rotateY(-180deg)",
                rotationY: 180,
              },
              "<"
            );
            tl.fromTo(
              cardFront,
              {
                rotationY: 180,
              },
              {
                rotationY: 360,
              },
              "<"
            );
          });
        });

        timeout = setTimeout(delayedAnimation, 300);
      });

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
    <div
      ref={containerRef}
      // className="tra-cards-container w-full h-[53vw] relative"
      className="tra-cards-container w-full min-h-screen relative flex flex-col justify-center items-center gap-6 sm:block"
      // style={{
      //   // transformStyle: "preserve-3d",
      //   perspective: "150rem",
      //   // transform: "translateX(-50%) rotateY(70deg)",
      // }}
    >
      <div
        ref={floatContainerRef}
        className="relative sm:absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center gap-6 sm:block"
      >
        <TRACard
          heading="All In"
          // subheading="Monthly fee."
          text={[
            "Flat Monthly Fee",
            "Immersive Brand Design",
            "Advanced Tech Stack",
            "Award-Winning Standard",
            "Zero Hidden Charges",
          ]}
          cardFrontImg="card-front-1"
        />
        <TRACard
          heading="Fast Track"
          subheading="Infinite requests."
          text={[
            "30 Day Builds",
            "Brand To Code",
            "Unlimited Task Queue",
            "Iterative Design Cycles",
            "Launch Ready Assets",
          ]}
          cardFrontImg="card-front-2"
        />
        <TRACard
          heading="Zero Ego"
          subheading="Elite Squad."
          text={[
            "Senior Crew",
            "Realtime Slack Sync",
            "Ego-Free Collaboration",
            "KPI Driven Decisions",
            "Daily Iterative Drops",
          ]}
          cardFrontImg="card-front-3"
        />
        <TRACard
          heading="Zero Risk"
          subheading="Trust led."
          text={[
            "Work Before Payment",
            "Cancel Any Sprint",
            "Post Launch Support",
            "Performance Guarantee",
            "Full Accountability ",
          ]}
          cardFrontImg="card-front-4"
        />
      </div>
    </div>
  );
}

export default TRACardsContainer;
