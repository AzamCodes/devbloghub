"use client";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation"; // Assuming you need it
import { useRouter } from "next/navigation"; // Next.js 13+
import React from "react";

interface SideBarProps {
  label: string;
  href: string;
  onClick?: () => void;
}

const NavItem = ({ label, href, onClick }: SideBarProps) => {
  const router = useRouter();
  const pathname = usePathname(); // Assuming you're using it

  const isActive = pathname
    ? (pathname === "/" && href === "/") ||
      pathname === href ||
      (pathname && pathname.startsWith(`${href}/`))
    : false; // Fallback for initial render

  const handleClick = () => {
    if (router) {
      // Check if router exists before using it
      try {
        router.push(href);
        if (onClick) onClick();
      } catch (error) {
        console.error(error); // Handle errors gracefully
      }
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          "flex items-center text-inherit",
          isActive && "text-green-400"
        )}
      >
        <span className=" px-3 ">{label}</span>
      </button>
    </div>
  );
};

export default NavItem;
