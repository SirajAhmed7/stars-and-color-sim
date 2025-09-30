"use client";

import { useState } from "react";
import Image from "next/image";
import ContactForm from "../contact/contactForm/ContactForm";

function MobileContactForm() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="col-span-2 bg-white text-gray-950 text-lg font-harmond font-bold p-[18px] flex items-center justify-center top-right-corner-cut"
        aria-expanded={isOpen}
        aria-label="Open contact form to book a call"
        type="button"
      >
        Book a call
      </button>

      {isOpen && (
        <div className="fixed w-full h-svh top-0 left-0 z-40">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-50 p-2"
            aria-label="Close contact form"
            type="button"
          >
            <Image
              src="/images/x-close.svg"
              alt="Close"
              width={24}
              height={24}
            />
          </button>
          <ContactForm />
        </div>
      )}
    </>
  );
}

export default MobileContactForm;
