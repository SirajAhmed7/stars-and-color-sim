"use client";

import SectionContainer from "@/components/interactions/SectionContainer";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import DiamondCorners from "@/components/ui/DiamondCorners";
import { useScrollSmoother } from "@/contexts/ScrollSmootherContext";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StepContent from "./StepContent";

function HomeSteps() {
  // const [scrollTo, setScrollTo] = useState<number>(0);
  const { scroller } = useScrollSmoother();

  // useEffect(() => {
  //   setScrollTo(
  //     document.querySelector(".home-diamond")?.getBoundingClientRect().bottom! -
  //       window.innerHeight
  //   );
  // }, []);

  useGSAP(() => {
    let isScrolling = false;

    const scrollToSection = (selector: string) => {
      if (isScrolling || !selector) return;
      isScrolling = true;
      scroller?.scrollTo(selector, true);
      // prevent re-triggering for 1.2s (same as smooth duration)
      setTimeout(() => (isScrolling = false), 1600);
    };

    // const obsMouse = Observer.create({
    //   target: ".home-steps",
    //   type: "wheel",
    //   tolerance: 100,
    //   onDown: () => {
    //     console.log("down");
    //     scrollToSection(".tiwigu");
    //     // scroller?.paused(false);
    //   },
    // });

    // obsMouse.disable();

    const st = ScrollTrigger.create({
      trigger: ".home-steps",
      start: "bottom 90%",
      // end: "bottom 50%",
      onEnter: () => {
        // console.log("hs enter");
        scroller?.paused(true);
        scrollToSection(".tiwigu");
        // obsMouse.enable();
      },

      // onEnterBack: () => {
      //   scroller?.paused(false);
      // },
      // onLeave: () => {
      //   // scroller?.paused(true);
      //   obsMouse.disable();
      // },
      // onLeaveBack: () => {
      //   scroller?.paused(true);
      //   scrollToSection(".text-bars");
      // },
    });

    return () => {
      // obsMouse.kill();
      st.kill();
    };
  }, [scroller]);

  return (
    // <section className="home-steps w-full h-max min-h-screen overflow-hidden relative bg-background snap-section">
    <SectionContainer
      curSecClassName="home-steps"
      // prevSecClassName="home-diamond"
      nextSecClassName="tiwigu"
      className="h-max min-h-screen overflow-hidden relative bg-background"
      // scrollToPrev={scrollTo}
    >
      <DiamondCorners corner="right" />
      <Container>
        <div className="w-full h-max lg:h-0 lg:min-h-screen pt-[88px] relative">
          <div className="h-full min-h-max py-12 lg:py-12 relative z-10">
            <div className="h-full flex flex-col gap-8 sm:gap-6 lg:gap-8">
              <StepContent
                title="Kick off a convo"
                text="Real talk, no sales fluff."
              />
              <StepContent
                title="Claim your slot"
                text="We only work with a few at a time."
              />
              <StepContent
                title="Get diamond designs"
                text="First draft in 24 hours. Like... actually."
              />

              <div className="mt-auto flex gap-4">
                <Button variant="secondary" size="lg">
                  See pricing
                </Button>

                <Button size="lg">Book a call</Button>
              </div>
            </div>
          </div>

          <div
            className="relative lg:absolute top-0 right-[97%] sm:right-[41%] 
          md:right-[35%] lg:right-0 h-[480px] lg:h-full w-[230%] sm:w-[140%] lg:w-[100%] 
          translate-y-[3%] translate-x-0 z-0"
          >
            <video
              muted
              autoPlay
              loop
              controls={false}
              // src="/videos/home-diamond-2.mp4"
              className="absolute top-0 right-0 w-full h-full object-contain"
            >
              <source
                src="/videos/home-steps-hand-waving.mp4"
                type="video/mp4"
              />
              {/* <source src="/videos/home-diamond-2.mp4" type="video/mp4" /> */}
            </video>
          </div>
          <div className="w-full h-5 block lg:hidden"></div>
        </div>
      </Container>
      {/* </section> */}
    </SectionContainer>
  );
}

export default HomeSteps;
