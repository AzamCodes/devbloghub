import Image from "next/image";
import React, { useEffect, useState } from "react";

const userCache: { [key: string]: any } = {}; // Simple cache object

const fetchUser = async (userId: string) => {
  if (userCache[userId]) {
    return userCache[userId]; // Return cached data if available
  }

  try {
    const res = await fetch(`${process.env.API_URL}/api/users/user/${userId}`, {
      method: "GET",
      cache: "no-cache", // Ensure fresh data on each request
    });
    if (!res.ok) {
      throw new Error("Failed to fetch user");
    }
    const data = await res.json();
    userCache[userId] = data; // Store fetched data in cache
    // console.log("Fetched user data:", data);
    return data;
  } catch (error: any) {
    console.error("Error fetching user:", error.message);
    return null;
  }
};

const PostUser = React.memo(({ userId }: { userId: string }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const fetchedUser = await fetchUser(userId);
      setUser(fetchedUser);
      setLoading(false);
    };

    getUser();
  }, [userId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user || !user.data) {
    return <p>User not found</p>;
  }

  return (
    <div className="flex items-center justify-start w-[90%]">
      <div className="flex items-center gap-2 md:gap-[0.65rem] ">
        <div className="h-10 w-10 relative">
          <Image
            src={user.data.img}
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
    </div>
  );
});

export default PostUser;
