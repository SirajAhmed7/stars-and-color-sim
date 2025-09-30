"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { ContactData } from "./ContactFormSlides";
import { cn } from "@/utils/utils";

function SelectAService({
  contactData,
  handleChange,
}: {
  contactData: ContactData;
  handleChange: (
    newContactData: ContactData,
    curSectionNum: number,
    toSectionNum: number
  ) => void;
}) {
  const services = ["Design", "Development", "Design + Dev", "Ask a Quote"];

  useGSAP(() => {
    const letters = new SplitType(".select-a-service-heading", {
      types: "chars",
      charClass: "origin-bottom scale-y-0",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".select-a-service",
        start: "top 40%",
      },
    });

    tl.to(letters.chars, {
      scaleY: 1,
      stagger: 0.017,
      duration: 0.55,
      ease: "power3.inOut",
    });
    tl.to(
      ".select-a-service-btn",
      {
        yPercent: -100,
        duration: 0.5,
        stagger: 0.07,
        ease: "power3.inOut",
      },
      "<0.2"
    );
    tl.to(
      ".form-num-indicator",
      {
        yPercent: -100,
        duration: 0.5,
        ease: "power3.inOut",
      },
      "<0.2"
    );
  });

  return (
    <div className="select-a-service w-screen h-full flex justify-center items-center">
      <div className="space-y-20 text-center -translate-y-1/4">
        <h2 className="select-a-service-heading font-harmond condensed font-semibold text-9xl">
          Select a service
        </h2>

        <div className="grid grid-cols-4 gap-12 overflow-hidden">
          {services.map((service: string, i: number) => (
            <button
              key={service + i}
              className={cn(
                "select-a-service-btn h-full text-3xl font-extralight flex items-center justify-center gap-4 px-10 py-6 transition-colors duration-300 translate-y-full min-w-64",
                service === contactData.service
                  ? "bg-white text-gray-900 font-normal"
                  : "bg-gray-900"
              )}
              onClick={() => {
                handleChange({ ...contactData, service }, 1, 2);
              }}
            >
              <span className="">{service}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SelectAService;
