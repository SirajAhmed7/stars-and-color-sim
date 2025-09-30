import TetrisFallCanvas from "./TetrisFallCanvas";
import Tooltip from "@/components/ui/Tooltip";

function EverythingDesign() {
  return (
    <section className="everything-design absolute top-0 left-0 w-full h-full bg-background">
      <TetrisFallCanvas />

      <Tooltip
        text="Hover to change orientation and move the piece"
        className="absolute top-6 left-1/2 -translate-x-1/2"
      />

      <div className="w-full h-full px-8 lg:px-14 flex flex-col justify-start md:justify-center items-center gap-2 relative md:-translate-y-4 pt-20 md:pt-0">
        <h2 className="text-base md:text-4xl font-extralight">Everthing</h2>
        <h2 className="text-7xl md:text-[8.5vw] font-harmond font-semibold condensed md:leading-none text-center">
          <span className="hidden md:inline">Product </span>Design
        </h2>
      </div>
    </section>
  );
}

export default EverythingDesign;
