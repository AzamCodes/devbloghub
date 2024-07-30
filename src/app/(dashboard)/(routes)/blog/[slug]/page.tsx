import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css"; // Import the chosen theme
import formatDate from "@/lib/formatDate";
import { Skeleton } from "@/components/ui/skeleton"; // Import the Skeleton component

interface PostContentProps {
  content: string;
}

const PostContent: React.FC<PostContentProps> = ({ content }) => {
  return (
    <div
      className="post-content"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

const fetchPost = async (slug: string) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
    const res = await fetch(`http://localhost:3000/api/blog/${slug}`, {
      method: "GET",
      cache: "no-cache",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch post");
    }
    const data = await res.json();

    // Highlight code blocks
    const contentWithHighlighting = data.desc.replace(
      /<pre>(.*?)<\/pre>/gs,
      (match: string, p1: string) => {
        const highlightedCode = hljs.highlightAuto(p1).value;
        return `<pre class="hljs">${highlightedCode}</pre>`;
      }
    );

    data.desc = contentWithHighlighting;

    return data;
  } catch (error: any) {
    console.error(error.message);
    return null;
  }
};

interface PageProps {
  params: { slug: string };
}

export const generateMetadata = async ({ params }: any) => {
  const { slug } = params;
  const post = await fetchPost(slug);
  return {
    title: post?.title || "Blog Post",
    description: post?.desc || "",
  };
};

const SingleBlogPost = async ({ params }: PageProps) => {
  const { slug } = params;
  const post = await fetchPost(slug);

  console.log("Fetched post:", post);

  if (!post) {
    return notFound(); // Handle post not found
  }

  return (
    <div className="md:px-12 px-3 py-8">
      <Button
        variant={"outline"}
        size={"sm"}
        className="flex justify-between gap-2"
      >
        <span className="">
          <IoIosArrowBack />
        </span>
        <Link className="text-sm md:text-sm" href="/blog">
          Back to Blog
        </Link>
      </Button>

      <div className="md:pt-10 pt-8">
        <h1 className="text-xl md:text-4xl leading-snug font-bold uppercase mb-3 md:mb-6">
          {post.title || <Skeleton className="h-6 w-[300px]" />}{" "}
          {/* Title Skeleton */}
        </h1>
        <div className="flex items-center justify-start w-[90%]">
          <div className="flex items-center gap-2 md:gap-[0.65rem]">
            <div className="h-10 w-10 relative">
              {post.authorImg ? (
                <Image
                  src={post.authorImg}
                  fill
                  objectFit="cover"
                  objectPosition="center"
                  alt="user profile"
                  className="rounded-full"
                />
              ) : (
                <Skeleton className="h-10 w-10 rounded-full" /> // Author image skeleton
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-xs md:text-sm text-gray-400">Author</span>
              <span className="text-sm md:text-base">
                {post.author || <Skeleton className="h-4 w-[200px]" />}{" "}
                {/* Author name Skeleton */}
              </span>
            </div>
          </div>
          <span className="px-4">|</span>
          <div className="flex flex-col">
            <span className="text-xs md:text-sm text-gray-400">Published</span>
            <span className="text-sm md:text-base">
              {formatDate(post.createdAt) || (
                <Skeleton className="h-4 w-[150px]" />
              )}{" "}
              {/* Date Skeleton */}
            </span>
          </div>
        </div>
      </div>
      <div className="w-[100%] mt-6 md:mt-10 min-h-[300px] bg-top md:min-h-[600px] z-10 relative rounded-xl">
        {post.img ? (
          <Image
            src={post.img}
            layout="fill"
            objectFit="cover"
            alt="post image"
            className="rounded-xl z-10"
          />
        ) : (
          <Skeleton className="w-full h-[300px] md:h-[600px] rounded-xl" /> // Post image skeleton
        )}
      </div>
      <div className="post-content text-gray-400 text-sm md:text-base md:w-[100%] mt-5 md:mt-6 pb-3">
        {post.desc ? (
          <PostContent content={post.desc} />
        ) : (
          <Skeleton className="w-full h-[200px] md:h-[400px]" /> // Post content skeleton
        )}
      </div>
    </div>
  );
};

export default SingleBlogPost;
