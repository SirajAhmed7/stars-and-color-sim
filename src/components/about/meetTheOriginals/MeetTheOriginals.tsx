import Star from "@/components/ui/Star";
import MtoCardsContainer from "./MtoCardsContainer";
import MtoContent from "./MtoContent";

function MeetTheOriginals() {
  return (
    <section className="meet-the-originals px-7 relative mb-80">
      <MtoContent />

      <Star className="absolute top-[25%] right-[25%] w-16" dataSpeed={1.3} />

      <Star className="absolute top-[40%] left-[5%] w-20" dataSpeed={1.3} />

      <Star className="absolute top-[65%] right-[3%] w-20" dataSpeed={0.8} />

      <MtoCardsContainer />
    </section>
  );
}

export default MeetTheOriginals;
