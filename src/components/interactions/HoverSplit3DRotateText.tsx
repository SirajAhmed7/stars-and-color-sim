import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useRef } from "react";
import SplitType from "split-type";

type HoverSplit3DRotateTextProps = {
  children: React.ReactNode;
  index: string;
  textClassName?: string;
};

const HoverSplit3DRotateText = ({
  children,
  index,
  textClassName,
}: HoverSplit3DRotateTextProps) => {
  const hover = useRef<HTMLDivElement>(null);
  const normalLettersRef = useRef<HTMLDivElement>(null);
  const italicLettersRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!normalLettersRef.current || !italicLettersRef.current) return;

    const normalLetters = new SplitType(normalLettersRef.current, {
      types: "chars",
    });
    const italicLetters = new SplitType(italicLettersRef.current, {
      types: "chars",
      charClass: "scale-x-0 opacity-0",
    });

    const linkHoverTl = gsap.timeline({ paused: true });
    linkHoverTl
      .fromTo(
        hover.current,
        {
          x: 0,
        },
        {
          x: 30,
          ease: "expo.inOut",
          duration: 0.75,
        }
      )
      .fromTo(
        normalLetters.chars,
        {
          xPercent: 0,
          scaleX: 1,
          opacity: 1,
        },
        {
          xPercent: 50,
          scaleX: 0,
          opacity: 0,
          stagger: 0.04,
          ease: "expo.inOut",
        },
        "<"
      )
      .fromTo(
        italicLetters.chars,
        {
          xPercent: -50,
          scaleX: 0,
          opacity: 0,
        },
        {
          xPercent: 0,
          scaleX: 1,
          opacity: 1,
          stagger: 0.04,
          ease: "expo.inOut",
        },
        "<+.1"
      );

    const handleMouseEnter = () => linkHoverTl.play();
    const handleMouseLeave = () => linkHoverTl.reverse();

    hover.current?.addEventListener("mouseenter", handleMouseEnter);
    hover.current?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      hover.current?.removeEventListener("mouseenter", handleMouseEnter);
      hover.current?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // const letters = children?.toString().split("");
  const letters = children?.toString() as string;

  return (
    <div ref={hover} className="relative">
      <span className="absolute left-0 top-0 font-light text-sm lg:text-xl 3xl:text-2xl -translate-x-full">
        {index}
      </span>
      {/* <div className="flex text-6xl 2xl:text-7xl font-serif">
        {letters?.map((letter, i) => (
          <div
            className={`relative letter ${i === 0 ? "uppercase" : ""}`}
            // key={letter + index + Math.ceil(Math.random() * 900)}
            key={i}
          >
            <span
              ref={(crr) => {
                if (crr) normalLetters.current.push(crr);
              }}
              className="font-harmond font-semibold condensed non-italic inline-block"
            >
              {letter}
            </span>
            <span
              ref={(crr) => {
                if (crr) italicLetters.current.push(crr);
              }}
              className="font-harmond font-semibold condensed italic inline-block mt-2 2xl:mt-3 absolute top-0 left-0 scale-x-0 opacity-0"
            >
              {letter}
            </span>
          </div>
        ))}
      </div> */}
      <div className="text-4xl 3xl:text-7xl font-serif">
        <div
          ref={normalLettersRef}
          className={"font-harmond font-semibold condensed"}
        >
          {letters?.at(0)?.toUpperCase() + letters?.slice(1)}
        </div>
        <div
          ref={italicLettersRef}
          className={
            "absolute top-0 left-0 w-full h-full font-harmond font-semibold condensed italic"
          }
        >
          {letters?.at(0)?.toUpperCase() + letters?.slice(1)}
        </div>
      </div>
    </div>
  );
};

export default HoverSplit3DRotateText;
