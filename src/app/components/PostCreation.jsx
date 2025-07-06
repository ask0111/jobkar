"use client";

import { useState } from "react";
import { Avatar, Button, Input, Upload } from "antd";
import { AiOutlinePicture } from "react-icons/ai"; // Image icon from react-icons
import { ImSpinner2 } from "react-icons/im"; // Loading icon from react-icons

const PostCreation = ({ user, setIsPanelOpen, setSelectedCategory }) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const resetForm = () => {
    setContent("");
    setImage(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.file.originFileObj;
    setImage(file);
    if (file) {
      readFileAsDataURL(file).then(setImagePreview);
    } else {
      setImagePreview(null);
    }
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="post-creation">
      <div className="post-creation-header">
        {/* <Avatar
          src={
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${user?.user.imageUrl}` ||
            "/avatar.png"
          }
          alt={user?.user.name}
          size={60}
          className="post-creation-avatar"
        /> */}
        <Input.TextArea
          placeholder="What's on your mind?"
          className="post-creation-input"
          autoSize={{ minRows: 3 }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {imagePreview && (
        <div className="post-creation-image-preview">
          <img src={imagePreview} alt="Selected" />
        </div>
      )}

      <div className="post-creation-footer">
        <Upload
          accept="image/*"
          showUploadList={false}
          onChange={handleImageChange}
          className="post-creation-upload"
        >
          <Button icon={<AiOutlinePicture />}>Photo</Button>
        </Upload>
        <Button
          onClick={() => {
            setIsPanelOpen(true);
            setSelectedCategory(null);
          }}
        >
          Change Category
        </Button>

        <Button
          type="primary"
          loading={false} // Use loading={isLoading} if using loading state
          //   onClick={handlePostCreation}
          className="post-creation-button"
        >
          {false ? <ImSpinner2 className="loading-icon" /> : "Share"}
        </Button>
      </div>
    </div>
  );
};

export default PostCreation;
