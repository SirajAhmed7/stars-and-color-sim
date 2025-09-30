'use client';

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { hoverLinkAudio } from "../Audio/audio";

const TextHoverArrow = ({ children }: Readonly<{ children: React.ReactNode }>) => {
   const arrowParent = useRef<HTMLSpanElement>(null);
   const arrow = useRef<HTMLSpanElement>(null);
   const text = useRef<HTMLSpanElement>(null);
   const container = useRef<HTMLSpanElement>(null);

   useGSAP(() => {
      const moveX = arrow.current?.getBoundingClientRect()?.width;
      if(!moveX) return;
      const tl = gsap.timeline({paused: true});
      tl
         .to(arrowParent.current, {
            onStart: () => {hoverLinkAudio.play()},
            width: moveX,
            duration: 0.15,
            ease: 'power1.in'
         })
         .to(text.current, {
            x: moveX / 2,
            duration: 0.15,
            ease: 'power1.out'
         })
         .to(text.current, {
            keyframes: {
               filter: [
                  'blur(0px)',
                  'blur(0.2px)',
                  'blur(0px)',
               ],
               opacity: [1, 0.8, 1],
               easeEach: 'none'
            },
            duration: 0.3
         }, 0)


      container.current?.addEventListener('mouseenter', () => tl.play());
      container.current?.addEventListener('mouseleave', () => tl.reverse());
   }, []);


   return (
      <span ref={container} className="flex items-center">
         <span ref={arrowParent} className="w-0 overflow-hidden">
            <span ref={arrow} className="leading-none translate-y-[11%] inline-block">⮡&nbsp;</span>
         </span>
         <span ref={text}>{children}</span>
      </span>
   )
}

export default TextHoverArrow
