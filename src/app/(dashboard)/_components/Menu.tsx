"use client";
import React, { useState } from "react";
import { IoClose, IoMenu } from "react-icons/io5";
import Link from "next/link";
import NavItem from "./navitem";
import { Button } from "@/components/ui/button";
import { FaSignOutAlt } from "react-icons/fa";
import { useUser } from "@/context/UserContext";
import axios from "axios";

const menuItems = [
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

const Menu = () => {
  const { user, isLoggedIn, fetchUserDetails } = useUser();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.get("/api/users/logout");
      await fetchUserDetails(); // Refresh user details after logout
      window.location.href = "/login"; // Redirect to login page
    } catch (error: any) {
      console.error("Error logging out:", error.message);
    }
  };

  const handleMenuClose = () => {
    setOpen(false);
  };

  return (
    <>
      {!open ? (
        <IoMenu size={22} onClick={() => setOpen(true)} />
      ) : (
        <IoClose size={22} onClick={handleMenuClose} />
      )}
      {open && (
        <div className="bg-inherit/75 z-50 rounded-xl backdrop-blur-[450px] md:backdrop-blur-[100px] flex items-center justify-center text-3xl flex-col gap-8 w-full absolute left-0 top-12 h-[calc(100vh-3rem)]">
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
            <Button variant={"outline"} onClick={handleMenuClose}>
              <Link href={"/login"}>Login</Link>
            </Button>
          )}
        </div>
      )}
    </>
  );
};

export default Menu;
