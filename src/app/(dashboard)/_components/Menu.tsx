"use client";
import React, { useEffect, useState } from "react";
import { IoClose, IoMenu } from "react-icons/io5";
import Link from "next/link";
import NavItem from "./navitem";
import { Button } from "@/components/ui/button";
import { FaSignOutAlt } from "react-icons/fa";
import { useUser } from "@/context/UserContext";
import axios from "axios";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

const menuItems = [
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

const Menu = () => {
  const { user, isLoggedIn, setUser, setIsLoggedIn } = useUser();
  const [open, setOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const { theme } = useTheme();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await axios.post("/api/users/logout");
      if (response.data.success) {
        setUser(null); // Clear user context
        setIsLoggedIn(false); // Set logged-in status to false
        setOpen(false); // Close the menu
        router.push("/login"); // Redirect to login page
      } else {
        console.error("Logout failed");
      }
    } catch (error: any) {
      console.error("Error logging out:", error.message);
    }
  };

  const handleMenuClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 10); // Adjust the value as per your requirement
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {!open ? (
        <IoMenu size={22} onClick={() => setOpen(true)} />
      ) : (
        <IoClose size={22} onClick={handleMenuClose} />
      )}
      {open && (
        <div
          className={`bg-inherit/75 z-50 rounded-xl backdrop-blur-[450px] md:backdrop-blur-[100px] flex items-center justify-center text-3xl flex-col gap-8 w-full absolute left-0 top-12 h-[calc(100vh-3rem)] ${
            isSticky ? "shadow-md transition-all duration-300 ease-in-out" : ""
          } ${
            theme === "dark"
              ? "bg-black bg-opacity-50 text-white"
              : "bg-white bg-opacity-50 text-black"
          }`}
        >
          {menuItems.map((route) => (
            <NavItem
              key={route.href}
              href={route.href}
              label={route.label}
              onClick={handleMenuClose}
            />
          ))}
          {isLoggedIn && user ? (
            <div className="flex items-center justify-center flex-col gap-5">
              <Button variant={"default"} onClick={handleMenuClose}>
                <Link href={`/dashboard/${user._id}`}>Dashboard</Link>
              </Button>
              <Button variant={"outline"} onClick={handleMenuClose}>
                <Link href={`/create`}>Create</Link>
              </Button>
              <Button variant={"outline"} onClick={handleMenuClose}>
                <Link href={`/profile`}>Profile</Link>
              </Button>
              <Button variant={"custom"} onClick={handleLogout}>
                <FaSignOutAlt className="inline-block mr-2" /> Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center flex-col gap-5">
              <Button variant={"default"} onClick={handleMenuClose}>
                <Link href={"/signup"}>Sign Up</Link>
              </Button>
              <Button variant={"outline"} onClick={handleMenuClose}>
                <Link href={"/login"}>Login</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Menu;
