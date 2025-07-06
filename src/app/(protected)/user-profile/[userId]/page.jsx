"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "../../../../utils/axios";
import { formatDate } from "../../../../utils/DateFormat";
import SectionContainer from "../../../components/SectionContainer";
import BlogPosts from "../../../components/BlogList";
import { useRouter } from "next/navigation";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const { userId } = useParams();
  const [skills, setSkills] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [experience, setExperience] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [follower, setFollower] = useState();
  const [following, setFollowing] = useState();
  const [blogs, setBlogs] = useState([]);
  const router = useRouter();

  const FetchUserBlogs = async () => {
    try {
      const res = await axiosInstance.get(`/api/blogs/user/${userId}`);
      setBlogs(res?.data?.blog?.data);
    } catch (error) {
      console.log(error, "err");
    }
  };

  const FetchUser = async () => {
    try {
      const res = await axiosInstance.get(`/api/users`);
      setAllUsers(res?.data?.data);
    } catch (error) {
      console.log(error, "err");
    }
  };

  useEffect(() => {
    FetchUser();
  }, []);

  useEffect(() => {
    // Fetch User Data
    axiosInstance.get(`/api/users/${userId}`).then((res) => {
      setUserData(res.data.data.user);
      setFollower(res?.data?.data?.total_followers);
      setFollowing(res?.data?.data?.total_following);
    });

    // Fetch Skills
    axiosInstance.get(`/api/user-skills/${userId}`).then((res) => {
      setSkills(res?.data?.data);
    });

    // Fetch Qualifications
    axiosInstance.get(`/api/user-qualifications/${userId}`).then((res) => {
      setQualifications(res?.data?.data);
    });

    // Fetch Experience
    axiosInstance.get(`/api/user-experience/${userId}`).then((res) => {
      setExperience(res?.data?.data);
    });

    FetchUserBlogs();
  }, [userId]);

  if (!userData) return <div>Loading...</div>;

  return (
    <SectionContainer className="user-profile container mx-auto p-6 lg:flex gap-5">
      <div className="lg:w-2/3">
        {/* Header Section */}
        <div className="header flex flex-col md:flex-row items-center gap-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6 rounded-lg shadow-md lg:h-40 relative mb-16">
          <div className=" bg-white absolute -bottom-16 rounded-full w-32 h-32 items-center justify-center flex">
            <img
              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${userData.imageUrl}`}
              alt={userData.name}
              className="w-28 h-28 rounded-full"
            />
          </div>
        </div>
        <div className="text-center md:text-left px-6 flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-gray-700">
            {userData.name}
          </h1>
          <p className="text-gray-600 text-sm">{userData.description}</p>
          <p className="text-gray-600 text-sm">
            {userData.city}, {userData.state}, {userData.country}
          </p>
        </div>
        {/* Stats Section */}
        <div className="flex gap-5 my-2 px-6">
          <p className="text-sm text-blue-700 underline">
            Followers {follower}
          </p>
          <p className="text-sm text-blue-700 underline">
            Following {following}
          </p>
        </div>

        {/* Tabs Section */}
        <div className="tabs mt-6 flex border-b-2 border-t">
          {["posts", "skills", "qualifications", "experience"].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 font-medium transition-colors text-sm ${
                activeTab === tab
                  ? "border-b-4 border-indigo-500 text-indigo-500"
                  : "text-gray-500 hover:text-indigo-500"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content Section */}
        <div className="content mt-6 bg-white shadow-lg p-6 rounded-lg ">
          {activeTab === "posts" && blogs?.length === 0 && (
            <div>
              <p>No blogs posted by user</p>
            </div>
          )}
          {activeTab === "posts" && blogs?.length > 0 && (
            <BlogPosts
              posts={blogs}
              postCreation={false}
              // userData={userDetails?.data}
              // categoryData={categories}
            />
          )}

          {activeTab === "skills" && (
            <ul className="grid grid-cols-2 gap-4">
              {skills?.length === 0 ? (
                <div>
                  <p>No skill added by user</p>
                </div>
              ) : (
                skills?.map((skill, index) => (
                  <li
                    key={index}
                    className="bg-gray-100 rounded-lg p-4 text-center font-medium"
                  >
                    {skill.category_names}
                  </li>
                ))
              )}
            </ul>
          )}
          {activeTab === "qualifications" && (
            <ul className="space-y-4">
              {qualifications?.length === 0 ? (
                <div>
                  <p>No qualifications added by user</p>
                </div>
              ) : (
                qualifications?.map((qual, index) => (
                  <li
                    key={index}
                    className="bg-gray-100 rounded-lg p-4 shadow-sm"
                  >
                    <div className="font-semibold">{qual.qualification}</div>
                    <div className="text-sm text-gray-600">{qual.from}</div>
                    <div className="text-sm text-gray-600">
                      {qual.board_or_university}
                    </div>
                    <div className="text-sm text-gray-600">
                      {qual.passing_year}
                    </div>
                    <div className="text-sm text-gray-600">
                      Grade: {qual.grade}
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}
          {activeTab === "experience" && (
            <ul className="space-y-4">
              {experience?.length === 0 ? (
                <div>
                  <p>No experience added by user</p>
                </div>
              ) : (
                experience?.map((exp, index) => (
                  <li
                    key={index}
                    className="bg-gray-100 rounded-lg p-4 shadow-sm"
                  >
                    <div className="font-semibold">{exp.designation}</div>
                    <div className="text-sm text-gray-600">
                      {exp.company_name} ({formatDate(exp.start_date)} -{" "}
                      {formatDate(exp.end_date)})
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>
      <div className="lg:w-1/3 border p-5 rounded-md h-fit">
        <p className="text-gray-700 font-semibold">More profiles for you</p>
        <div className="flex flex-col gap-5 mt-5 ">
          {allUsers &&
            allUsers?.map((item, index) => (
              <div
                className={`flex gap-3 pb-2 ${
                  index !== allUsers.length - 1 ? "border-b" : ""
                }`}
              >
                <img
                  src="data:image/jpeg;base64,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"
                  className="h-16 w-16 rounded-full"
                  alt="img"
                />
                <div>
                  <p className=" font-semibold text-sm text-gray-700">
                    {item?.name}
                  </p>
                  <p className="  text-sm text-gray-700">
                    {item?.city}, {item?.state}
                  </p>
                  <button
                    onClick={() => {
                      router.push(`/user-profile/${item?.id}`);
                    }}
                    className="my-3 border-2 border-gray-500 text-gray-500 text-sm font-semibold rounded-full px-4 py-1 flex items-center gap-1"
                  >
                    {" "}
                    View Profile
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </SectionContainer>
  );
};

export default UserProfile;
