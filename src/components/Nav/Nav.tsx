"use client";

import { useEffect, useState } from "react";
import NavLeft from "./NavLeft";
import NavRight from "./NavRight";
import { cn } from "@/utils/utils";

const Nav = () => {
  const [isWindowScrolled, setIsWindowScrolled] = useState(false);

  useEffect(function () {
    window.addEventListener("scroll", () => {
      setIsWindowScrolled(window.scrollY > 0);
    });

    return () => {
      window.removeEventListener("scroll", () => {
        setIsWindowScrolled(window.scrollY > 0);
      });
    };
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 z-30 w-full 2xl:text-xl flex items-center justify-between px-[4vw] py-3 transition-all ease-in-out",
        isWindowScrolled ? "" : "bg-black/20 backdrop-blur-md"
      )}
      // className={cn(
      //   "fixed top-0 left-0 z-30 w-full 2xl:text-xl flex items-center justify-between px-4 lg:px-10 py-3 transition-all ease-in-out bg-black/20 backdrop-blur-md"
      // )}
    >
      <NavLeft />
      <NavRight />
    </nav>
  );
};

export default Nav;
