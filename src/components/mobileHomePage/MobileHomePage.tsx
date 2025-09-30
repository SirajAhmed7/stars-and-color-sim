import Image from "next/image";
import HeroTagline from "../home/Hero/HeroTagline";
import TicketLink from "../ui/TicketLink";
import MobileSocialLink from "./MobileSocialLink";
import NormalizeScroll from "./NormalizeScroll";
import WebExperienceWarning from "./WebExperienceWarning";
import MobileContactForm from "./MobileContactForm";

function MobileHomePage() {
  return (
    <div className="w-full h-svh relative">
      <NormalizeScroll />

      {/* <WebExperienceWarning /> */}

      <HeroTagline />
    </div>
  );
}

export default MobileHomePage;
