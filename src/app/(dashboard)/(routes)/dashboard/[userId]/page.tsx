"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import DOMPurify from "dompurify";

// Helper function to strip HTML tags
const stripHtmlTags = (html: string) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

// Helper function to truncate text
const truncateText = (text: string, length: number) => {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
};

// Interface for the Post object
interface Post {
  _id: string;
  title: string;
  desc: string;
  img: string;
  author: string;
  userId: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

const DashPage: React.FC = () => {
  const { toast } = useToast();
  const params = useParams();
  const userId = params.userId;
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async (userId: string) => {
    try {
      const response = await axios.get(`/api/users/posts/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  };

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        const data = await fetchPosts(userId as string);
        setPosts(
          data.sort(
            (a: Post, b: Post) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
      };

      fetchData();
    }
  }, [userId]);

  const sanitizeHTML = (html: string) => {
    return DOMPurify.sanitize(html);
  };

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const handleDelete = async (postId: string) => {
    try {
      const response = await axios.delete(`/api/post`, {
        data: { postId },
      });
      setPosts(posts.filter((post) => post._id !== postId));
      toast({
        variant: "popup",
        title: "Post has been Deleted Successfully!",
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        variant: "popup",
        title: "Failed to delete post",
      });
    }
  };

  return (
    <div>
      <h1 className="text-3xl p-4 font-bold mb-2">Posts:</h1>
      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-transparent rounded-xl relative text-wrap p-3 md:p-4 flex flex-col gap-3 md:flex-row hover:shadow-xl overflow-hidden mb-5"
        >
          <Image
            src={post.img}
            alt={post.title}
            width={500}
            height={320}
            className="w-full h-[22rem] md:flex-1 md:h-80 object-cover rounded-lg"
          />
          <div className="w-full md:flex-1 text-ellipse truncate relative">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <div className="flex space-x-2 items-center">
                <button
                  type="button"
                  className="border-none hover:text-green-400 transition-all outline-none bg-transparent"
                  onClick={() => handleDelete(post._id)}
                >
                  <MdDeleteOutline size={24} />
                </button>
                <button>
                  <Link href={`/edit/${post.slug}`}>
                    <MdEdit
                      size={24}
                      className="hover:text-green-400 transition-all outline-none bg-transparent"
                    />
                  </Link>
                </button>
              </div>
            </div>
            <div
              className="mt-2 text-gray-600 md:max-h-6xl text-ellipsis truncate"
              dangerouslySetInnerHTML={{
                __html: sanitizeHTML(
                  truncateText(stripHtmlTags(post.desc), 150)
                ),
              }}
            ></div>
            <Link
              className="text-sm md:text-base text-gray-300"
              href={`/blog/${post.slug}`}
            >
              Read More
            </Link>
            <div className="absolute bottom-1 right-3 text-sm text-gray-400 md:bottom-3 md:right-3 md:pt-0 pt-3">
              {formatDate(post.createdAt)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashPage;
