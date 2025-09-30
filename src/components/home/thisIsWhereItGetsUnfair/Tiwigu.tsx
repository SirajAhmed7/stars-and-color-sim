"use client";

import ScrollSnapWrapper from "@/components/interactions/ScrollSnapWrapper";
import SectionContainer from "@/components/interactions/SectionContainer";
import KineticTypeVideo from "@/components/ui/KineticTypeVideo";
import { useVideoScroll } from "@/contexts/VideoScrollContext";

function Tiwigu() {
  const { scrollDirection } = useVideoScroll();

  return (
    <SectionContainer
      curSecClassName="tiwigu"
      prevSecClassName="home-steps"
      nextSecClassName="the-rare-advantage"
      className={`bg-white relative flex justify-center items-center ${
        scrollDirection === "down" ? "pointer-events-none" : ""
      }`}
    >
      {/* <section className="tiwigu w-full h-screen bg-white relative flex justify-center items-center pointer-events-none snap-section"> */}
      {/* <h2 className="text-8xl text-gray-950">This is where it gets unfair</h2> */}
      <KineticTypeVideo
        src="/videos/this-is-where-it-gets-unfair.mp4"
        type="video/mp4"
        prevSecClassName="home-steps"
        curSecClassName="tiwigu"
        nextSecClassName="the-rare-advantage"
      />
      {/* </section> */}
    </SectionContainer>
  );
}

export default Tiwigu;
