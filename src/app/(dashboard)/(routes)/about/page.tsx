import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "ABOUT",
  description: "Devblog About Page",
};
const AboutPage = () => {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-green-400 text-3xl md:text-5xl font-bold mb-4">
        About Devblog
      </h1>
      <p className="text-gray-200 text-base md:text-lg mb-4">
        Welcome to Devblog, your ultimate platform for creating and sharing
        blogs. Our mission is to provide a seamless experience for users to
        publish their ideas and connect with a wider audience.
      </p>
      <p className="text-gray-200 text-base md:text-lg mb-4">
        With Devblog, you can:
      </p>
      <ul className="list-disc list-inside text-gray-200 text-base md:text-lg mb-4">
        <li>Create and publish your blogs.</li>
        <li>Upload images to enhance your blog posts.</li>
        <li>
          Manage your profile, including updating your profile photo and email.
        </li>
        <li>View and manage your published blogs in your dashboard.</li>
        <li>Delete blogs that you no longer wish to keep.</li>
        <li>Search for blogs from other users.</li>
        <li>Log in and out securely with full-stack authentication.</li>
        <li>Reset your password if you forget it.</li>
        <li>Verify your email to secure your account.</li>
      </ul>
      <p className="text-gray-200 text-base md:text-lg mb-4">
        Devblog also offers a toggle functionality to switch between light and
        dark modes, ensuring a comfortable reading experience in any lighting
        condition.
      </p>
    </div>
  );
};

export default AboutPage;
