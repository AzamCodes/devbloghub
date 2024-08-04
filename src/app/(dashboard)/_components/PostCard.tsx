import formatDate from "@/lib/formatDate";
import Image from "next/image";
import Link from "next/link";
import React from "react";

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

const PostCard: React.FC<{ post: any }> = React.memo(({ post }) => {
  const strippedDescription = stripHtmlTags(post.desc);
  const truncatedDescription = truncateText(strippedDescription, 100);

  // Add a version or timestamp to the author image URL
  // const authorImgUrl = post.authorImg
  //   ? `${post.authorImg}?v=${Date.now()}`
  //   : "/user.jpg";

  return (
    <div className="flex flex-col items-center py-3 px-4 glass-effect border-gray-700 border justify-center md:py-4 hover:opacity-85 shadow-xl transition-all ease-in-out duration-300 hover:translate-y-1 rounded-xl gap-4">
      <div className="w-full h-[280px] relative rounded-xl overflow-hidden">
        {post.img && (
          <Image
            src={post.img}
            layout="fill"
            objectFit="cover"
            alt="post image"
            className="rounded-xl"
          />
        )}
      </div>
      <div className="w-full">
        <h1 className="font-bold text-lg md:text-xl pb-3">{post.title}</h1>
        <p className="text-gray-400 text-sm md:text-base overflow-hidden">
          {truncatedDescription}
        </p>
        <Link
          className="text-sm md:text-base hover:text-green-400 transition-all text-gray-300"
          href={`/blog/${post.slug}`}
        >
          Read More
        </Link>
      </div>
      <div className="flex justify-between w-full items-center mt-4">
        <div className="flex items-center gap-2 md:gap-[0.65rem]">
          <div className="h-10 w-10 relative">
            <Image
              src={post.authorImg || "/user.jpg"}
              fill
              objectFit="cover"
              objectPosition="center"
              alt="user profile"
              className="rounded-full"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xs md:text-sm text-gray-400">Author</span>
            <span className="text-sm md:text-base">{post.author}</span>
          </div>
        </div>
        <div>
          <span className="text-sm md:text-base text-gray-400">
            {formatDate(post.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
});

// Assign a display name for better debugging
PostCard.displayName = "PostCard";

export default PostCard;
