"use client";
import sanitizeHtml from "sanitize-html";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import Image from "next/image";
import React, { FormEvent, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";

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
    ["link", "image"],
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
  "image",
  "code-block",
];

const CreatePage = () => {
  const { toast } = useToast();
  const [img, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    desc: "",
    slug: "",
  });

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
  };

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", data.title);

      // Sanitize the description HTML content
      const sanitizedDesc = sanitizeHtml(data.desc, {
        allowedTags: [
          "p",
          "a",
          "img",
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
          img: ["src", "alt", "title"],
          "*": ["style"],
        },
        allowedSchemes: ["http", "https", "mailto", "tel"],
      });
      formData.append("desc", sanitizedDesc);
      formData.append("slug", data.slug);

      if (img) {
        formData.append("img", img);
      }

      const response = await axios.post("/api/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast({
          variant: "popup",
          title: "Post Created Successfully!",
        });
        // Reset form data and files
        setData({
          title: "",
          desc: "",
          slug: "",
        });
        setImage(null);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error.",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="p-4 pt-4 md:p-10 flex flex-col relative gap-4"
    >
      <p className="text-xl">Upload Image</p>
      <label htmlFor="img">
        <Image
          src={!img ? "/upl.png" : URL.createObjectURL(img)}
          height={70}
          width={130}
          alt="img upload"
        />
      </label>
      <input onChange={handleImageChange} type="file" id="img" hidden />

      <h1 className="md:text-3xl font-bold text-lg">Create Post</h1>
      <input
        type="text"
        name="title"
        onChange={onChangeHandler}
        value={data.title}
        className="text-sm md:text-base px-2 md:px-3 border-none py-2 ring-1 ring-gray-600 focus:ring-1 focus:ring-green-600 outline-none rounded-sm"
        placeholder="Add Title"
        required
      />
      <input
        type="text"
        name="slug"
        onChange={onChangeHandler}
        value={data.slug}
        className="text-sm md:text-base px-2 md:px-3 border-none py-2 ring-1 ring-gray-600 focus:ring-1 focus:ring-green-600 outline-none rounded-sm"
        placeholder="Add Slug"
      />
      <ReactQuill
        value={data.desc}
        onChange={onDescChange}
        className="w-full sm:w-[500px] mt-4 px-4 py-3 border"
        placeholder="Write Content Here..."
        modules={modules}
        formats={formats}
      />
      <Button variant="custom">{loading ? "Posting..." : "Post"}</Button>
    </form>
  );
};

export default CreatePage;
