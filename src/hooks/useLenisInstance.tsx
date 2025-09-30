import Lenis from "lenis";
import { useLenis } from "lenis/react";
import { useEffect, useState } from "react";

function useLenisInstance(): Lenis | null {
  const [lenisInstance, setLenisInstance] = useState<any>(null);
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      setLenisInstance(lenis);
    }
  }, [lenis]);

  return lenisInstance;
}

export default useLenisInstance;
