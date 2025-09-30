import { ContactData } from "./ContactFormSlides";

function YourEmail({
  contactData,
  setContactData,
  handleChange,
}: {
  contactData: ContactData;
  setContactData: React.Dispatch<React.SetStateAction<ContactData>>;
  handleChange: (
    newContactData: ContactData,
    curSectionNum: number,
    toSectionNum: number
  ) => void;
}) {
  return (
    <div className="about-project w-screen h-full flex justify-center items-center">
      <div className="space-y-16 text-center -translate-y-[25%]">
        <h2 className="font-harmond condensed font-semibold text-9xl">
          Your email?
        </h2>

        <div className="space-y-6">
          <input
            type="email"
            placeholder="johndoe@gmail.com"
            className="w-[50vw] h-full bg-gray-900 px-10 py-6 text-3xl font-extralight text-center placeholder:text-gray-600"
            value={contactData.email}
            onChange={(e) => {
              setContactData({
                ...contactData,
                email: e.target.value,
              });
            }}
          />

          <p className="text-gray-50 text-xl font-extralight">
            press enter to submit
          </p>
        </div>
      </div>
    </div>
  );
}

export default YourEmail;
