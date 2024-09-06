"use client";
import React, { useEffect, useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useDropzone } from "react-dropzone";

const Profile: React.FC = () => {
  const router = useRouter();
  const { user, setUser, setIsLoggedIn, fetchUserDetails } = useUser();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(user?.email || "");
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

      let message = "Profile updated successfully"; // Default success message

      // Only append if there are changes
      if (img) {
        formData.append("img", img);
        message = "Profile photo updated successfully"; // Specific success message for photo update
      }
      if (email && email !== user?.email) {
        formData.append("email", email);
        message = "Email updated successfully"; // Specific success message for email update
      }

      // Ensure at least one field is being updated
      if (!img && (!email || email === user?.email)) {
        toast({
          variant: "destructive",
          title: "No changes detected.",
          description: "Please update your email or profile photo.",
        });
        setLoading(false);
        return;
      }

      const response = await axios.post("/api/profile", formData);

      if (response.data.success) {
        toast({
          variant: "popup",
          title: message,
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

  const handleDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
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

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: {
      "image/*": [],
    },
  });

  return (
    <div className="pt-5 px-5">
      <h2 className="text-lg md:text-2xl pb-4 font-bold">Profile Page</h2>
      <h4>
        {user ? (
          <div className="flex flex-col items-center">
            <Image
              src={user.img || "/user.jpg"}
              alt="User Image"
              width={200}
              height={200}
              className="rounded-lg mb-3"
            />
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
      <div
        {...getRootProps()}
        className="flex flex-col items-center border-dashed border-2 mb-4 border-gray-300 p-4 rounded-md cursor-pointer relative overflow-hidden"
      >
        <input
          {...getInputProps()}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {imgPreview ? (
          <Image
            src={imgPreview}
            alt="Image preview"
            height={70}
            width={130}
            className="rounded-sm"
          />
        ) : (
          <p className="text-gray-400">
            Drag & drop an image here, or click to select one
          </p>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm md:text-lg font-medium text-gray-400"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 px-3 py-2 border rounded-md w-full"
            required
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-600 w-full"
        >
          {loading ? "Updating..." : "Update Profile"}
        </Button>
      </form>
      <div className="mt-4">
        <Button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-600 w-full"
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Profile;
