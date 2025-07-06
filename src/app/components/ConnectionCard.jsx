import React from "react";

const ConnectionCard = ({ name, role, image }) => {
  return (
    <div className="connection-card">
      <div className="person-info">
        <img src="/assets/image.png" alt={name} className="profile-picture" />
        <h3>{name}</h3>
        <p>{role}</p>
        <button className="connect-btn">Connect</button>
      </div>
    </div>
  );
};

export default ConnectionCard;
