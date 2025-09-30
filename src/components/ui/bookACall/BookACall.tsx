import BookACallLInk from "./BookACallLInk";
import BookACallStrip from "./BookACallStrip";

function BookACall() {
  return (
    <section className="book-a-call w-full relative hidden md:flex flex-col gap-5 bg-background overflow-hidden snap-section">
      <BookACallStrip />
      <BookACallLInk />
      <BookACallStrip />
    </section>
  );
}

export default BookACall;
