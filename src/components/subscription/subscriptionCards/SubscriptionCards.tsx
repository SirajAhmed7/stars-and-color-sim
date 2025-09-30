import Star from "@/components/ui/Star";
import ScCardsContainer from "./ScCardsContainer";
import ScContent from "./ScContent";

function SubscriptionCards() {
  return (
    <section className="subscription-cards w-full min-h-screen px-7 relative mb-48 lg:mb-[360px]">
      <ScContent />

      <Star className="absolute top-[33%] right-[27%] w-20" dataSpeed={1.3} />

      <Star className="absolute top-[43%] left-[6%] w-16" dataSpeed={1.2} />

      <Star className="absolute top-[55%] right-[6%] w-14" dataSpeed={1} />

      <Star className="absolute top-[80%] left-[4%] w-16" dataSpeed={1.3} />

      <Star className="absolute top-[100%] right-[3%] w-16" dataSpeed={0.8} />

      <ScCardsContainer />
    </section>
  );
}

export default SubscriptionCards;
