"use client";

import { useScrollSmootherSnap } from "@/hooks/useScrollSmootherSnap";
import useScrollSnap from "@/hooks/useScrollSnap";

function ScrollSnapWrapper({
  prevSecClassName,
  curSecClassName,
  nextSecClassName,
  stopAfterSnap,
  children,
}: {
  prevSecClassName: string;
  curSecClassName: string;
  nextSecClassName?: string;
  stopAfterSnap?: boolean;
  children: React.ReactNode;
}) {
  // useScrollSnap(
  //   prevSecClassName,
  //   curSecClassName,
  //   nextSecClassName,
  //   stopAfterSnap
  // );
  // useScrollSmootherSnap({
  //   prevSectionClass: prevSecClassName,
  //   currentSectionClass: curSecClassName,
  //   nextSectionClass: nextSecClassName,
  //   stopAfterSnap,
  // });
  return <>{children}</>;
}

export default ScrollSnapWrapper;
