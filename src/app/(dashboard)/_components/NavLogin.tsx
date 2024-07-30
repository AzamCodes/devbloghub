"use client";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

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

const NavLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  async function getUserDetails() {
    try {
      const res = await axios.get<ApiResponse>("/api/users/me");
      // console.log("API response:", res.data); // Log entire response

      const { message, data: fetchedUser } = res.data;
      // console.log("Message:", message); // Log the message
      // console.log("Fetched User:", fetchedUser); // Log the fetched user

      if (message === "User found" && fetchedUser && fetchedUser._id) {
        setIsLoggedIn(true);
        setUser(fetchedUser);
        // console.log("User found and set:", fetchedUser); // Log the set user
      } else {
        console.warn("User not found or invalid user object");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  }

  useEffect(() => {
    getUserDetails();
  }, []);

  useEffect(() => {
    // console.log("Current user state:", user); // Log current user state
  }, [user]);

  return (
    <div className="flex items-center gap-2 text-xs">
      <ModeToggle />
      <div className="hidden md:flex font-semibold">
        {isLoggedIn && user ? (
          <>
            <Button variant={"outline"} className="mr-3">
              <Link href={`/dashboard/${user._id}`}>Dashboard</Link>
            </Button>
            <Button variant={"outline"} className="mr-3">
              <Link href={`/profile`}>Profile</Link>
            </Button>
            <Button variant={"outline"}>
              <Link href={`/create`}>Create</Link>
            </Button>
          </>
        ) : (
          <Button variant={"outline"}>
            <Link href={"/login"}>Login</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default NavLogin;
