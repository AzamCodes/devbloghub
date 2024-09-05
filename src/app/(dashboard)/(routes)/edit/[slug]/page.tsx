"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import sanitizeHtml from "sanitize-html";
import { useTheme } from "next-themes";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const modules = {
  syntax: {
    highlight: (text: string) => hljs.highlightAuto(text).value,
  },
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
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

const EditPage: React.FC = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { slug } = useParams(); // Get slug from URL params
  const [post, setPost] = useState({
    title: "",
    desc: "",
    slug: "",
    img: "",
  });
  const [img, setImage] = useState<{
    file: File | null;
    imgURL: string | null;
  }>({ file: null, imgURL: null });
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/blog/${slug}`);
        setPost(response.data);
        setImage({ file: null, imgURL: response.data.img });
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleDescChange = (value: string) => {
    setPost({ ...post, desc: value });
  };

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const imgURL = URL.createObjectURL(file);
      setImage({ file, imgURL });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSave = async () => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", post.title);
      formData.append("slug", post.slug);

      const sanitizedDesc = sanitizeHtml(post.desc, {
        allowedTags: [
          "p",
          "a",
          "b",
          "i",
          "u",
          "strong",
          "em",
          "blockquote",
          "code",
          "pre",
        ],
        allowedAttributes: {
          a: ["href", "title", "target"],
          "*": ["style"],
        },
        allowedSchemes: ["http", "https", "mailto", "tel"],
      });
      formData.append("desc", sanitizedDesc);

      if (img.file) {
        formData.append("img", img.file);
      }

      const response = await axios.put(`/api/post/${slug}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast({
          variant: "popup",
          title: "Post updated successfully!",
        });
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
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-10 flex flex-col gap-4">
      <h1 className="text-3xl font-bold mb-4">Edit Post</h1>

      {/* Image upload */}
      <div
        {...getRootProps()}
        className="border-2 border-dashed p-4 cursor-pointer"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-green-400">Drop the files here...</p>
        ) : (
          <p>Drag & drop an image here, or click to select one</p>
        )}
      </div>
      {img.imgURL && (
        <div className="mt-4">
          <Image
            src={img.imgURL}
            height={70}
            width={130}
            alt="Uploaded image"
            className="rounded"
          />
        </div>
      )}

      {/* Title input */}
      <input
        type="text"
        name="title"
        onChange={handleInputChange}
        value={post.title}
        className="text-sm md:text-base px-2 md:px-3 border-none py-2 ring-1 ring-gray-600 focus:ring-1 focus:ring-green-600 outline-none rounded-sm"
        placeholder="Add Title"
        required
      />

      {/* Slug input */}
      <input
        type="text"
        name="slug"
        onChange={handleInputChange}
        value={post.slug}
        className="text-sm md:text-base px-2 md:px-3 border-none py-2 ring-1 ring-gray-600 focus:ring-1 focus:ring-green-600 outline-none rounded-sm"
        placeholder="Add Slug"
        required
      />

      <ReactQuill
        value={post.desc}
        onChange={handleDescChange}
        className={`w-full mt-4 outline-none rounded ${
          theme === "dark" ? "bg-black text-white" : "bg-white text-black"
        }`}
        placeholder="Write Content Here..."
        modules={modules}
        formats={formats}
        theme="snow"
      />
      <Button
        onClick={handleSave}
        variant="custom"
        className="mt-4 bg-green-700 text-white/75"
      >
        {loading ? "Saving..." : "Save"}
      </Button>
    </div>
  );
};

export default EditPage;
