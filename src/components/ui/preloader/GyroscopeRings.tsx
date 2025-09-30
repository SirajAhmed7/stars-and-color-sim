"use client";

import { useEffect, useState } from "react";

const GyroscopeRings = ({
  // ringCount = 5,
  ringCount = 1,
  ringsPerWrapper = 3,
  // baseSize = 2,
  baseSize = 36,
  animationDuration = 5000,
  backgroundColor = "transparent",
  ringColor = "white",
}) => {
  const [windowWidth, setWindowWidth] = useState(1536);

  // Generate array of ring wrapper sizes
  const wrapperSizes = Array.from({ length: ringCount }, (_, i) => {
    const multiplier = Math.pow(2, i);
    return baseSize * multiplier;
  });

  const containerStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100vw",
    height: "100vh",
    backgroundColor,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const ringWrapperBaseStyle = {
    listStyle: "none",
    margin: 0,
    padding: 0,
    position: "absolute",
    animation: `spinZ ${animationDuration}ms infinite linear`,
  };

  const ringStyle = {
    position: "absolute",
    width: "100%",
    height: "100%",
    // border: `1px solid ${ringColor}`,
    border: `2px solid ${ringColor}`,
    borderRadius: "50%",
    animation: `spinY ${animationDuration}ms infinite linear`,
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div style={{ ...(containerStyle as any) }}>
      <style>
        {`
          @keyframes spinY {
            0%   { transform: rotateY(0deg); }
            100% { transform: rotateY(360deg); }
          }

          @keyframes spinZ {
            0%   { transform: rotateZ(0deg); }
            100% { transform: rotateZ(360deg); }
          }
        `}
      </style>

      <div style={{ position: "relative" }}>
        {wrapperSizes.map((size, wrapperIndex) => {
          const wrapperStyle = {
            ...ringWrapperBaseStyle,
            width: `${Math.min(size, (windowWidth * 0.8) / 16)}em`,
            height: `${Math.min(size, (windowWidth * 0.8) / 16)}em`,
            marginTop: `-${Math.min(size, (windowWidth * 0.8) / 16) / 2}em`,
            marginLeft: `-${Math.min(size, (windowWidth * 0.8) / 16) / 2}em`,
            animationDirection: wrapperIndex % 2 === 1 ? "reverse" : "normal",
          };
          // const wrapperStyle = {
          //   ...ringWrapperBaseStyle,
          //   width: `min(${size}em, calc(80vw / 1em))`,
          //   height: `min(${size}em, calc(80vw / 1em))`,
          //   marginTop: `calc(min(${size}em, calc(80vw / 1em)) / -2)`,
          //   marginLeft: `calc(min(${size}em, calc(80vw / 1em)) / -2)`,
          //   animationDirection: wrapperIndex % 2 === 1 ? "reverse" : "normal",
          // };

          return (
            <ul key={wrapperIndex} style={wrapperStyle as any}>
              {Array.from({ length: ringsPerWrapper }, (_, ringIndex) => (
                <li
                  key={ringIndex}
                  style={{
                    ...(ringStyle as any),
                    // animationDelay: `-${(ringIndex + 1) * 500}ms`,
                    animationDelay: `-${
                      (animationDuration / 2 / ringsPerWrapper) * ringIndex
                    }ms`,
                  }}
                />
              ))}
            </ul>
          );
        })}
      </div>
    </div>
  );
};

export default GyroscopeRings;
