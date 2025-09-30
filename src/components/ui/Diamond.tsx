import Image from "next/image";

function Diamond({ size }: { size: number }) {
  return (
    <Image
      src={"/images/corner-diamond.svg"}
      alt="Diamond"
      height={size}
      width={size}
    />
  );
}

export default Diamond;
