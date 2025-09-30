import starFragmentShader from "@/shaders/star/fragment.glsl";
import starVertexShader from "@/shaders/star/vertex.glsl";
import { useFrame, useThree } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

interface StarFieldProps {
  count?: number;
}

const StarField: React.FC<StarFieldProps> = ({ count = 1000 }) => {
  const starGeometryRef = useRef<THREE.BufferGeometry>(null);
  const positions = useMemo(() => new Float32Array(count * 3), [count]);
  const { viewport, camera } = useThree();
  const [isInitialized, setIsInitialized] = React.useState(false);

  useEffect(() => {
    // Initialize positions array
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = Math.random() * 1000 - 500; // x
      positions[i3 + 1] = Math.random() * 1000 - 500; // y
      positions[i3 + 2] = Math.random() * 2000 - 1000; // z
    }

    // Set initialized to true so the geometry can be set up
    setIsInitialized(true);
  }, [count]);

  // Set up geometry when ref is available and positions are initialized
  useEffect(() => {
    if (starGeometryRef.current && isInitialized) {
      starGeometryRef.current.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      starGeometryRef.current.computeBoundingSphere();
    }
  }, [isInitialized, positions]);

  useFrame(() => {
    if (!isInitialized || !starGeometryRef.current?.attributes.position) return;

    const positionArray = starGeometryRef.current.attributes.position
      .array as Float32Array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positionArray[i3 + 2] += 2 * (i / count);
      if (positionArray[i3 + 2] > 1000) positionArray[i3 + 2] -= 2000;
    }
    starGeometryRef.current.attributes.position.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry ref={starGeometryRef} />
      <shaderMaterial
        vertexShader={starVertexShader}
        fragmentShader={starFragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
          uSize: { value: 3000 },
        }}
      />
    </points>
  );
};

export default StarField;
