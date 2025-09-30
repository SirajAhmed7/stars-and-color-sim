import FrameBorder from "./FrameBorder";
import FrameCta from "./FrameCta";
import FrameLogo from "./FrameLogo";
import FrameMenu from "./FrameMenu";
import FrameNav from "./FrameNav";
import FrameScrollIndicator from "./FrameScrollIndicator";
import FrameStroke from "./FrameStroke";
import FrameText from "./FrameText";

function Frame() {
  const bgColor = "bg-gray-980";
  return (
    <>
      <FrameStroke bgColor="bg-gray-800" />
      <FrameBorder bgColor={bgColor} />
      <FrameLogo bgColor={bgColor} />
      <FrameNav bgColor={bgColor} />
      <FrameText bgColor={bgColor} />
      <FrameCta bgColor={bgColor} />
      <FrameScrollIndicator bgColor={bgColor} />
      <FrameMenu bgColor={bgColor} />
    </>
  );
}

export default Frame;
