import { cn } from "@/utils/utils";

function TicketLink({
  href,
  text,
  className,
}: {
  href: string;
  text: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        "bg-gray-800 text-white text-7xl font-semibold w-full px-7 py-6 flex items-center justify-center",
        "font-harmond",
        "condensed",
        className
      )}
      style={{
        clipPath: `polygon(0 0, calc(100% - var(--frame-size) * 2) 0, 100% calc(var(--frame-size) * 2), 100% 100%, 0 100%)`,
      }}
    >
      {text}
    </a>
  );
}

export default TicketLink;
