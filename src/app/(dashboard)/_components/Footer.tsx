import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black/50 text-green-500 py-4 mt-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-2 md:justify-between items-center">
        <p>&copy; {new Date().getFullYear()} DEVBLOG. All rights reserved.</p>
        <p>Made with 💚 by Azam</p>
      </div>
    </footer>
  );
};

export default Footer;
