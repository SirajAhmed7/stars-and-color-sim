"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ServicesHeading from "./ServicesHeading";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function SgSectionsContainer() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const tl0 = gsap.timeline({
        scrollTrigger: {
          trigger: ".services-heading-scroll-grid-wrapper",
          start: "top top",
          end: "100%",
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl0.set(".sg-grid-item", {
        opacity: 1,
        visibility: "visible",
      });

      tl0.to(".scroll-grid", {
        scale: 1,
        // duration: 0.5,
      });
    });
  });

  return <ServicesHeading />;
}

export default SgSectionsContainer;
