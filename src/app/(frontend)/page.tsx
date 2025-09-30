import Hero from "@/components/home/Hero/Hero";
import HomeDiamond from "@/components/home/homeDiamond/HomeDiamond";
import NavGrid from "@/components/home/NavGrid/NavGrid";
import OutrunOrdinary from "@/components/home/outrunOrdinary/OutrunOrdinary";
import SpeedCreativityPrecision from "@/components/home/speedCreativityPrecision/SpeedCreativityPrecision";
import TheRareAdvantage from "@/components/home/theRareAdvantage/TheRareAdvantage";
import KickOffAConvo from "@/components/ui/kickOffAConvo/KickOffAConvo";
import RobotDance from "@/components/ui/robotDance/RobotDance";

const Home = () => {
  return (
    <div className="text-white">
      <Hero />

      <HomeDiamond />

      <KickOffAConvo
        textLeft={[
          "We only take a few",
          "Each one gets our focus",
          "You're not a ticket in queue",
        ]}
        textRight={[
          "Real talk, no sales fluff",
          "Human-first, no scripts",
          "Hit us up anytime",
        ]}
        video="/videos/one-hand-waving.mp4"
        videoClassName="scale-[2.8] lg:scale-150 object-cover lg:object-top translate-y-[80%] lg:translate-y-[20%]"
        nextSectionClassName=".outrun-ordinary"
        instantSnap
      />

      <OutrunOrdinary />

      <TheRareAdvantage />

      <SpeedCreativityPrecision />

      <NavGrid />

      <RobotDance video="/videos/robot-dance.mp4" />
    </div>
  );
};

export default Home;
