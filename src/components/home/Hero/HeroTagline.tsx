import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger, Observer);

const HeroTagline = () => {
  return (
    <div
      className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:-translate-y-[60%] mix-blend-exclusion"
      style={{
        transformStyle: "preserve-3d",
        perspective: 500,
      }}
    >
      <h1
        className="hero-heading -tracking-[2px] whitespace-nowrap leading-[0.7] sm:leading-none max-sm:text-center text-transparent sm:text-white bg-clip-text bg-gradient-to-b from-gray-700 to-white"
        // style={{
        //   transform: "translate3d(0, 28vh, 300px) rotateX(30deg)",
        // }}
      >
        {/* <span className="font-thin text-[12vw] font-roboto-flex">we are</span>
        <span className="font-medium text-[13vw] font-harmond">
          {" "}
          rare
        </span> */}
        <span className="font-neue-montreal font-light hidden sm:inline sm:text-[18vw] md:text-[14vw]">
          we are
        </span>

        <div className="font-neue-montreal font-light block sm:hidden text-[30vw]">
          <span>we</span>
          <br className="block sm:hidden" />
          <span>are</span>
        </div>
        <br className="block sm:hidden" />
        <span className="hidden sm:inline font-semibold text-[28vw] sm:text-[19vw] md:text-[15vw] font-harmond">
          {" "}
        </span>
        <span className="text-[37vw] sm:text-[19vw] md:text-[15vw] font-harmond font-semibold max-sm:condensed">
          rare
        </span>
      </h1>
    </div>
  );
};

export default HeroTagline;
