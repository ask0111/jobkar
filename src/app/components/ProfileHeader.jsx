"use client";

import { useState } from "react";

const ProfileHeader = ({ isEditing }) => {
  const [name, setName] = useState("John Doe");
  const [title, setTitle] = useState("Software Engineer at ABC Corp");
  const [location, setLocation] = useState("San Francisco, CA");

  return (
    <div className="profile-header">
      <img
        className="cover-photo"
        src="https://via.placeholder.com/850x200"
        alt="Cover"
      />
      <div className="profile-info">
        <img
          className="profile-photo"
          src="https://via.placeholder.com/150"
          alt="Profile"
        />
        <div className="profile-details">
          {isEditing ? (
            <>
              <input value={name} onChange={(e) => setName(e.target.value)} />
              <input value={title} onChange={(e) => setTitle(e.target.value)} />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </>
          ) : (
            <>
              <h2>{name}</h2>
              <p>{title}</p>
              <p>{location}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
