"use client";

import { useState } from "react";

const SkillsSection = ({ isEditing }) => {
  const [skills, setSkills] = useState([
    "JavaScript",
    "React",
    "Node.js",
    "CSS",
    "HTML",
  ]);

  const handleSkillChange = (index, value) => {
    const updatedSkills = skills.map((skill, idx) =>
      idx === index ? value : skill
    );
    setSkills(updatedSkills);
  };

  return (
    <div className="skills-section">
      <h3>Skills</h3>
      <ul>
        {skills.map((skill, index) => (
          <li key={index}>
            {isEditing ? (
              <input
                value={skill}
                onChange={(e) => handleSkillChange(index, e.target.value)}
              />
            ) : (
              skill
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SkillsSection;
