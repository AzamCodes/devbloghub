"use client";
// HomePage.tsx
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useUser } from "@/context/UserContext";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";

const metadata: Metadata = {
  title: "Home Page",
  description: "Blog Application made with Next JS",
};

const HomePage: React.FC = () => {
  const { theme } = useTheme();
  const { isLoggedIn } = useUser(); // Use the context
  const router = useRouter();

  const handleStartYourBlogClick = () => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      router.push("/create");
    }
  };

  const handleStartBloggingClick = () => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      router.push("/create");
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        theme === "dark" ? "bg-[#000000] text-white" : "bg-white text-[#000000]"
      }`}
    >
      {/* Hero Section */}
      <header
        className={`py-12 text-center flex-shrink-0 ${
          theme === "dark"
            ? "bg-[#20B256] text-white"
            : "bg-[#20B256] text-white"
        }`}
      >
        <h1 className="text-4xl md:text-5xl drop-shadow-[4px_4px_var(--tw-shadow-color)] shadow-black font-bold">
          Welcome to Devblog
        </h1>
        <p className="mt-4 text-lg md:text-xl">
          Create, share, and explore amazing blogs!
        </p>
        <button className="group relative h-12 w-48 overflow-hidden rounded-lg mt-8 bg-white text-base md:text-lg shadow">
          <div className="absolute inset-0 w-3 bg-green-400 transition-all duration-[250ms] ease-out group-hover:w-full"></div>
          <span className="relative text-black group-hover:text-white">
            Start Your Blog
          </span>
        </button>
      </header>

      {/* Feature Highlight Section */}
      <section
        className={`py-12 px-4 md:px-12 flex-grow ${
          theme === "dark" ? "bg-[#000000]" : "bg-[#ebebeb]"
        }`}
      >
        <h2 className="text-3xl font-bold drop-shadow-[2px_2px_var(--tw-shadow-color)] shadow-black dark:drop-shadow-[1.5px_2px_var(--tw-shadow-color)] dark:shadow-white text-[#20B256] mb-8 text-center">
          Why Join Us?
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 border-[0.6px] dark:border-green-500 text-center shadow-[0_9px_0_rgb(0,0,0)] hover:shadow-[0_4px_0px_rgb(0,0,0)] dark:shadow-green-500 dark:bg-black dark:text-white text-black bg-white ease-out hover:translate-y-1 transition-all rounded-lg">
            <h3 className="text-xl font-bold text-[#20B256]">
              Discover New Ideas
            </h3>
            <p className="mt-2">
              Explore a diverse range of blogs on topics you love. Stay updated
              with the latest trends and insights from our vibrant community.
            </p>
          </div>
          <div className="p-6 border-[0.6px] dark:border-green-500 text-center shadow-[0_9px_0_rgb(0,0,0)] hover:shadow-[0_4px_0px_rgb(0,0,0)] dark:shadow-green-500 dark:bg-black dark:text-white text-black bg-white ease-out hover:translate-y-1 transition-all rounded-lg">
            <h3 className="text-xl font-bold text-[#20B256]">
              Share Your Voice
            </h3>
            <p className="mt-2">
              Start your own blog and share your thoughts with the world. Easy
              to use and customize, your blog is just a few clicks away.
            </p>
          </div>
          <div className="p-6 border-[0.6px] dark:border-green-500 text-center shadow-[0_9px_0_rgb(0,0,0)] hover:shadow-[0_4px_0px_rgb(0,0,0)] dark:shadow-green-500 dark:bg-black dark:text-white text-black bg-white ease-out hover:translate-y-1 transition-all rounded-lg">
            <h3 className="text-xl font-bold text-[#20B256]">
              Join a Community
            </h3>
            <p className="mt-2">
              Connect with like-minded individuals, get feedback, and grow your
              network. Our community is here to support and inspire you.
            </p>
          </div>
        </div>
      </section>

      {/* Call-to-Action Banners */}
      <section
        className={`py-12 px-4 md:px-12 text-center ${
          theme === "dark"
            ? "bg-[#000000] text-white"
            : "bg-[#35ee79] text-white"
        }`}
      >
        <div className="flex flex-col items-center space-y-6">
          <div className="bg-[#ffffff] dark:bg-[#000000] p-6 dark:shadow-md dark:border ease-out hover:translate-y-1 transition-all dark:shadow-green-600 rounded-lg shadow-lg shadow-black text-center  border-[#20B256] dark:border-[#20B256]">
            <h3 className="text-2xl font-bold  drop-shadow-[2px_2px_var(--tw-shadow-color)] shadow-green-500    dark:drop-shadow-[2px_2px_var(--tw-shadow-color)] dark:shadow-green-500 text-[#111827] dark:text-white">
              Explore Our Blog
            </h3>
            <p className="mt-2 text-[#111827] dark:text-white">
              Dive into a world of engaging content and latest updates. Find
              what interests you and stay informed.
            </p>
            <Button
              className="mt-4 text-bold inline-block  transition-colors"
              variant={"default"}
            >
              <Link href="/blog">View All Blogs</Link>
            </Button>
          </div>
          <div className="bg-green-500 border border-[#20B256] dark:border-[#20B256] py-6 px-3 rounded-lg shadow-xl text-center">
            <h3 className="text-2xl font-bold drop-shadow-[2px_2px_var(--tw-shadow-color)] shadow-black dark:drop-shadow-[2px_2px_var(--tw-shadow-color)] dark:shadow-black text-[#ffffff] dark:text-white ">
              Create Your Own Blog
            </h3>
            <p className="mt-2">
              Have something to share? Start your own blog with just a few
              clicks and connect with a global audience.
            </p>
            <Button
              onClick={handleStartBloggingClick}
              className="mt-3 rounded-lg text-base transition-all ease-linear"
              variant={"custom"}
            >
              Start Blogging
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
