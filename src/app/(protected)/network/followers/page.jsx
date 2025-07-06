"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "../../../../hooks/auth/useAuthContext";
import axiosInstance from "../../../../utils/axios";
import SectionContainer from "../../../components/SectionContainer";
import { useDispatch, useSelector } from "react-redux";
import { getFollowingList } from "../../../../redux/slices/user";
import { useRouter } from "next/navigation";

function Followers() {
  const [followers, setFollowers] = useState([]);
  const [filters, setFilters] = useState({ city: "", state: "", country: "" });
  const { user } = useAuthContext();
  const { following } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const isFollowed = (id) => {
    return following?.some((item) => item.user_id === id);
  };

  const fetchFollowers = () => {
    if (!user || !user.id) return;

    axiosInstance
      .get(`/api/followers/${user.id}`)
      .then((res) => {
        setFollowers(res.data.followers || []);
      })
      .catch((err) => {
        console.error("Failed to fetch followers", err);
      });
  };

  useEffect(() => {
    fetchFollowers();
    dispatch(getFollowingList(user?.id));
  }, []);

  const handleFollow = async (targetUserId) => {
    try {
      await axiosInstance.post(`/api/follow/${targetUserId}`);
      fetchFollowers();
      dispatch(getFollowingList(user?.id));
    } catch (err) {
      console.error("Failed to follow", err);
    }
  };

  const handleUnfollow = async (targetUserId) => {
    try {
      await axiosInstance.post(`/api/unfollow/${targetUserId}`);
      fetchFollowers();
      dispatch(getFollowingList(user?.id));
    } catch (err) {
      console.error("Failed to unfollow", err);
    }
  };

  const filteredFollowers = followers.filter((user) => {
    const { city, state, country } = filters;
    const follower = user.follower;

    return (
      (city
        ? follower.city?.toLowerCase().includes(city.toLowerCase())
        : true) &&
      (state
        ? follower.state?.toLowerCase().includes(state.toLowerCase())
        : true) &&
      (country
        ? follower.country?.toLowerCase().includes(country.toLowerCase())
        : true)
    );
  });

  return (
    <SectionContainer className="gap-4 flex flex-col">
      <h2 className="text-2xl font-semibold text-indigo-700">Followers</h2>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFollowers.length > 0 ? (
          filteredFollowers.map((user, index) => {
            const followed = isFollowed(user.follower.id);
            return (
              <div
                key={index}
                onClick={() =>
                  router.push(`/user-profile/${user?.follower?.id}`)
                }
                className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm hover:shadow-md transition w-full h-20 flex items-center gap-4 cursor-pointer"
              >
                <div className="rounded-full flex-shrink-0">
                  {user.follower.imageUrl ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${user.follower.imageUrl}`}
                      alt={user.follower.name}
                      className="w-14 h-14 object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-indigo-100 flex items-center justify-center rounded-full text-indigo-600 font-bold">
                      {user.follower.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="w-1/2">
                  <h3 className="font-medium text-gray-800 truncate">
                    {user.follower.name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {user.follower.city}, {user.follower.state},{" "}
                    {user.follower.country}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent triggering navigate
                    followed
                      ? handleUnfollow(user.follower.id)
                      : handleFollow(user.follower.id);
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
          <div className="col-span-1 md:col-span-2 text-center py-10 text-gray-500">
            No followers found.
          </div>
        )}
      </div>
    </SectionContainer>
  );
}

export default Followers;
