// "use client";

import ScrollSnapWrapper from "@/components/interactions/ScrollSnapWrapper";
import SectionContainer from "@/components/interactions/SectionContainer";
import KineticTypeVideo from "@/components/ui/KineticTypeVideo";
import { useVideoScroll } from "@/contexts/VideoScrollContext";

function Negi() {
  // const { scrollDirection } = useVideoScroll();
  // const [timeline, setTimeline] = useState<GSAPTimeline>();

  // useGSAP(() => {
  //   // const enterScrollTrigger = ScrollTrigger.create({
  //   //   trigger: ".negi",
  //   //   start: "top bottom-=1%",
  //   //   toggleActions: "play none none none",
  //   //   once: false,
  //   //   onEnter: () => {
  //   //     lenisInstance?.stop();
  //   //     gsap.to(window, {
  //   //       scrollTo: {
  //   //         y: ".negi",
  //   //         offsetY: 0,
  //   //         autoKill: false,
  //   //       },
  //   //       duration: 0.5,
  //   //       ease: "power2",
  //   //       onComplete: () => {
  //   //         lenisInstance?.start();
  //   //       },
  //   //     });
  //   //   },
  //   // });

  //   const tl = gsap.timeline({
  //     scrollTrigger: {
  //       trigger: ".negi",
  //       start: "top 15%",
  //       toggleActions: "play reset play reset",
  //       once: false,
  //     },
  //   });
  //   setTimeline(tl);

  //   // function scrollToNext() {
  //   //   lenisInstance?.stop();
  //   //   gsap.to(window, {
  //   //     scrollTo: {
  //   //       y: ".negi",
  //   //       offsetY: 0,
  //   //       autoKill: false,
  //   //     },
  //   //     duration: 0.5,
  //   //     ease: "power2",
  //   //     onComplete: () => {
  //   //       // lenisInstance?.start();
  //   //     },
  //   //   });
  //   // }

  //   // const heroObsMouse = Observer.create({
  //   //   target: ".hero",
  //   //   type: "wheel",
  //   //   tolerance: 100,
  //   //   onDown: scrollToNext,
  //   // });

  //   // const heroObsTouch = Observer.create({
  //   //   target: ".hero",
  //   //   type: "touch",
  //   //   tolerance: 100,
  //   //   onUp: scrollToNext,
  //   // });

  //   // const obsMouse = Observer.create({
  //   //   target: ".negi",
  //   //   type: "wheel",
  //   //   tolerance: 100,
  //   //   onDown: () => {
  //   //     snapScrollTo(".home-diamond", lenisInstance, false);
  //   //   },
  //   //   onUp: () => {
  //   //     snapScrollTo(".hero", lenisInstance, false);
  //   //   },
  //   // });

  //   // const obsTouch = Observer.create({
  //   //   target: ".negi",
  //   //   type: "touch",
  //   //   tolerance: 100,
  //   //   onUp: () => {
  //   //     snapScrollTo(".home-diamond", lenisInstance, false);
  //   //   },
  //   //   onDown: () => {
  //   //     snapScrollTo(".hero", lenisInstance, false);
  //   //   },
  //   // });

  //   // return () => {
  //   //   heroObsMouse.kill();
  //   //   heroObsTouch.kill();
  //   //   obsMouse.kill();
  //   //   obsTouch.kill();
  //   // };
  // }, [lenisInstance]);

  return (
    // <section
    //   // className={`negi w-full h-screen relative bg-background snap-section ${
    //   //   scrollDirection === "down" ? "pointer-events-none" : ""
    //   // }`}
    //   className={`negi w-full h-screen relative bg-background snap-start snap-section`}
    // >
    <SectionContainer
      curSecClassName="negi"
      prevSecClassName="hero"
      nextSecClassName="home-diamond"
    >
      {/* <KineticTypeVideo
          src="/videos/not-everyone-gets-in.mp4"
          type="video/mp4"
          prevSecClassName="hero"
          curSecClassName="negi"
          nextSecClassName="home-diamond"
        /> */}

      <div className="absolute w-full h-full top-0 left-0 pointer-events-none">
        <video
          // ref={videoRef}
          muted
          autoPlay
          // loop
          controls={false}
          // src="/videos/home-diamond-2.mp4"
          className="w-full h-full object-cover"
        >
          <source src="/videos/not-everyone-gets-in.mp4" type="video/mp4" />
        </video>
      </div>

      {/* <Not lenisInstance={lenisInstance} timeline={timeline} />
        <Everyone lenisInstance={lenisInstance} timeline={timeline} />
        <GetsIn lenisInstance={lenisInstance} timeline={timeline} />
        <GetIn
          lenisInstance={lenisInstance}
          timeline={timeline}
          setCanScroll={setCanScroll}
        /> */}
      {/* </section> */}
    </SectionContainer>
  );
}

export default Negi;
