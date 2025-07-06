"use client";

import { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../utils/axios";
import ProfileCard from "./ProfileCard";
import Loader from "./Loader";
import BlogPosts from "./BlogList";
import JobList from "./JobList";
import SectionContainer from "../components/SectionContainer";
import { getFollowingList, getUserAddress } from "../../redux/slices/user";
import { useDispatch } from "react-redux";
import { useAuthContext } from "../../hooks/auth/useAuthContext";
import {
  UserControlCard,
  PolicyControlCard,
  LogoutCard,
} from "./UserControlCard";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";

const Home = () => {
  const { user } = useAuthContext();
  const [isFollow, setIsFollow] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [allStatuses, setAllStatus] = useState([]);
  const [currentPost, setCurrentPost] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [postImage, setPostImage] = useState("");
  const [userDetails, setUserDetails] = useState({});
  const [categories, setCategories] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [applyJobs, setApplyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(10);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const authToken = localStorage.getItem("accesstoken");

        if (!authToken) throw new Error("No auth token found");

        const response = await axiosInstance.get("/api/user-details");
        setUserDetails(response?.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const attemptScrollRestore = () => {
      const savedPosition = parseInt(
        sessionStorage.getItem("HomeScroll") || "0"
      );
      if (document.body.scrollHeight > savedPosition) {
        window.scrollTo(0, savedPosition);
      } else {
        setTimeout(attemptScrollRestore, 50);
      }
    };

    if (loading === false) {
      attemptScrollRestore();
    }
  }, [loading]); // This useEffect depends on the loading state

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/api/blog_category?limit=100`
        );
        setCategories(response?.data?.blog_category?.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const fetchPost = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/blogs?limit=${limit}`);
      setBlogPosts(response?.data?.blog?.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  useEffect(() => {
    const fetchUserJobs = async () => {
      try {
        setLoading(true);
        const authToken = localStorage.getItem("accesstoken");

        if (!authToken) throw new Error("No auth token found");

        const response = await axiosInstance.get(`/api/job-applications`);
        setApplyJobs(response?.data?.data?.data);
      } catch (error) {
        console.error("Error fetching user jobs:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserJobs();
  }, []);

  useEffect(() => {
    dispatch(getUserAddress());
  }, []);

  useEffect(() => {
    dispatch(getFollowingList(user?.id));
  }, []);

  const handleLoadMore = () => {
    setLimit((prevLimit) => prevLimit + 10);
  };

  if (loading) return <Loader />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className=" bg-gray-100 ">
      <SectionContainer className="flex flex-col lg:flex-row gap-6 p-5">
        {/* Left Sidebar */}
        <div className="w-full lg:w-1/4 space-y-6">
          <ProfileCard userData={userDetails?.data} />
          <UserControlCard />
          <PolicyControlCard />
          <LogoutCard />
        </div>

        {/* Main Feed */}
        <div className="w-full lg:w-1/2 space-y-6">
          <BlogPosts
            posts={blogPosts}
            userData={userDetails?.data}
            categoryData={categories}
          />
          <div className="flex items-center justify-end">
            <button
              onClick={handleLoadMore}
              className="text-blue-700 text-sm font-semibold py-2 px-2 rounded"
            >
              Load More
            </button>{" "}
            <FaArrowRightLong color="blue" />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-1/4 ">
          <JobList jobs={applyJobs} />
          <div className="border rounded-md p-5 bg-white shadow-md h-fit">
            <p className="text-gray-700 font-semibold text-lg mb-3">
              Suggested companies{" "}
            </p>
            <div className="flex flex-col gap-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex gap-3">
                  <img
                    alt="img"
                    className="h-16 w-16"
                    src="https://www.liblogo.com/img-logo/ey1267ed60-ey-logo-ernst-young-ey-logo-vector-svg-icon-png-repo-free-png-icons.png"
                  />
                  <div className="border-b w-full">
                    <p className="text-gray-700 font-semibold">
                      Spirehub Softwares
                    </p>
                    <p className="text-gray-500 text-xs">
                      Technology, Information and Internet
                    </p>
                    <button className="my-3 border-2 border-gray-500 text-gray-500 text-sm font-semibold rounded-full px-4 py-1 flex items-center gap-1">
                      {" "}
                      <FaPlus />
                      Follow
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
};

export default Home;
