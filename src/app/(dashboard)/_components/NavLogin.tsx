"use client";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { useUser } from "@/context/UserContext";

const NavLogin = () => {
  const { user, isLoggedIn } = useUser(); // No need to call fetchUserDetails here

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
