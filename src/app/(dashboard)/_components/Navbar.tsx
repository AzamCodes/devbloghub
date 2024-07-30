import Link from "next/link";
import React from "react";
import Menu from "./Menu";
import NavLogin from "./NavLogin";
import NavLinks from "./NavLinks";

const NavbarComponent = () => {
  return (
    <>
      <div className="flex justify-between w-full  border-green-500 border-b-[1px] h-12 md:h-24  p-4 md:p-8 items-center">
        <div className="flex cursor-pointer md:hidden">
          <Menu />
        </div>
        <Link href={"/"}>
          <div className="uppercase font-bold">devblog</div>
        </Link>
        <NavLinks />
        <NavLogin />
      </div>
    </>
  );
};
export default NavbarComponent;
