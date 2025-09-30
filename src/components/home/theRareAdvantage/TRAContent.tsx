"use client";

import TypedText from "@/components/interactions/TypedText";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useState } from "react";
import TRABendingLine from "./TRABendingLine";
import TRAHeading from "./TRAHeading";

function TRAContent() {
  const [tlText, setTlText] = useState<GSAPTimeline | null>(null);

  useGSAP(() => {
    const tlTextTrigger = gsap.timeline({
      scrollTrigger: {
        trigger: ".tra-content-p-1",
        start: "top 95%",
      },
    });

    setTlText(tlTextTrigger);
  });

  return (
    <div className="w-full relative pt-32 mb-20 z-10">
      <div className="text-white px-8 lg:px-14 relative space-y-8">
        <TRAHeading />

        {/* <div className="sm:absolute sm:right-0 sm:-bottom-2 md:-bottom-10 sm:translate-y-full text-center sm:text-right text-base md:text-lg lg:text-xl font-roboto-flex font-extralight text-gray-400 px-8 lg:px-14"> */}
        <div className="hidden sm:block interactable sm:absolute sm:right-0 sm:-bottom-2 md:bottom-auto md:top-0 md:-translate-y-[20%] text-center sm:text-right text-base md:text-lg lg:text-xl font-roboto-flex font-extralight text-gray-400 px-8 lg:px-14">
          <p className="tra-content-p-1 -z-10">
            <TypedText
              text="Design that hits different."
              timeline={tlText}
              rtl
            />
          </p>
          <p className="-z-10">
            <TypedText
              text="Code that moves with intent."
              timeline={tlText}
              rtl
            />
          </p>
          <p className="mb-3 -z-10">
            <TypedText
              text="A team so fast, it feels like time travel."
              timeline={tlText}
              rtl
            />
          </p>
          {/* <p>RARE isn’t just better—it’s unfair.</p> */}

          <TRABendingLine initTl={tlText} />
        </div>
      </div>
    </div>
  );
}

export default TRAContent;
