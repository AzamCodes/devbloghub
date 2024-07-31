"use client";
import React, { useEffect, useState, useCallback } from "react";
import PostCard from "../../_components/PostCard";
import axios from "axios";
import { Post } from "@/helpers/types";
import { Skeleton } from "@/components/ui/skeleton";
import SearchBar from "../../_components/SearchBar";

const getData = async (
  page: number,
  limit: number,
  query: string
): Promise<{ posts: Post[]; totalPages: number }> => {
  try {
    const res = await axios.get(
      `/api/blog?page=${page}&limit=${limit}&query=${query}`
    );
    if (!res) {
      return { posts: [], totalPages: 0 };
    }
    return res.data;
  } catch (error: any) {
    return { posts: [], totalPages: 0 };
  }
};

const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [query, setQuery] = useState<string>("");

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const data = await getData(currentPage, 6, query);
    setPosts((prevPosts) => [...prevPosts, ...data.posts]);
    setFilteredPosts((prevPosts) => [...prevPosts, ...data.posts]);
    setTotalPages(data.totalPages);
    setLoading(false);
  }, [currentPage, query]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSearch = (query: string) => {
    setQuery(query);
    setCurrentPage(1);
    setPosts([]);
    setFilteredPosts([]);
    fetchPosts();
  };

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      loading
    ) {
      return;
    }
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }, [loading, totalPages, currentPage]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <div className="px-3 md:px-3 py-10 md:p-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
        {loading &&
          Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="flex flex-col space-y-3">
              <Skeleton className="h-[210px] md:h-[280px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
      </div>
      {loading && (
        <div className="flex justify-center mt-8">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
