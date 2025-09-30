"use client";

import TRABendingLine from "@/components/home/theRareAdvantage/TRABendingLine";
import TypedText from "@/components/interactions/TypedText";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextPlugin from "gsap/TextPlugin";
import { useState } from "react";
import ScHeading from "./ScHeading";

gsap.registerPlugin(useGSAP, ScrollTrigger, TextPlugin);

function ScContent() {
  const [tlText, setTlText] = useState<GSAPTimeline | null>(null);

  useGSAP(() => {
    const tlTextTrigger = gsap.timeline({
      scrollTrigger: {
        trigger: ".subscription-content-p-1",
        start: "top 95%",
      },
    });

    setTlText(tlTextTrigger);
  });

  return (
    <div className="relative pt-32 mb-20 lg:mb-36">
      <ScHeading />

      <div className="hidden sm:block interactable sm:absolute sm:right-0 sm:-bottom-2 md:bottom-auto md:top-0 md:translate-y-[43%] text-center sm:text-right text-base md:text-lg lg:text-xl font-roboto-flex font-extralight text-gray-400 px-8 lg:px-14">
        <p className="subscription-content-p-1 -z-10">
          <TypedText text="Excellence never" timeline={tlText} rtl />
        </p>
        <p className="-z-10">
          <TypedText text="comes discounted." timeline={tlText} rtl />
        </p>

        <TRABendingLine lineClassName="w-[50%]" initTl={tlText} />
      </div>
    </div>
  );
}

export default ScContent;
