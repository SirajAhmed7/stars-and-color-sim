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
      answer: [],
    },
    {
      question: "Who’s this for?",
      answer: [],
    },
    {
      question: "How fast is “fast”?",
      answer: [],
    },
    {
      question: "What can I request?",
      answer: [],
    },
    {
      question: "What tools do you use?",
      answer: [],
    },
    {
      question: "Is there a waitlist?",
      answer: [],
    },
    {
      question: "Can I cancel anytime?",
      answer: [],
    },
    {
      question: "What if I need a break?",
      answer: [],
    },
    {
      question: "Why RARE?",
      answer: [],
    },
  ];
  return (
    <section className="p-20">
      <div className="w-full space-y-4">
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
