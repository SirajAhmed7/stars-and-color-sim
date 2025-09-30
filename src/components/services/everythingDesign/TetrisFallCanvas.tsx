"use client";

import { useEffect } from "react";
import tetrisFall from "./tetrisFall";

function TetrisFallCanvas() {
  useEffect(() => {
    const section = document.querySelector(".everything-design");
    const wrapper = document.querySelector(".tetris-fall-wrapper");
    const canvas = document.querySelector("#tetris-fall-canvas");

    tetrisFall(
      section as HTMLElement,
      wrapper as HTMLDivElement,
      canvas as HTMLCanvasElement
    );
  }, []);
  return (
    <div className="absolute w-full h-full top-0 left-0 overflow-hidden">
      <div className="tetris-fall-wrapper w-full h-full relative">
        <canvas id="tetris-fall-canvas"></canvas>
      </div>
    </div>
  );
}

export default TetrisFallCanvas;
