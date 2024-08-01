"use client";
import React, { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

const Profile: React.FC = () => {
  const router = useRouter();
  const { user, setUser, setIsLoggedIn, fetchUserDetails } = useUser();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [img, setImage] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      if (img) formData.append("img", img);
      if (email) formData.append("email", email);
      const response = await axios.post("/api/profile", formData);
      if (response.data.success) {
        toast({
          variant: "popup",
          title: "User Profile Updated Successfully!",
        });
        setImage(null);
        setImgPreview(null);
        await fetchUserDetails(); // Refresh user data after updating profile
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
      await axios.post("/api/users/logout");
      setUser(null); // Clear user data
      setIsLoggedIn(false); // Update login state
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

  useEffect(() => {
    if (!user) {
      fetchUserDetails();
    }
    return () => {
      if (imgPreview) URL.revokeObjectURL(imgPreview);
    };
  }, [user, imgPreview, fetchUserDetails]);

  return (
    <div className="pt-5 px-5">
      <h2 className="text-lg md:text-2xl pb-4 font-bold">Profile Page</h2>
      <h4>
        {user ? (
          <div className="flex flex-col items-center">
            {user.img && (
              <Image
                src={user.img}
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
                  {user.username}
                </span>
              </p>
              <p className="text-gray-400">
                Email:{" "}
                <span className="text-green-400 text-sm md:text-lg">
                  {user.email}
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
            src={imgPreview || user?.img || "/up.png"}
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
          className="border-[0.5px] focus:border-green-500 outline-none p-2 mt-2"
        />
        <Button type="submit" variant={"outline"} className="mt-2">
          {loading ? "Updating..." : "Update Profile"}
        </Button>
        <Button
          type="button"
          onClick={logout}
          variant={"outline"}
          className="mt-2"
        >
          Logout
        </Button>
      </form>
    </div>
  );
};

export default Profile;
