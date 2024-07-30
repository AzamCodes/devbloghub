"use client";
import { useEffect, useState } from "react";
import { IoClose, IoMenu } from "react-icons/io5";
import Link from "next/link";
import NavItem from "./navitem";
import { Button } from "@/components/ui/button";
import { FaSignOutAlt } from "react-icons/fa";
import axios from "axios";

interface User {
  _id: string;
  username: string;
  email: string;
  isVerified: boolean;
  isAdmin: boolean;
  img: string;
}

interface ApiResponse {
  message: string;
  data: User;
}

const menuItems = [
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

const Menu = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  const getUserDetails = async () => {
    try {
      const res = await axios.get<ApiResponse>("/api/users/me", {
        withCredentials: true,
      });
      // console.log("API response:", res.data);

      const { message, data: fetchedUser } = res.data;
      // console.log("Message:", message);
      // console.log("Fetched User:", fetchedUser);

      if (message === "User found" && fetchedUser && fetchedUser._id) {
        setIsLoggedIn(true);
        setUser(fetchedUser);
        // console.log("User found and set:", fetchedUser);
      } else {
        console.warn("User not found or invalid user object");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        "/api/users/logout",
        {},
        { withCredentials: true }
      );
      // console.log("Logout response:", res.data);

      if (res.status === 200) {
        setIsLoggedIn(false); // Update state
        window.location.href = "/login"; // Redirect to login page
      } else {
        console.error("Logout failed:", res.data);
      }
    } catch (error) {
      // console.log("Logout error:", error);
    }
  };

  const handleMenuClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    // console.log("isLoggedIn state:", isLoggedIn);
    // console.log("User state:", user);
  }, [isLoggedIn, user]);

  return (
    <>
      {!open ? (
        <IoMenu size={22} onClick={() => setOpen(true)} />
      ) : (
        <IoClose size={22} onClick={handleMenuClose} />
      )}
      {open && (
        <div className="bg-inherit z-50 rounded-xl backdrop-blur-[100px] flex items-center justify-center text-3xl flex-col gap-8 w-full absolute left-0 top-12 h-[calc(100vh-3rem)]">
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
