import { horizontalLoop } from "@/utils/interactionUtils";
import { useGSAP } from "@gsap/react";
import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef } from "react";
import { Group, Mesh, Vector3 } from "three";

function GalleryContainer() {
  const meshesRef = useRef<Mesh[]>([]);
  const groupsRef = useRef<Group[]>([]);
  const { camera, clock } = useThree();
  const controlsRef = useRef<any>(undefined);
  const scrollRef = useRef({ x: 0, y: 0 });
  const RelMouseX = useRef({ x: 0 });

  // const size = 1.8;
  const size = 1.8;

  useGSAP(() => {
    gsap.to(scrollRef.current, {
      scrollTrigger: {
        trigger: document.querySelector(".portfolio-gallery"),
        start: "top top",
        end: "+=400%",
        scrub: 1.2,
        pin: true,
        pinSpacing: true,
      },
      // y: -14.5 * size,
      y: -20 * size,
    });

    const setX = gsap.quickTo(RelMouseX.current, "x", {
      duration: 4,
      ease: "power3.out",
    });

    const canvasWrapper: HTMLElement | null =
      document.querySelector(".scroll-canvas");

    if (!canvasWrapper) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = -((e.clientX / window.innerWidth) * 2 - 1);

      setX(x);
    };

    canvasWrapper.addEventListener("mousemove", handleMouseMove);

    return () => {
      canvasWrapper.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useFrame(() => {
    camera.position.y = scrollRef.current.y;

    // camera.rotation.y = RelMouseX.current.x * Math.PI * 0.8;
    // controlsRef.current.rotation.y = (RelMouseX.current * Math.PI) / 2;

    // groupsRef.current?.forEach((group, i) => {
    //   group.rotation.y =
    //     (((i % 2 === 0 ? 1 : -1) * clock.elapsedTime * Math.PI) / 2) * 0.2;
    // });
  });

  return (
    <>
      {new Array(8).fill(1).map((_, i) => (
        <group
          ref={(el) => {
            if (el) {
              groupsRef.current.push(el);
            }
          }}
          key={"group-" + i}
        >
          {new Array(8).fill(1).map((_, j) => (
            <mesh
              ref={(el) => {
                if (el) {
                  meshesRef.current.push(el);
                }
              }}
              key={j}
              // position={[(j - 3.5) * size * 4.5, size * 3.3 * (1.3 - i), -1]}
              position={[(j - 3.5) * size * 4.1, size * 3.1 * (0.3 - i), -1]}
              // position={[
              //   Math.sin(((Math.PI * 2) / 16) * j) * size * 10.4,
              //   // -size * 3.3,
              //   // size * 3.3 * (3.5 - i),
              //   size * 3.3 * (1.3 - i),
              //   // Math.cos(((Math.PI * 2) / 8) * j) * size * 5.2,
              //   Math.cos(((Math.PI * 2) / 16) * j) * size * 10.4,
              //   // Math.cos(((Math.PI * 2) / 12) * j) * size * 7.8,
              // ]}
            >
              <planeGeometry args={[4 * size, 3 * size]} />
              <meshBasicMaterial color={`${j === 0 ? "#FF0000" : "#00FF00"}`} />
            </mesh>
          ))}
        </group>
      ))}
    </>
  );
}

export default GalleryContainer;
