import { cn } from "@/utils/utils";

function FrameText({ bgColor }: { bgColor: string }) {
  return (
    <>
      <div
        aria-hidden={true}
        className={cn(
          "frame-el fixed bottom-0 left-[10vw] h-[var(--frame-element-stroke-size)] px-4 py-2 hidden md:flex gap-9 items-center z-40 text-sm leading-6 bg-gray-800 font-extralight frame-element-bottom frame-stroke"
        )}
      >
        Not everyone gets in. But those who do, never go back to
        &quot;normal&quot;.
      </div>
      <div
        className={cn(
          "frame-el fixed bottom-0 left-[10vw] h-[var(--frame-element-size)] px-4 py-2 hidden md:flex gap-9 items-center z-50 text-sm leading-6 text-gray-200 font-extralight frame-element-bottom",
          bgColor
        )}
      >
        <span className="inline-block -translate-y-0.5">
          Not everyone gets in. But those who do, never go back to
          &quot;normal&quot;.
        </span>
      </div>
    </>
  );
}

export default FrameText;
