import Image from "next/image";
import { Fragment, useRef } from "react";

function PgRow({ colNum }: { colNum: number }) {
  // const [videoExists, setVideoExists] = useState(true);
  const imgRef = useRef<HTMLDivElement>(null);

  const maxVids = 28;

  // useEffect(() => {
  //   async function checkVideo() {
  //     const exists = await fileExists(
  //       `/portfolio-content/videos/${colNum}.mp4`
  //     );
  //     setVideoExists(exists);
  //   }
  //   checkVideo();
  // }, [colNum]);

  return (
    <Fragment>
      <div
        ref={imgRef}
        className="aspect aspect-[4/3] w-[60vw] md:w-[40vw] shrink-0 relative overflow-hidden"
      >
        <Image
          src={`/portfolio-content/images/${colNum}.webp`}
          alt={"portfolio image " + colNum}
          priority
          fill
          className="object-cover absolute inset-0 w-full h-full hover:scale-110 transition-transform duration-700 ease-in-out"
        />
      </div>
      <div className="aspect aspect-[4/3] w-[60vw] md:w-[40vw] shrink-0 relative overflow-hidden">
        <video
          muted
          autoPlay
          loop
          controls={false}
          playsInline
          preload="auto"
          // src="/videos/home-diamond-2.mp4"
          src={`/portfolio-content/videos/${
            colNum > maxVids ? colNum - maxVids : colNum
          }_1.webm`}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 ease-in-out"
        ></video>
      </div>
    </Fragment>
  );
}

export default PgRow;
