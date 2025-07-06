"use client";

import { useState } from "react";
import { Card, Avatar, Button, Input, Modal, Typography, List } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

const NewProfilePage = () => {
  const [isEditing, setIsEditing] = useState({
    about: false,
    experience: false,
    education: false,
    skills: false,
  });
  const [profileInfo, setProfileInfo] = useState({
    name: "Govind Rajput",
    title: "Experienced React Developer",
    location: "Noida, Uttar Pradesh, India",
    about:
      "I am a skilled Frontend Developer proficient in React.js and TypeScript, seeking exciting opportunities.",
    skills: ["React", "Redux", "JavaScript", "TypeScript", "SASS"],
    experience: [
      {
        title: "Frontend Developer",
        company: "Instant Systems Inc",
        duration: "Jul 2022 - Feb 2024",
        location: "Noida, India - Hybrid",
        description: "Responsive Web Design, HTML5, CSS, JavaScript, React.js",
      },
    ],
    education: [
      {
        school: "Rajkiya Engineering College Sonbhadra",
        degree: "Bachelor of Technology, Electrical Engineering",
        duration: "Jul 2016 - Sep 2020",
      },
    ],
  });

  const [editData, setEditData] = useState(profileInfo);

  const handleEdit = (section) => {
    setIsEditing((prev) => ({ ...prev, [section]: true }));
  };

  const handleSave = (section) => {
    setProfileInfo(editData);
    setIsEditing((prev) => ({ ...prev, [section]: false }));
  };

  const handleCancel = (section) => {
    setEditData(profileInfo);
    setIsEditing((prev) => ({ ...prev, [section]: false }));
  };

  return (
    <div className="profile-page">
      {/* Banner Section */}
      <div className="banner">
        <img
          src="https://via.placeholder.com/800x200"
          alt="Banner"
          className="banner-image"
        />
      </div>

      {/* Profile Section */}
      <Card className="profile-card">
        <Avatar size={100} src="https://via.placeholder.com/150" />
        <div className="profile-info">
          <Title level={2}>{profileInfo.name}</Title>
          <Paragraph>{profileInfo.title}</Paragraph>
          <Paragraph>{profileInfo.location}</Paragraph>
        </div>
        <Button icon={<EditOutlined />} onClick={() => handleEdit("about")}>
          Edit Profile
        </Button>
      </Card>

      {/* About Section */}
      <Card
        title="About"
        extra={<EditOutlined onClick={() => handleEdit("about")} />}
      >
        {isEditing.about ? (
          <div>
            <TextArea
              rows={4}
              value={editData.about}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, about: e.target.value }))
              }
            />
            <Button onClick={() => handleSave("about")}>Save</Button>
            <Button onClick={() => handleCancel("about")}>Cancel</Button>
          </div>
        ) : (
          <Paragraph>{profileInfo.about}</Paragraph>
        )}
      </Card>

      {/* Experience Section */}
      <Card
        title="Experience"
        extra={<EditOutlined onClick={() => handleEdit("experience")} />}
      >
        {isEditing.experience ? (
          <div>
            <TextArea
              rows={4}
              value={editData.experience
                .map((exp) => `${exp.title} at ${exp.company}`)
                .join("\n")}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  experience: e.target.value
                    .split("\n")
                    .map((item) => ({ title: item.split(" at ")[0] })),
                }))
              }
            />
            <Button onClick={() => handleSave("experience")}>Save</Button>
            <Button onClick={() => handleCancel("experience")}>Cancel</Button>
          </div>
        ) : (
          <List
            dataSource={profileInfo.experience}
            renderItem={(exp) => (
              <List.Item>
                <div>
                  <strong>{exp.title}</strong> - {exp.company}
                  <br />
                  {exp.duration} | {exp.location}
                  <br />
                  {exp.description}
                </div>
              </List.Item>
            )}
          />
        )}
      </Card>

      {/* Education Section */}
      <Card
        title="Education"
        extra={<EditOutlined onClick={() => handleEdit("education")} />}
      >
        {isEditing.education ? (
          <div>
            <TextArea
              rows={4}
              value={editData.education
                .map((edu) => `${edu.degree} from ${edu.school}`)
                .join("\n")}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  education: e.target.value
                    .split("\n")
                    .map((item) => ({ degree: item.split(" from ")[0] })),
                }))
              }
            />
            <Button onClick={() => handleSave("education")}>Save</Button>
            <Button onClick={() => handleCancel("education")}>Cancel</Button>
          </div>
        ) : (
          <List
            dataSource={profileInfo.education}
            renderItem={(edu) => (
              <List.Item>
                <div>
                  <strong>{edu.school}</strong> - {edu.degree}
                  <br />
                  {edu.duration}
                </div>
              </List.Item>
            )}
          />
        )}
      </Card>

      {/* Skills Section */}
      <Card
        title="Skills"
        extra={<EditOutlined onClick={() => handleEdit("skills")} />}
      >
        {isEditing.skills ? (
          <div>
            <TextArea
              rows={4}
              value={editData.skills.join(", ")}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  skills: e.target.value.split(", "),
                }))
              }
            />
            <Button onClick={() => handleSave("skills")}>Save</Button>
            <Button onClick={() => handleCancel("skills")}>Cancel</Button>
          </div>
        ) : (
          <List
            dataSource={profileInfo.skills}
            renderItem={(skill) => <List.Item>{skill}</List.Item>}
          />
        )}
      </Card>
    </div>
  );
};

export default NewProfilePage;
