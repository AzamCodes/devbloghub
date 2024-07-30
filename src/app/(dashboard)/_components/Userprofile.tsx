import Image from "next/image";
import React from "react";

const fetchUser = async (username: string) => {
  try {
    const res = await fetch(`${process.env.API_URL}/api/users/${username}`, {
      method: "GET",
      cache: "no-cache", // Ensure fresh data on each request
    });
    if (!res.ok) {
      throw new Error("Failed to fetch user");
    }
    const data = await res.json();
    // console.log("Fetched user data:", data);
    return data;
  } catch (error: any) {
    console.error("Error fetching user:", error.message);
    return null;
  }
};

const Userprofile = async ({ username }: { username: string }) => {
  const user = await fetchUser(username);
  // console.log(user);

  if (!user || !user.data) {
    return <p>User not found</p>;
  }

  return (
    <>
      <div className="flex items-center gap-2 md:gap-[0.65rem]">
        <div className="h-10 w-10 relative">
          <Image
            src={user.data.img || "/nature.jpg"}
            fill
            objectFit="cover"
            objectPosition="center"
            alt="user profile"
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-xs md:text-sm text-gray-400">Author</span>
          <span className="text-sm md:text-base">{user.data.username}</span>
        </div>
      </div>
    </>
  );
};

export default Userprofile;
