import FluidSim from "./liquidSim/FluidSim";
import TicketLink from "./TicketLink";

function Footer() {
  return (
    <footer className="footer h-[calc(150vh-var(--frame-size))] md:h-[calc(100vh-var(--frame-size))] relative bg-background z-20">
      <div className="flex md:hidden flex-col gap-5 px-12 py-12 max-md:z-20">
        <TicketLink text="Dribbble" href="https://dribbble.com/akshayhooda" />
        <TicketLink
          text="LinkedIn"
          href="https://www.linkedin.com/company/rare-design-studios/"
        />
        <TicketLink text="WhatsApp" href="https://web.whatsapp.com/" />
        <TicketLink
          text="Dial Up"
          href="tel:+919876543210"
          className="bg-gray-100 text-gray-900"
        />
      </div>

      <div
        id="orientation-permission-btn-wrapper"
        className="absolute w-full h-screen left-0 bottom-0 z-50 justify-center items-center hidden"
      >
        <button
          id="orientation-permission-btn"
          // className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-gray-900 text-2xl px-7 py-3 z-[200]"
          className="bg-white text-gray-900 text-lg px-7 py-3 z-[200]"
        >
          Enable Gyro Control
        </button>
      </div>

      <FluidSim />
      {/* <HangingSocials /> */}
    </footer>
  );
}

export default Footer;
