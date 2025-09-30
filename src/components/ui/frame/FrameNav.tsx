import HoverSplitText from "@/components/interactions/HoverSplitText";
import { cn } from "@/utils/utils";
import Link from "next/link";

function FrameNav({ bgColor }: { bgColor: string }) {
  return (
    <>
      <div
        aria-hidden={true}
        className={cn(
          "frame-el frame-nav fixed top-0 right-[8vw] h-[var(--frame-element-stroke-size)] px-[21px] translate-x-[0.5px] py-2 hidden md:flex gap-9 items-center z-40 text-gray-200 font-extralight frame-element-top bg-gray-800 frame-stroke"
        )}
      >
        <p>Home</p>
        <p>Subscription</p>
        <p>Services</p>
        <p>Portfolio</p>
        <p>Who We Are</p>
      </div>

      <nav
        className={cn(
          "frame-el frame-nav fixed top-0 right-[8vw] h-[var(--frame-element-size)] px-5 py-2 hidden md:flex gap-9 items-center z-50 text-gray-200 font-extralight frame-element-top",
          "frame-el frame-nav fixed top-0 right-[8vw] h-[var(--frame-element-size)] px-5 py-2 hidden md:flex gap-9 items-center z-50 text-gray-200 font-extralight frame-element-top",
          bgColor
        )}
      >
        <Link href="/" scroll={false} className="interactable translate-y-0.5">
          <HoverSplitText>Home</HoverSplitText>
        </Link>
        <Link
          href="/subscription"
          scroll={false}
          className="interactable translate-y-0.5"
        >
          <HoverSplitText>Subscription</HoverSplitText>
        </Link>
        <Link
          href="/services"
          scroll={false}
          className="interactable translate-y-0.5"
        >
          <HoverSplitText>Services</HoverSplitText>
        </Link>
        <Link
          href="/portfolio"
          scroll={false}
          className="interactable translate-y-0.5"
        >
          <HoverSplitText>Portfolio</HoverSplitText>
        </Link>
        <Link
          href="/about"
          scroll={false}
          className="interactable translate-y-0.5"
        >
          <HoverSplitText>Who We Are</HoverSplitText>
        </Link>
      </nav>
    </>
  );
}

export default FrameNav;
