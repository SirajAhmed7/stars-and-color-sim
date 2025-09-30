// components/MobileRedirect.tsx
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useMobileDetection } from "@/hooks/useMobileDetection";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MobileRedirect = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isMobile, isLoaded } = useMobileDetection();

  useEffect(() => {
    if (isLoaded && isMobile && pathname !== "/") {
      router.replace("/");
    }
  }, [isMobile, isLoaded, pathname, router]);

  // // Show loading state until we know if it's mobile
  // if (!isLoaded) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-black">
  //       <div className="text-2xl font-extralight text-white">
  //         Loading the rare experience...
  //       </div>
  //     </div>
  //   );
  // }

  return <>{children}</>;
};

export default MobileRedirect;
