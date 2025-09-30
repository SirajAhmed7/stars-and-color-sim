"use client";

import { cn } from "@/utils/utils";
import { useState } from "react";

type ContactData = {
  service: string;
  aboutProject: string;
  email: string;
};

function ContactForm() {
  const [contactData, setContactData] = useState<ContactData>({
    service: "",
    aboutProject: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const services = ["Design", "Development", "Design + Dev", "Ask a Quote"];

  const projectCategories = [
    "FinTech",
    "DeFi",
    "Web3",
    "Crypto",
    "EdTech",
    "Ecommerce",
    "HealthTech",
    "Others",
  ];

  const formNotFilled =
    !contactData.service || !contactData.aboutProject || !contactData.email;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (formNotFilled) {
      setError("Please fill in all fields.");
      return;
    }

    window.open(
      "https://calendly.com/raredesignlabs/30min",
      "_blank",
      "noopener,noreferrer"
    );

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/contact-submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      if (response.ok) {
        setSubmitted(true);
        setContactData({
          service: "",
          aboutProject: "",
          email: "",
        });
      } else {
        throw new Error("Failed to submit form");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="contact-form min-h-svh bg-background relative max-md:pb-10">
      <div className="hidden md:block absolute w-full h-full top-0 left-[20%] pointer-events-none z-0">
        <video
          muted
          autoPlay
          loop
          controls={false}
          // src="/videos/home-diamond-2.mp4"
          className="w-full h-full object-cover"
          playsInline
        >
          <source src={`/videos/lets-talk-rob.mp4`} type={"video/mp4"} />
          {/* <source src="/videos/home-diamond-2.mp4" type="video/mp4" /> */}
        </video>
      </div>

      <div
        className={cn(
          "min-h-screen flex flex-col justify-start md:justify-center items-stretch sm:items-start w-full md:w-3/4 lg:w-1/2 relative px-8 md:pl-12 lg:pl-24 pt-16 md:pt-6",
          submitted ? "justify-center" : ""
        )}
      >
        {submitted ? (
          <>
            <div className="space-y-3">
              <h3 className="text-6xl font-harmond font-semibold condensed text-center md:text-left">
                Thank you for your message!
              </h3>
              <p className="text-2xl text-gray-300 font-extralight text-center md:text-left">
                We&apos;ll get back to you shortly.
              </p>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-7xl md:text-8xl 3xl:text-9xl font-harmond font-semibold condensed text-center sm:text-left mb-6 3xl:mb-7">
              Let&apos;s Talk
            </h1>
            <form
              className={cn(
                "w-full font-extralight space-y-6 3xl:space-y-8 transition-opacity duration-300",
                isSubmitting ? "opacity-40" : ""
              )}
              onSubmit={handleSubmit}
            >
              <div className="space-y-2 3xl:space-y-3">
                <label>Select a service</label>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1 md:gap-4 w-full">
                  {services.map((service: string, i: number) => (
                    <button
                      key={service + i}
                      className={cn(
                        "select-a-service-btn h-full text-base 3xl:text-xl flex items-center justify-center gap-4 px-1 sm:px-4 py-3 3xl:py-4 transition-colors duration-300 last:col-span-3 sm:last:col-span-1",
                        service === contactData.service
                          ? "bg-white text-gray-900 font-normal"
                          : "text-white border border-gray-800"
                      )}
                      type="button"
                      onClick={() => {
                        setContactData((prev) => ({ ...prev, service }));
                      }}
                    >
                      <span className="">{service}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 3xl:space-y-3">
                <label>About your project</label>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1 md:gap-4 w-full">
                  {projectCategories.map((category: string, i: number) => (
                    <button
                      key={category + i}
                      className={cn(
                        "about-project-btn h-full text-base 3xl:text-xl flex items-center justify-center gap-4 px-1 sm:px-4 py-3 3xl:py-4 transition-colors duration-300 last:col-span-3 sm:last:col-span-1",
                        category === contactData.aboutProject
                          ? "bg-white text-gray-900 font-normal"
                          : "text-white border border-gray-800",
                        category === "Web3" ? "hidden sm:block" : ""
                      )}
                      type="button"
                      onClick={() => {
                        setContactData((prev) => ({
                          ...prev,
                          aboutProject: category,
                        }));
                      }}
                    >
                      <span className="">{category}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 3xl:space-y-3">
                <label htmlFor="email">Your Email</label>

                <input
                  id="email"
                  type="email"
                  placeholder="eg. johndoe@gmail.com"
                  className="w-full border border-gray-800 bg-transparent px-5 3xl:px-7 py-3 3xl:py-5 text-base 3xl:text-xl font-extralight placeholder:text-gray-600"
                  value={contactData.email}
                  onChange={(e) => {
                    setContactData({
                      ...contactData,
                      email: e.target.value,
                    });
                  }}
                />
              </div>

              {error && (
                <div className="px-6 py-4 border border-red-400">
                  <p className="text-red-100">{error}</p>
                </div>
              )}

              <button
                className={`max-md:w-full 
              font-harmond font-semibold condensed text-2xl px-14 py-5 !mt-8 3xl:!mt-10 transition-colors duration-300 ${
                formNotFilled
                  ? "bg-gray-800 text-gray-700"
                  : "bg-white text-gray-900"
              }
            `}
                disabled={isSubmitting || formNotFilled}
              >
                {isSubmitting ? "Submitting..." : "Book a call"}
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}

export default ContactForm;
