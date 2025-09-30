"use client";

import { horizontalLoop } from "@/utils/interactionUtils";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { Fragment, useRef } from "react";

function BookACallStrip() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = horizontalLoop(
        document.querySelectorAll(".book-a-call-strip-el"),
        {
          speed: 1.3,
          reversed: true,
          repeat: -1,
        }
      );
    },
    { scope: wrapperRef }
  );

  return (
    <div
      ref={wrapperRef}
      className="min-w-full overflow-hidden flex gap-3 px-[calc(var(--frame-size)+12px)] py-1.5 border-y border-gray-800"
    >
      {new Array(3).fill(1).map((_: any, i: number) => (
        <div
          className={`book-a-call-strip-el flex items-center gap-3 shrink-0 pr-3`}
          key={"book-a-call-strip-" + i}
        >
          {new Array(9).fill(1).map((_, i) => (
            <Fragment key={"book-a-call-strip-el-" + i}>
              <p className="font-extralight text-xl shrink-0 text-gray-500">
                Book a Call
              </p>

              <Image
                src={"/images/book-a-call-star.svg"}
                alt="phone call"
                height={20}
                width={20}
              />
            </Fragment>
          ))}
        </div>
      ))}
    </div>
  );
}

export default BookACallStrip;
