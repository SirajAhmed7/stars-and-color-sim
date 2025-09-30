import ContactForm from "@/components/contact/contactForm/ContactForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.raredesignlabs.com/contact",
  },
};

function Page() {
  return (
    <div>
      <ContactForm />
    </div>
  );
}

export default Page;
