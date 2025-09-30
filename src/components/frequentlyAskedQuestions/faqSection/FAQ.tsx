import FaqItem from "./FaqItem";

function FAQ() {
  const faqs = [
    {
      question: "What exactly is Rare?",
      answer: [
        "RARE is not an agency. Not a marketplace.",
        "We're a tight crew of original minds—designers, developers, and product thinkers—plugging into your team to ship exceptional digital work at speed.",
        "We move like co-founders. We care like owners. We build like it's ours.",
      ],
    },
    {
      question: "How does the subscription work?",
      answer: [
        "You subscribe. We embed.",
        "No scope stress, no hourly rates. Just a flat, fair price for unlimited requests—one at a time, in a streamlined flow.",
        "Think: creative ops meets Navy SEALs.",
      ],
    },
    {
      question: "Who’s this for?",
      answer: [
        "→ Startups that move fast.",
        "→ Founders tired of mid.",
        "→ Product teams who need elite design + dev on tap.",
        "If you obsess over taste, velocity, and execution—we’re your people.",
      ],
    },
    {
      question: "How fast is “fast”?",
      answer: [
        "First draft in 24 hours. Sometimes faster.",
        "We’re not fast because we rush.",
        "We’re fast because we’re built different.",
      ],
    },
    {
      question: "What can I request?",
      answer: [
        "Design, dev, or both.",
        "From landing pages to full product UX, app UI to pitch decks, brand kits to interactive prototypes—if it lives in pixels, we craft it.",
        "Need custom dev? We ship React, Next.js, Tailwind, Framer, and spicy micro-interactions that feel alive.",
      ],
    },
    {
      question: "What tools do you use?",
      answer: [
        "We breathe Figma. We write code. We speak Slack.",
        "We’ll fit into your stack—without breaking your flow.",
      ],
    },
    {
      question: "Is there a waitlist?",
      answer: [
        "Yes.",
        "We’re boutique by design.",
        "We only work with a handful of teams at a time to keep quality untouchable.",
        "Want in? [Join the Waitlist] — we’ll reach out if you’re the right fit.",
      ],
    },
    {
      question: "Can I cancel anytime?",
      answer: [
        "Absolutely. No contracts. No strings.",
        "RARE is high-trust, low-friction. Stay because you love the output, not because you're locked in.",
      ],
    },
    {
      question: "What if I need a break?",
      answer: [
        "Pause anytime. Restart when you’re ready.",
        "We bill in clean, flexible monthly cycles. Creative momentum without commitment anxiety.",
      ],
    },
    {
      question: "Why RARE?",
      answer: [
        "Because average is everywhere.",
        "We built RARE for the founders and teams who expect more—and aren’t afraid to say it.",
        "This isn’t off-the-shelf.",
        "This is original thinking, applied with precision.",
      ],
    },
  ];

  return (
    <section className="px-[var(--frame-size)] pt-0 md:p-8 lg:p-20">
      <div className="w-full md:space-y-4">
        {faqs.map((faq, i) => (
          <FaqItem
            question={faq.question}
            answer={faq.answer}
            open={i === 0}
            key={faq.question}
          />
        ))}
      </div>
    </section>
  );
}

export default FAQ;
