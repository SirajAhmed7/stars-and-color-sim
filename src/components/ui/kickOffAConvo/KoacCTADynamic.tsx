"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import PoppingStarsAnimation from "../PoppingStarsAnimation";

function KoacCTADynamic({
  ctaWrapperRef,
}: {
  ctaWrapperRef: React.RefObject<HTMLDivElement | null>;
}) {
  const wrapperRef = useRef<HTMLAnchorElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useGSAP(() => {
    const xTo = gsap.quickTo(circleRef.current, "x", {
      // duration: 0.2,
      // ease: "power3.out",
      duration: 0.1,
      ease: "power1.out",
    });
    const yTo = gsap.quickTo(circleRef.current, "y", {
      // duration: 0.2,
      // ease: "power3.out",
      duration: 0.1,
      ease: "power1.out",
    });

    const wrapper = wrapperRef.current;

    if (!wrapper) return;

    const cursor = {
      // x: wrapperBoundingRect.x + wrapperBoundingRect.width / 2,
      // y: wrapperBoundingRect.y + wrapperBoundingRect.height / 2,
      x: wrapper.offsetWidth / 2,
      y: wrapper.offsetHeight / 2,
      // scaleX: 1,
      // scaleY: 1,
    };

    // console.log(cursor.x, cursor.y);

    function handleMouseEnter(event: MouseEvent) {
      if (!wrapper) return;
      cursor.x = event.offsetX;
      cursor.y = event.offsetY;
    }

    function handleMouseMove(event: MouseEvent) {
      if (!wrapper) return;
      cursor.x = event.offsetX;
      cursor.y = event.offsetY;
    }

    function handleMouseLeave() {
      if (!wrapper) return;

      gsap.to(cursor, {
        x: wrapper.offsetWidth / 2,
        y: wrapper.offsetHeight / 2,
        // scaleX: 1,
        // scaleY: 1,
        duration: 0.8,
        ease: "elastic.out(1.5)",
      });
    }

    const tick = () => {
      if (!wrapper) return;
      const x = cursor.x - wrapper.offsetWidth / 2;
      const y = cursor.y - wrapper.offsetHeight / 2;

      // console.log(x, y);

      xTo(x);
      yTo(y);
      // scaleXTo(cursor.scaleX);
      // scaleYTo(cursor.scaleY);

      requestAnimationFrame(tick);
    };

    tick();

    // wrapper.addEventListener("mouseenter", handleMouseEnter);
    wrapper.addEventListener("mousemove", handleMouseMove);
    wrapper.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      // obs.kill();
      // boundingRectSt.kill();
      // wrapper.removeEventListener("mouseenter", handleMouseEnter);
      wrapper.removeEventListener("mousemove", handleMouseMove);
      wrapper.removeEventListener("mouseleave", handleMouseLeave);
    };
  });

  return (
    <div
      ref={ctaWrapperRef}
      // className="koac-cta-wrapper h-full w-full relative -translate-y-[85%] lg:-translate-y-1/2 lg:opacity-0"
      className="hidden lg:block koac-cta-wrapper h-full w-full relative translate-y-0 lg:-translate-y-1/2 opacity-0"
    >
      <Link
        ref={wrapperRef}
        // href={"https://calendly.com/raredesignlabs/30min"}
        href={"/contact"}
        // target="_blank"
        // className="koac-cta-link absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex justify-center items-center px-20 py-16 group/cta"
        className="koac-cta-link absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex justify-center items-center p-36 group/cta"
        // className="koac-cta-wrapper absolute top-0 left-1/2 -translate-x-1/2 flex justify-center items-center p-16 opacity-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute top-0 left-0 w-full h-full -z-10">
          <PoppingStarsAnimation wrapperClassName="koac-cta-link" />
        </div>
        <div
          ref={circleRef}
          className="koac-circle aspect-square w-56 rounded-full relative flex justify-center items-center pointer-events-none cursor-pointer"
        >
          {/* <div className="absolute top-0 left-0 w-full h-full rounded-full bg-gray-200 blur-xl opacity-0 group-hover/cta:opacity-20 -z-10 transition-all duration-300 ease-in-out"></div> */}

          <div
            className="absolute top-0 left-0 w-full h-full rounded-full bg-gray-950/20 backdrop-blur-lg z-0 group-hover/cta:bg-gray-100 transition-all duration-300 ease-in-out"
            style={{
              boxShadow: isHovered ? "0 0 85px 20px #A0A0AB70" : "none",
            }}
          ></div>

          <div className="absolute top-0 left-0 w-full h-full rounded-full z-10">
            <Image
              src={"/images/gradient-stroke-circle.svg"}
              alt="Gradient stroke circle"
              fill
              className="object-contain pointer-events-none"
            />
          </div>

          <p className="font-harmond condensed font-bold text-3xl relative z-10 group-hover/cta:text-gray-900 transition-all duration-300 ease-in-out">
            Let&apos;s Talk
          </p>
        </div>
      </Link>
    </div>
  );
}

export default KoacCTADynamic;
