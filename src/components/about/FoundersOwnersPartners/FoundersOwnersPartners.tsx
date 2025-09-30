import Star from "@/components/ui/Star";
import FopAnimationsWrapper from "./FopAnimationsWrapper";

function FoundersOwnersPartners() {
  return (
    <FopAnimationsWrapper>
      <section className="founders-owners-partners h-[400vh] relative">
        <div className="fop-video-container-outer absolute top-0 left-0 h-screen w-full">
          <div
            className="absolute w-[170%] md:w-full h-[50%] sm:h-[60%] lg:h-[100%] top-1/4 md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none"
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
              className="fop-video w-full h-full object-contain"
              playsInline
              // style={{
              //   transform: "translate3d(0, 35vh, 200px)",
              // }}
            >
              <source
                src="/videos/horns-about-us-denoised.webm"
                type="video/webm"
              />
              <source
                src="/videos/horns-about-us-denoised.mp4"
                type="video/mp4"
              />
              {/* <source src="/videos/home-diamond-2.mp4" type="video/mp4" /> */}
            </video>
          </div>
        </div>

        <div className="fop-content-wrapper w-full h-screen flex flex-col justify-center lg:justify-between items-center relative py-24 px-5 md:px-20">
          <p
            className="hidden lg:block self-start text-3xl font-extralight fop-wide-text fop-wide-text-top text-transparent bg-clip-text"
            style={{
              backgroundImage:
                "linear-gradient(to right, #3F3F46 0%, #3F3F46 50%, #3F3F4600 50%, #3F3F4600 100%)",
              backgroundSize: "200% 100%",
              backgroundPosition: "100% 0%",
            }}
          >
            Customer pain is compass.
          </p>

          <div className="w-full relative translate-y-full md:translate-y-0">
            <div className="absolute -top-[45%] md:-top-[35%] left-0 w-full font-extralight text-base md:text-5xl text-center overflow-hidden">
              <div className="fop-subheading translate-y-full">We think as</div>
              <div className="fop-subheading absolute top-0 left-0 w-full h-full translate-y-[200%]">
                We build as
              </div>
              <div className="fop-subheading absolute top-0 left-0 w-full h-full translate-y-[300%]">
                We move as
              </div>
            </div>

            <div className="font-harmond condensed text-7xl md:text-[13vw] font-semibold text-center md:leading-none overflow-clip relative max-md:h-[200%]">
              <div className="fop-lower-word-1">Co-Founders</div>
              <div className="fop-lower-word-2 absolute inset-0">Co-Owners</div>
              <div className="fop-lower-word-3 absolute inset-0">
                Creative Partners
              </div>
            </div>
          </div>

          <p
            className="hidden lg:block self-end text-3xl font-extralight text-right fop-wide-text fop-wide-text-bottom text-transparent bg-clip-text"
            style={{
              backgroundImage:
                "linear-gradient(to right, #3F3F46 0%, #3F3F46 50%, #3F3F4600 50%, #3F3F4600 100%)",
              backgroundSize: "200% 100%",
              backgroundPosition: "100% 0%",
            }}
          >
            Solutions scale from day one.
          </p>
        </div>

        <Star className="absolute top-[22%] right-[10%] w-16" />

        <Star className="absolute top-[40%] left-[12%] w-16" />

        <Star className="absolute top-[60%] right-[8%] w-20" />

        <Star className="absolute top-[80%] left-[9%] w-20" />
      </section>
    </FopAnimationsWrapper>
  );
}

export default FoundersOwnersPartners;
