import React, { useState } from "react";

const ExperienceSection = ({ isEditing }) => {
  const [experiences, setExperiences] = useState([
    {
      id: 1,
      role: "Software Engineer",
      company: "ABC Corp",
      period: "Jan 2020 - Present",
    },
    {
      id: 2,
      role: "Web Developer",
      company: "XYZ Solutions",
      period: "Jun 2018 - Dec 2019",
    },
  ]);

  const handleExperienceChange = (index, field, value) => {
    const updatedExperiences = experiences.map((exp, idx) =>
      idx === index ? { ...exp, [field]: value } : exp
    );
    setExperiences(updatedExperiences);
  };

  return (
    <div className="experience-section">
      <h3>Experience</h3>
      {experiences.map((experience, index) => (
        <div key={experience.id} className="experience-item">
          {isEditing ? (
            <>
              <input
                value={experience.role}
                onChange={(e) =>
                  handleExperienceChange(index, "role", e.target.value)
                }
              />
              <input
                value={experience.company}
                onChange={(e) =>
                  handleExperienceChange(index, "company", e.target.value)
                }
              />
              <input
                value={experience.period}
                onChange={(e) =>
                  handleExperienceChange(index, "period", e.target.value)
                }
              />
            </>
          ) : (
            <>
              <h4>{experience.role}</h4>
              <p>{experience.company}</p>
              <p>{experience.period}</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExperienceSection;
