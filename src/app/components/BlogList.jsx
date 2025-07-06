import { useState, useEffect, useRef } from "react";
import {
  HeartOutlined,
  HeartFilled,
  MessageOutlined,
  ShareAltOutlined,
  UploadOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import {
  Card,
  Button,
  message,
  Input,
  Modal,
  Form,
  Select,
  Upload,
  Menu,
  Dropdown,
  Progress,
} from "antd";
import moment from "moment";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axios";
import { useAuthContext } from "../../hooks/auth/useAuthContext";
import Loader from "./Loader";
import { useRouter } from "next/navigation";

const { Option } = Select;

export const PostCard = ({ post, userId, onEdit }) => {
  const [likeCount, setLikeCount] = useState(post?.like_count);
  const { likes, following } = useSelector((state) => state.user);
  const isInitiallyLiked = likes.some((likedPost) => likedPost.id === post.id);
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef(null);

  const isFollowed = following.some(
    (following) => following.user_id === post?.user_id
  );
  const [isLiked, setIsLiked] = useState(isInitiallyLiked);
  const [isUserFollowing, setIsUserFollowing] = useState(isFollowed);

  const relativeTime = moment(post?.created_at).fromNow();
  const router = useRouter();
  const { user } = useAuthContext();

  useEffect(() => {
    if (contentRef.current) {
      const el = contentRef.current;
      setIsOverflowing(el.scrollHeight > el.clientHeight);
    }
  }, [post?.content]);

  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem("HomeScroll", window.scrollY.toString());
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleFollow = async (id) => {
    try {
      const response = await axiosInstance.post(`/api/follow/${id}`);
      if (response?.data?.status === "success") {
        setIsUserFollowing(true);
        message.success("You are now following this user!");
      } else {
        message.error("Unable to follow the user. Please try again.");
      }
    } catch (error) {
      console.error("Error following user:", error);
      message.error("Failed to follow the user. Try again.");
    }
  };

  const handleUnfollow = async (id) => {
    try {
      const response = await axiosInstance.post(`/api/unfollow/${id}`);
      if (response?.data?.status === "success") {
        setIsUserFollowing(false);
        message.success("You have unfollowed this user.");
      } else {
        message.error("Unable to unfollow the user. Please try again.");
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
      message.error("Failed to unfollow the user. Try again.");
    }
  };

  const handleLike = async () => {
    try {
      const response = await axiosInstance.post("/api/add_like_unlike", {
        blog_id: post.id,
        user_id: userId,
      });
      if (response.status === 200) {
        const newLikeState = !isLiked;
        setIsLiked(newLikeState);
        setLikeCount((prev) => (newLikeState ? prev + 1 : prev - 1));
        message.success(newLikeState ? "Post liked!" : "Like removed!");
      } else {
        message.error("An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error);
      message.error("Failed to like/unlike the post. Try again.");
    }
  };

  const handleComment = () => {
    router.push(`/posts/${post.id}`);
  };

  const handleShare = () => {
    router.push(`/posts/${post.id}`);
  };

  const dropdownItems = [
    {
      key: "1",
      label: (
        <span onClick={() => router.push(`/user-profile/${post.user_id}`)}>
          View
        </span>
      ),
    },
  ];

  if (user?.id === post?.user_id) {
    dropdownItems.push({
      key: "2",
      label: <span onClick={() => onEdit(post)}>Edit</span>,
    });
  }

  return (
    <div className="bg-white shadow-lg rounded-lg mb-6">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <img
            onClick={() => router.push(`/user-profile/${post.user_id}`)}
            src={
              post?.user?.profile_image ||
              "https://www.pngmart.com/files/23/Profile-PNG-Photo.png"
            }
            alt="Profile"
            className="w-14 h-14 rounded-full object-cover cursor-pointer"
          />
          <div>
            <h5 className="text-base font-semibold">{post?.user?.name}</h5>
            <p className="text-sm text-gray-500">
              <span className="font-medium text-blue-500">React Native</span>
              <span className="ml-2">• {relativeTime}</span>
            </p>
            <p className="text-xs text-gray-400">@{post?.user?.genrate_slug}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {user?.id !== post?.user_id && (
            <Button
              type="primary"
              size="small"
              onClick={() =>
                isUserFollowing
                  ? handleUnfollow(post?.user_id)
                  : handleFollow(post?.user_id)
              }
              className="bg-blue-500"
            >
              {isUserFollowing ? "Unfollow" : "Follow"}
            </Button>
          )}
          <Dropdown menu={{ items: dropdownItems }} trigger={["click"]}>
            <EllipsisOutlined className="text-xl cursor-pointer" />
          </Dropdown>
        </div>
      </div>
      <div className="px-4">
        <div
          ref={contentRef}
          className={`text-sm text-gray-800 overflow-hidden ${
            expanded ? "" : "line-clamp-4"
          }`}
          dangerouslySetInnerHTML={{
            __html: post?.content.replace(/\n/g, "<br />"),
          }}
        />
        {isOverflowing && (
          <button
            className="text-blue-500 text-xs mt-1"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>
      {post && (
        <div className="mb-4">
          {post?.video?.endsWith(".mp4") || post?.video?.endsWith(".webm") ? (
            <video
              controls
              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${post?.video}`}
              className="w-full h-96"
            ></video>
          ) : (
            post?.imageUrl && (
              <img
                src={post?.imageUrl}
                alt="Post Media"
                className="w-full object-contain h-auto"
              />
            )
          )}
        </div>
      )}
      <div className="flex justify-between items-center mt-4 p-4">
        <div className="flex space-x-4">
          <button
            className="flex items-center text-sm text-gray-600 hover:text-red-500"
            onClick={handleLike}
          >
            <span className="mr-1">Like</span>
            {isLiked ? (
              <HeartFilled className="text-red-500" />
            ) : (
              <HeartOutlined />
            )}
            <span className="ml-1">{likeCount}</span>
          </button>
          <button
            className="flex items-center text-sm text-gray-600 hover:text-blue-500"
            onClick={handleComment}
          >
            <span className="mr-1">Comment</span>
            <MessageOutlined />
            <span className="ml-1">{post?.comment_count}</span>
          </button>
        </div>
        <button
          className="flex items-center text-sm text-gray-600 hover:text-green-500"
          onClick={handleShare}
        >
          <span className="mr-1">Share</span>
          <ShareAltOutlined />
        </button>
      </div>
    </div>
  );
};

const BlogPosts = ({ posts, userData = {}, postCreation = true }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [postContent, setPostContent] = useState("");
  const [fileList, setFileList] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editingPost, setEditingPost] = useState(null);

  const user = userData.user || {};

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/blog_category?limit=300"
        );
        setCategories(response?.data?.blog_category?.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        message.error("Failed to load categories.");
      }
    };
    fetchCategories();
  }, []);

  const showModal = () => setIsModalVisible(true);

  const handleCancel = () => {
    setIsModalVisible(false);
    setPostContent("");
    setSelectedCategory(null);
    setFileList([]);
    setUploadProgress(0);
  };

  const handleCategoryChange = (value) => setSelectedCategory(value);

  const handleFileChange = ({ fileList: newFileList }) => {
    if (newFileList.length > 1) {
      message.error("You can only upload one file (photo or video).");
      return;
    }

    const file = newFileList[0]?.originFileObj;
    if (file && file.size > 50 * 1024 * 1024) {
      message.error("File size must not exceed 500MB.");
      return;
    }
    setFileList(newFileList);
  };

  const handleOk = async () => {
    if (!selectedCategory) {
      message.error("Please select a category.");
      return;
    }
    if (!postContent) {
      message.error("Please enter a caption.");
      return;
    }

    const formData = new FormData();
    formData.append("content", postContent);
    formData.append("blog_category_id", selectedCategory);

    const file = fileList[0]?.originFileObj;
    if (file) {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      if (!isImage && !isVideo) {
        message.error("Only photos or videos are allowed.");
        return;
      }
      formData.append(isImage ? "imageUrl" : "video", file);
    }

    try {
      setUploadProgress(0);

      let response;
      if (editingPost) {
        // Update existing post
        response = await axiosInstance.post(
          `/api/blogs/${editingPost.id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            },
          }
        );
        message.success("Post updated successfully!");
      } else {
        // Create new post
        response = await axiosInstance.post("/api/blogs", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        });
        message.success("Post created successfully!");
      }

      console.log("Response:", response.data);

      // Reset everything
      setIsModalVisible(false);
      setPostContent("");
      setSelectedCategory(null);
      setFileList([]);
      setUploadProgress(0);
      setEditingPost(null);
    } catch (error) {
      console.error("Error creating/updating post:", error);
      message.error("Failed to create/update post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setPostContent(post?.content || "");
    // setSelectedCategory(post?.blog_category_id || null);
    setFileList([]);
    setIsModalVisible(true);
  };

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="feed-body">
          {postCreation && (
            <div
              className="create-post flex bg-white p-4 shadow-sm rounded-md gap-3"
              style={{ marginBottom: 16 }}
            >
              <img
                className="w-14 h-14 rounded-full object-cover"
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${user?.imageUrl}`}
                alt="User"
              />
              <Input
                className="rounded-full"
                placeholder="Create New Post..."
                onClick={showModal}
                readOnly
              />
            </div>
          )}

          {posts?.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              userId={user.id}
              onEdit={handleEdit}
            />
          ))}

          <Modal
            title={editingPost ? "Edit Post" : "Create Post"}
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Post"
            cancelText="Cancel"
          >
            <Form layout="vertical">
              <Form.Item label="Select Category">
                <Select
                  placeholder="Choose a category"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  style={{ width: "100%" }}
                >
                  {categories.map((category) => (
                    <Option key={category.id} value={category.id}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Caption">
                <Input.TextArea
                  rows={4}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="What's on your mind?"
                />
              </Form.Item>

              <Form.Item label="Upload Photo/Video">
                <Upload
                  fileList={fileList}
                  onChange={handleFileChange}
                  beforeUpload={() => false}
                  multiple={false}
                >
                  <Button icon={<UploadOutlined />}>Add Photo/Video</Button>
                </Upload>
              </Form.Item>
              {uploadProgress > 0 && (
                <Progress percent={uploadProgress} status="active" />
              )}
            </Form>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default BlogPosts;
