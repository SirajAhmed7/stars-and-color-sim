import { cn } from "@/utils/utils";
import SdAnimationsWrapper from "./SdAnimationsWrapper";
import SdVideo from "./SdVideo";
import SdNums from "./SdNums";

function SubscriptionDescription() {
  const descriptions = [
    {
      heading: "Monthly Rate",
      text: "One bill for all your product needs. No hourly crap.",
    },
    {
      heading: "Limitless Scope",
      text: "No more “out-of-scope” emails or compromises.",
    },
    {
      heading: "Zero-Ego",
      text: "Purpose driven brains, zero drama, just shipping.",
    },
    {
      heading: "Trust-led Model",
      text: "We care. We earn our keep, through skill.",
    },
  ];

  return (
    <SdAnimationsWrapper numOfDescriptions={descriptions.length}>
      <section
        className="subscription-description w-full px-5 relative"
        style={{
          height: `${(descriptions.length + 1) * 100}vh`,
        }}
      >
        <SdVideo />

        <div className="sd-content-wrapper w-full h-screen flex justify-center items-center max-md:translate-y-5">
          <div className="relative w-full">
            <div className="absolute -top-12 md:-top-44 w-full overflow-hidden">
              <div className="sd-why-rare text-base sm:text-lg md:text-4xl font-extralight text-center translate-y-full">
                Why Rare?
              </div>
            </div>

            <div className="w-full font-harmond condensed font-semibold text-[18vw] md:text-[13vw] leading-none text-center italic md:not-italic px-6 md:px-0">
              {descriptions.map((descriptions, i) => (
                <h2
                  className={`${"sd-heading-" + (i + 1)} ${
                    i > 0 ? "absolute top-0 left-0 w-full h-full" : ""
                  }`}
                  key={descriptions.heading}
                >
                  {descriptions.heading}
                </h2>
              ))}
            </div>

            <div className="absolute -bottom-20 md:-bottom-36 left-1/2 -translate-x-1/2 w-2/3 md:w-full overflow-hidden">
              <div className="sd-text-wrapper relative w-full translate-y-full">
                {descriptions.map((description, i) => (
                  <p
                    className={cn(
                      "font-extralight text-base md:text-4xl text-gray-400 text-center",
                      i > 0 ? "absolute top-0 left-0 w-full h-full" : ""
                    )}
                    style={{
                      transform: `translateY(${i * 100}%)`,
                    }}
                    key={description.text}
                  >
                    {description.text}
                  </p>
                ))}
              </div>
            </div>

            <SdNums numOfDescription={descriptions.length} />
          </div>
        </div>
      </section>
    </SdAnimationsWrapper>
  );
}

export default SubscriptionDescription;
