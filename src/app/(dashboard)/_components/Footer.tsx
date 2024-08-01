"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const Footer = () => {
  const { theme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<string>("dark"); // Default to dark

  useEffect(() => {
    if (theme) {
      setCurrentTheme(theme);
    }
  }, [theme]);

  return (
    <footer
      className={`py-4 mt-8 ${
        currentTheme === "dark" ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-2 md:justify-between items-center">
        <p className="text-green-500">
          &copy; {new Date().getFullYear()} DEVBLOG. All rights reserved.
        </p>
        <p className="text-green-500">Made with 💚 by Azam</p>
      </div>
    </footer>
  );
};

export default Footer;
