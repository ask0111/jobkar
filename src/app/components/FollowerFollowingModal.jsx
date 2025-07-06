import React, { useState, useEffect } from "react";
import { Modal, List, Avatar, Spin } from "antd";
import axios from "axios";
import { useAuthContext } from "../../hooks/auth/useAuthContext";

const FollowerFollowingModal = ({ type, visible, onClose }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();

  useEffect(() => {
    if (!type || !visible) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const endpoint =
          type === "followers"
            ? `/api/followers/${user?.id}`
            : `/api/following/${user?.id}`;

        const response = await axios.get(
          process.env.NEXT_PUBLIC_API_BASE_URL + endpoint
        );
        setData(
          type === "followers"
            ? response.data.followers
            : response.data.following
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [type, visible]);

  return (
    <Modal
      title={type === "followers" ? "Followers" : "Following"}
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      {loading ? (
        <Spin size="large" />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item) => {
            const user = type === "followers" ? item.follower : item.user;
            return (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={
                        user.imageUrl
                          ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${user.imageUrl}`
                          : "/default-avatar.png"
                      }
                    />
                  }
                  title={user.name}
                  description={user.description || "No description available"}
                />
              </List.Item>
            );
          }}
        />
      )}
    </Modal>
  );
};

export default FollowerFollowingModal;
