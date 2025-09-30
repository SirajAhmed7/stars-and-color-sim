import { cn } from "@/utils/utils";
import Image from "next/image";
import Link from "next/link";
import logo from "./logo-name.svg";

function FrameLogo({ bgColor }: { bgColor: string }) {
  return (
    <>
      <div
        aria-hidden={true}
        className={cn(
          "frame-el logo fixed top-0 left-1/2 max-md:-translate-x-1/2 md:left-[8vw] h-[var(--frame-element-stroke-size)] max-w-[22%] sm:max-w-[15%] md:max-w-[6%] px-3 py-1 flex justify-center items-center cursor-pointer z-40 frame-element-top bg-gray-800 frame-stroke"
        )}
      >
        <Image src={logo} alt="logo" className="h-7 sm:h-9" />
      </div>
      <Link
        href="/#"
        className={cn(
          "frame-el logo fixed top-0 left-1/2 max-md:-translate-x-1/2 md:left-[8vw] h-[var(--frame-element-size)] max-w-[22%] sm:max-w-[15%] md:max-w-[6%] px-3 py-1 flex justify-center items-center cursor-pointer z-50 frame-element-top",
          bgColor
        )}
      >
        <Image
          src={logo}
          alt="logo"
          className="h-7 sm:h-9 translate-y-0.5 sm:translate-y-1"
        />
      </Link>
    </>
  );
}

export default FrameLogo;
