"use client";
import React, { useState, useEffect } from "react";
import SearchBar from "../../_components/SearchBar";

const TestPage: React.FC = () => {
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const searchBar = document.getElementById("search-bar");
      if (searchBar) {
        const offset = searchBar.getBoundingClientRect().top + window.scrollY;
        setIsFixed(window.scrollY > offset - 10);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen">
      {" "}
      {/* Ensure there's enough height */}
      <SearchBar />
      <div
        className={`relative ${
          isFixed ? "fixed top-0 left-0 w-full bg-red-500" : "static"
        } bg-red-500`}
        style={{ height: "200px" }}
      >
        Scroll me
      </div>
      <div style={{ height: "2000px" }}>
        {" "}
        {/* Add more height for scrolling */}
        <p>Add more content here to enable scrolling.</p>
      </div>
    </div>
  );
};

export default TestPage;
