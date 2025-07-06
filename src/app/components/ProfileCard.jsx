"use client";

import { useState } from "react";
import { Card, Avatar, Row, Col, Button, Typography } from "antd";
import { EnvironmentOutlined, MailOutlined } from "@ant-design/icons";
import FollowerFollowingModal from "./FollowerFollowingModal";
import { useRouter } from "next/navigation";

const { Text, Link } = Typography;

const ProfileCard = ({ userData = {} }) => {
  const user = userData.user || {};
  const {
    name,
    genrate_slug,
    description,
    imageUrl,
    country,
    email,
    cover_image,
  } = user;
  const { total_followers = 0, total_following = 0 } = userData;
  const router = useRouter();

  const [modalType, setModalType] = useState(null); // "followers" or "following"
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  return (
    <Card
      className="profile-card !p-0"
      style={{
        maxWidth: 300,
        margin: "0 auto",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s, box-shadow 0.3s",
        cursor: "pointer",
        border: "1px solid #e6e6e6",
      }}
      cover={
        <div style={{ position: "relative" }}>
          <img
            alt="profile background"
            src={`${cover_image}`}
            style={{
              width: "100%",
              height: 100,
              objectFit: "cover",
              borderRadius: "1.5rem",
              padding: "8px",
            }}
          />
          <Avatar
            size={64}
            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${imageUrl}`}
            style={{
              position: "absolute",
              bottom: -20,
              left: 16,
              border: "2px solid white",
              transition: "box-shadow 0.3s",
            }}
            onMouseOver={(e) => {
              e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
            }}
            onMouseOut={(e) => {
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
      }
      hoverable
      // onClick={() => router.push("/profile")}
    >
      <div style={{ padding: "1rem 0rem" }}>
        <div
          className="follow-wrapper"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: "16px", fontWeight: "bold" }}>
            {name || "No Name Provided"}
          </span>
          {/* <Button
            type="primary"
            shape="round"
            style={{
              backgroundColor: "#1DA1F2",
              borderColor: "#1DA1F2",
              fontWeight: 600,
              transition: "all 0.3s",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#0d8bec";
              e.target.style.borderColor = "#0d8bec";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#1DA1F2";
              e.target.style.borderColor = "#1DA1F2";
            }}
          >
            Details
          </Button> */}
        </div>
        <p className="!mb-0" style={{ color: "#555", fontSize: "14px" }}>
          @{genrate_slug || "N/A"}
        </p>
        <p
          className="!mb-0"
          style={{
            marginTop: 8,
            color: "#888",
            fontSize: "14px",
            lineHeight: "1.5",
          }}
        >
          {description ||
            "Building Websites and Webapps with Seamless User Experience Across Devices."}
        </p>

        <Row
          style={{
            marginTop: 12,
            textAlign: "center",
            borderTop: "1px solid #f0f0f0",
            paddingTop: 12,
          }}
        >
          <Col span={12} onClick={() => openModal("following")}>
            <Text strong style={{ color: "#1DA1F2", fontSize: "16px" }}>
              {total_following}
            </Text>
            <Text style={{ display: "block", fontSize: "14px", color: "#666" }}>
              Following
            </Text>
          </Col>
          <Col span={12} onClick={() => openModal("followers")}>
            <Text strong style={{ color: "#1DA1F2", fontSize: "16px" }}>
              {total_followers}
            </Text>
            <Text style={{ display: "block", fontSize: "14px", color: "#666" }}>
              Followers
            </Text>
          </Col>
        </Row>

        <div
          style={{
            marginTop: 16,
            fontSize: "14px",
            textAlign: "left",
          }}
        >
          <Link href={""} style={{ color: "#1DA1F2" }}>
            <MailOutlined style={{ marginRight: 4 }} />
            {email || "example@example.com"}
          </Link>
          <br />
          <Text
            type="secondary"
            style={{ display: "flex", alignItems: "center", marginTop: 4 }}
          >
            <EnvironmentOutlined style={{ marginRight: 4 }} />{" "}
            {country || "India"}
          </Text>
        </div>
      </div>
      <FollowerFollowingModal
        type={modalType}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </Card>
  );
};

export default ProfileCard;
