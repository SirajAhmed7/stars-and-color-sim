import Image from "next/image";
import Diamond from "./Diamond";

function DiamondCorners({
  fullWidth,
  corner,
}: {
  fullWidth?: boolean;
  corner?: "left" | "right" | undefined;
}) {
  // return (
  //   <div className="w-full h-full absolute inset-0 pt-[88px] pointer-events-none z-[1]">
  //     {/* {corner === "left" && (
  //       <div className="absolute top-12 lg:top-8 left-8 lg:left-10">
  //         <Image
  //           src={"/images/corner-diamond.svg"}
  //           alt="Diamond"
  //           height={40}
  //           width={40}
  //         />
  //         <div className="hidden lg:block absolute top-1/2 right-1 -translate-y-1/2 translate-x-full h-[1px] min-w-44 bg-gradient-to-r from-white to-white/0"></div>
  //         <div className="hidden lg:block absolute left-1/2 top-1 -translate-x-1/2 -translate-y-full min-h-44 w-[1px] bg-gradient-to-t from-white to-white/0"></div>
  //       </div>
  //     )} */}

  //     <div className="w-full h-full relative">
  //       <div
  //         className={`w-full h-full ${
  //           fullWidth ? "" : "max-w-[1920px]"
  //         } mx-auto absolute inset-0 pointer-events-none`}
  //       >
  //         {corner === undefined || corner === "right" ? (
  //           <div className="absolute top-12 lg:top-8 right-8 lg:right-10">
  //             <Diamond size={24} />
  //             <div className="hidden lg:block absolute top-1/2 left-1 -translate-y-1/2 -translate-x-full h-[1px] min-w-12 bg-gradient-to-l from-white to-white/0"></div>
  //             <div className="hidden lg:block absolute left-1/2 bottom-1 -translate-x-1/2 translate-y-full min-h-12 w-[1px] bg-gradient-to-b from-white to-white/0"></div>
  //           </div>
  //         ) : null}

  //         {corner === undefined || corner === "left" ? (
  //           <div className="absolute bottom-12 lg:bottom-8 left-8 lg:left-10">
  //             <Diamond size={24} />
  //             <div className="hidden lg:block absolute top-1/2 right-1 -translate-y-1/2 translate-x-full h-[1px] min-w-12 bg-gradient-to-r from-white to-white/0"></div>
  //             <div className="hidden lg:block absolute left-1/2 top-1 -translate-x-1/2 -translate-y-full min-h-12 w-[1px] bg-gradient-to-t from-white to-white/0"></div>
  //           </div>
  //         ) : null}
  //       </div>
  //     </div>
  //   </div>
  // );
  return null;
}

export default DiamondCorners;
