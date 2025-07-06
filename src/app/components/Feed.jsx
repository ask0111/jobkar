import React from "react";
import "./Feed.scss";

const Feed = () => {
  const posts = [
    {
      user: "Theresa Steward",
      timestamp: "9:34 AM",
      content: `What did the Dursleys care if Harry lost his place on the House Quidditch team because he hadn’t practiced all summer? What was it to the Dursleys if Harry went back to school without any of his homework done?`,
      readMore: true,
      likes: 43,
      comments: 9,
      shares: 0,
    },
    {
      user: "Kyle Fisher",
      timestamp: "1:34 PM",
      content: `How’s your day going, guys?`,
      image:
        "https://cdn.prod.website-files.com/62d84e447b4f9e7263d31e94/6557420216a456cfaef685c0_6399a4d27711a5ad2c9bf5cd_ben-sweet-2LowviVHZ-E-unsplash-1-p-1080.jpg",
      likes: 3,
      comments: 5,
      shares: 0,
    },
    {
      user: "Brandon Wilson",
      timestamp: "Yesterday, 10:14 PM",
      content: `There is some new guidelines for iOS`,
      links: [
        { title: "IOS 11 guidelines for UX/UI designers", url: "#" },
        { title: "IOS 11 guidelines for developers", url: "#" },
      ],
      likes: 69,
      comments: 7,
      shares: 0,
    },
    {
      user: "Audrey Alexander",
      timestamp: "1 day ago",
      content: `The bun runs along the road and meets a wolf. “Little bun, little bun, I want to eat you!,” says the wolf.`,
      likes: 0,
      comments: 0,
      shares: 0,
    },
  ];

  return (
    <div className="feed-container">
      <div className="feed">
        <div className="new-post">
          <input type="text" placeholder="What’s on your mind?" />
          <button className="post-btn">Post 0000000000000000</button>
        </div>

        <div className="sort-options">
          <p>
            SORT BY: <span>Trending</span>
          </p>
        </div>

        {posts.map((post, index) => (
          <div key={index} className="post">
            <div className="post-header">
              <div className="user-info">
                <p>{post.user}</p>
                <span>{post.timestamp}</span>
              </div>
            </div>

            <div className="post-content">
              <p>{post.content}</p>
              {post.readMore && <p className="read-more">READ MORE</p>}
              {post.image && <img src={post.image} alt="Post" />}
              {post.links && (
                <ul>
                  {post.links.map((link, i) => (
                    <li key={i}>
                      <a href={link.url}>{link.title}</a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="post-actions">
              <span>👍 {post.likes}</span>
              <span>💬 {post.comments}</span>
              <span>🔄 {post.shares}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="sidebar">
        <div className="user-profile">
          <img src="/assets/user.png" alt="User" />
          <h4>Dmitry Karapov</h4>
          <p>Founder & CEO at Interaction Design Foundation</p>
        </div>

        <button className="write-article">Write New Article</button>

        <div className="groups-section">
          <h4>My Groups</h4>
          <ul>
            <li>Moscow State Linguistic University</li>
            <li>Digital Freelancers</li>
            <li>Interaction Design Association</li>
            {/* Add more groups as needed */}
          </ul>
        </div>

        <div className="hashtags-section">
          <h4>Followed Hashtags</h4>
          <ul>
            <li>#books</li>
            <li>#illustration</li>
            <li>#freelance</li>
            {/* Add more hashtags as needed */}
          </ul>
        </div>

        <div className="trending-articles-section">
          <h4>Trending Articles</h4>
          <ul>
            <li>How I make cool design</li>
            <li>Advice for young illustrators</li>
            <li>A little about usability testing</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Feed;
