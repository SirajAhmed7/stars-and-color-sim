"use client";

import React, { useEffect, useRef } from "react";
import TextHoverArrow from "../interactions/TextHoverArrow";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

type NavSectionProps = {
  isActive: boolean;
};

const NavSectionDetails: React.FC<NavSectionProps> = ({ isActive }) => {
  const links = ["twitter", "instagram", "linkedin", "dribble", "behance"];
  const linksContainer = useRef<(HTMLAnchorElement | HTMLDivElement)[]>([]);
  const navTl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    navTl.current = gsap.timeline();

    navTl.current.from(linksContainer.current, {
      opacity: 0,
      stagger: 0.2,
      delay: 0.7,
    });
  }, []);

  useEffect(() => {
    if (isActive) {
      navTl.current?.play();
    } else {
      navTl.current?.reverse();
    }
  }, [isActive]);

  return (
    <div className="absolute w-full bottom-0 px-[10%] pb-[5%] flex justify-between items-end opacity-90">
      <div>
        <Link
          ref={(crr) => {
            if (crr) linksContainer.current.push(crr);
          }}
          href="mailto:rare@studio.com"
          className="text-sm"
        >
          <TextHoverArrow>rare@studio.com</TextHoverArrow>
        </Link>
        <Link
          ref={(crr) => {
            if (crr) linksContainer.current.push(crr);
          }}
          href="mailto:rare@studio.com"
          className="text-sm"
        >
          <TextHoverArrow>(+91)9937 200 616</TextHoverArrow>
        </Link>
      </div>

      <div
        className="w-[15%]"
        ref={(crr) => {
          if (crr) linksContainer.current.push(crr);
        }}
      >
        {links.map((link) => {
          return (
            <Link
              key={link}
              href="mailto:rare@studio.com"
              className="text-[10px] uppercase leading-[1.5]"
            >
              <TextHoverArrow>{link}</TextHoverArrow>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default NavSectionDetails;
