import Image from "next/image";
import Link from "next/link";
import logo from "./logo-name.svg";

const NavLeft = () => {
  return (
    <Link href="/#" className="logo flex cursor-pointer">
      <Image src={logo} alt="logo" className="h-16" />
    </Link>
  );
};

export default NavLeft;
