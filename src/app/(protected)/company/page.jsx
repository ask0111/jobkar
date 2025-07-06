"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import moment from "moment";
import Link from "next/link";

import { FaPlus, FaStar } from "react-icons/fa";
import { TbTransferIn } from "react-icons/tb";
import { IoLocationSharp } from "react-icons/io5";
import { MdOutlineWorkOutline } from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";
import { GoClock } from "react-icons/go";

import axiosInstance from "@/utils/axios";
// import { SectionContainer } from "@/components/common/SectionContainer";
import { useAuthContext } from "@/hooks/auth/useAuthContext";
// import CompanyRegistrationDialog from "@/app/company/CompanyRegisterDialog";

const CompanyPage = () => {
  const [company, setCompany] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [ratingForPost, setRatingForPost] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [job, setJob] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("jobs");
  const [isCompany, setIsCompany] = useState(true);

  const { user } = useAuthContext();
  const router = useRouter();
  const params = useParams();
  const companyId = user?.id;

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get(`/api/companies/${companyId}`);
        setCompany(res.data?.companies[0]);
      } catch (err) {
        console.error("Company fetch error", err);
        setIsCompany(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (companyId) fetchCompanyDetails();
  }, [companyId]);

  useEffect(() => {
    if (company?.id) {
      fetchReviews();
      fetchJobs();
    }
  }, [company?.id]);

  const fetchReviews = async () => {
    try {
      const res = await axiosInstance.get(`/api/reviews/company/${company?.id}`);
      setRating(res.data?.total_average_rating);
      setReviews(res.data?.data?.data);
    } catch (err) {
      console.error("Review fetch error", err);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await axiosInstance.get(`/api/job-posts/company/${company?.id}`);
      setJob(res.data?.data);
    } catch (err) {
      console.error("Job fetch error", err);
    }
  };

  const submitReview = async () => {
    try {
      await axiosInstance.post("/api/add_review", {
        company_id: company?.id,
        user_id: user?.id,
        rating: ratingForPost,
        review: reviewText,
      });
      setReviewText("");
      setRatingForPost(0);
      fetchReviews();
    } catch (err) {
      console.error("Submit review failed", err);
    }
  };

  const getLevelColor = (r) => {
    if (r === 5) return "bg-green-500";
    if (r === 4) return "bg-green-300";
    if (r === 3) return "bg-yellow-500";
    if (r === 2) return "bg-orange-500";
    return "bg-red-500";
  };

  const getLevelText = (r) => {
    if (r === 5) return "Excellent";
    if (r === 4) return "Good";
    if (r === 3) return "Average";
    if (r === 2) return "Below Average";
    return "Poor";
  };

  const buildLevel = (label, count, total, rating) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
      <div className="flex items-center gap-3">
        <span className="w-24 text-xs text-gray-700">{label}</span>
        <div className="w-full bg-gray-200 h-2 rounded-full relative overflow-hidden">
          <div className={`h-3 ${getLevelColor(rating)}`} style={{ width: `${percentage}%` }} />
        </div>
        <span className="w-6 text-sm font-semibold text-gray-700">{count}</span>
      </div>
    );
  };

  return (
    <div>
    
      {/* <CompanyRegistrationDialog isOpen={!isCompany} onClose={() => setIsCompany(true)} recruiterId={1} /> */}
      <div className="min-h-screen">
        {isLoading ? (
          <p className="text-center">Loading...</p>
        ) : company ? (
          <div className="lg:flex gap-5">
            <div className="w-full bg-white shadow-lg rounded-lg">
              {/* HEADER */}
              <div className="relative bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6 rounded-lg lg:h-40 mb-16">
                <div className="absolute -bottom-16 w-36 h-36 bg-white rounded-full flex justify-center items-center">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${company?.image_url}`}
                    alt="company"
                    className="w-28 h-28 rounded-full"
                  />
                </div>
              </div>

              {/* BASIC INFO */}
              <h1 className="text-xl font-semibold text-gray-800 mb-1 px-6">{company?.name}</h1>
              <p className="text-gray-500 text-sm px-6">{company?.address}</p>
              <div className="flex px-6 py-2">
                <button
                  onClick={() => window.open(company?.website, "_blank")}
                  className="text-blue-700 border-2 border-blue-500 text-sm font-semibold rounded-full px-4 py-1 flex items-center gap-1"
                >
                  Visit Website <TbTransferIn size={18} />
                </button>
              </div>

              {/* TABS */}
              <div className="flex border-y my-3 shadow-md">
                {[
                  { key: "jobs", label: "Jobs" },
                  { key: "ratings", label: "Ratings" },
                  { key: "about", label: "About" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    className={`py-2 px-4 text-sm font-semibold border-b-4 transition-colors ${
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

              {/* ABOUT TAB */}
              {activeTab === "about" && (
                <div className="px-6 py-4">
                  <p className="text-gray-700 font-bold text-xl">Overview</p>
                  <p className="text-gray-600 my-2">{company?.description || "Company description here."}</p>
                  <p className="text-gray-700 font-semibold mt-2">Industry</p>
                  <p className="text-gray-600">{company?.industry_type?.name}</p>
                  <p className="text-gray-600 font-semibold mt-3">Company size</p>
                  <p className="text-gray-600">{company?.size}</p>
                  <p className="text-gray-600 font-semibold mt-3">Website</p>
                  <Link href={company?.website || "#"} className="text-blue-700">
                    {company?.website}
                  </Link>
                </div>
              )}

              {/* JOBS TAB */}
              {activeTab === "jobs" && (
                <div className="px-4">
                  {job?.length > 0 ? (
                    job.map((item, index) => (
                      <div
                        key={index}
                        className="border-b-2 p-4 mb-3 flex gap-3 cursor-pointer"
                        onClick={() => router.push(`/jobs/${item.id}`)}
                      >
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-3">
                            <p className="text-black font-semibold text-lg">{item?.title}</p>
                            <span className="bg-green-600 rounded-md px-2 text-white text-sm">{item?.type}</span>
                          </div>
                          <div className="flex gap-5 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <IoLocationSharp className="text-green-500" />
                              <span>
                                {item?.company_details?.city}, {item?.company_details?.state}
                              </span>
                            </div>
                          </div>
                          <p className="line-clamp-2 text-gray-700">{item?.description}</p>
                          <div className="flex gap-5 text-xs text-gray-600">
                            <span className="flex gap-1 items-center">
                              <MdOutlineWorkOutline /> {item?.experience}
                            </span>
                            <span className="flex gap-1 items-center">
                              <GoClock /> {moment(item?.created_at).fromNow()}
                            </span>
                            <span className="flex gap-1 items-center">
                              <GiMoneyStack />
                              ₹{item?.min_salary} - ₹{item?.max_salary}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-600">No Jobs Found</p>
                  )}
                </div>
              )}

              {/* RATINGS TAB */}
              {activeTab === "ratings" && (
                <div className="px-6 pb-6 pt-4">
                  <h2 className="text font-semibold text-gray-700 mb-2 text-center">Company Ratings</h2>
                  <div className="text-center mb-6">
                    <p className="text-2xl font-bold">{parseFloat(rating).toFixed(1)}</p>
                    <div className="flex justify-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={i < rating ? "text-yellow-500" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <p className="text-gray-500 text-sm">Based on {reviews.length} reviews</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    {[5, 4, 3, 2, 1].map((r) =>
                      buildLevel(
                        getLevelText(r),
                        reviews.filter((rev) => rev.rating === r).length,
                        reviews.length,
                        r
                      )
                    )}
                  </div>

                  {/* Review submission */}
                  <div className="mt-10">
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`cursor-pointer ${
                            ratingForPost >= star ? "text-yellow-500" : "text-gray-300"
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

                  {/* Existing reviews */}
                  {reviews.length > 0 && (
                    <div className="mt-8">
                      <p className="text-gray-700 font-semibold mb-4">Reviews</p>
                      <div className="flex flex-col gap-5">
                        {reviews.map((item, index) => (
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
                                    .fill(0)
                                    .map((_, i) => (
                                      <FaStar key={i} className="text-yellow-500" />
                                    ))}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600">{item?.review}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-lg font-semibold text-gray-700">
            Company not found.
          </p>
        )}
      </div>
    </div>
  );
};

export default CompanyPage;
