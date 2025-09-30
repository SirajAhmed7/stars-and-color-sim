import SubscriptionCards from "@/components/subscription/subscriptionCards/SubscriptionCards";
import SubscriptionDescription from "@/components/subscription/SubscriptionDescription/SubscriptionDescription";
import PageHeadingWithVideo from "@/components/ui/PageHeadingWithVideo";
import RobotDance from "@/components/ui/robotDance/RobotDance";
import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.raredesignlabs.com/subscription",
  },
};

function Page() {
  return (
    <div>
      {/* <SubscriptionHeading /> */}
      <PageHeadingWithVideo
        heading="Subscription"
        video="subscription-heading.mp4"
        sectionClassName="subscription-heading"
      />

      <SubscriptionCards />

      <SubscriptionDescription />

      <RobotDance video="/videos/robot-dance.mp4" />
    </div>
  );
}

export default Page;
