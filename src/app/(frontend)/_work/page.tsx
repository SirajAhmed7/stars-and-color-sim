import ComingSoon from "@/components/ui/ComingSoon";
import RobotDance from "@/components/ui/robotDance/RobotDance";

function Page() {
  return (
    <div>
      <ComingSoon />
      <RobotDance video="/videos/robot-dance.mp4" />
    </div>
  );
}

export default Page;
