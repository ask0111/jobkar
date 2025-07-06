"use client";

import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../../utils/axios";
import { useAuthContext } from "../../../hooks/auth/useAuthContext";
import SectionContainer from "../../components/SectionContainer";
import {
  LogoutCard,
  PolicyControlCard,
  UserControlCard,
} from "../../components/UserControlCard";
import Qualification from "../../components/Qualification";
import Experience from "../../components/Experience";
import Skill from "../../components/Skill";
import { FiEdit2 } from "react-icons/fi";
import EditProfileModal from "../../components/EditProfileModal";
import { useRouter } from "next/navigation";

const Profile = ({ setIsLogin }) => {
  const [userData, setUserData] = useState();
  const profileImageInputRef = useRef(null);
  const coverImageInputRef = useRef(null);
  const [qualification, setQualification] = useState([]);
  const [editingSkill, setEditingSkill] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState("");
  const router = useRouter();
  const { logout } = useAuthContext();
  const { user } = useAuthContext();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("profile_image", file);

    try {
      await axiosInstance.post("/api/update_profile_image", formData);
      fetchUser();
    } catch (err) {
      console.error("Error uploading profile image", err);
    }
  };

  const handleCoverImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("cover_image", file);

    try {
      await axiosInstance.post("/api/update_cover_image", formData);
      fetchUser(); // Refresh user data to show the new cover
    } catch (err) {
      console.error("Error uploading cover image", err);
    }
  };

  const handleNameUpdate = async () => {
    try {
      await axiosInstance.post("/api/update_profile", {
        name: name,
        user_id: userData?.user?.id,
        email: userData?.user?.email,
        phone: userData?.user?.phone,
        country: userData?.user?.country,
        state: userData?.user?.state,
        city: userData?.user?.city,
        description: userData?.user?.description,
      });
      setEditingName(false);
      fetchUser();
    } catch (err) {
      console.error("Failed to update name", err);
    }
  };

  const fetchUser = async () => {
    console.log("Fetching user data...dddddddddd");
    const res = await axiosInstance.get("/api/user-details");
    setUserData(res?.data?.data);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  
  return (
    <SectionContainer className="profile-page">
      <div className="profile-body">
        <div className="profile-main">
          <div className="profile-header">
            <div className="h-32 relative">
              <img
                alt="profile background"
                src={`${userData?.user?.cover_image}`}
                className="w-full h-full object-cover rounded-[1.5rem] p-2"
              />
              <button
                onClick={() => coverImageInputRef.current.click()}
                className="absolute top-3 right-5 text-white bg-black bg-opacity-40 p-2 rounded-full hover:bg-opacity-60"
              >
                <FiEdit2 size={18} />
              </button>
              <input
                type="file"
                ref={coverImageInputRef}
                className="hidden"
                onChange={handleCoverImageChange}
                accept="image/*"
              />
            </div>
            <div className="profile-info">
              <div className="profile-picture relative">
                <img
                  className="h-full w-full rounded-full object-cover"
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${userData?.user?.imageUrl}`}
                />
                <button
                  onClick={() => profileImageInputRef.current.click()}
                  className="absolute bottom-2 right-2 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-70"
                >
                  <FiEdit2 size={16} />
                </button>
                <input
                  type="file"
                  ref={profileImageInputRef}
                  className="hidden"
                  onChange={handleProfileImageChange}
                  accept="image/*"
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <h2 className="profile-name">{userData?.user?.name}</h2>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-gray-600 hover:text-gray-800"
                  title="Edit Profile"
                >
                  <FiEdit2 size={16} />
                </button>
              </div>
              <p className="profile-title">{user?.description}</p>
              <p className="profile-location">
                {userData?.user?.city}, {userData?.user?.state},{" "}
                {userData?.user?.country}
              </p>
              <div className="flex gap-5 my-2">
                <p className="text-sm text-blue-700 underline">
                  Followers {userData?.total_followers}
                </p>
                <p className="text-sm text-blue-700 underline">
                  Following {userData?.total_following}
                </p>
              </div>
            </div>
          </div>
          <Qualification />

          <Skill />
          <Experience />
        </div>

        <div>
          <UserControlCard />
          <PolicyControlCard />
          <LogoutCard />
        </div>
      </div>
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userData={userData?.user}
        refreshUser={fetchUser}
      />
    </SectionContainer>
  );
};

export default Profile;
