import $ from "./$";
import $$ from "./$$";
import makeSticky from "./makeSticky";
import getCursorPosition from "./getCursorPosition";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import gsap from "gsap";

type ClassValue = string | null | undefined | ClassValue[];

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function snapScrollTo(
  secClassName: string,
  scroller: ScrollSmoother | null,
  isAnimating: boolean,
  duration: number = 0.5
) {
  // lenisInstance?.stop();
  if (isAnimating) return;
  // gsap.to(window, {
  //   scrollTo: {
  //     y: secClassName,
  //     offsetY: 0,
  //     autoKill: false,
  //   },
  //   duration,
  //   ease: "power2",
  //   onComplete: () => {
  //     lenisInstance?.start();
  //   },
  // });
  scroller?.scrollTo(secClassName, true);
  scroller?.paused(false);
}

function randomChars(length: number) {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += `${charset[randomIndex]}`;
  }
  return result;
}

function scramble(text: string, element: Element) {
  let prefix = "";
  let suffix = randomChars(text.length);

  function scrambleIteration() {
    let nextChar = text.charAt(prefix.length);

    prefix = prefix + nextChar;
    suffix = randomChars(text.length - prefix.length);
    if (element) {
      element.innerHTML = prefix + suffix;
    }
  }

  for (let i = 0; i < text.length; i++) {
    setTimeout(() => {
      scrambleIteration();
    }, 30 * i);
  }
}

function observerScroll(
  lenisInstance: any,
  prevSecClassName: string,
  curSecClassName: string,
  nextSecClassName: string,
  isAnimating: boolean
) {}

export {
  $,
  $$,
  makeSticky,
  getCursorPosition,
  cn,
  snapScrollTo,
  scramble,
  randomChars,
};
