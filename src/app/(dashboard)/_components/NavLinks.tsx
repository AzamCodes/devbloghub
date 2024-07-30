import React from "react";
import NavItem from "./navitem";

const menuItems = [
  {
    label: "Blog",
    href: "/blog",
  },
  {
    label: "About",
    href: "/about",
  },
];

const NavLinks = () => {
  const routes = menuItems;

  return (
    <div className="hidden  border-2 rounded-3xl px-6 py-3 border-green-400 md:flex">
      {routes.map((route) => (
        <NavItem key={route.href} href={route.href} label={route.label} />
      ))}
    </div>
  );
};

export default NavLinks;
