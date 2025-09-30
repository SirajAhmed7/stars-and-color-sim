import FAQ from "@/components/frequentlyAskedQuestions/faqSection/FAQ";
import PageHeadingWithVideo from "@/components/ui/PageHeadingWithVideo";
import RobotDance from "@/components/ui/robotDance/RobotDance";
import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.raredesignlabs.com/f-a-q",
  },
};

function Page() {
  return (
    <div>
      <PageHeadingWithVideo
        video="thinking-rob-2.mp4"
        heading="FAQs"
        sectionClassName="faq-heading"
      />
      <FAQ />
      <RobotDance video="/videos/robot-dance.mp4" />
    </div>
  );
}

export default Page;
