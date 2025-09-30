import Diamond from "@/components/ui/Diamond";

function StepContent({ title, text }: { title: string; text: string }) {
  return (
    <div className="space-y-2 lg:space-y-2">
      <h3 className="text-5xl lg:text-6xl min-[1920px]:text-7xl font-harmond italic">
        {title}
      </h3>
      <div className="flex items-center gap-3 sm:gap-4">
        <Diamond size={24} />
        <p className="text-xl lg:text-2xl font-extralight text-gray-400">
          {text}
        </p>
      </div>
    </div>
  );
}

export default StepContent;
