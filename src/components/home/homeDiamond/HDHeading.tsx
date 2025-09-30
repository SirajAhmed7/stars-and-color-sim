function HDHeading({ text, text2 }: { text: string; text2: string }) {
  const [fw, sw] = text.split(" ");
  const [fw2, sw2] = text2.split(" ");

  return (
    <div
      className="absolute top-[70%] sm:top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 
    w-full flex justify-center items-center"
    >
      <h2
        className="home-diamond-heading w-full h-max text-center text-[20vw] sm:text-[12vw] lg:text-[12vw] min-[2460px]:text-[8vw] condensed font-bold leading-none flex justify-center relative"
        // style={{
        //   clipPath: "polygon(0 10%, 100% 10%, 100% 85%, 0 85%)",
        // }}
      >
        <div className="w-full text-center font-harmond home-diamond-heading-letters home-diamond-heading-letters-1">
          {fw}
          &nbsp;
          <span className="font-harmond font-bold italic">{sw}</span>
        </div>
        {/* <div
          className="w-full absolute top-0 left-1/2 -translate-x-1/2 font-harmond text-center"
          style={{
            wordBreak: "break-word",
          }}
        >
          <span className="hd-heading-normal"></span>&nbsp;
          <span className="hd-heading-italic font-harmond font-bold italic"></span>
        </div> */}
        <div className="w-full absolute top-0 left-1/2 -translate-x-1/2 font-harmond home-diamond-heading-letters home-diamond-heading-letters-2">
          {fw2}
          &nbsp;
          <span className="font-harmond font-bold italic">{sw2}</span>
        </div>
      </h2>
    </div>
  );
}

export default HDHeading;
