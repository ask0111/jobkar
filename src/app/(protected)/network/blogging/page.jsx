"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../../../../utils/axios";
import { useAuthContext } from "../../../../hooks/auth/useAuthContext";
import BlogPosts from "../../../components/BlogList";

function Blogging() {
  const [blogs, setBlogs] = useState([]);
  const { user } = useAuthContext();

  const FetchUserBlogs = async () => {
    try {
      const res = await axiosInstance.get(`/api/blogs/user/${user?.id}`);
      setBlogs(res?.data?.blog?.data);
    } catch (error) {
      console.log(error, "err");
    }
  };

  useEffect(() => {
    FetchUserBlogs();
  }, []);
  return (
    <BlogPosts
      posts={blogs}
      postCreation={false}
      // userData={userDetails?.data}
      // categoryData={categories}
    />
  );
}

export default Blogging;
