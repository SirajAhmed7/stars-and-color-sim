"use client";

import { cn } from "@/utils/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef, useState } from "react";

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

  const gap = 80;

  const { contextSafe } = useGSAP(() => {
    if (!wrapperRef.current || !answerRef.current || !btnRef.current) return;

    gsap.set(wrapperRef.current, {
      height: isOpen
        ? "auto"
        : wrapperRef.current?.offsetHeight -
          answerRef.current?.offsetHeight -
          gap,
    });
  });

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
      className="w-full px-12 py-16 bg-gray-950 space-y-20 relative overflow-hidden"
    >
      <div className="flex items-center gap-10">
        <Image
          src={"/images/faq/faq-diamond.svg"}
          alt="Diamond"
          width={64}
          height={64}
        />

        <button
          ref={btnRef}
          className="after:absolute after:top-0 after:left-0 after:w-full after:h-full"
          onClick={toggleFaq}
        >
          <h2 className="font-harmond condensed font-semibold text-8xl min-[1920px]:text-[120px] leading-none text-left">
            {question}
          </h2>
        </button>

        <div className="aspect-square w-16 ml-auto relative">
          <Image
            src={"/images/faq/faq-interaction-line.svg"}
            alt="line"
            fill
            className="object-contain w-full h-full"
          />
          <Image
            ref={lineVerticleRef}
            src={"/images/faq/faq-interaction-line.svg"}
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
        <div ref={answerRef} className="pl-[104px] font-extralight text-4xl">
          {answer.map((text) => (
            <p key={`faq-item-${text.slice(0, 5)}`}>{text}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default FaqItem;
