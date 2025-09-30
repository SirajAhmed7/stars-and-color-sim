"use client";

import { useEffect } from "react";
import matrixText from "./matrixText";

function MatrixTextCanvas() {
  useEffect(() => {
    const wrapper = document.querySelector(".matrix-text-wrapper");
    const canvas = document.querySelector("#matrix-text-canvas");
    const section = document.querySelector(".everything-dev");

    matrixText(
      section as HTMLElement,
      wrapper as HTMLDivElement,
      canvas as HTMLCanvasElement
    );
  }, []);
  return (
    <div className="absolute w-full h-full top-0 left-0 overflow-hidden">
      <div className="matrix-text-wrapper w-full h-full relative">
        <canvas id="matrix-text-canvas"></canvas>
      </div>
    </div>
  );
}

export default MatrixTextCanvas;
