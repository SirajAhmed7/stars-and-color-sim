"use client";

import { horizontalLoop } from "@/utils/interactionUtils";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { Fragment, useRef } from "react";

function SgMarquee({ services }: { services: string[] }) {
  const stripsRef = useRef<HTMLElement[]>([]);

  useGSAP(() => {
    const tl = horizontalLoop(stripsRef.current, {
      speed: 1,
      // reversed: true,
      repeat: -1,
    });
  });

  return (
    <div className="max-w-full h-full overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full max-w-full overflow-hidden flex gap-3 py-2 border-b border-gray-800">
        {new Array(3).fill(1).map((_, i) => (
          <div
            ref={(cur) => {
              if (cur) stripsRef.current.push(cur);
            }}
            key={"sg-marquee-" + i}
            className="flex gap-3 shrink-0"
          >
            {services.map((service, i) => (
              <Fragment key={`sg-marquee-${i}-${service}`}>
                <Image
                  src={`/images/services/sg-marquee-star.svg`}
                  alt={"star"}
                  height={20}
                  width={20}
                />
                <p className="text-xl font-extralight text-gray-500">
                  {service}
                </p>
              </Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SgMarquee;
