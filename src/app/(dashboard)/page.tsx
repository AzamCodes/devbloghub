// pages/index.tsx
"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useUser } from "@/context/UserContext";
import { Metadata } from "next";

interface HomePageProps {
  // Remove recentPosts and popularPosts as we are not using them
}

const metadata: Metadata = {
  title: "Home Page",
  description: "Blog Application made with Next JS",
};

const HomePage: React.FC<HomePageProps> = () => {
  const { theme } = useTheme();
  const { isLoggedIn } = useUser(); // Use the context
  const router = useRouter();

  const handleStartYourBlogClick = () => {
    // Redirect to /login if not authenticated
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      router.push("/create");
    }
  };

  const handleStartBloggingClick = () => {
    // Redirect to /login if not authenticated
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      router.push("/create");
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Hero Section */}
      <header className="bg-black text-green-400 py-12 text-center flex-shrink-0">
        <h1 className="text-4xl md:text-5xl font-bold">Welcome to Devblog</h1>
        <p className="mt-4 text-lg md:text-xl">
          Create, share, and explore amazing blogs!
        </p>
        <button
          onClick={handleStartYourBlogClick}
          className="mt-8 inline-block bg-green-400 text-black py-2 px-6 rounded-full text-lg md:text-xl"
        >
          Start Your Blog
        </button>
      </header>

      {/* Feature Highlight Section */}
      <section className="py-12 px-4 md:px-12 bg-gray-800 flex-grow">
        <h2 className="text-3xl font-bold text-green-400 mb-8 text-center">
          Why Join Us?
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-black/15 p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-bold text-green-400">
              Discover New Ideas
            </h3>
            <p className="text-gray-300 mt-2">
              Explore a diverse range of blogs on topics you love. Stay updated
              with the latest trends and insights from our vibrant community.
            </p>
          </div>
          <div className="bg-black/15 p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-bold text-green-400">
              Share Your Voice
            </h3>
            <p className="text-gray-300 mt-2">
              Start your own blog and share your thoughts with the world. Easy
              to use and customize, your blog is just a few clicks away.
            </p>
          </div>
          <div className="bg-black/15 p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-bold text-green-400">
              Join a Community
            </h3>
            <p className="text-gray-300 mt-2">
              Connect with like-minded individuals, get feedback, and grow your
              network. Our community is here to support and inspire you.
            </p>
          </div>
        </div>
      </section>

      {/* Call-to-Action Banners */}
      <section className="py-12 px-4 md:px-12 bg-black text-green-400 text-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="bg-green-600 p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-2xl font-bold text-black">Explore Our Blog</h3>
            <p className="mt-2 text-black">
              Dive into a world of engaging content and latest updates. Find
              what interests you and stay informed.
            </p>
            <Link
              href="/blog"
              className="mt-4 inline-block bg-black text-green-400 py-2 px-4 rounded-full text-lg"
            >
              View All Blogs
            </Link>
          </div>
          <div className="bg-transparent border border-green-400 p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-2xl font-bold text-green-400">
              Create Your Own Blog
            </h3>
            <p className="mt-2">
              Have something to share? Start your own blog with just a few
              clicks and connect with a global audience.
            </p>
            <button
              onClick={handleStartBloggingClick}
              className="mt-4 inline-block bg-black border border-green-400 hover:bg-green-500 hover:text-black transition-all ease-in-out text-green-400 py-2 px-4 rounded-full text-lg"
            >
              Start Blogging
            </button>
          </div>
        </div>
      </section>

      {/* Ensuring Footer Space is Covered */}
    </div>
  );
};

export default HomePage;
