import React, { useState } from "react";

const AboutSection = ({ isEditing }) => {
  const [aboutText, setAboutText] = useState(
    "Enthusiastic software engineer with a passion for developing innovative programs."
  );

  return (
    <div className="about-section">
      <h3>About</h3>
      {isEditing ? (
        <textarea
          value={aboutText}
          onChange={(e) => setAboutText(e.target.value)}
        />
      ) : (
        <p>{aboutText}</p>
      )}
    </div>
  );
};

export default AboutSection;
