"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "../../../../hooks/auth/useAuthContext";
import axiosInstance from "../../../../utils/axios";
import SectionContainer from "../../../components/SectionContainer";
import { useDispatch, useSelector } from "react-redux";
import { getFollowingList } from "../../../../redux/slices/user";
import { useRouter } from "next/navigation";

function AllUser() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ city: "", state: "", country: "" });
  const { user } = useAuthContext();
  const { following } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const isFollowed = (id) => {
    return following?.some((item) => item.user_id === id);
  };

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get(`/api/users?role_id=4`);
      setUsers(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    dispatch(getFollowingList(user?.id));
  }, []);

  const handleFollow = async (targetUserId) => {
    try {
      await axiosInstance.post(`/api/follow/${targetUserId}`);
      fetchUsers();
      dispatch(getFollowingList(user?.id));
    } catch (err) {
      console.error("Failed to follow", err);
    }
  };

  const handleUnfollow = async (targetUserId) => {
    try {
      await axiosInstance.post(`/api/unfollow/${targetUserId}`);
      fetchUsers();
      dispatch(getFollowingList(user?.id));
    } catch (err) {
      console.error("Failed to unfollow", err);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesCity = u.city
      ?.toLowerCase()
      .includes(filters.city.toLowerCase());
    const matchesState = u.state
      ?.toLowerCase()
      .includes(filters.state.toLowerCase());
    const matchesCountry = u.country
      ?.toLowerCase()
      .includes(filters.country.toLowerCase());
    return matchesCity && matchesState && matchesCountry;
  });

  return (
    <SectionContainer className="gap-4 flex flex-col">
      <h2 className="text-2xl font-semibold text-indigo-700">People</h2>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {users.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              placeholder="City"
              value={filters.city}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, city: e.target.value }))
              }
              className="px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm"
            />
            <input
              type="text"
              placeholder="State"
              value={filters.state}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, state: e.target.value }))
              }
              className="px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm"
            />
            <input
              type="text"
              placeholder="Country"
              value={filters.country}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, country: e.target.value }))
              }
              className="px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredUsers && filteredUsers.length > 0 ? (
          filteredUsers.map((userItem, index) => {
            const followed = isFollowed(userItem.id);
            return (
              <div
                key={index}
                onClick={() => router.push(`/user-profile/${userItem.id}`)}
                className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm hover:shadow-md transition w-full h-20 flex items-center gap-4 cursor-pointer"
              >
                <div className="flex-shrink-0">
                  <img
                    src={
                      userItem.imageUrl
                        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${userItem.imageUrl}`
                        : "https://th.bing.com/th/id/OIP.hGSCbXlcOjL_9mmzerqAbQHaHa?w=185&h=185&c=7&r=0&o=5&dpr=1.5&pid=1.7"
                    }
                    alt={userItem.name}
                    className="w-14 h-14 object-cover rounded-full"
                  />
                </div>
                <div className="w-1/2">
                  <h3 className="font-medium text-gray-800 truncate">
                    {userItem.name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {userItem.city}, {userItem.state}, {userItem.country}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    followed
                      ? handleUnfollow(userItem.id)
                      : handleFollow(userItem.id);
                  }}
                  className={`text-xs px-3 py-1 rounded-full font-medium transition
                    ${
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
            <p className="text-lg">No users found</p>
            <p className="text-sm">
              Try clearing your filters or explore other users!
            </p>
          </div>
        )}
      </div>
    </SectionContainer>
  );
}

export default AllUser;
