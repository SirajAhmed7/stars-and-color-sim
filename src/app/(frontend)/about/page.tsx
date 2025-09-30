import FoundersOwnersPartners from "@/components/about/FoundersOwnersPartners/FoundersOwnersPartners";
import MeetTheOriginals from "@/components/about/meetTheOriginals/MeetTheOriginals";
import Testimonials from "@/components/about/testimonials/Testimonials";
import KickOffAConvo from "@/components/ui/kickOffAConvo/KickOffAConvo";
import PageHeadingWithVideo from "@/components/ui/PageHeadingWithVideo";
import RobotDance from "@/components/ui/robotDance/RobotDance";
import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.raredesignlabs.com/about",
  },
};

function page() {
  return (
    <div>
      <PageHeadingWithVideo
        heading="Built Different"
        video="robot-dance.mp4"
        sectionClassName="about-heading mb-20"
      />

      <FoundersOwnersPartners />
      <KickOffAConvo
        textLeft={["Elite Squad", "Zero Fluff"]}
        textRight={["Zero Ego", "Full Power"]}
        video="/videos/robot-moonwalk.mp4"
        videoClassName="object-bottom inset-auto bottom-0 left-0 w-full h-full"
        // nextSectionClassName=""
      />
      <MeetTheOriginals />
      <Testimonials />
      <RobotDance video="/videos/both-hands-waving.mp4" />
      {/* </div> */}
    </div>
  );
}

export default page;
