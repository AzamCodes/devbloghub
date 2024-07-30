"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, FormEvent, ChangeEvent } from "react";

interface User {
  username: string;
  email: string;
  img?: string;
  // Add other fields as needed
}

const Profile: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<User | null>(null);
  const [img, setImage] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      if (img) {
        formData.append("img", img);
      }
      if (email) {
        formData.append("email", email);
      }
      const response = await axios.post("/api/profile", formData);
      if (response.data.success) {
        toast({
          variant: "popup",
          title: "User Profile Updated Successfully!",
        });
        setImage(null);
        setImgPreview(null);
        getUserDetails(); // Refresh user data after updating profile
      } else {
        throw new Error(response.data.message || "Failed to update profile");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      toast({
        variant: "destructive",
        title: "Error.",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setImage(file);
        setImgPreview(URL.createObjectURL(file));
      } else {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload an image file.",
        });
      }
    }
  };

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast({
        variant: "popup",
        title: "Logout successful",
      });
      router.push("/");
    } catch (error: any) {
      console.error("Error logging out:", error.message);
      toast({
        variant: "destructive",
        description: error.message,
      });
    }
  };

  const getUserDetails = async () => {
    try {
      const res = await axios.get("/api/users/me");
      setData(res.data.data);
      setEmail(res.data.data.email); // Set initial username
    } catch (error: any) {
      console.error("Error fetching user details:", error.message);
    }
  };

  useEffect(() => {
    getUserDetails();

    // Clean up the URL object if it exists
    return () => {
      if (img) URL.revokeObjectURL(imgPreview || "");
    };
  }, [imgPreview]);

  return (
    <div className="pt-5 px-5">
      <h2 className="text-lg md:text-2xl pb-4 font-bold">Profile Page</h2>
      <h4>
        {data ? (
          <div className="flex flex-col items-center">
            {data.img && (
              <Image
                src={data.img}
                alt="User Image"
                width={200}
                className="rounded-lg mb-3"
                height={200}
              />
            )}
            <div className="flex justify-start flex-col">
              <p className="text-gray-400">
                Username:{" "}
                <span className="text-green-400 text-sm md:text-lg">
                  {data.username}
                </span>
              </p>
              <p className="text-gray-400">
                Email:{" "}
                <span className="text-green-400 text-sm md:text-lg">
                  {data.email}
                </span>
              </p>
            </div>
          </div>
        ) : (
          "Loading user data..."
        )}
      </h4>
      <hr className="bg-green-500 mt-5" />
      <h2 className="pt-5 text-lg md:text-2xl text-green-500 font-semibold pb-3">
        New Profile Upload
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <label htmlFor="img" className="cursor-pointer">
          <Image
            src={imgPreview || data?.img || "/upl.png"}
            height={70}
            width={130}
            alt="img upload"
            className="rounded-sm"
          />
        </label>
        <input type="file" id="img" hidden onChange={handleImageChange} />
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Update email"
          className="mt-3 px-3 py-2 md:px-4 md:py-2 text-xs outline-none focus:ring-1 ring-green-400 rounded-md"
        />
        <div className="flex gap-8 items-center">
          <Button
            variant="custom"
            type="submit"
            className="mt-3 text-xs md:text-sm"
          >
            {loading ? "Updating..." : "Update"}
          </Button>
          <Button
            variant="outline"
            onClick={logout}
            className="mt-3 text-xs md:text-sm"
          >
            Logout
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
