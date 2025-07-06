"use client";

import { useState } from "react";
import ProfileHeader from "./ProfileHeader";
import AboutSection from "./AboutSection";
import ExperienceSection from "./ExperienceSection";
import SkillsSection from "./SkillsSection";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => setIsEditing(!isEditing);

  return (
    <div className="profile-page">
      <button onClick={toggleEditing} className="edit-button">
        {isEditing ? "Save" : "Edit Profile"}
      </button>
      <ProfileHeader isEditing={isEditing} />
      <AboutSection isEditing={isEditing} />
      <ExperienceSection isEditing={isEditing} />
      <SkillsSection isEditing={isEditing} />
    </div>
  );
};

export default ProfilePage;
