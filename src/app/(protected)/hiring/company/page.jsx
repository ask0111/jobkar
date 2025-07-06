"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../../../../utils/axios";
import SectionContainer from "../../../components/SectionContainer";
import { FaPlus, FaStar } from "react-icons/fa";
import { TbTransferIn } from "react-icons/tb";
import { IoLocationSharp } from "react-icons/io5";
import { MdOutlineWorkOutline } from "react-icons/md";
import { GoClock } from "react-icons/go";
import { GiMoneyStack } from "react-icons/gi";
import moment from "moment";
import { useRouter } from "next/navigation";

function Company() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reqruiterCompany, setReqruiterCompany] = useState([]);
  const [company, setCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("jobs");
  const [jobs, setJobs] = useState([]);
  const [job, setJob] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [ratingForPost, setRatingForPost] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const router = useRouter();

  useEffect(() => {
    const FetchRecruiterCompany = async () => {
      try {
        const response = await axiosInstance.get("/api/companies-by-recruiter");
        if (response.data.status === "success") {
          setReqruiterCompany(response.data.data);
          const companyId = response.data.data.find(
            (item) => item?.status === "accepted"
          );
          fetchCompanyDetails(companyId?.owner_id);
          console.log(companyId, "ddsds");
        } else {
          throw new Error("Failed to fetch companies");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    FetchRecruiterCompany();
  }, []);

  const fetchCompanyDetails = async (companyId) => {
    console.log(companyId, "companyId");
    setIsLoading(true);
    try {
      const companyRes = await axiosInstance.get(`/api/companies/${companyId}`);
      setCompany(companyRes.data?.companies[0]);
      const jobsRes = await axiosInstance.get(`/api/jobs/${companyId}`);
      setJobs(jobsRes.data?.data || []);
    } catch (error) {
      console.log("Error fetching company details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////

  const fetchReviews = async () => {
    try {
      const companyRes = await axiosInstance.get(
        `/api/reviews/company/${company?.id}`
      );
      setRating(companyRes?.data?.total_average_rating);
      setReviews(companyRes?.data?.data?.data);
      console.log(companyRes, "ee");
      // setAllCompany(companyRes.data?.companies);
    } catch (error) {
      console.log("Error fetching co:", error);
    }
  };

  useEffect(() => {
    if (company?.id) {
      fetchReviews();
      fetchJobs();
    }
  }, [company?.id]);

  const submitReview = async () => {
    try {
      await axiosInstance.post("/api/add_review", {
        company_id: company?.id,
        user_id: user?.id,
        rating: ratingForPost,
        review: reviewText,
      });
      setRating(0);
      setReviewText("");
      fetchReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(
        `/api/job-posts/company/${company?.id}`
      );
      setJob(res?.data?.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const getLevelColor = (rating) => {
    if (rating === 5) return "bg-green-500";
    if (rating === 4) return "bg-green-300";
    if (rating === 3) return "bg-yellow-500";
    if (rating === 2) return "bg-orange-500";
    return "bg-red-500";
  };

  const getLevelText = (rating) => {
    if (rating === 5) return "Excellent";
    if (rating === 4) return "Good";
    if (rating === 3) return "Average";
    if (rating === 2) return "Below Average";
    return "Poor";
  };

  const buildLevel = (label, count, totalRatings, rating) => {
    const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
    return (
      <div className="flex items-center gap-3">
        <span className="w-24 text-xs  text-gray-700">{label}</span>
        <div className="w-full bg-gray-200 h-2 rounded-full relative overflow-hidden">
          <div
            className={`h-3 ${getLevelColor(rating)}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="w-6 text-sm font-semibold text-gray-700">{count}</span>
      </div>
    );
  };

  return (
    <div className="">
      <SectionContainer className="min-h-screen">
        {isLoading ? (
          <p className="text-center text-lg font-semibold text-gray-700">
            Loading company details...
          </p>
        ) : company ? (
          <div className="">
            <div className="bg-white shadow-lg rounded-lg">
              <div className="header flex flex-col md:flex-row items-center gap-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6 rounded-lg shadow-md lg:h-40 relative mb-16">
                <div className=" bg-white absolute -bottom-16 rounded-full w-36 h-36 items-center justify-center flex">
                  <img
                    className="w-28 h-28 rounded-full"
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${company?.image_url}`}
                    alt="Company"
                  />
                </div>
              </div>
              <h1 className="text-xl font-semibold text-gray-800 mb-1 px-6">
                {company?.name}
              </h1>
              <p className="text-gray-500 text-sm px-6">{company?.address}</p>
              <div className="flex px-6 py-2">
                <button className="bg-blue-700 text-white text-sm font-semibold rounded-full px-4 py-1 flex items-center gap-1">
                  {" "}
                  <FaPlus />
                  Follow
                </button>
                <button
                  onClick={() => window.open(`${company?.website}`, "_blank")}
                  className=" text-blue-700 border-blue-500 border-2 text-sm font-semibold rounded-full px-4 py-1 ml-3 flex items-center gap-1"
                >
                  Visit webite <TbTransferIn size={18} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-y my-3 shadow-md">
                {[
                  { key: "jobs", label: "Jobs" },
                  { key: "ratings", label: "Ratings" },
                  { key: "about", label: "About" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    className={`py-2 px-4 text-sm font-semibold focus:outline-none border-b-4 transition-colors ${
                      activeTab === tab.key
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-600 hover:text-gray-800"
                    }`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === "about" && (
                <div className="px-6 py-4">
                  <p className="text-gray-700 font-bold text-xl">Overview</p>
                  <p className="text-gray-600 my-2">
                    Founded by Anmol Girdhar and Javleen Kaur in 2021, KnoBee
                    Social India Private Limited is committed to creating
                    genuine connections. KnoBee is the world's first social
                    media platform designed and focused on a families in family
                    network. It is free for all to connect with family, friends,
                    and followers
                  </p>
                  <p className="text-gray-700 font-semibold mt-2">Industry</p>
                  <p className="text-gray-600 ">
                    {company?.industry_type?.name}
                  </p>
                  <p className="text-gray-600 font-semibold mt-3">
                    Company size
                  </p>
                  <p className="text-gray-600">{company?.size}</p>
                  <p className="text-gray-600 font-semibold mt-3">Website</p>
                  <p className="text-blue-700">{company?.website}</p>
                </div>
              )}

              {activeTab === "jobs" && (
                <div>
                  {job?.length > 0 ? (
                    job.map((item, index) => (
                      <div
                        key={index}
                        className="border-b-2 w-full p-4 mb-3 flex gap-3 cursor-pointer"
                        onClick={() => router.push(`/jobs/${item.id}`)}
                      >
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-3">
                            <p className="text-black font-semibold text-lg">
                              {item?.title}
                            </p>
                            <div className="bg-green-600 rounded-md px-2">
                              <p className="text-white text-sm">{item?.type}</p>
                            </div>
                          </div>
                          <div className="flex gap-5">
                            <div className="flex gap-1 items-center">
                              <img
                                className="w-4 rounded-md h-4"
                                alt="company"
                                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${item?.company_details?.image_url}`}
                              />
                              <p className="text-blue-500 text-sm">
                                {item?.company_details?.name}
                              </p>
                            </div>
                            <div className="flex gap-1 items-center">
                              <IoLocationSharp color="green" />
                              <p className="text-xs">
                                {item?.company_details?.city},{" "}
                                {item?.company_details?.state},{" "}
                                {item?.company_details?.country}
                              </p>
                            </div>
                          </div>

                          <p className=" text-gray-700 text-sm line-clamp-2">
                            {item?.description}
                          </p>
                          <div className="flex gap-5 my-1">
                            <div className="flex gap-1 items-center">
                              <MdOutlineWorkOutline color="gray" />
                              <p className="text-xs">{item?.experience}</p>
                            </div>

                            <div className="flex gap-1 items-center">
                              <GoClock color="gray" />
                              <p className="text-xs">
                                {moment(item?.created_at).fromNow()}
                              </p>
                            </div>
                            <div className="flex gap-1 items-center">
                              <GiMoneyStack color="gray" />
                              <p className="text-xs">
                                ₹{item?.min_salary} - ₹{item?.max_salary}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center">No Jobs Found</p>
                  )}
                </div>
              )}

              {activeTab === "ratings" && (
                <div className="px-6 pb-6 pt-4 ">
                  <h2 className="text font-semibold text-gray-700 mb-2 text-center lg:w-1/2">
                    Company Ratings
                  </h2>
                  <div className="text-center mb-6 lg:w-1/2">
                    <p className="text-2xl font-bold">
                      {parseFloat(rating).toFixed(1)}
                    </p>
                    <div className="flex justify-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < rating ? "text-yellow-500" : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <p className="text-gray-500 text-sm">
                      Based on {reviews.length} reviews
                    </p>
                  </div>

                  {/* Rating Breakdown */}
                  <div className="flex flex-col gap-2 lg:w-1/2">
                    {buildLevel(
                      getLevelText(5),
                      reviews.filter((r) => r.rating === 5).length,
                      reviews.length,
                      5
                    )}
                    {buildLevel(
                      getLevelText(4),
                      reviews.filter((r) => r.rating === 4).length,
                      reviews.length,
                      4
                    )}
                    {buildLevel(
                      getLevelText(3),
                      reviews.filter((r) => r.rating === 3).length,
                      reviews.length,
                      3
                    )}
                    {buildLevel(
                      getLevelText(2),
                      reviews.filter((r) => r.rating === 2).length,
                      reviews.length,
                      2
                    )}
                    {buildLevel(
                      getLevelText(1),
                      reviews.filter((r) => r.rating === 1).length,
                      reviews.length,
                      1
                    )}
                  </div>

                  {reviews && (
                    <div>
                      <p className="text-gray-700 font-semibold mb-4  mt-10">
                        Reviews
                      </p>
                      <div className="flex flex-col gap-5">
                        {reviews?.map((item, index) => (
                          <div key={index} className="flex gap-3">
                            <img
                              className="h-12 w-12 rounded-full"
                              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${item?.user?.imageUrl}`}
                            />
                            <div>
                              <div className="flex gap-2 items-center mb-1">
                                <p className="text-sm text-gray-600 font-semibold">
                                  {item?.user?.name}
                                </p>
                                <div className="flex">
                                  {Array(item.rating)
                                    .fill()
                                    .map((_, i) => (
                                      <FaStar
                                        key={i}
                                        className="text-yellow-500"
                                      />
                                    ))}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600">
                                {item?.review}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-10">
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`cursor-pointer ${
                            ratingForPost >= star
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                          onClick={() => setRatingForPost(star)}
                        />
                      ))}
                    </div>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Write a review"
                      className="border p-2 w-full mt-2"
                    />
                    <button
                      onClick={submitReview}
                      className="bg-blue-500 text-white p-2 rounded mt-2 w-full"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-lg font-semibold text-gray-700">
            Company not found.
          </p>
        )}
      </SectionContainer>
    </div>
  );
}

export default Company;
