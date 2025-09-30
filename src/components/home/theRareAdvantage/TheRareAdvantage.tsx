import DiamondCorners from "@/components/ui/DiamondCorners";
import Star from "@/components/ui/Star";
import TRACardsContainer from "./TRACardsContainer";
import TRAContent from "./TRAContent";

function TheRareAdvantage() {
  return (
    <section className="the-rare-advantage w-full min-h-screen relative snap-section">
      <div className="absolute inset-0 w-full h-full">
        <div className="tra-sticky top-0 w-full h-screen">
          <DiamondCorners />
        </div>
      </div>
      <TRAContent />

      <Star className="top-[27%] right-[31%] w-20" dataSpeed={1.3} />

      <Star
        // variant="outline"
        className="top-[33%] left-[20%] w-40"
        dataSpeed={1.15}
      />

      <Star className="top-[53%] right-[4%] w-20" dataSpeed={1.3} />

      <Star
        // variant="outline"
        className="top-[73%] left-[2%] w-32"
        dataSpeed={0.85}
      />

      <TRACardsContainer />
    </section>
  );
}

export default TheRareAdvantage;
