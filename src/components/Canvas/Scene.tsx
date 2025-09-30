"use client";

import { Canvas } from "@react-three/fiber";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

// Dynamic imports for Noise and StarField components
const Noise = dynamic(() => import("./Noise"), {
  ssr: false,
  loading: () => null,
});

const StarField = dynamic(() => import("./StarField"), {
  ssr: false,
  loading: () => null,
});

const Scene = () => {
  const pathname = usePathname();
  const [resizeKey, setResizeKey] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setResizeKey((prevKey) => prevKey + 1);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className="h-screen max-w-[100vw] w-full fixed z-[100] top-0 left-0 pointer-events-none mix-blend-hard-light">
        <Canvas flat key={resizeKey} style={{ pointerEvents: "none" }}>
          <Suspense fallback={null}>
            <Noise key={pathname} />
          </Suspense>
        </Canvas>
      </div>
      <div className="h-screen max-w-[100vw] w-full fixed z-10 top-0 left-0 pointer-events-none">
        <Canvas key={resizeKey} style={{ pointerEvents: "none" }}>
          <Suspense fallback={null}>
            <StarField count={400} />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
};

export default Scene;
