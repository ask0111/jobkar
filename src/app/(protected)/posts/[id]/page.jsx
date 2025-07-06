"use client";

import { useState, useEffect } from "react";
import {
  HeartOutlined,
  HeartFilled,
  MessageOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Button, Input, message } from "antd";
import { useParams } from "next/navigation";
import axiosInstance from "../../../../utils/axios";
import { useAuthContext } from "../../../../hooks/auth/useAuthContext";
import { useSelector } from "react-redux";
import SectionContainer from "../../../components/SectionContainer";
import { useRouter } from "next/navigation";
import moment from "moment";

const PostDetailPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyComment, setReplyComment] = useState("");
  const { likes } = useSelector((state) => state.user);
  const [allUsers, setAllUsers] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (post && likes) {
      const liked = likes.some((likedPost) => likedPost.id === post.id);
      setIsLiked(liked);
    }
  }, [post, likes]);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await axiosInstance.get(`/api/blog_details/${id}`);
        setPost(response?.data?.blog);
      } catch (error) {
        console.error("Error fetching post details:", error);
        message.error("Failed to load post details.");
      }
    };

    fetchPostDetails();
  }, [id]);

  const FetchUser = async () => {
    try {
      const res = await axiosInstance.get(`/api/users`);
      setAllUsers(res?.data?.data);
    } catch (error) {
      console.log(error, "err");
    }
  };

  useEffect(() => {
    FetchUser();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/comment_list?id=${post?.id}`
      );
      setComments(response.data.blog_comment?.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      message.error("Failed to load comments.");
    }
  };

  useEffect(() => {
    if (post) {
      fetchComments();
    }
  }, [post]);

  const handleLike = async () => {
    try {
      const response = await axiosInstance.post("/api/add_like_unlike", {
        blog_id: id,
        user_id: user.id,
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

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      message.error("Comment cannot be empty.");
      return;
    }

    try {
      await axiosInstance.post("/api/add_comment", {
        blog_id: id,
        user_id: user.id,
        comment: newComment,
      });
      setNewComment("");
      fetchComments();
      message.success("Comment added successfully!");
    } catch (error) {
      console.error("Error adding comment:", error);
      message.error("Failed to add comment. Please try again.");
    }
  };

  const handleReplySubmit = async () => {
    if (!replyComment.trim() || !replyingTo) {
      message.error("Reply cannot be empty.");
      return;
    }

    try {
      await axiosInstance.post("/api/reply_comment", {
        blog_id: id,
        user_id: user.id,
        comment: replyComment,
        parent_id: replyingTo,
      });
      setReplyComment("");
      setReplyingTo(null);
      fetchComments();
      message.success("Reply added successfully!");
    } catch (error) {
      console.error("Error adding reply:", error);
      message.error("Failed to add reply. Please try again.");
    }
  };

  const renderReplies = (replies) => {
    return replies?.map((reply) => (
      <div key={reply.id} className="flex mt-2 ml-8">
        <img
          src={
            "data:image/jpeg;base64,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"
          }
          alt="Commenter"
          className="w-8 h-8 rounded-full object-cover"
        />
        <div>
          <h5 className="text-sm font-semibold">{reply?.user?.name}</h5>
          <p className="text-sm text-gray-700">{reply?.comment}</p>
          <p className="text-xs text-gray-400">
            {moment(reply.created_at).fromNow()}
          </p>
        </div>
      </div>
    ));
  };

  if (!post) return <p>Loading...</p>;

  const formatContent = (content) => {
    if (!content) return "";

    let formattedText = content.replace(/\n/g, "<br />");

    formattedText = formattedText.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">$1</a>'
    );

    return formattedText;
  };

  return (
    <SectionContainer className="p-4 lg:flex gap-5">
      <div className="lg:w-2/3">
        <div className="bg-white shadow-lg rounded-lg">
          <div className="p-4">
            <div className="flex items-center space-x-4">
              <img
                onClick={() => {
                  router.push(`/user-profile/${post.user_id}`);
                }}
                src={
                  post?.user?.profile_image ||
                  "https://www.pngmart.com/files/23/Profile-PNG-Photo.png"
                }
                alt="Profile"
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <h5 className="text-base font-semibold">{post?.user?.name}</h5>
                <p className="text-sm text-gray-500">
                  <span className="font-medium text-blue-500">
                    {post?.category?.name}
                  </span>
                  <span className="ml-2">
                    {moment(post.created_at).fromNow()}
                  </span>
                </p>
              </div>
            </div>

            <p
              className="text-sm text-gray-800 mt-4"
              dangerouslySetInnerHTML={{
                __html: post?.content.replace(/\n/g, "<br />"),
              }}
            />

            {post.video ? (
              <video
                controls
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${post.video}`}
                className="w-full h-96 mt-4"
              ></video>
            ) : (
              post?.imageUrl && (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${post.imageUrl}`}
                  alt="Post Media"
                  className="w-full object-cover h-96 mt-4"
                />
              )
            )}

            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-10">
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
                </button>

                <button className="flex items-center text-sm text-gray-600 hover:text-blue-500">
                  <span className="mr-1">Comment</span>
                  <MessageOutlined />
                  {/* <span className="ml-2">{comments?.length}</span> */}
                </button>
              </div>

              <button className="flex items-center text-sm text-gray-600 hover:text-green-500">
                <ShareAltOutlined />
                <span className="ml-2">Share</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg mt-4 p-4">
          <h4 className="text-lg font-semibold mb-4">Comments</h4>
          <div className="space-y-4">
            {comments?.map((comment) => (
              <div key={comment.id}>
                <div className="flex items-start space-x-4">
                  <img
                    src={
                      "data:image/jpeg;base64,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"
                    }
                    alt="Commenter"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h5 className="text-sm font-semibold">
                      {comment?.user?.name}
                    </h5>
                    <p className="text-sm text-gray-700">{comment?.comment}</p>
                    <p className="text-xs text-gray-400">
                      {moment(comment.created_at).fromNow()}
                    </p>
                    <Button
                      type="link"
                      onClick={() => setReplyingTo(comment.id)}
                      className="text-blue-500"
                    >
                      Reply
                    </Button>
                  </div>
                </div>
                {renderReplies(comment.replies)}
                {replyingTo === comment.id && (
                  <div className="ml-8 mt-2">
                    <Input.TextArea
                      rows={3}
                      value={replyComment}
                      onChange={(e) => setReplyComment(e.target.value)}
                      placeholder="Write a reply..."
                    />
                    <Button
                      type="primary"
                      className="mt-2"
                      onClick={handleReplySubmit}
                    >
                      Submit Reply
                    </Button>
                    <Button
                      type="default"
                      className="mt-2 ml-2"
                      onClick={() => setReplyingTo(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4">
            <Input.TextArea
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
            />
            <Button
              type="primary"
              className="mt-2"
              onClick={handleCommentSubmit}
            >
              Submit Comment
            </Button>
          </div>
        </div>
      </div>
      <div className="lg:w-1/3 border p-5 rounded-md h-fit">
        <p className="text-gray-700 font-semibold">More profiles for you</p>
        <div className="flex flex-col gap-5 mt-5 ">
          {allUsers &&
            allUsers.slice(0, 5)?.map((item, index) => (
              <div
              key={index}
                className={`flex gap-3 pb-2 ${
                  index !== allUsers.length - 1 ? "border-b" : ""
                }`}
              >
                <img
                  src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAsJCQcJCQcJCQkJCwkJCQkJCQsJCwsMCwsLDA0QDBEODQ4MEhkSJRodJR0ZHxwpKRYlNzU2GioyPi0pMBk7IRP/2wBDAQcICAsJCxULCxUsHRkdLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCz/wAARCAEOAP8DASIAAhEBAxEB/8QAHAABAAIDAQEBAAAAAAAAAAAAAAEGBAUHAgMI/8QAQhAAAgIBAgIHBAYIBAYDAAAAAAECAwQFESExBhITQVFhcSIygZEUI2KhorEHM0JDUnKCwSSy4fAVU2NzkvE0wtH/xAAWAQEBAQAAAAAAAAAAAAAAAAAAAQL/xAAWEQEBAQAAAAAAAAAAAAAAAAAAEQH/2gAMAwEAAhEDEQA/AOtgAAAAAAAAAADAytVwcXrRc+0tXDs6tm0/tS5I0eTrOoX7quSohx4Ve/t5zfH5bAWW7Jxcdb33V196U5JSfpHn9xrbtewobqqu219z2VcH8Ze1+Erbbbcm25Pi23u36tkFRt7dezpb9nXTWu7dSnL5tpfcYk9U1Sz3sqxfydWH+RIwwB6nZbNtznOT8ZSbf3nkAAe4W3VPeuycHz3hJr8jwAM2vVdVr5ZM5f8AcUJ/5lv95l1a/mR27Wqmxd7j1q5P72vuNOALPTruBPZWxtpfi114fOPH7jZVX498etTbCyO2+8JJ7eqXEoxMZThJThKUZripQbjJfFcQL4Cr42t5tO0btr4L+L2bEvKS/ujeYmo4WXsq7OrZ/wAqzaM/h3P4MiswAAAAAAAAAAAAAAAAA1Wo6tXiuVNG1mRyb5wqf2tub8v/AEwzcrMxsOHXumlvv1YR4znt/DErmZq+Zlbwg3TS+HVg/bkvtyX5L7zAtttunKy2cp2S4ylJ8f8A8PBUAAAAAAAAAAAAAAAAAAAHh67ryYAG1w9ayaOrDI3uq4Ld/rYryk+fx+ZYsfJx8mtWU2RnHhvt70X4SXNMpB9aMi/GsVtM3Ca57cpLwkuTQF4BrtP1SjMXZy2ryEt3Df2ZeLg/7GxIoAAAAAAAAAaHV9TcXPEx5bS4xvsi+XjXFrv8fl6A1PV2nPHxJceMbbovl3ONbX3v/wBrQAFQAAAAAAAAAAAAAAAAAAAAAAAAAAEpuLTTacWnFxezTXJplk0vVVf1cfJaV/KufJW+T+1+ZWh/7AvoNPpWqfSNsbIl9fFfVzf76K8ftLvNwRQAAAD4ZeTXiUW3T5RW0Y77Oc3yivUDB1bUPotfY1P/ABFsea/dwfDrer7v9ONXPpdbbfbZdbLrWWScpP8AJLyXJHzKgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACYylGUZRbjKMlKMo8GpLimmWzTM9ZtPt7LIq2VsVw335TS8GVI+2Nk24l9d9fFx4Sj3Tg+cX6gXcHzpurvqrure8LI9aL/s/PxPoRQq2s5n0jI7GD+px24rblKzlKXw5L4+JvNSy/omJbOL2sn9VT/PJc/hxZTyoAAAAAAAAAAAAeLbaceq2/IthVRUutbZY9oxXJcuLb7kuLA98XwXFvlsYWdquk6c3HLyoxtX7ipdrf8YR5fFoqmrdKcvKdlGnOeLi+67d9sq5eLkn7K8lx8X3Kt+Pm935vxZcRccjpnUt1iae5Lkp5du3x6lK/wDuYEumGsv3acCHkqbJffOxldILBZIdMNYW3XowJrw7KyH3wmZ+P0yx5NLLwbK0+c8axWJf0WJP8RTCRB1HD1HTdQX+Dya7ZJbyr4wuivOue0vluZZySMpwlGcJSjODTjKLalF+Ka4lo0npVbW4Y+qN2VPaMcpL62v/ALqXvLxfP1JBcwRGULIQsrlGdc4qcJwalGUXxTi1w2JIoAAAAAAAAAAN1oeZ1LXiWP2LW5U791m27j8f7eZYyhxlKEoyi9pxkpRa5qUXumXTDyY5eNTetk5x9tfwzXCS+YFf1zI7XLVKfsY0eq/B2T2lJ/kvgao9TnKyc7JveU5SnJ+MpPds8gAAAAAAAAAABEp11wtttnGuqqErLbJe7CEVu5M53rmtXatftHrV4NMn9Fpb4vu7W3bnN/cuHrt+l2pyTr0qmXspQvzmnzk/arqe3gvafm14FRNYgCCQBBJAAkgkAAQBvtA1yWm2rGyJN6fbL2t939GnJ/rI/Z/iXx5rjf1xSaaaa3TTTTT5NNHIy7dFNTd9E9OulvZixU8ZvnLH326v9D4ejXgBZgAZUAAAAAAAANzoeZCmWRRbLaE0roN8lJbRkvjw+RpiNt9uLW3gBIAAAAAAAAAAHmdtdFdt9v6qiuy+z+SuLm18dtj0anpJa6dE1DZ7O6VGMtvCyxSl9yZRz7Ivtyr8jJte9uRbO6b+1N7tfDkfEkGkQSAQCCQBBIAAgkAQZem5jwM7Cy0/ZptXa+dM/YsXye/wMUjbfdPk1s/iB13h3cV3PxBgaPfLJ0rSrpPeUsWqM34yrXZv8jPIoACAAAAAAAAAAAAAAAAAAABX+lzf/CaV3PUKN/hVaywGk6U1uzRrpLnTlYtr/l3lU/8AMio58CAaEggkgAEASCCQABAEggkDofRl76Jp/lLKXwWRYbk1fR+uVWi6TGXOVHbPfh+tnK3+5tCaAAIoAAAAAAAAAAAAAAAAAABj52N9Mws7E4b5GPZXDf8A5m3Wh96RkDiuXPuA5Hs1umtmm00+5rg0Qb7pPp30PUJXwjtj5zldDZcI3b/WQ+ftL+byNCaQJIJAEEkACSCQBBJAA91U2ZFtGNXxsyba6Ietj6u/w5/A8Fm6Jae7sq3UbI/VYnWpx9/28icdpSX8qe3rLyAutdcKq6qoe5VCFcF4RhFRR6AMqAAAAAAAAAAAAAAAAAAAAAAAAxNRwKNTxLcS72ettOqzbd1Wx36s1+TXemc0ysXJw77cbJg4XVS2kuaafKUX3xfNM6sa3VtIxNWpUbPq8itP6PkRW8ob8erJd8X3r4rzuI5oSZWdp+dp13Y5dTg5b9nNcarUu+uff6c/IxSgQSAIJAAEEmZp2mZ+q2uvFglXB7XZFifYU+Ta5y8Evu5geMDBytSyq8TH4Sl7VtjW8aKt9nZL+y73w9OmYmLj4WNRi48erTRDqR34yfe5Sfi3u36nw0zTMPSsfsMdNyk1O+6e3aXWcutJru8FyX55xNAAEUAAAAAAAAAAAAAAAAAAAAAAAAAAHzuoxsmqdGRTXdTP3oWxUovz9fMrGb0Pqk5T07JdXN9jldadfpGyPtL4plrBRzbI0DXsdvr4NtkV+3iuN0flB9b8JgToya3tZj5MH4Toui/vidYJ3l4v5sVHJYU5NjSrx8mbb29ii6XH4RNhj9H9fydurgzqi/28uUaI+u0t5/hOlby8X8yBRVsHofjVuNmo3vIlwboo61VHpKT+sf4SzV1U0111U1wrqrXVhXXFRhFeCjHgewFAAQAAAAAAAAAAAAAH0vplRddTL3qpyg/NLk/jzPmbvXsbq21ZUVwsSqs/nivZb9Vw+BpAAAAAAAAAAASbaSTbfJLiwAMTL1PSsDrLLzKa5r91F9pd6dnXu/nsaPI6ZYcN1h4Ntz47TypqqPr1K+tL8SLBZwk3yTfomyg39LNet3VUsbGjzXYURcl/Vd1ma67V9av37XUc2W/d284r5QaQiOouE1zjJeq2/M8NwXOypetla/NnJpWWzbc7LJvxnOUn+JnjZeC+RYOupxfKdb9LIP8AJnpQm+UZP0Tf5HINl4L5HuNlsHvCyyD8YTlF/hYg6001zTXrwBzGnWNco27LUcxJd0rZTj/42bo2NHSzXKtu1+i5Ef8Aq0qEv/Klx/IkF9BWcbphgT2WXiXUPfjOiSugv6X1ZfmbzE1DTc9f4PKpulz6kZdW1etc9p/cRWUAAAAAAAAAAB6rrttmoVRcpNN7Luiub/L5nksHR/G2hflyX6x9jVv/AAQftNer4f0gbbLx4ZWPdRL9uPsN/szXGMilSjKE5wmnGcJShNPukns0Xwr2u4XVksytezPaF+y5S5Rm/Xk/9SK0YAKgAAASbaSTbb2SXNs8W20Y9Vt+RbGqiqPWtssfsxXcuHFt9yXFlJ1fpPlZfXx8Dr42I94yn7uTevtyT9mL8E/VvkUWPUukGlaa5VubycqO6dGNJNQfhbbxivTi/IqOf0k1jOU4K36Njy3XY4jlBNeE7N+u/nt5GnBUP9sgkAQSAAIJAEEgACCQACbTTTaa4pp7NPya4gAbzA6T6vidWF01l0Lh1Mlt2RX2Ll7Xz3LdputaZqe0KbHXkbcca7aNrf8A03ykvTj5HNQns002mmmmuDTXJpgdcBS9J6U21OGPqjlbTyjlcZXVru7VL3o+fP15FyhOFkIWVzjOuyKnXODUozi+Ti1wMj0AAoAAPdNVmRbVRX79s1CL/h73J+i3fwLtTTXRVVTWtoVQjCK8ktt2afQsJxhLNsW0rY9ShNcqubn/AFfkvM3hAPFlddsLK7IqUJxcZJ96Z7AVS8zEsw750y3cfernt78Hyfr3Mxi45+FDNodb2jZFuVM3+zLwfk+//QqFldlU512RcZwl1ZRfNMqPJ4utox6bsjIsVdFMevbN9y5bJd7fJLvbPaTbSS3beyXi2UXpPq/0zJ+g4898PDm1Nx5X5K3jKe/eo+7H4vvKMLWdZydWuXB1YdTf0bH336vd17Guc33vu5Lz1QBUQAAJIJIAEkEgCCSABJBIAgkgASQSBBJBIA3Oh65bpdiqt61mBZLeytcZUyfO2pf5l3+vPSkgdbhOuyFdlc4zrshGcJwe8Zwkt1JPwZJTOiurSrsWl3y+qucpYbf7Fr9qVXpLi157/wARcyaBmadhSzshQe/YV7SyJLw7q0/GX5GPRRdk210Ux3sm+/3YxXOUvJf75lxw8SrDohRXx23lOT2UrJvnKW3+/kRX3SUUkkkktklwSS7kiQCKAAAa3U9NjmQ7SvaOTCO0W+Csjz6kv7M2QA5nrmZZpenZ1vGGT/8AEoUuEo3W7rfbxit38EcyO5dLui66RYcOwuVGdjSlbjuW/Y3Nx6vUvSW/o1y81wfFMvEzMDJvw82iyjKoko21WraS35NNcGn3NNpmsZ18AAUQAAJIJIAEkEgCCSABJBIAgkgASQSBBJBIEEkElExlOMozhJxnCUZwkucZxalGS9GdT0rInquLgXUQ61uVBb1x/Ztj7Ni38E092c107TtS1bLqwdOx5X5NntNcq6a99nbfPlGK+/kk29juXRno7R0d0+GKrnkZE5StyL5LZOc9nKFUe6C7lv5vi+GdMZ+nafXg1Nbqd9mzus257cox+yu7595nAGWgAAAAAAAA0mv9G9J6Q46qzIOF9cWsXLp2V9DfHZNrZxffF8PR8VuwB+f9e6N6z0eu6ubWp4s5dWjNpUnj278oyb4xl9l/BvmaY/St1GPk1W0ZFVd1FsXC2q2MZ1zi+alGS2aOca/+jaMnZk9HrIwfGUsDJm+yfftj3Pdr0luvNI1UjmIPvl4edgXyxc7GuxcmO/1WRBwk0v2oP3WvNNo+BUAAAAAAAAAAAAAAAAADK0/TtU1W/wCi6ZiXZd6aU1Ul2dW/fdbLaEV6sDFLB0c6J6z0jnCymLxtNUtrc+6D6stuDjiwfvvz91eL5O66B+jbCxnXla/OvNvW0o4dXW+g1vmu0ctpTa80l5PmdCjCEIwhCMYwglGEYpKMYrgkkuGxN1Y1ui6FpOg4ixNPo6kW1K62x9e/IsS9+6zbdvw7l3JLgbQAyoAAAAAAAAAAAAAAADDz9N0zVKHjahiUZNDe6hfBS6r/AIoS95PzTRQdW/RhTLr26JnSqfFrF1DrWVekL4/WL4qR0oCj896l0c6SaR1nn6bkQqj+/oj9IxtvHtKd0vikalSjJbxkpLxi0/yP00abUOi/RbU3KebpWHO2W+91cOxvb8e1pcZ/eaqR+fiTrWX+i/Qrd3hahqOI291Gbqya18LIqf4zSZP6Ltar60sbVtPugk39fTfRLZecHYi1FAIMzUMDI026dORKqU4tpulyceHh1op/cYSkn4lEknlyS8TZ6Zo+dq1sKcWePGU2op5ErIxTf8kZMDXA6Dj/AKLNXm19L1jCqXesbGuult5OycF9xu8P9GHRyrqvNzNRzJLnF2Qxqn/TRFT/ABmaRyGUoR2UpJN8k3xfklzN3pnRbpVq/UliaZfCmWz+kZyeJRs+9O1dd/CDO16d0d6N6U09P0vComuVsalO/wCNtm9n4jairHOtJ/Rjp9XUt1vMszJrZvGxetj4m/hKW/ay+cfQvuJh4OBRXjYWNRjY8Pdqx6411rz6sVtv4mQDKgAAAAAAAAAA/9k="
                  className="h-16 w-16 rounded-full"
                  alt="img"
                />
                <div>
                  <p className=" font-semibold text-sm text-gray-700">
                    {item?.name}
                  </p>
                  <p className="  text-sm text-gray-700">
                    {item?.city}, {item?.state}
                  </p>
                  <button
                    onClick={() => {
                      router.push(`/user-profile/${item?.id}`);
                    }}
                    className="my-3 border-2 border-gray-500 text-gray-500 text-sm font-semibold rounded-full px-4 py-1 flex items-center gap-1"
                  >
                    {" "}
                    View Profile
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </SectionContainer>
  );
};

export default PostDetailPage;
