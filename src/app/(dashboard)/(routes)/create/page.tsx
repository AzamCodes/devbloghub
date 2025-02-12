"use client";
import React, { FormEvent, useState, useCallback } from "react";
import Image from "next/image";
import sanitizeHtml from "sanitize-html";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Ensure Quill CSS is imported
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { useTheme } from "next-themes";

// Dynamically import ReactQuill
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

 const modules = {
  syntax: {
    highlight: (text: string) => hljs.highlightAuto(text).value,
  },
  toolbar: [
    [{ header: ['1', '2', '3', false] }],
    ['bold', 'italic', 'underline', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'code-block'],
    ['clean'],
  ],
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'code-block'
];

const CreatePage = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { toast } = useToast();
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
  const [slugError, setSlugError] = useState("");

  const validateSlug = (slug: string) => {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugRegex.test(slug);
  };

  const onChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const name = event.target.name;
    const value = event.target.value;
    
    if (name === "slug") {
      if (!value) {
        setSlugError("");
      } else if (!validateSlug(value)) {
        setSlugError("Slug must be lowercase, with no spaces. Use hyphens to separate words (e.g., my-blog-post)");
      } else {
        setSlugError("");
      }
    }
    
    setData({ ...data, [name]: value });
  };

  const onDescChange = (value: string) => {
    setData({ ...data, desc: value });
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const imgURL = URL.createObjectURL(file);
      setImage({ file, imgURL });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateSlug(data.slug)) {
      toast({
        variant: "destructive",
        title: "Invalid Slug Format",
        description: "Please correct the slug format before submitting",
      });
      return;
    }
    
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", data.title);

      const sanitizedDesc = sanitizeHtml(data.desc, {
        allowedTags: [
          "p", "a", "b", "i", "u", "strong", "em", 
          "blockquote", "code", "pre", "h1", "h2", "h3",
          "ul", "ol", "li"
        ],
        allowedAttributes: {
          a: ["href", "title", "target"],
          "*": ["style"],
        },
        allowedSchemes: ["http", "https", "mailto", "tel"],
      });
      formData.append("desc", sanitizedDesc);
      formData.append("slug", data.slug);

      if (img.file) {
        formData.append("img", img.file);
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
        setData({
          title: "",
          desc: "",
          slug: "",
        });
        setImage({ file: null, imgURL: null });
        router.push("/blog");
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.error("Error creating post:", error);
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
    <form
      onSubmit={onSubmitHandler}
      className="p-4 pt-4 md:p-10 flex flex-col relative gap-4"
    >
      <p className="text-xl">Upload Image</p>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-4 cursor-pointer ${
          isDragActive ? "border-green-400" : "border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-green-400">Drop the files here ...</p>
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
            alt="img upload"
            className="rounded"
          />
        </div>
      )}

      <h1 className="md:text-3xl font-bold text-lg mt-4">Create Post</h1>
      <input
        type="text"
        name="title"
        onChange={onChangeHandler}
        value={data.title}
        className="text-sm md:text-base px-2 md:px-3 border-none py-2 ring-1 ring-gray-600 focus:ring-1 focus:ring-green-600 outline-none rounded-sm"
        placeholder="Add Title"
        required
      />
      <div className="flex flex-col gap-1">
        <input
          type="text"
          name="slug"
          onChange={onChangeHandler}
          value={data.slug}
          className={`text-sm md:text-base px-2 md:px-3 border-none py-2 ring-1 ${
            slugError ? 'ring-red-500' : 'ring-gray-600'
          } focus:ring-1 focus:ring-green-600 outline-none rounded-sm`}
          placeholder="Add Slug (e.g., my-blog-post)"
          required
        />
        {slugError && (
          <p className="text-red-500 text-sm">{slugError}</p>
        )}
      </div>
      <ReactQuill
        value={data.desc}
        onChange={onDescChange}
        className={`w-full mt-4 outline-none rounded ${
          theme === "dark" ? "bg-black text-white" : "bg-white text-black"
        }`}
        placeholder="Write Content Here..."
        modules={modules}
        formats={formats}
        theme="snow"
      />
      <Button variant="custom" className="mt-4 bg-green-700 text-white/75 ">
        {loading ? "Posting..." : "Post"}
      </Button>
    </form>
  );
};

export default CreatePage;
