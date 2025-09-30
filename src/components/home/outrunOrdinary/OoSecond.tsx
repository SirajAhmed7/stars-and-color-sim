"use client";

import BlinkingStar from "@/components/ui/BlinkingStar";
import PureTextEffect from "./PureTextEffect";

function OoSecond({ tl }: { tl: GSAPTimeline | null }) {
  return (
    <div className="oo-second absolute top-0 left-0 w-full h-full flex justify-center items-center bg-gray-980 border-t border-gray-800 z-10">
      <BlinkingStar className="top-[6%] left-[35%] w-8" />
      <BlinkingStar className="top-[15%] left-[7%] w-12" />
      <BlinkingStar className="top-[40%] left-[13%] w-7" />
      <BlinkingStar className="top-[60%] left-[9%] w-9" />
      <BlinkingStar className="top-[80%] left-[25%] w-10" />
      <BlinkingStar className="top-[85%] left-[48%] w-7" />
      <BlinkingStar className="top-[76%] right-[35%] w-12" />
      <BlinkingStar className="top-[80%] right-[10%] w-7" />
      <BlinkingStar className="top-[50%] right-[14%] w-9" />
      <BlinkingStar className="top-[30%] right-[10%] w-10" />
      <BlinkingStar className="top-[10%] right-[18%] w-8" />
      <BlinkingStar className="top-[7%] right-[40%] w-7" />
      <PureTextEffect
        text="Outrun ordinary."
        backgroundColor="#141416"
        tl={tl}
      />
    </div>
  );
}

export default OoSecond;
