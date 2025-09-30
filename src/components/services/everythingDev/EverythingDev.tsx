import Tooltip from "@/components/ui/Tooltip";
import ServicePills from "../ServicePill";
import MatrixTextCanvas from "./MatrixTextCanvas";

function EverythingDev() {
  return (
    // <section className="w-full min-h-screen bg-gradient-to-t from-gray-800 to-20% to-background relative">
    <section className="everything-dev absolute top-0 left-0 w-full h-full bg-background">
      <MatrixTextCanvas />

      <Tooltip
        text="Hover to interact with the matrix rain"
        className="absolute top-6 left-1/2 -translate-x-1/2"
      />

      <div className="w-full min-h-full px-8 lg:px-14 flex flex-col justify-start md:justify-center items-center gap-2 relative md:-translate-y-4 pt-20 md:pt-0 pointer-events-none">
        <h2 className="text-base md:text-4xl font-extralight">Everthing</h2>
        <h2 className="text-7xl md:text-[8.5vw] font-harmond font-semibold condensed leading-none">
          Development
        </h2>
      </div>
    </section>
  );
}

export default EverythingDev;
