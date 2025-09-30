import PortfolioGallery from "@/components/portfolio/portfolioGallery/PortfolioGallery";
import PageHeadingWithVideo from "@/components/ui/PageHeadingWithVideo";
import RobotDance from "@/components/ui/robotDance/RobotDance";
import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.raredesignlabs.com/portfolio",
  },
};

function Page() {
  return (
    <div>
      <PageHeadingWithVideo
        heading="Portfolio"
        video="subscription-heading.mp4"
        sectionClassName="portfolio-heading"
      />

      <PortfolioGallery />

      <RobotDance video="/videos/robot-dance.mp4" />
    </div>
  );
}

export default Page;
