"use client";
import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import Menu from "./Menu";
import NavLogin from "./NavLogin";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

const SearchBar = ({ onSearch }: any) => {
  const [query, setQuery] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const { theme } = useTheme();
  const router = useRouter();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      try {
        const res = await axios.get(`/api/suggestions?query=${value}`);
        setSuggestions(res.data.suggestions);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (slug: string) => {
    router.push(`/blog/${slug}`);
    setQuery(""); // Clear query on suggestion click
    setSuggestions([]); // Clear suggestions
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form reload
    onSearch(query); // Trigger search
    setSuggestions([]); // Clear suggestions on form submit
  };

  useEffect(() => {
    const handleScroll = () => {
      const searchBar = document.getElementById("search-bar");
      if (searchBar) {
        const offset = searchBar.getBoundingClientRect().top + window.scrollY;
        setIsSticky(window.scrollY > offset - 10);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <form
      id="search-bar"
      className={`relative w-full mx-auto py-5 px-4 ${
        isSticky
          ? "sticky top-0 left-0 shadow-md z-10 transition-all duration-300 ease-in-out backdrop-filter backdrop-blur-md"
          : "static"
      } ${
        theme === "dark"
          ? "bg-black bg-opacity-50 text-white"
          : "bg-white bg-opacity-50 text-black"
      }`}
      onSubmit={handleSubmit}
    >
      {isSticky && (
        <div className="flex text-gray-500  pr-3 md:hidden">
          <Menu />
        </div>
      )}
      <div className="flex justify-center items-center ml-8 w-full">
        <div
          className={`relative ${
            isSticky ? "flex items-center justify-center" : "w-3/5"
          }`}
        >
          <input
            className={`outline-none focus:border-green-400 placeholder:opacity-60 focus:placeholder:opacity-100 focus:ring-0 focus:border-b-[0.5px] px-4 py-2 rounded-none ${
              isSticky ? "pl-12" : "w-full"
            } md:px-6 md:text-lg ${
              theme === "dark"
                ? "bg-black bg-opacity-30 text-white placeholder-white"
                : "bg-white bg-opacity-30 text-black placeholder-black"
            } border-b-[0.25px] border-gray-300`}
            type="text"
            placeholder="Search Blogs"
            value={query}
            onChange={handleChange}
          />
          <CiSearch
            size={22}
            fill={theme === "dark" ? "#FFFFFF" : "#000000"}
            className={`absolute ${
              isSticky ? "left-3 md:left-4" : "right-3"
            } top-2 md:top-[0.65rem]`}
          />
          {suggestions.length > 0 && (
            <div
              className={`absolute top-full left-0 w-full shadow-lg rounded-md mt-2 z-20 ${
                theme === "dark" ? "bg-black text-white" : "bg-white text-black"
              }`}
            >
              <ul>
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-white/15 cursor-pointer"
                    onClick={() => handleSuggestionClick(suggestion.slug)}
                  >
                    {suggestion.title}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      {isSticky && (
        <div className="hidden md:flex md:absolute md:top-0 md:right-0 md:pr-4 md:items-center md:justify-end md:h-full">
          <NavLogin />
        </div>
      )}
    </form>
  );
};

export default SearchBar;
