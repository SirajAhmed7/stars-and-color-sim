import { cn } from "@/utils/utils";
import Image from "next/image";

function FrameBorder({ bgColor }: { bgColor: string }) {
  return (
    <>
      <div className="frame-el fixed top-0 left-0 w-screen h-svh z-[48] pointer-events-none">
        <div
          className={cn(
            "absolute top-0 left-0 w-full h-[var(--frame-size)]",
            bgColor
          )}
        ></div>
        <div
          className={cn(
            "absolute top-0 right-0 w-[var(--frame-size)] h-full frame-border-right",
            bgColor
          )}
        ></div>
        <div
          className={cn(
            "absolute bottom-0 left-0 w-full h-[var(--frame-size)]",
            bgColor
          )}
        ></div>
        <div
          className={cn(
            "absolute top-0 left-0 w-[var(--frame-size)] h-full",
            bgColor
          )}
        ></div>

        <div
          className={cn(
            "absolute top-[var(--frame-size)] left-[var(--frame-size)] -translate-x-1/2 -translate-y-1/2 rotate-45 aspect-square w-[var(--frame-size)]",
            bgColor
          )}
        ></div>

        <div
          className={cn(
            "absolute bottom-[var(--frame-size)] left-[var(--frame-size)] -translate-x-1/2 translate-y-1/2 rotate-45 aspect-square w-[var(--frame-size)]",
            bgColor
          )}
        ></div>

        <div className="absolute top-[1.1vw] sm:top-[0.8vw] lg:top-[0.5vw] left-[1.1vw] sm:left-[0.8vw] lg:left-[0.5vw] aspect-square w-[2.3vw] sm:w-[1.6vw] lg:w-[1.1vw]">
          <Image
            src={"/images/corner-diamond.svg"}
            alt="Diamond"
            fill
            className="w-full h-full inset-0 object-contain"
          />
        </div>

        <div className="absolute bottom-[1.1vw] sm:bottom-[0.8vw] lg:bottom-[0.5vw] left-[1.1vw] sm:left-[0.8vw] lg:left-[0.5vw] aspect-square w-[2.3vw] sm:w-[1.6vw] lg:w-[1.1vw]">
          <Image
            src={"/images/corner-diamond.svg"}
            alt="Diamond"
            fill
            className="w-full h-full inset-0 object-contain"
          />
        </div>
      </div>

      <div className="frame-el fixed top-0 left-0 w-screen h-svh z-[49] pointer-events-none">
        <div
          className={cn(
            "absolute top-[var(--frame-size)] right-[var(--frame-size)] translate-x-1/2 -translate-y-1/2 rotate-45 aspect-square w-[var(--frame-size)] frame-corner-right",
            bgColor
          )}
        ></div>
        <div
          className={cn(
            "absolute bottom-[var(--frame-size)] right-[var(--frame-size)] translate-x-1/2 translate-y-1/2 rotate-45 aspect-square w-[var(--frame-size)] frame-corner-right",
            bgColor
          )}
        ></div>
        <div className="absolute top-[1.1vw] sm:top-[0.8vw] lg:top-[0.5vw] right-[1.1vw] sm:right-[0.8vw] lg:right-[0.5vw] aspect-square w-[2.3vw] sm:w-[1.6vw] lg:w-[1.1vw] frame-border-right">
          <Image
            src={"/images/corner-diamond.svg"}
            alt="Diamond"
            fill
            className="w-full h-full inset-0 object-contain"
          />
        </div>
        <div className="absolute bottom-[1.1vw] sm:bottom-[0.8vw] lg:bottom-[0.5vw] right-[1.1vw] sm:right-[0.8vw] lg:right-[0.5vw] aspect-square w-[2.3vw] sm:w-[1.6vw] lg:w-[1.1vw] frame-border-right">
          <Image
            src={"/images/corner-diamond.svg"}
            alt="Diamond"
            fill
            className="w-full h-full inset-0 object-contain"
          />
        </div>
      </div>
    </>
  );
}

export default FrameBorder;
