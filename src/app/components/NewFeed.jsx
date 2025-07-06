"use client";

import { useState } from "react";
import styled from "styled-components";
const profile = "/assets/profile.png";


import ModalComponent from "./ModalComponent";

const NweFeed = () => {
  const [isFollow, setIsFollow] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [allStatuses, setAllStatus] = useState([]);
  const [currentPost, setCurrentPost] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [postImage, setPostImage] = useState("");
  return (
    <div style={{ backgroundColor: "#f5f5f5" }}>
      <FeedContainer>
        <LeftSidebar>
          <ProfileCard>
            <ProfileImage src={profile} alt="Profile" />
            <ProfileName>Govind Rajput</ProfileName>
            <ProfileTitle>
              Experienced React developer | JavaScript, TypeScript, Three.js,
              Tailwind CSS, HTML, CSS, Bootstrap
            </ProfileTitle>
            <ProfileMetrics>
              <span>Profile viewers</span>
              <MetricNumber>25</MetricNumber>
            </ProfileMetrics>
            <AnalyticsLink href="#">View all analytics</AnalyticsLink>
            {/* <PremiumOffer>
            Job search smarter with Premium
            <OfferButton>Try for ₹0</OfferButton>
          </PremiumOffer> */}
            <SavedItems>Saved items</SavedItems>
          </ProfileCard>
          <NewsSection>
            <SectionTitle>Categories</SectionTitle>
            <NewsList>
              {newsItems.map((news, index) => (
                <NewsItem key={index}>
                  <NewsTitle>#{news.title}</NewsTitle>
                  {/* <NewsDetails>{news.details}</NewsDetails> */}
                </NewsItem>
              ))}
            </NewsList>
          </NewsSection>
        </LeftSidebar>

        <MainFeed>
          <PostBox>
            <PostInput
              placeholder="Start a post, try writing with AI"
              // onClick={() => {
              //   setModalOpen(true);
              //   setIsEdit(false);
              // }}
            />
            <PostOptions>
              <PostOption>Media</PostOption>
              <PostOption>Event</PostOption>
              <PostOption>Write article</PostOption>
            </PostOptions>
          </PostBox>

          <PostCard>
            <PostHeader>
              <PosterImage src={profile} alt="Poster" />
              <PosterDetails>
                <PosterName>Soniya Prasad</PosterName>
                <PostTitle>Software Engineer 3d</PostTitle>
                {/* <PostTime>3d</PostTime> */}
              </PosterDetails>
              <FollowButton onClick={() => setIsFollow(!isFollow)}>
                {isFollow ? <span> ✓ Following</span> : <span> + Follow</span>}
              </FollowButton>
            </PostHeader>
            <PostContent>
              My interview experience for Software Engineer -1 (Frontend): I
              recently completed a technical interview...
              <img
                src="https://img.freepik.com/premium-photo/cardano-blockchain-platform_23-2150411956.jpg"
                width={550}
                alt="image"
              />
            </PostContent>
            <PostMetrics>
              <LikeButton>Like</LikeButton>
              <CommentButton>Comment</CommentButton>
              <RepostButton>Repost</RepostButton>
              <SendButton>Send</SendButton>
            </PostMetrics>
          </PostCard>
          <ModalComponent
            setStatus={setStatus}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            status={status}
            //   sendStatus={sendStatus}
            isEdit={isEdit}
            //   updateStatus={updateStatus}
            //   uploadPostImage={uploadPostImage}
            postImage={postImage}
            setPostImage={setPostImage}
            //   setCurrentPost={setCurrentPost}
            //   currentPost={currentPost}
          />
        </MainFeed>

        <RightSidebar>
          {/* <NewsSection>
          <SectionTitle>LinkedIn News</SectionTitle>
          <NewsList>
            {newsItems.map((news, index) => (
              <NewsItem key={index}>
                <NewsTitle>{news.title}</NewsTitle>
                <NewsDetails>{news.details}</NewsDetails>
              </NewsItem>
            ))}
          </NewsList>
        </NewsSection> */}
          <JobSection>
            <SectionTitle>Applied Jobs</SectionTitle>
            <JobList>
              {jobs.map((job, index) => (
                <JobCard key={index}>
                  <Logo src={job.logo} alt={job.title} />
                  <JobInfo>
                    <JobTitle>{job.title}</JobTitle>
                    <JobDetails>{job.details}</JobDetails>
                  </JobInfo>
                  {/* <MoreButton>More</MoreButton> */}
                </JobCard>
              ))}
            </JobList>
          </JobSection>
          {/* <PuzzlesSection>
          <QuickBreak>Need a quick break?</QuickBreak>
          <PuzzlesList>
            <PuzzleItem>Queens</PuzzleItem>
            <PuzzleItem>Pinpoint</PuzzleItem>
          </PuzzlesList>
        </PuzzlesSection> */}
        </RightSidebar>
      </FeedContainer>
    </div>
  );
};

const newsItems = [
  {
    title: "React",
    details: "3d ago • 16,394 readers",
  },
  {
    title: "UX-Developer",
    details: "5d ago • 6,977 readers",
  },
  { title: "Frontend", details: "2d ago • 3,047 readers" },
  // More news items...
];

const jobs = [
  {
    logo: "https://www.pymnts.com/wp-content/uploads/2023/05/upwork-earnings.jpg?w=768",
    title: "UX/UI Designer",
    details: "On Upwork you’ll find a range of top freelancers...",
  },
  {
    logo: "https://www.pymnts.com/wp-content/uploads/2023/05/upwork-earnings.jpg?w=768",
    title: "React Developer",
    details: "On Upwork you’ll find a range of top freelancers...",
  },
  // Add more job objects here...
];

export default NweFeed;

// Styled Components
const FeedContainer = styled.div`
  display: flex;
  padding: 20px;
  padding: 1rem 10rem;
`;

const LeftSidebar = styled.div`
  width: 20%;
  padding-right: 20px;
  text-align: center;
`;

const ProfileCard = styled.div`
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
`;

const ProfileName = styled.h2`
  font-size: 1.2em;
  font-weight: bold;
  margin: 10px 0;
`;

const ProfileTitle = styled.p`
  font-size: 0.9em;
  color: #555;
`;

const ProfileMetrics = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
`;

const MetricNumber = styled.span`
  font-weight: bold;
`;

const AnalyticsLink = styled.a`
  color: #0073b1;
  font-size: 0.9em;
`;

const PremiumOffer = styled.div`
  background-color: #f3f2f1;
  padding: 10px;
  border-radius: 8px;
  margin: 10px 0;
  text-align: center;
`;

const OfferButton = styled.button`
  background-color: #ff9a00;
  border: none;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
`;

const SavedItems = styled.div`
  font-size: 0.9em;
  color: #555;
`;

const MainFeed = styled.div`
  width: 50%;
  padding-right: 20px;
`;

const PostBox = styled.div`
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`;

const PostInput = styled.input`
  width: 100%;
  border: none;
  font-size: 1em;
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const PostOptions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const PostOption = styled.span`
  color: #0073b1;
  cursor: pointer;
`;

const PostCard = styled.div`
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const PosterImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const PosterDetails = styled.div`
  flex: 1;
  margin-left: 10px;
`;

const PosterName = styled.h3`
  font-size: 1.1em;
`;

const PostTitle = styled.p`
  color: #777;
`;

const PostTime = styled.p`
  font-size: 0.9em;
  color: #777;
`;

const FollowButton = styled.button`
  background-color: #0073b1;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  height: 40px;
`;

const PostContent = styled.p`
  font-size: 1em;
  color: #333;
  margin-bottom: 15px;
`;

const PostMetrics = styled.div`
  display: flex;
  justify-content: space-between;
`;

const LikeButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #0073b1;
`;

const CommentButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #0073b1;
`;

const RepostButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #0073b1;
`;

const SendButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #0073b1;
`;

const RightSidebar = styled.div`
  width: 25%;
`;

const NewsSection = styled.div`
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 1.2em;
  font-weight: bold;
`;

const NewsList = styled.ul`
  margin-top: 10px;
`;

const NewsItem = styled.li`
  font-size: 0.9em;
  margin-bottom: 8px;
  color: #555;
  list-style: none;
`;

const NewsTitle = styled.h4`
  font-size: 1em;
  font-weight: bold;
  color: #333;
`;

const NewsDetails = styled.p`
  font-size: 0.8em;
  color: #777;
`;

const PuzzlesSection = styled.div`
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
`;

const QuickBreak = styled.h4`
  font-size: 1.1em;
  margin-bottom: 10px;
`;

const PuzzlesList = styled.div`
  display: flex;
  flex-direction: column;
`;

const PuzzleItem = styled.span`
  font-size: 0.9em;
  margin-bottom: 8px;
  color: #0073b1;
  cursor: pointer;
`;

const JobSection = styled.div`
  width: 100%;
`;

// const SectionTitle = styled.h2`
//   font-size: 1.5em;
//   font-weight: 600;
//   margin-bottom: 20px;
// `;

const JobList = styled.div`
  display: flex;
  flex-direction: column;
`;

const JobCard = styled.div`
  display: flex;
  align-items: center;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  margin-top: 10px;
`;

const Logo = styled.img`
  width: 50px;
  height: 50px;
  margin-right: 20px;
`;

const JobInfo = styled.div`
  flex: 1;
`;

const JobTitle = styled.h3`
  font-size: 1.2em;
  font-weight: 600;
`;

const JobDetails = styled.p`
  font-size: 0.9em;
  color: #777;
`;
const MoreButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;
