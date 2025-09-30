"use client";
import SectionContainer from "@/components/interactions/SectionContainer";
import KineticTypeVideo from "@/components/ui/KineticTypeVideo";
import { useEffect, useState } from "react";

function Hwaw() {
  const [scrollTo, setScrollTo] = useState<number>(0);

  useEffect(() => {
    setScrollTo(
      document.querySelector(".the-rare-advantage")?.getBoundingClientRect()
        .bottom! - window.innerHeight
    );
  }, []);

  return (
    <SectionContainer
      curSecClassName="hwaw"
      scrollToPrev={scrollTo}
      nextSecClassName="speed-creativity-precision"
      className="bg-background relative flex justify-center items-center"
    >
      {/* <section className="hwaw w-full h-screen relative bg-background"> */}
      {/* <HowWe timeline={timeline} />
        <Actually timeline={timeline} /> */}

      <div>hello</div>
      {/* <KineticTypeVideo
          src="/videos/how-we-break-barriers.mp4"
          type="video/mp4"
          prevSecClassName="the-rare-advantage"
          curSecClassName="hwaw"
          nextSecClassName="speed-creativity-precision"
          /> */}
      {/* </section> */}
    </SectionContainer>
  );
}

export default Hwaw;
