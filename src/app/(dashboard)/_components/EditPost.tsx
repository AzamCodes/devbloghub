"use client";
import React, { FormEvent, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import sanitizeHtml from "sanitize-html";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import hljs from "highlight.js";
import { useTheme } from "next-themes";

// Dynamically import ReactQuill
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const modules = {
  syntax: {
    highlight: (text: string) => hljs.highlightAuto(text).value,
  },
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link"],
    ["code-block"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "code-block",
];

const EditPage = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams();
  const [img, setImage] = useState<{
    file: File | null;
    imgURL: string | null;
  }>({ file: null, imgURL: null });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    desc: "",
    slug: "",
  });

  // Fetch existing post data
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await axios.get(`/api/post/${params.slug}`);
        const post = response.data;

        setData({
          title: post.title,
          desc: post.desc,
          slug: post.slug,
        });

        setImage({ file: null, imgURL: post.img });
      } catch (error) {
        console.error("Error fetching post:", error);
        toast({
          variant: "destructive",
          title: "Error.",
          description: "Failed to load post data.",
        });
      }
    };

    fetchPostData();
  }, [params.slug, toast]);

  const onChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const name = event.target.name;
    const value = event.target.value;
    setData({ ...data, [name]: value });
  };

  const onDescChange = (value: string) => {
    setData({ ...data, desc: value });
  };

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const imgURL = URL.createObjectURL(file);
      setImage({ file, imgURL });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", data.title);

      const sanitizedDesc = sanitizeHtml(data.desc);
      formData.append("desc", sanitizedDesc);
      formData.append("slug", data.slug);

      if (img.file) {
        formData.append("img", img.file);
      }

      const response = await axios.put(`/api/post/${params.slug}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast({ variant: "popup", title: "Post Updated Successfully!" });
        router.push("/blog");
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.error("Error updating post:", error);
      toast({
        variant: "destructive",
        title: "Error.",
        description:
          error.response?.data?.message || "An unknown error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="p-4 flex flex-col gap-4">
      {/* Similar structure for uploading image and inputs for editing */}
      <Button
        type="submit"
        variant="custom"
        className="bg-green-700 text-white/75"
      >
        {loading ? "Updating..." : "Update"}
      </Button>
    </form>
  );
};

export default EditPage;
