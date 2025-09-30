"use client";

import { horizontalLoop } from "@/utils/interactionUtils";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import BookACallTarget from "./BookACallTarget";

function BookACallLInk() {
  useGSAP(() => {
    const tl = horizontalLoop(
      document.querySelectorAll(".book-a-call-link-animation"),
      {
        speed: 1.5,
        // reversed: true,
        repeat: -1,
      }
    );
  });

  return (
    <div className="relative text-8xl sm:text-9xl md:text-[160px] font-harmond condensed font-bold md:!leading-none shrink-0">
      <Link
        href={"https://calendly.com/raredesignlabs/30min"}
        className="relative flex items-center"
        target="_blank"
      >
        {new Array(3).fill(1).map((_: any, i: number) => (
          <div
            aria-hidden={i > 0 ? "true" : "false"}
            key={"book-a-call-link-animation-" + i}
            // ref={linkRef}
            className="book-a-call-link-animation flex items-center gap-10 md:gap-20 pr-10 md:pr-20"
          >
            {/* <div className="shrink-0 text-nowrap">Book a Call</div> */}

            {/* <BookACallHeadshot className="aspect-square h-24 sm:h-36 md:h-48 lg:h-60" /> */}
            <BookACallTarget className="aspect-square h-24 sm:h-36 md:h-48 lg:h-40" />

            <div className="shrink-0 text-nowrap">
              We weaponize your vision.
            </div>
          </div>
        ))}
      </Link>
    </div>
  );
}

export default BookACallLInk;
