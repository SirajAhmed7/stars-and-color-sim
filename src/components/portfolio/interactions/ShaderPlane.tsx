import React, { useRef, useEffect, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader, ShaderMaterial, Mesh } from "three";
import * as THREE from "three";
import gsap from "gsap";
import glsl from "glslify";
// import vertex from "./../../../shaders/gallery/vertex-01.glsl";
// import fragment from "./../../../shaders/gallery/fragment-01.glsl";

const vertex = `
precision mediump float;
varying vec2 vUv;
varying float wave;
uniform float uTime;
uniform float uProg;
uniform float uIndex;

// Simple noise function to replace glslify dependency
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float noise(vec3 st) {
    vec2 i = floor(st.xy);
    vec2 f = fract(st.xy);
    
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  vec3 pos = position;
  if (uIndex < 3.) {      
    pos.z += noise(vec3(pos.x * 4. + uTime, pos.y, 0.)) * uProg;
    wave = pos.z;
    pos.z *= 3.;    
  } else if (uIndex < 6.) {
    float pr = smoothstep(0., 0.5 - sin(pos.y), uProg) * 5.;
    pos.z += pr;
  } else {
    pos.z += sin(pos.y * 5. + uTime) * 2. * uProg;
    wave = pos.z;
  }
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}
`;

const fragment = `
precision mediump float;
varying vec2 vUv;
varying float wave;
uniform sampler2D uTexture;
uniform float uTime;
uniform float uProg;
uniform float uIndex;
 
void main() {
  vec2 uv = vUv;
  vec2 dUv = vec2(uv.x, uv.y);
  vec3 textureColor; // Changed from 'texture' to 'textureColor'
 
  if (uIndex < 3.) {
    float w = wave;
    float r = texture2D(uTexture, dUv + vec2(0., 0.) + uProg * w * 0.05).r;
    float g = texture2D(uTexture, dUv + vec2(0., 0.) + uProg * w * 0.0).g;
    float b = texture2D(uTexture, dUv + vec2(0., 0.) + uProg * w * -0.02).b;
    textureColor = vec3(r, g, b);    
  } else if (uIndex < 6.) {
    float count = 10.;
    float smoothness = 0.5;
    float pr = smoothstep(-smoothness, 0., dUv.y - (1. - uProg) * (1. + smoothness));
    float s = 1. - step(pr, fract(count * dUv.y));
    textureColor = texture2D(uTexture, dUv * s).rgb;
  } else {
    dUv.y += wave * 0.05;
    float r = texture2D(uTexture, dUv + vec2(0., 0.)).r;
    float g = texture2D(uTexture, dUv + vec2(0., 0.)).g;
    float b = texture2D(uTexture, dUv + vec2(0., -0.02) * uProg).b;
    textureColor = vec3(r, g, b);
  }
 
  gl_FragColor = vec4(textureColor, 1.);
}
`;

interface ShaderPlaneProps {
  el: HTMLElement | null;
  index: number;
  imageSrc: string;
}

interface ShaderUniforms {
  uTexture: { value: THREE.Texture | null };
  uTime: { value: number };
  uProg: { value: number };
  uIndex: { value: number };
}

const ShaderPlane: React.FC<ShaderPlaneProps> = ({ el, index, imageSrc }) => {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<ShaderMaterial>(null);

  // Load texture
  const texture = useLoader(TextureLoader, imageSrc);

  // Configure texture
  useEffect(() => {
    if (texture) {
      texture.minFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
    }
  }, [texture]);

  // Create shader material with uniforms
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uTexture: { value: texture },
        uTime: { value: 0 },
        uProg: { value: 0 },
        uIndex: { value: index },
      } as {
        [uniform: string]: THREE.IUniform<any>;
      },
    });
  }, [texture, index]);

  // Update time uniform on each frame
  useFrame((state) => {
    if (materialRef.current?.uniforms) {
      (
        materialRef.current.uniforms as {
          [uniform: string]: THREE.IUniform<any>;
        }
      ).uTime.value = state.clock.elapsedTime;
    }
  });

  // Mouse event handlers
  useEffect(() => {
    if (!el) return;

    const handleMouseEnter = (): void => {
      if (materialRef.current?.uniforms) {
        gsap.to(
          (
            materialRef.current.uniforms as {
              [uniform: string]: THREE.IUniform<any>;
            }
          ).uProg,
          {
            value: 1,
            ease: "power.inOut",
          }
        );
      }
    };

    const handleMouseLeave = (): void => {
      if (materialRef.current?.uniforms) {
        gsap.to(
          (
            materialRef.current.uniforms as {
              [uniform: string]: THREE.IUniform<any>;
            }
          ).uProg,
          {
            value: 0,
            ease: "power.inOut",
          }
        );
      }
    };

    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [el]);

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <primitive ref={materialRef} object={shaderMaterial} attach="material" />
    </mesh>
  );
};

export default ShaderPlane;
