import Container from "@/components/ui/Container";
import DiamondCorners from "@/components/ui/DiamondCorners";
import HDAnimationsWrapper from "./HDAnimationsWrapper";
import HDHeading from "./HDHeading";
import HDSubHeading from "./HDSubHeading";

function HomeDiamond() {
  return (
    <HDAnimationsWrapper>
      <section className="home-diamond h-[250vh] lg:h-[150vh] relative">
        {/* <section className="home-diamond h-[500vh] "> */}
        <div className="hd-video-container-outer absolute top-0 left-0 h-screen w-full">
          {/* <div className="hd-video-container-outer absolute top-0 left-0 h-full w-full"> */}
          {/* <HDScifiElements /> */}
          {/* <div className="sticky top-0 w-full h-screen"> */}
          <div
            className="absolute w-[80%] sm:w-full h-[50%] sm:h-[60%] lg:h-[80%] top-[30%] sm:top-1/2 left-1/2 sm:left-0 max-sm:-translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none"
            style={{
              transformStyle: "preserve-3d",
              perspective: 200,
            }}
          >
            <video
              muted
              autoPlay
              loop
              controls={false}
              // src="/videos/home-diamond-2.mp4"
              className="home-diamond-video w-full h-full object-contain"
              playsInline
              // style={{
              //   transform: "translate3d(0, 20vh, 200px)",
              // }}
            >
              <source src="/videos/home-diamond-2.webm" type="video/webm" />
              <source src="/videos/home-diamond-2.mp4" type="video/mp4" />
            </video>
          </div>
          {/* </div> */}
        </div>
        <div className="home-diamond-sticky absolute top-0 h-screen w-full">
          <DiamondCorners />
          <Container>
            <div className="w-full h-screen py-8">
              {/* <div className="w-full h-full mx-auto relative"> */}
              <div className="w-full h-full mx-auto relative flex flex-col justify-between py-16 px-6">
                {/* <p className="hidden lg:block absolute top-20 left-0 text-5xl font-extralight uppercase text-gray-700"> */}
                <p
                  className="hidden lg:block self-start text-3xl font-extralight home-diamond-text text-transparent bg-clip-text"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #3F3F46 0%, #3F3F46 50%, #3F3F4600 50%, #3F3F4600 100%)",
                    backgroundSize: "200% 100%",
                    backgroundPosition: "100% 0%",
                  }}
                >
                  {/* <HoverTextScramble> */}
                  Designers who break the grid
                  {/* </HoverTextScramble> */}
                </p>

                {/* <div className="space-y-2"> */}
                <div>
                  {/* <div className="space-y-2 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-max"> */}
                  <HDSubHeading
                    text="A coalition of"
                    text2="Built to be your"
                  />
                  <HDHeading
                    text="Original Geniuses"
                    text2="Creative Partners"
                  />
                </div>

                <p
                  className="hidden lg:block self-end text-3xl font-extralight text-right home-diamond-text text-transparent bg-clip-text"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #3F3F46 0%, #3F3F46 50%, #3F3F4600 50%, #3F3F4600 100%)",
                    backgroundSize: "200% 100%",
                    backgroundPosition: "100% 0%",
                  }}
                >
                  Developers who hack the system
                </p>
              </div>
            </div>
          </Container>
        </div>
      </section>
    </HDAnimationsWrapper>
  );
}

export default HomeDiamond;
