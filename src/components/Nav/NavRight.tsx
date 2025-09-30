"use client";
import Link from "next/link";
import HoverSplitText from "../interactions/HoverSplitText";
import NavToggler from "./NavToggler";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NavSection from "./NavSection";
import HoverTextScramble from "../interactions/HoverTextScramble";
import Button from "../ui/Button";

gsap.registerPlugin(ScrollTrigger);

const NavRight = () => {
  const [isActive, setIsActive] = useState(false);
  const navLinks = useRef<HTMLAnchorElement[]>([]);
  const navLinkCon = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const navLinkMover = navLinkCon.current?.getBoundingClientRect().width;
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        scroller: "body",
        trigger: "main",
        start: "1%",
        toggleActions: "play none none reverse",
      },
    });

    scrollTl.to(navLinks.current, {
      x: navLinkMover,
      duration: 1,
      stagger: -0.1,
      ease: "back.inOut",
    });
  }, []);

  return (
    <div className="flex items-center gap-4 lg:gap-8">
      <div
        ref={navLinkCon}
        className="links 2xl:text-xl hidden lg:flex gap-12 pr-12 translate-x-12"
        style={{ clipPath: "inset(0 0 0 -100%)" }}
      >
        {/* <Link ref={crr => { if (crr) navLinks.current.push(crr) }} href='/portfolio'><HoverSplitText>Portfolio</HoverSplitText></Link>
        <Link ref={crr => { if (crr) navLinks.current.push(crr) }} href='/pricing'><HoverSplitText>Pricing</HoverSplitText></Link>
        <Link ref={crr => { if (crr) navLinks.current.push(crr) }} href='/courses'><HoverSplitText>Courses</HoverSplitText></Link> */}
        <Link
          ref={(crr) => {
            if (crr) navLinks.current.push(crr);
          }}
          href="/subscription"
        >
          <HoverSplitText>Subscription</HoverSplitText>
        </Link>
        <Link
          ref={(crr) => {
            if (crr) navLinks.current.push(crr);
          }}
          href="/services"
        >
          <HoverSplitText>Services</HoverSplitText>
        </Link>
        <Link
          ref={(crr) => {
            if (crr) navLinks.current.push(crr);
          }}
          href="/pricing"
        >
          <HoverSplitText>Pricing</HoverSplitText>
        </Link>
        <Link
          ref={(crr) => {
            if (crr) navLinks.current.push(crr);
          }}
          href="/work"
        >
          <HoverSplitText>Work</HoverSplitText>
        </Link>
        <Link
          ref={(crr) => {
            if (crr) navLinks.current.push(crr);
          }}
          href="/about"
        >
          <HoverSplitText>About us</HoverSplitText>
        </Link>
      </div>

      <Button asLink href="/contact" className="">
        Let&apos;s Talk
      </Button>

      <NavToggler isActive={isActive} setIsActive={setIsActive} />

      <NavSection isActive={isActive} setIsActive={setIsActive} />
    </div>
  );
};

export default NavRight;
