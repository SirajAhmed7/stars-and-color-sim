"use client";

import ScrollSnapWrapper from "@/components/interactions/ScrollSnapWrapper";
import Bar from "./Bar";
import SectionContainer from "@/components/interactions/SectionContainer";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function TextBars({ text }: { text: string }) {
  useGSAP(() => {
    const barTop = gsap.utils.toArray(".bar-top");
    const barBottom = gsap.utils.toArray(".bar-bottom");
    const barFront = gsap.utils.toArray(".bar-front");
    const barBack = gsap.utils.toArray(".bar-back");

    const barText = gsap.utils.toArray(".bar-text");
    const barText2 = gsap.utils.toArray(".bar-text-2");

    gsap.to(barText, {
      translateX: "-25.24%",
      duration: 5,
      repeat: -1,
      ease: "none",
      // yoyo: true,
    });

    gsap.to(barText2, {
      translateX: "-18.24%",
      // translateX: "-32.24%",
      duration: 5,
      repeat: -1,
      ease: "none",
      // yoyo: true,
    });

    gsap.to(barTop, {
      rotationX: "-270deg",
      duration: 8,
      repeat: -1,
      ease: "none",
      // yoyo: true,
    });

    gsap.to(barBottom, {
      rotationX: "-270deg",
      duration: 8,
      repeat: -1,
      ease: "none",
      // yoyo: true,
    });

    gsap.to(barFront, {
      rotationX: "-360deg",
      duration: 8,
      repeat: -1,
      ease: "none",
      // yoyo: true,
    });

    gsap.to(barBack, {
      rotationX: "-360deg",
      duration: 8,
      repeat: -1,
      ease: "none",
      // yoyo: true,
    });
  });

  return (
    <SectionContainer
      curSecClassName="text-bars"
      prevSecClassName="hero"
      nextSecClassName="home-diamond"
      className="h-[150vh]"
    >
      <div
        className="h-[150vh] relative"
        style={{
          transformStyle: "preserve-3d",
          // perspective: 1000,
          perspective: 1500,
        }}
      >
        {/* <Bar
          text={text}
          barYPosition="10%"
          barAngle="translateZ(-200px) rotateY(0deg) rotateX(30deg) rotateZ(70deg)"
        /> */}
        {/* 
        <Bar
          text={text}
          barYPosition="40%"
          barAngle="rotateY(40deg) rotateX(-40deg) rotateZ(-20deg)"
        />

        <Bar
          text={text}
          barYPosition="80%"
          barAngle="rotateY(40deg) rotateX(-40deg) rotateZ(-20deg)"
          textAnimationClass="bar-text-2"
        />

        <Bar
          text={text}
          barYPosition="15%"
          barAngle="translateZ(100px) rotateY(10deg) rotateX(-50deg) rotateZ(25deg)"
        /> */}

        {/* <Bar
          text={text}
          barYPosition="-15%"
          barXPosition="-80%"
          // barAngle="translateZ(-1500px) rotateY(-5deg) rotateX(30deg) rotateZ(20deg)"
          barAngle="translateZ(-1550px) rotateY(-2deg) rotateX(30deg) rotateZ(20deg)"
        /> */}

        <Bar
          text={text}
          barYPosition="25%"
          barAngle="translateZ(-130px) rotateY(40deg) rotateX(-40deg) rotateZ(-20deg)"
        />

        <Bar
          text={text}
          barYPosition="60%"
          barAngle="translateZ(-130px) rotateY(40deg) rotateX(-40deg) rotateZ(-20deg)"
          textAnimationClass="bar-text-2"
        />

        <Bar
          text={text}
          barYPosition="30%"
          barAngle="translateZ(70px) rotateY(15deg) rotateX(-30deg) rotateZ(20deg)"
        />
      </div>
    </SectionContainer>
  );
}

export default TextBars;
