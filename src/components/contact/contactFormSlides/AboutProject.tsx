import { cn } from "@/utils/utils";
import { ContactData } from "./ContactFormSlides";

function AboutProject({
  contactData,
  handleChange,
}: {
  contactData: ContactData;
  handleChange: (
    newContactData: ContactData,
    curSectionNum: number,
    toSectionNum: number
  ) => void;
}) {
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

  return (
    <div className="about-project w-screen h-full flex justify-center items-center">
      <div className="space-y-20 text-center -translate-y-[15%]">
        <h2 className="font-harmond condensed font-semibold text-9xl">
          About your project?
        </h2>

        <div className="grid grid-cols-4 gap-12">
          {projectCategories.map((category: string, i: number) => (
            <button
              key={category + i}
              className={cn(
                "h-full min-w-60 text-3xl font-extralight flex items-center justify-center gap-4 px-10 py-6 transition-colors duration-300",
                category === contactData.aboutProject
                  ? "bg-white text-gray-900 font-normal"
                  : "bg-gray-900"
              )}
              onClick={() => {
                handleChange({ ...contactData, aboutProject: category }, 2, 3);
              }}
            >
              <span className="">{category}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AboutProject;
