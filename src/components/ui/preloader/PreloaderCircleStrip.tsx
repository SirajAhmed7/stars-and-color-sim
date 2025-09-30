import { cn } from "@/utils/utils";

function PreloaderCircleStrip({ className }: { className?: string }) {
  const radius = 152.5;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      className={cn(
        "absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 aspect-square w-full spoke-rotate",
        className
      )}
    >
      <svg
        width="325"
        height="325"
        viewBox="0 0 325 325"
        className="absolute top-0 left-0 aspect-square w-full h-full"
      >
        <circle
          cx="162.5"
          cy="162.5"
          r="152.5"
          stroke="#3F3F46"
          strokeWidth="20"
          strokeDasharray={`0 ${circumference}`}
          fill="none"
          style={{
            animation: "drawSpokes 3s ease-out forwards",
          }}
        />
      </svg>

      <style jsx>{`
        .spoke-rotate {
          animation: rotate360 12s linear 3s infinite;
        }

        @keyframes drawSpokes {
          from {
            stroke-dasharray: 0 ${circumference};
          }
          to {
            stroke-dasharray: 2 22;
          }
        }

        @keyframes rotate360 {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default PreloaderCircleStrip;
