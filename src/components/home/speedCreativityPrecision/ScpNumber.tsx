function ScpNumber() {
  return (
    <div className="scp-number-wrapper absolute -bottom-24 sm:-bottom-24 translate-y-full w-full flex justify-center items-center gap-6 overflow-hidden">
      <div className="relative flex items-center w-1/4">
        <div className="scp-number-line w-full h-1p bg-gradient-to-l from-gray-500 to-gray-500/0 origin-right scale-x-0"></div>

        <svg
          width="19"
          height="19"
          viewBox="0 0 19 19"
          fill="none"
          // className="scp-corner-line-star absolute right-0 bottom-0 translate-x-1/2 translate-y-1/2 opacity-0"
          className="scp-number-line-star opacity-0 -translate-x-1/2"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.07542 -0.000244141C9.07542 -0.000244141 10.2622 5.37519 11.5188 6.63178C12.7754 7.88837 18.1508 9.07517 18.1508 9.07517C18.1508 9.07517 12.7754 10.2619 11.5188 11.5185C10.2622 12.7751 9.07542 18.1506 9.07542 18.1506C9.07542 18.1506 7.88859 12.7751 6.632 11.5185C5.37541 10.2619 0 9.07517 0 9.07517C0 9.07517 5.37541 7.88837 6.632 6.63178C7.88859 5.37519 9.07542 -0.000244141 9.07542 -0.000244141Z"
            fill="#70707B"
          />
        </svg>
      </div>

      <div className="scp-number text-xl sm:text-3xl xl:text-6xl font-extralight text-gray-500 relative overflow-y-clip">
        <span className="scp-number-text inline-block translate-y-[105%]">
          0
        </span>
        <span className="opacity-0 select-none pointer-events-none">2</span>
        <div className="scp-nums translate-y-[33.3%] absolute top-0 right-0 flex flex-col items-center">
          <div>1</div>
          <div>2</div>
          <div>3</div>
        </div>
      </div>

      <div className="relative flex items-center w-1/4">
        <svg
          width="19"
          height="19"
          viewBox="0 0 19 19"
          fill="none"
          // className="scp-corner-line-star absolute right-0 bottom-0 translate-x-1/2 translate-y-1/2 opacity-0"
          className="scp-number-line-star opacity-0 translate-x-1/2"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.07542 -0.000244141C9.07542 -0.000244141 10.2622 5.37519 11.5188 6.63178C12.7754 7.88837 18.1508 9.07517 18.1508 9.07517C18.1508 9.07517 12.7754 10.2619 11.5188 11.5185C10.2622 12.7751 9.07542 18.1506 9.07542 18.1506C9.07542 18.1506 7.88859 12.7751 6.632 11.5185C5.37541 10.2619 0 9.07517 0 9.07517C0 9.07517 5.37541 7.88837 6.632 6.63178C7.88859 5.37519 9.07542 -0.000244141 9.07542 -0.000244141Z"
            fill="#70707B"
          />
        </svg>
        <div className="scp-number-line w-full h-1p bg-gradient-to-r from-gray-500 to-gray-500/0 origin-left scale-x-0"></div>
      </div>
    </div>
  );
}

export default ScpNumber;
