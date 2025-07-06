"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../../../utils/axios";
import SectionContainer from "../../components/SectionContainer";
import { useAuthContext } from "../../../hooks/auth/useAuthContext";
import Link from "next/link";
import Followers from "./followers/page";
import Followings from "./following/page";
import CompanyList from "./company/page";
import AllUser from "./people/page";
import Blogging from "./blogging/page";
import { usePathname } from "next/navigation";

const TABS = ["Followers", "Following", "Company", "People", "Blogging"];

const Network = () => {
  const [following, setFollowing] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Followers");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [filters, setFilters] = useState({ state: "", country: "" });
  const location = usePathname();
  const { user } = useAuthContext();
  const userId = user?.id || 7420;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [followingRes, usersRes] = await Promise.all([
          axiosInstance.get(`/api/following/${userId}`),
          axiosInstance.get("/api/users?role_id=4"),
        ]);
        const followedUsers = followingRes.data.following.map((f) => f.user);
        setFollowing(followedUsers);
        setAllUsers(usersRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCurrentTabComponent = () => {
    if (location.endsWith("/followers")) return <Followers />;
    if (location.endsWith("/following")) return <Followings />;
    if (location.endsWith("/company")) return <CompanyList />;
    if (location.endsWith("/people")) return <AllUser />;
    if (location.endsWith("/blogging")) return <Blogging />;
    return <Followers />; // default
  };

  const isFollowing = (id) => following.some((user) => user.id === id);

  const handleFollow = async (id) => {
    try {
      await axios.post("/api/follow", { follower_id: userId, user_id: id });
      const user =
        allUsers.find((u) => u.id === id) ||
        followers.find((f) => f.follower.id === id)?.follower;
      if (user) setFollowing((prev) => [...prev, user]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnfollow = async (id) => {
    try {
      await axios.post("/api/unfollow", { follower_id: userId, user_id: id });
      setFollowing((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const applyFilters = (users) => {
    return users.filter((user) => {
      const matchesName = user.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCity = selectedCity
        ? user.city?.toLowerCase() === selectedCity.toLowerCase()
        : true;
      const matchesState = filters.state
        ? user.state?.toLowerCase() === filters.state.toLowerCase()
        : true;
      const matchesCountry = filters.country
        ? user.country?.toLowerCase() === filters.country.toLowerCase()
        : true;

      return matchesName && matchesCity && matchesState && matchesCountry;
    });
  };

  const renderUserCard = (user, isFollowed) => (
    <div
      key={user.id}
      className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition w-full h-24 flex items-center gap-4"
    >
      <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-lg flex items-center justify-center overflow-hidden">
        {user.imageUrl ? (
          <img
            src={user.imageUrl}
            alt={user.name}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          user.name?.charAt(0)?.toUpperCase()
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-gray-800 truncate">{user.name}</h3>
        <p className="text-sm text-gray-500 truncate">
          {user.city}, {user.state}, {user.country}
        </p>
      </div>
      <button
        onClick={() =>
          isFollowed ? handleUnfollow(user.id) : handleFollow(user.id)
        }
        className={`text-xs px-3 py-1 rounded-full font-medium transition ${
          isFollowed
            ? "bg-red-100 text-red-600 hover:bg-red-200"
            : "bg-green-100 text-green-600 hover:bg-green-200"
        }`}
      >
        {isFollowed ? "Unfollow" : "Follow"}
      </button>
    </div>
  );

  const renderActiveTab = () => {
    let usersToRender = [];
    if (activeTab === "Followers") {
      usersToRender = followers.map((f) => f.follower);
    } else if (activeTab === "Following") {
      usersToRender = following;
    } else if (activeTab === "People") {
      usersToRender = allUsers;
    }
    const filteredUsers = applyFilters(usersToRender);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredUsers.map((user) =>
          renderUserCard(user, isFollowing(user.id))
        )}
      </div>
    );
  };

  return (
    <SectionContainer className="p-2 ">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1 md:col-span-3 space-y-6">
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : (
            <div className="flex-1">{getCurrentTabComponent()}</div>
          )}
        </div>
      </div>
    </SectionContainer>
  );
};

export default Network;
