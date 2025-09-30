"use client";

import { cn } from "@/utils/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(useGSAP);

function FaqItem({
  question,
  answer,
  open,
}: {
  question: string;
  answer: string[];
  open?: boolean;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const lineVerticleRef = useRef<HTMLImageElement>(null);
  const [isOpen, setIsOpen] = useState(open ? true : false);
  const [isMobile, setIsMobile] = useState(true);
  const [gap, setGap] = useState(80);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setGap(window.innerWidth < 768 ? 32 : 80);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const { contextSafe } = useGSAP(
    () => {
      if (!wrapperRef.current || !answerRef.current || !btnRef.current) return;

      gsap.set(wrapperRef.current, {
        height: isOpen
          ? "auto"
          : wrapperRef.current?.offsetHeight -
            answerRef.current?.offsetHeight -
            gap,
      });
    },
    {
      dependencies: [gap],
      revertOnUpdate: true,
    }
  );

  const toggleFaq = contextSafe(() => {
    if (!wrapperRef.current || !answerRef.current || !btnRef.current) return;

    if (!isOpen) {
      // Open
      gsap.to(lineVerticleRef.current, {
        rotate: "+=270deg",
        duration: 0.8,
        ease: "power3.inOut",
      });
      gsap.to(wrapperRef.current, {
        height: "auto",
        duration: 0.8,
        ease: "power3.inOut",
        onComplete: () => setIsOpen((prev) => !prev),
      });
    } else {
      // Close
      gsap.to(lineVerticleRef.current, {
        rotate: "-=270deg",
        duration: 0.8,
        ease: "power3.inOut",
      });
      gsap.to(wrapperRef.current, {
        height:
          wrapperRef.current?.offsetHeight -
          answerRef.current?.offsetHeight -
          gap,
        duration: 0.8,
        ease: "power3.inOut",
        onComplete: () => setIsOpen((prev) => !prev),
      });
    }
  });

  return (
    <div
      ref={wrapperRef}
      className="w-full px-5 py-8 md:px-12 md:py-16 bg-gray-950 space-y-8 md:space-y-20 relative overflow-hidden border md:border-none border-b border-gray-800"
      style={{
        clipPath: isMobile
          ? ""
          : `polygon(0 0, calc(100% - var(--frame-size) * 2) 0, 100% calc(var(--frame-size) * 2), 100% 100%, 0 100%)`,
      }}
    >
      <div className="flex items-start md:items-center gap-3 sm:gap-6 md:gap-10">
        <div className="aspect-square w-6 sm:w-8 md:w-16 relative">
          <Image
            src={"/images/f-a-q/faq-diamond.svg"}
            alt="Diamond"
            fill
            className="w-full h-full object-contain"
          />
        </div>

        <button
          ref={btnRef}
          className="after:absolute after:top-0 after:left-0 after:w-full after:h-full z-10"
          onClick={toggleFaq}
        >
          <h2 className="font-harmond condensed font-semibold text-3xl sm:text-5xl lg:text-8xl min-[1920px]:text-[120px] leading-none text-left">
            {question}
          </h2>
        </button>

        <div className="aspect-square w-6 sm:w-8 md:w-16 ml-auto relative z-0">
          <Image
            src={"/images/f-a-q/faq-interaction-line.svg"}
            alt="line"
            fill
            className="object-contain w-full h-full"
          />
          <Image
            ref={lineVerticleRef}
            src={"/images/f-a-q/faq-interaction-line.svg"}
            alt="line"
            fill
            className={cn(
              "object-contain w-full h-full",
              isOpen ? "" : "rotate-90"
            )}
          />
        </div>
      </div>

      {answer.length > 0 && (
        <div
          ref={answerRef}
          className="pl-9 sm:pl-[56px] md:pl-[104px] font-extralight text-xl sm:text-3xl lg:text-4xl"
        >
          {answer.map((text) => (
            <p key={`faq-item-${text.slice(0, 15)}`}>{text}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default FaqItem;
