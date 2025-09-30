"use client";

function HDSubHeading({ text, text2 }: { text: string; text2: string }) {
  return (
    <div
      className="absolute top-[55%] sm:top-[27%] left-1/2 -translate-y-1/2 -translate-x-1/2 
      w-full overflow-y-hidden"
    >
      <div className="home-diamond-sub-heading-wrapper text-base sm:text-3xl lg:text-5xl font-extralight translate-y-[110%]">
        <p className="text-center home-diamond-sub-heading">{text}</p>
        <p className="absolute top-0 left-0 translate-y-[110%] w-full text-center home-diamond-sub-heading">
          {text2}
        </p>
      </div>
    </div>
  );
}

export default HDSubHeading;
