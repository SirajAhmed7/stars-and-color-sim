"use client";

import Image from "next/image";
import { useState } from "react";

function WebExperienceWarning() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-x-11 top-14 flex items-center gap-2 p-2 bg-white/10 backdrop-blur-[100px] z-10">
      <Image
        src={"/images/info-circle.svg"}
        alt="info"
        width={20}
        height={20}
      />

      <p className="text-xs font-light basis-full">
        This experience is designed for the web. Please open the link in a
        desktop browser for the full interactive-experience.
      </p>

      <button onClick={() => setIsOpen(false)}>
        <Image src={"/images/x-close.svg"} alt="Close" width={20} height={20} />
      </button>
    </div>
  );
}

export default WebExperienceWarning;
