"use client";

import { useEffect, useRef, useState } from "react";
import SelectAService from "./SelectAService";
import Image from "next/image";
import { cn } from "@/utils/utils";
import AboutProject from "./AboutProject";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import YourEmail from "./YourEmail";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type ContactData = {
  service: string;
  aboutProject: string;
  email: string;
};

function ContactFormSlides() {
  const [formSectionNum, setFormSectionNum] = useState(1);
  const [contactData, setContactData] = useState<ContactData>({
    service: "",
    aboutProject: "",
    email: "",
  });
  const contactFormRef = useRef<HTMLDivElement>(null);
  // const toSecondSecTl = useRef<GSAPTimeline | null>(null);
  // const toThirdSecTl = useRef<GSAPTimeline | null>(null);

  // useGSAP(() => {
  //   toSecondSecTl.current = gsap.timeline({ paused: true });

  //   toSecondSecTl.current?.fromTo(
  //     contactFormRef.current,
  //     {
  //       x: 0,
  //     },
  //     {
  //       x: "-100vw",
  //       duration: 0.5,
  //       ease: "power3.inOut",
  //     }
  //   );
  // });

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter") {
        if (
          formSectionNum === 3 &&
          contactData.service &&
          contactData.aboutProject &&
          contactData.email
        ) {
          handleChange(
            {
              service: "",
              aboutProject: "",
              email: "",
            },
            3,
            1
          );
        }
      }

      if (e.key === "ArrowLeft") {
        if (formSectionNum > 1)
          handleChange(contactData, formSectionNum, formSectionNum - 1);
      }
      if (e.key === "ArrowRight") {
        if (formSectionNum < 3) {
          if (contactData.service && formSectionNum < 2) {
            handleChange(contactData, formSectionNum, formSectionNum + 1);
          }
          if (contactData.aboutProject && formSectionNum < 3) {
            handleChange(contactData, formSectionNum, formSectionNum + 1);
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  const { contextSafe } = useGSAP(() => {
    ScrollTrigger.create({
      trigger: ".contact-form-wrapper",
      start: "top top",
      end: "+=100%",
      pin: true,
    });
  });

  const handleChange = contextSafe(function handleChange(
    // newFormSectionNum: number,
    newContactData: ContactData,
    curSectionNum: number,
    toSectionNum: number
  ) {
    setContactData(newContactData);
    setFormSectionNum(toSectionNum);

    setTimeout(() => {
      gsap.fromTo(
        contactFormRef.current,
        {
          x: `${-100 * (curSectionNum - 1)}vw`,
        },
        {
          x: `${-100 * (toSectionNum - 1)}vw`,
          duration: 0.5,
          ease: "power3.inOut",
        }
      );
    }, 300);
  });

  return (
    <div className="contact-form-wrapper w-screen h-screen overflow-hidden relative">
      <div ref={contactFormRef} className="w-[300vw] h-screen flex">
        <SelectAService contactData={contactData} handleChange={handleChange} />

        <AboutProject contactData={contactData} handleChange={handleChange} />

        <YourEmail
          contactData={contactData}
          setContactData={setContactData}
          handleChange={handleChange}
        />
      </div>

      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 overflow-hidden">
        <div className="form-num-indicator flex items-center translate-y-full">
          <button
            className="aspect-square w-8 relative"
            onClick={() => handleChange(contactData, formSectionNum, 1)}
          >
            <Image
              src={"/images/contact/contact-form-diamond-bright.svg"}
              alt="diamond"
              fill
              className="object-contain"
            />
          </button>

          <div className="h-1p w-12 bg-gray-800">
            <div
              className={cn(
                "h-full w-full bg-white origin-left transition-all duration-500 ease-out",
                formSectionNum > 1 ? "scale-x-100" : "scale-x-0"
              )}
            ></div>
          </div>

          <button
            className="aspect-square w-8 relative"
            onClick={() => {
              if (contactData.service)
                handleChange(contactData, formSectionNum, 2);
            }}
          >
            <Image
              src={"/images/contact/contact-form-diamond-dim.svg"}
              alt="diamond"
              fill
              className="object-contain"
            />
            <Image
              src={"/images/contact/contact-form-diamond-bright.svg"}
              alt="diamond"
              fill
              className={cn(
                "object-contain",
                formSectionNum > 1 ? "" : "opacity-0"
              )}
            />
          </button>

          <div className="h-1p w-12 bg-gray-800">
            <div
              className={cn(
                "h-full w-full bg-white origin-left transition-all duration-500 ease-out",
                formSectionNum > 2 ? "scale-x-100" : "scale-x-0"
              )}
            ></div>
          </div>

          <button
            className="aspect-square w-8 relative"
            onClick={() => {
              if (contactData.service && contactData.aboutProject)
                handleChange(contactData, formSectionNum, 3);
            }}
          >
            <Image
              src={"/images/contact/contact-form-diamond-dim.svg"}
              alt="diamond"
              fill
              className="object-contain"
            />
            <Image
              src={"/images/contact/contact-form-diamond-bright.svg"}
              alt="diamond"
              fill
              className={cn(
                "object-contain",
                formSectionNum > 2 ? "" : "opacity-0"
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContactFormSlides;
