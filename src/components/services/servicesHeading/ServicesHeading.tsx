import DiamondCorners from "@/components/ui/DiamondCorners";

function ServicesHeading() {
  return (
    <section className="services-heading w-full h-full relative overflow-hidden bg-background">
      <DiamondCorners />

      <div className="absolute w-full h-full top-0 left-0 pointer-events-none">
        <video
          muted
          autoPlay
          loop
          controls={false}
          // src="/videos/home-diamond-2.mp4"
          className="w-full h-full object-cover"
          playsInline
        >
          <source
            src="/videos/services-spider-rob-heading.mp4"
            type="video/mp4"
          />
          {/* <source src="/videos/home-diamond-2.mp4" type="video/mp4" /> */}
        </video>
      </div>

      <div className="w-full h-full min-h-0 flex justify-center items-center relative">
        <h1 className="text-6xl lg:text-[106px] font-harmond condensed font-semibold text-center lg:leading-none">
          Services
        </h1>
      </div>
    </section>
  );
}

export default ServicesHeading;
