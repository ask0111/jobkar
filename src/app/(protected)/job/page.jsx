"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import SectionContainer from "../../components/SectionContainer";
import axiosInstance from "../../../utils/axios";
import moment from "moment";
import { MdOutlineWorkOutline } from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";
import { GoClock } from "react-icons/go";
import { GiMoneyStack } from "react-icons/gi";
import Loader from "../../components/Loader";
import JobList from "../../components/JobList";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";

const SliderWrapper = styled.div`
  .horizontal-slider {
    width: 100%;
    height: 8px;
    background: #e0e0e0;
    border-radius: 4px;
    margin: 20px 0;
  }
  .thumb {
    height: 18px;
    width: 18px;
    background: #007bff;
    border: 2px solid white;
    border-radius: 50%;
    cursor: grab;
    top: -5px;
    position: relative;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
  }
  .track {
    background: #007bff;
    height: 8px;
    border-radius: 4px;
  }
  .active-time {
    margin-top: -15px;
    font-size: 14px;
    text-align: center;
    color: #007bff;
  }
`;

const JobPage = () => {
  const [job, setJob] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isJobLoading, setIsJobLoading] = useState(false);
  const [applyJobs, setApplyJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [salaryRange, setSalaryRange] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [timeFilter, setTimeFilter] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedTimeFilters, setSelectedTimeFilters] = useState([]);
  const [jobType, setJobType] = useState("");
  const [selectedSalaryRanges, setSelectedSalaryRanges] = useState([]);

  const router = useRouter();

  const jobTypes = ["Full Time", "Part Time", "Remote", "Internship"];
  const salaryOptions = ["Below 4L", "4L - 6L", "6L - 10L", "10L+"];
  const timeOptions = [
    { label: "Last 24 hours", value: "1" },
    { label: "Last 7 days", value: "7" },
    { label: "Last 30 days", value: "30" },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (selectedCategory) params.category_id = selectedCategory;
      if (selectedSubCategory) params.sub_category_id = selectedSubCategory;
      const res = await axiosInstance.get("/api/jobs-post", { params });
      setJob(res?.data?.data);
      setFilteredJobs(res?.data?.data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/api/category?limit=200");
      setCategories(res?.data?.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubCategories = async (categoryId) => {
    try {
      const res = await axiosInstance.get(
        `/api/subcategory?category_id=${categoryId}&limit=200`
      );
      setSubCategories(res?.data?.subcategory?.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [selectedCategory, selectedSubCategory]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCheckboxChange = (value, stateSetter) => {
    stateSetter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  useEffect(() => {
    let jobs = job;
    //  allJobs.filter(job => job.country === "India");

    if (jobType.length > 0) {
      jobs = jobs.filter((job) => jobType.includes(job.type));
    }
    // if (experienceLevel) jobs = jobs.filter(job => job.experience === experienceLevel);
    if (selectedSalaryRanges.length > 0) {
      jobs = jobs.filter((job) => {
        const minSalary = Number(job.min_salary);
        const maxSalary = Number(job.max_salary);

        return selectedSalaryRanges.some((range) => {
          if (range === "Below 4L") return maxSalary < 400000;
          if (range === "4L - 6L")
            return minSalary >= 400000 && maxSalary <= 600000;
          if (range === "6L - 10L")
            return minSalary >= 600000 && maxSalary <= 1000000;
          if (range === "10L+") return minSalary >= 1000000;
        });
      });
    }
    if (selectedTimeFilters.length > 0) {
      const now = moment();
      jobs = jobs.filter((job) => {
        return selectedTimeFilters.some((timeFilter) => {
          const timeLimit = now.subtract(Number(timeFilter), "days");
          return moment(job.created_at).isAfter(timeLimit);
        });
      });
    }
    setFilteredJobs(jobs);
  }, [jobType, timeFilter, salaryRange]);

  useEffect(() => {
    const fetchUserJobs = async () => {
      try {
        setIsJobLoading(true);
        const response = await axiosInstance.get(`/api/job-applications`);
        setApplyJobs(response?.data?.data?.data);
      } catch (error) {
        console.error("Error fetching user jobs:", error);
      } finally {
        setIsJobLoading(false);
      }
    };

    fetchUserJobs();
  }, []);
  return (
    <div className="bg-gray-100">
      {!isJobLoading ? (
        <SectionContainer className="lg:flex my-3 gap-4">
          {/* Filter Jobs Section */}
          <div className="bg-gray-300 lg:w-1/4 rounded-md p-4 h-fit shadow-md">
            <p className="text-black font-bold">Filter Jobs</p>

            {/* Category Filter */}
            <div className="bg-white my-4 rounded-md">
              <select
                className="p-3 rounded-md w-full outline-none"
                value={selectedCategory || ""}
                onChange={(e) => {
                  const categoryId = e.target.value;
                  setSelectedCategory(categoryId);
                  setSelectedSubCategory(null);
                  fetchSubCategories(categoryId);
                }}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Time Filter */}
            <div className="bg-white my-4 rounded-md p-3">
              <p className="text-black font-semibold mb-2">Time Posted</p>
              {timeOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 mb-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={selectedTimeFilters.includes(option.value)}
                    onChange={() =>
                      handleCheckboxChange(option.value, setSelectedTimeFilters)
                    }
                    className="cursor-pointer"
                  />
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>

            {/* Job Type Filter (Checkbox) */}
            <div className="bg-white my-4 rounded-md p-3">
              <p className="text-black font-semibold mb-2">Job Type</p>
              {jobTypes.map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 mb-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={type}
                    checked={jobType.includes(type)}
                    onChange={(e) => {
                      const selected = e.target.value;
                      setJobType(
                        (prev) =>
                          prev.includes(selected)
                            ? prev.filter((t) => t !== selected) // Remove if already selected
                            : [...prev, selected] // Add if not selected
                      );
                    }}
                    className="cursor-pointer"
                  />
                  <span className="text-gray-700">{type}</span>
                </label>
              ))}
            </div>

            {/* Salary Range Filter */}
            <div className="bg-white my-4 rounded-md p-3">
              <p className="text-black font-semibold mb-2">Salary Range</p>
              {salaryOptions.map((salary) => (
                <label
                  key={salary}
                  className="flex items-center gap-2 mb-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={salary}
                    checked={selectedSalaryRanges.includes(salary)}
                    onChange={() =>
                      handleCheckboxChange(salary, setSelectedSalaryRanges)
                    }
                    className="cursor-pointer"
                  />
                  <span className="text-gray-700">{salary}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Job Listings Section */}
          <div className="flex flex-col lg:w-2/4">
            {/* Subcategory Filter */}
            {subCategories.length > 0 && (
              <div className="bg-white mb-4 rounded-md p-2 overflow-x-auto whitespace-nowrap">
                <div className="flex gap-2">
                  {subCategories.map((subCat) => (
                    <div
                      key={subCat.id}
                      className={`px-3 py-2 rounded-lg cursor-pointer ${
                        selectedSubCategory === subCat.id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-black"
                      }`}
                      onClick={() =>
                        setSelectedSubCategory(
                          selectedSubCategory === subCat.id ? null : subCat.id
                        )
                      }
                    >
                      {subCat.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!isLoading ? (
              <div>
                {filteredJobs?.length > 0 ? (
                  filteredJobs.map((item, index) => (
                    <div
                      key={index}
                      className="w-full p-4 mb-3 flex gap-3 bg-white rounded-md shadow-sm  cursor-pointer"
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
            ) : (
              <Loader />
            )}
          </div>

          {/* Applied Jobs Section */}
          <div className="w-full lg:w-1/4">
            <JobList jobs={applyJobs} />
            <div className="border rounded-md p-5 bg-white shadow-md h-fit">
              <p className="text-gray-700 font-semibold text-lg mb-3">
                Suggested companies{" "}
              </p>
              <div className="flex flex-col gap-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex gap-3">
                    <img
                      alt="img"
                      className="h-16 w-16"
                      src="https://www.liblogo.com/img-logo/ey1267ed60-ey-logo-ernst-young-ey-logo-vector-svg-icon-png-repo-free-png-icons.png"
                    />
                    <div className="border-b w-full">
                      <p className="text-gray-700 font-semibold">
                        Spirehub Softwares
                      </p>
                      <p className="text-gray-500 text-xs">
                        Technology, Information and Internet
                      </p>
                      <button className="my-3 border-2 border-gray-500 text-gray-500 text-sm font-semibold rounded-full px-4 py-1 flex items-center gap-1">
                        {" "}
                        <FaPlus />
                        Follow
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionContainer>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default JobPage;
