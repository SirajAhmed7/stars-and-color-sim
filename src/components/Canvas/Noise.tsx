import fragment from "@/shaders/noise/fragment.glsl";
import vertex from "@/shaders/noise/vertex.glsl";
import { useFrame } from "@react-three/fiber";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// const Noise = () => {
//   const uniforms = {
//     uOpacity: { value: 0.1 },
//     uWhites: { value: 0.5 },
//     uBlacks: { value: 0.5 },
//     uTime: { value: 0 },
//   };

//   // useFrame((state) => {
//   //   const time = state.clock.elapsedTime;
//   //   uniforms.uTime.value = time;
//   // })
//   useFrame((state, delta) => {
//     uniforms.uTime.value += delta; // Accumulate delta time
//     uniforms.uTime.value %= 1000; // Keep it bounded
//   });

//   return (
//     <mesh>
//       <planeGeometry args={[2, 2]} />
//       <shaderMaterial
//         fragmentShader={fragment}
//         vertexShader={vertex}
//         transparent={true}
//         uniforms={uniforms}
//       />
//     </mesh>
//   );
// };

const Noise = () => {
  const pathname = usePathname();
  const uniformsRef = useRef({
    uOpacity: { value: pathname === "/portfolio" ? 0.0 : 0.07 },
    uWhites: { value: 0.5 },
    uBlacks: { value: 0.5 },
    uTime: { value: 0 },
  });

  useFrame((state, delta) => {
    uniformsRef.current.uTime.value += delta;
    uniformsRef.current.uTime.value %= 1000;
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Reset time when component unmounts
      uniformsRef.current.uTime.value = 0;
    };
  }, [pathname]);

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        fragmentShader={fragment}
        vertexShader={vertex}
        transparent={true}
        uniforms={uniformsRef.current}
      />
    </mesh>
  );
};

export default Noise;
