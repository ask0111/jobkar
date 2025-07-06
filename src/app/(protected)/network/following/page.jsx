"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "../../../../hooks/auth/useAuthContext";
import axiosInstance from "../../../../utils/axios";
import SectionContainer from "../../../components/SectionContainer";
import { useDispatch, useSelector } from "react-redux";
import { getFollowingList } from "../../../../redux/slices/user";
import { useRouter } from "next/navigation";

function Followings() {
  const [followers, setFollowers] = useState([]);
  const [filters, setFilters] = useState({ city: "", state: "", country: "" });
  const { user } = useAuthContext();
  const { following } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  
  const isFollowed = (id) => {
    return following?.some((item) => item.user_id === id);
  };

  const fetchFollowing = async () => {
    try {
      const res = await axiosInstance.get(`/api/following/${user.id}`);
      setFollowers(res.data.following || []);
    } catch (err) {
      console.error("Failed to fetch followers", err);
    }
  };

  useEffect(() => {
    fetchFollowing();
    dispatch(getFollowingList(user?.id));
  }, []);

  const handleUnfollow = async (targetUserId) => {
    try {
      await axiosInstance.post(`/api/unfollow/${targetUserId}`);
      dispatch(getFollowingList(user?.id));
      fetchFollowing();
    } catch (err) {
      console.error("Failed to unfollow", err);
    }
  };

  const filteredFollowers = followers.filter((user) => {
    const cityMatch = user.user.city
      ?.toLowerCase()
      .includes(filters.city.toLowerCase());
    const stateMatch = user.user.state
      ?.toLowerCase()
      .includes(filters.state.toLowerCase());
    const countryMatch = user.user.country
      ?.toLowerCase()
      .includes(filters.country.toLowerCase());
    return cityMatch && stateMatch && countryMatch;
  });

  return (
    <SectionContainer className="gap-4 flex flex-col">
      <h2 className="text-2xl font-semibold text-indigo-700">Following</h2>

      {followers.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="City"
            value={filters.city}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, city: e.target.value }))
            }
            className="px-3 py-2 w-40 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm"
          />
          <input
            type="text"
            placeholder="State"
            value={filters.state}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, state: e.target.value }))
            }
            className="px-3 py-2 w-40 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm"
          />
          <input
            type="text"
            placeholder="Country"
            value={filters.country}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, country: e.target.value }))
            }
            className="px-3 py-2 w-40 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm"
          />
          <button
            onClick={() => setFilters({ city: "", state: "", country: "" })}
            className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-semibold hover:bg-indigo-200 transition"
          >
            Clear
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFollowers.length > 0 ? (
          filteredFollowers.map((user, index) => {
            const followed = isFollowed(user.user.id);
            return (
              <div
                key={index}
                onClick={() => router.push(`/user-profile/${user.user.id}`)}
                className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm hover:shadow-md transition w-full h-20 flex items-center gap-4 cursor-pointer"
              >
                <div className="flex-shrink-0 rounded-full">
                  <img
                    src={
                      user.user.imageUrl
                        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${user.user.imageUrl}`
                        : "https://th.bing.com/th/id/OIP.hGSCbXlcOjL_9mmzerqAbQHaHa?w=185&h=185&c=7&r=0&o=5&dpr=1.5&pid=1.7"
                    }
                    alt={user.user.name}
                    className="w-14 h-14 object-cover rounded-full"
                  />
                </div>

                <div className="w-1/2">
                  <h3 className="font-medium text-gray-800 truncate">
                    {user.user.name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {user.user.city}, {user.user.state}, {user.user.country}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnfollow(user.user.id);
                  }}
                  className={`text-xs px-3 py-1 rounded-full font-medium transition ${
                    followed
                      ? "bg-red-100 text-red-600 hover:bg-red-200"
                      : "bg-green-100 text-green-600 hover:bg-green-200"
                  }`}
                >
                  {followed ? "Unfollow" : "Follow"}
                </button>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            <p className="text-lg">No followers found</p>
            <p className="text-sm">
              Start connecting with other users to grow your network
            </p>
          </div>
        )}
      </div>
    </SectionContainer>
  );
}

export default Followings;
