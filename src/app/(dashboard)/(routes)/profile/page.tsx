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
  const { user, fetchUserDetails } = useUser();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(user?.email || "");
  const [img, setImage] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string | null>(null);

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

  useEffect(() => {
    if (!user) {
      fetchUserDetails();
    }
    return () => {
      if (imgPreview) URL.revokeObjectURL(imgPreview);
    };
  }, [user, imgPreview, fetchUserDetails]);

  return <div className="pt-5 px-5">{/* Profile UI */}</div>;
};

export default Profile;
