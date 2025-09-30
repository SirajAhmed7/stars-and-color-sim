import Container from "@/components/ui/Container";
import ScpAnimationsWrapper from "./ScpAnimationsWrapper";
import ScpHeading from "./ScpHeading";
import ScpNumber from "./ScpNumber";
import ScpVideo from "./ScpVideo";

function SpeedCreativityPrecision() {
  return (
    <ScpAnimationsWrapper>
      <section className="speed-creativity-precision w-full h-[450vh] relative snap-section">
        {/* <div className="scp-sticky absolute top-0 left-0 w-full h-screen">
          <DiamondCorners />
        </div> */}

        <ScpVideo />

        {/* <div className="absolute inset-0 w-full h-full"> */}
        <div className="scp-content-sticky h-screen w-full z-0 translate-y-[50vh]">
          <Container>
            <div className="w-full h-screen flex flex-col justify-center items-center">
              {/* <div className="w-full relative mb-24 sm:mb-6 lg:mb-12 sm:-translate-y-[60%] md:-translate-y-1/2 lg:-translate-y-0"> */}

              <div className="w-full relative sm:-translate-y-[60%] md:-translate-y-1/2 lg:-translate-y-0">
                <div className="absolute -top-[30%] sm:bottom-0 lg:top-1/2 lg:bottom-auto -translate-y-full sm:translate-y-[110%] lg:-translate-y-[70%] left-1/2 md:left-0 max-md:-translate-x-1/2 w-[40%] sm:w-[35%] md:w-1/4 lg:w-1/5 sm:gap-4 py-1 ">
                  <div className="overflow-hidden flex justify-center md:justify-end items-center gap-3 pr-3">
                    <p className="scp-corner-text translate-y-[105%] text-base sm:text-xl font-extralight text-gray-500">
                      Our priorities
                    </p>
                  </div>

                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 19 19"
                    fill="none"
                    className="hidden md:inline-block scp-corner-line-star absolute right-0 bottom-0 translate-x-1/2 translate-y-1/2 opacity-0"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.07542 -0.000244141C9.07542 -0.000244141 10.2622 5.37519 11.5188 6.63178C12.7754 7.88837 18.1508 9.07517 18.1508 9.07517C18.1508 9.07517 12.7754 10.2619 11.5188 11.5185C10.2622 12.7751 9.07542 18.1506 9.07542 18.1506C9.07542 18.1506 7.88859 12.7751 6.632 11.5185C5.37541 10.2619 0 9.07517 0 9.07517C0 9.07517 5.37541 7.88837 6.632 6.63178C7.88859 5.37519 9.07542 -0.000244141 9.07542 -0.000244141Z"
                      fill="#70707B"
                    />
                  </svg>

                  <div className="hidden md:block scp-corner-line absolute bottom-0 w-full h-1p bg-gradient-to-l from-gray-500 to-gray-500/0 origin-right scale-x-0"></div>
                </div>

                <ScpHeading />

                <div className="hidden md:block absolute -bottom-[10%] sm:bottom-0 lg:top-1/2 lg:bottom-auto translate-y-[110%] lg:-translate-y-[70%] right-0 w-[40%] sm:w-[35%] md:w-1/4 lg:w-1/5 py-1">
                  <div className="overflow-hidden flex justify-start items-center gap-3 pl-3">
                    <p className="scp-corner-text translate-y-[105%] text-base sm:text-xl font-extralight text-gray-500">
                      Our priorities
                    </p>
                  </div>

                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 19 19"
                    fill="none"
                    className="scp-corner-line-star absolute left-0 bottom-0 -translate-x-1/2 translate-y-1/2 opacity-0"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.07542 -0.000244141C9.07542 -0.000244141 10.2622 5.37519 11.5188 6.63178C12.7754 7.88837 18.1508 9.07517 18.1508 9.07517C18.1508 9.07517 12.7754 10.2619 11.5188 11.5185C10.2622 12.7751 9.07542 18.1506 9.07542 18.1506C9.07542 18.1506 7.88859 12.7751 6.632 11.5185C5.37541 10.2619 0 9.07517 0 9.07517C0 9.07517 5.37541 7.88837 6.632 6.63178C7.88859 5.37519 9.07542 -0.000244141 9.07542 -0.000244141Z"
                      fill="#70707B"
                    />
                  </svg>

                  <div className="scp-corner-line absolute bottom-0 w-full h-[1px] bg-gradient-to-r from-gray-500 to-gray-500/0 origin-left scale-x-0"></div>
                </div>

                <div className="absolute -bottom-7 sm:-bottom-6 lg:-bottom-6 left-1/2 -translate-x-1/2 translate-y-full overflow-hidden w-[75%] sm:w-full text-base md:text-3xl text-gray-500 font-extralight text-center text-wrap sm:break-all">
                  <p className="scp-text translate-y-full">
                    Launch before your competitors finish their pitch decks.
                  </p>
                  <p className="scp-text absolute top-0 left-0 w-full h-full translate-y-[200%]">
                    Unconventional thinking, beautifully executed.
                  </p>
                  <p className="scp-text absolute top-0 left-0 w-full h-full translate-y-[300%]">
                    Because sloppy kills momentum—and trust.
                  </p>
                </div>

                <ScpNumber />
              </div>
            </div>
          </Container>
        </div>
        {/* </div> */}
      </section>
    </ScpAnimationsWrapper>
  );
}

export default SpeedCreativityPrecision;
