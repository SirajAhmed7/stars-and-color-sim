"use client";

import { $$ } from "@/utils/utils";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import CSSPlugin from "gsap/CSSPlugin";
import { useRef, useEffect } from "react";
import { useLenisContext } from "../interactions/LenisContext";
import Hover from "../interactions/HoverSplit3DRotateText";
import Link from "next/link";
import NavSectionDetails from "./NavSectionDetails";
import { closeGateAudio, openGateAudio } from "../Audio/audio";
import useLenisInstance from "@/hooks/useLenisInstance";
import React from "react";
import { useScrollSmoother } from "@/contexts/ScrollSmootherContext";

gsap.registerPlugin(CSSPlugin);

type NavSectionProps = {
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
};

// const NavSection: React.FC<NavSectionProps> = ({ isActive, setIsActive }) => {
//   // const lenis: any = useLenisContext();
//   // const lenis = useLenisInstance();
//   const { scroller } = useScrollSmoother();
//   const links = [
//     "subscription",
//     "services",
//     "work",
//     "pricing",
//     "about",
//     "contact",
//   ];
//   const navPage = useRef<HTMLElement>(null);
//   const navPageLinks = useRef<HTMLAnchorElement[]>([]);
//   const activeClickAnimationTl = useRef<gsap.core.Timeline | null>(null);

//   useGSAP(() => {
//     activeClickAnimationTl.current = gsap.timeline({ paused: true });
//     activeClickAnimationTl.current
//       .to(
//         navPage.current,
//         {
//           clipPath: "polygon(100% 0%, 0% 0%, 0% 100%, 100% 100%)",
//           ease: "expo.inOut",
//           duration: 1,
//         },
//         "<"
//       )
//       .fromTo(
//         navPageLinks.current,
//         {
//           xPercent: 100,
//         },
//         {
//           xPercent: 0,
//           duration: 1,
//           stagger: 0.05,
//           ease: "power4.inOut",
//         },
//         "<-0.1"
//       );

//     navPageLinks.current.forEach((link) => {
//       const nonItalicLinks = $$(".non-italic", link);
//       activeClickAnimationTl.current?.fromTo(
//         nonItalicLinks,
//         {
//           xPercent: 100,
//           opacity: 0,
//           scaleX: 0,
//         },
//         {
//           xPercent: 0,
//           opacity: 1,
//           scaleX: 1,
//           stagger: 0.05,
//           duration: 1,
//           ease: "power4.inOut",
//         },
//         "<"
//       );
//     });
//   }, []);

//   useEffect(() => {
//     if (!scroller) return;
//     if (isActive) {
//       gsap.delayedCall(0.5, () => openGateAudio.play());
//       activeClickAnimationTl.current?.play();
//       scroller.paused(true);
//     } else {
//       gsap.delayedCall(0.5, () => closeGateAudio.play());
//       activeClickAnimationTl.current?.reverse();
//       scroller.paused(false);
//     }
//   }, [isActive, scroller]);

//   return (
//     <nav
//       ref={navPage}
//       // className="nav-page fixed top-0 right-0 h-screen w-full lg:w-1/2 2xl:w-[40%] bg-[#f1edeb] text-[#212121] flex items-center justify-center flex-col gap-[1vh]"
//       className="nav-page fixed top-0 right-0 h-screen w-full lg:w-1/2 2xl:w-[40%] bg-gray-800 text-gray-100 flex items-center justify-center flex-col gap-[1vh] z-50"
//       style={{ clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)" }}
//     >
//       <div className="space-y-3">
//         {links.map((elem, i) => {
//           const index = "0" + (i + 1).toString();
//           return (
//             <Link
//               key={elem}
//               href={elem}
//               ref={(crr) => {
//                 if (crr) navPageLinks.current.push(crr);
//               }}
//               onClick={() => {
//                 setIsActive(false);
//               }}
//               className="block"
//             >
//               <Hover index={index}>{elem}</Hover>
//             </Link>
//           );
//         })}
//       </div>

//       {/* <NavSectionDetails isActive={isActive} /> */}
//     </nav>
//   );
// };

const NavSection: React.FC<NavSectionProps> = ({ isActive, setIsActive }) => {
  // const lenis: any = useLenisContext();
  // const lenis = useLenisInstance();
  const { scroller } = useScrollSmoother();
  const links = [
    "subscription",
    "services",
    "work",
    "pricing",
    "about",
    "contact",
  ];
  const navPage = useRef<HTMLElement>(null);
  const navPageLinks = useRef<HTMLAnchorElement[]>([]);
  const activeClickAnimationTl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    activeClickAnimationTl.current = gsap.timeline({ paused: true });
    activeClickAnimationTl.current
      .to(
        navPage.current,
        {
          // clipPath: "polygon(100% 0%, 0% 0%, 0% 100%, 100% 100%)",
          xPercent: -100,
          ease: "expo.inOut",
          duration: 1,
        },
        "<"
      )
      .fromTo(
        navPageLinks.current,
        {
          xPercent: 100,
        },
        {
          xPercent: 0,
          duration: 1,
          stagger: 0.05,
          ease: "power4.inOut",
        },
        "<-0.1"
      );

    navPageLinks.current.forEach((link) => {
      const nonItalicLinks = $$(".non-italic", link);
      activeClickAnimationTl.current?.fromTo(
        nonItalicLinks,
        {
          xPercent: 100,
          opacity: 0,
          scaleX: 0,
        },
        {
          xPercent: 0,
          opacity: 1,
          scaleX: 1,
          stagger: 0.05,
          duration: 1,
          ease: "power4.inOut",
        },
        "<"
      );
    });
  }, []);

  useEffect(() => {
    if (isActive) {
      gsap.delayedCall(0.5, () => openGateAudio.play());
      activeClickAnimationTl.current?.play();
      scroller?.paused(true);
    } else {
      gsap.delayedCall(0.5, () => closeGateAudio.play());
      activeClickAnimationTl.current?.reverse();
      scroller?.paused(false);
    }
  }, [isActive, scroller]);

  return (
    <nav
      ref={navPage}
      // className="nav-page fixed top-0 right-0 h-screen w-full lg:w-1/2 2xl:w-[40%] bg-[#f1edeb] text-[#212121] flex items-center justify-center flex-col gap-[1vh]"
      className="nav-page fixed top-0 right-0 h-screen w-full lg:w-1/2 2xl:w-[40%] translate-x-full bg-gray-800 text-gray-100 flex items-center justify-center flex-col gap-[1vh] z-50"
      // style={{ clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)" }}
    >
      <div className="space-y-3">
        {links.map((elem, i) => {
          const index = "0" + (i + 1).toString();
          return (
            <Link
              key={elem}
              href={elem}
              ref={(crr) => {
                if (crr) navPageLinks.current.push(crr);
              }}
              onClick={() => {
                setIsActive(false);
              }}
              className="block"
            >
              <Hover index={index}>{elem}</Hover>
            </Link>
          );
        })}
      </div>

      {/* <NavSectionDetails isActive={isActive} /> */}
    </nav>
  );
};

export default NavSection;
