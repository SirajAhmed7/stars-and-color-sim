import EverythingDesign from "@/components/services/everythingDesign/EverythingDesign";
import EverythingDev from "@/components/services/everythingDev/EverythingDev";
import ScrollGrid from "@/components/services/ScrollGrid/ScrollGrid";
import SgSectionsContainer from "@/components/services/servicesHeading/SgSectionsContainer";
import RobotDance from "@/components/ui/robotDance/RobotDance";
import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.raredesignlabs.com/services",
  },
};

function Page() {
  return (
    <div className="bg-gray-900">
      <ScrollGrid wrapperClassName="services-heading-scroll-grid-wrapper">
        <SgSectionsContainer />
      </ScrollGrid>

      <ScrollGrid
        heading="Any idea, fully shaped"
        xBg="/images/services/design-block-bg.svg"
        hideBottomMount
        services={[
          "Discovery & Strategy",
          "User Research",
          "Brand DNA",
          "UX Foundation",
          "Information Architecture",
          "UI & Visuals",
          "Interaction Design",
          "Design Systems",
          "Motion Design",
          "Prototyping",
          "Usability Testing",
          "Accessibility Testing",
          "Design Handoff",
          "Post-Launch Support",
        ]}
      >
        <EverythingDesign />
      </ScrollGrid>

      <ScrollGrid
        heading="All stacks, shipped."
        xBg="/images/services/dev-num-bg.svg"
        xBgWrapperClassName="w-[75%] h-full scale-x-100"
        xBgClassName="object-cover"
        hideBottomMount
        services={[
          "Tech Architecture",
          "Database Design",
          "API Development",
          "Frontend Engineering",
          "Backend Engineering",
          "CMS Integration",
          "Performance Optimization",
          "QA & Bug Fixing",
          "Security Implementation",
          "Staging & Review",
          "Production Deployment",
          "Ongoing Maintenance",
        ]}
      >
        <EverythingDev />
      </ScrollGrid>

      <RobotDance video="/videos/robot-dance.mp4" />
    </div>
  );
}

export default Page;
