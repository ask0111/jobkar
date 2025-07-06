"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../../../../utils/axios";
import moment from "moment";
import { useParams } from "next/navigation";
import SectionContainer from "../../../components/SectionContainer";
import { MdDateRange, MdOutlineWorkOutline } from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";
import { GoClock } from "react-icons/go";
import { GiMoneyStack } from "react-icons/gi";
import { getJobApplied } from "../../../../redux/slices/job";
import { useDispatch, useSelector } from "react-redux";
import { ImOffice } from "react-icons/im";
import { FaEye } from "react-icons/fa";
import { useAuthContext } from "../../../../hooks/auth/useAuthContext";
import { useRouter } from "next/navigation";

const JobDetailsPage = () => {
  const { jobId } = useParams(); // Get job ID from the URL
  const [job, setJob] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRelatedLoading, setIsRelatedLoading] = useState(false);
  const { appliedList } = useSelector((state) => state.job);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [isApplicantsLoading, setIsApplicantsLoading] = useState(false);
  const { user } = useAuthContext();

  const router = useRouter();
  console.log(appliedList, "appliedList");
  console.log(job, "jobb");

  const isApplied = appliedList?.some(
    (appliedJob) => appliedJob.job_post_id == jobId
  );
  console.log(isApplied, "dd");

  const fetchIsApplied = () => {};

  useEffect(() => {
    const fetchApplicants = async () => {
      setIsApplicantsLoading(true);
      try {
        const res = await axiosInstance.get(
          `/api/total/job-applications/${jobId}`
        );
        setApplicants(res.data?.data?.data || []);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      } finally {
        setIsApplicantsLoading(false);
      }
    };

    if (jobId) fetchApplicants();
  }, [jobId]);

  const handleApply = async () => {
    try {
      const res = await axiosInstance.get("/api/resume");
      setResumes(res.data.data || []);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching resumes:", error);
    }
  };

  useEffect(() => {
    const fetchJobDetails = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get(`/api/jobs-post/${jobId}`);
        setJob(res.data?.data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const submitApplication = async () => {
    if (!selectedResume && !uploadedFile) {
      alert("Please select or upload a resume.");
      return;
    }
    if (!coverLetter) {
      alert("Cover letter is mandatory.");
      return;
    }

    const formData = new FormData();
    formData.append("job_post_id", jobId);
    formData.append("cover_letter", coverLetter || "");

    if (uploadedFile) {
      formData.append("resume_file", uploadedFile);
    } else {
      formData.append("resume_id", selectedResume);
    }

    try {
      await axiosInstance.post("/api/job-applications", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Application submitted successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error(
        "Error submitting application:",
        error.response?.data || error.message
      );
      alert("Failed to submit the application. Please try again.");
    }
  };

  useEffect(() => {
    dispatch(getJobApplied());
  }, [dispatch]);

  useEffect(() => {
    const fetchRelatedJobs = async () => {
      setIsRelatedLoading(true);
      try {
        const res = await axiosInstance.get(`/api/job-posts/related/5`);
        setRelatedJobs(res.data?.data || []);
      } catch (error) {
        console.error("Error fetching related jobs:", error);
      } finally {
        setIsRelatedLoading(false);
      }
    };

    fetchRelatedJobs();
  }, []);
  const handleResumeSelection = async (resume) => {
    setSelectedResume(resume.id);
    setUploadedFile(null);
  };
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setUploadedFile(file);
    setSelectedResume(null);
  };

  return (
    <div className="">
      <SectionContainer className="p-4 min-h-screen">
        <div>
          {/* Modal Component */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg w-1/2">
                <h2 className="text-xl font-bold mb-4">Select Resume</h2>
                <ul className="mb-4">
                  {resumes.map((resume) => (
                    <div
                      key={resume.id}
                      className="flex items-center gap-4 mb-2 cursor-pointer"
                      onClick={() => handleResumeSelection(resume)}
                    >
                      <input
                        type="radio"
                        name="resume"
                        value={resume.id}
                        onChange={() => handleResumeSelection(resume)}
                      />
                      <span>{resume.resume.split("/").pop()}</span>
                    </div>
                  ))}
                </ul>
                {/* <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="mb-4" /> */}

                <textarea
                  placeholder="Add a cover letter"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full border p-2 rounded mb-4"
                />
                <div className="flex justify-end gap-3">
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={submitApplication}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Rest of your code */}
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : job ? (
          <div className=" relative">
            <div className="lg:flex lg:gap-10">
              <div className="lg:w-2/3 ">
                <div className="header flex flex-col md:flex-row items-center gap-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6 rounded-lg shadow-md lg:h-48 relative mb-10">
                  <div className=" bg-white absolute -bottom-16 rounded-full w-36 h-36 items-center justify-center flex">
                    <img
                      className="w-28 h-28 rounded-full"
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${job.company_details?.image_url}`}
                      alt="Company"
                    />
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:justify-between p-6 py-10 shadow-md">
                  {/* Job Details and Apply Button */}
                  <div className="lg:w-3/4 flex gap-5 ">
                    <div>
                      <h1 className="text-2xl font-bold mb-2">{job.title}</h1>

                      {/* Company Info with Icon */}
                      <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() =>
                          router.push(
                            `/companies/${job?.company_details?.requiter_id}`
                          )
                        }
                      >
                        <MdOutlineWorkOutline className="text-blue-600 text-xl" />
                        <span className="text-blue-600 font-medium hover:underline">
                          {job.company_details?.name}
                        </span>
                      </div>
                      <div className="flex gap-1 items-center mt-2">
                        <IoLocationSharp color="gray" />
                        <p className="">
                          {job?.company_details?.city},{" "}
                          {job?.company_details?.state},{" "}
                          {job?.company_details?.country}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Right Section - Apply Button */}
                  <div className="lg:w-1/4 flex justify-center items-start lg:ml-6">
                    {isApplied ? (
                      <span className="bg-green-100 text-green-600 px-6 py-3 rounded-md shadow">
                        Applied
                      </span>
                    ) : (
                      <button
                        className="bg-green-600 text-white px-6 py-2 rounded-full shadow hover:bg-blue-700 transition"
                        onClick={() => handleApply(job?.id)}
                      >
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-6 mt-6 shadow-md">
                  <h1 className="text-xl font-bold mb-4">About the Job</h1>
                  <p
                    className="text-sm text-gray-800 px-4"
                    dangerouslySetInnerHTML={{
                      __html: job.description.replace(/\n/g, "<br />"),
                    }}
                  />
                  {/* <p className="text-gray-700 mb-4 lg:w-5/6">
                    {job.description}
                  </p> */}
                </div>
                {user?.role_id !== 4 && (
                  <div className="mt-10 p-6 shadow bg-white rounded-md">
                    <h2 className="text-xl font-bold mb-4">Applicants</h2>
                    {isApplicantsLoading ? (
                      <p>Loading applicants...</p>
                    ) : applicants.length === 0 ? (
                      <p>No applicants yet.</p>
                    ) : (
                      <table className="min-w-full table-auto border">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="p-2 border">#</th>
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Email</th>
                            <th className="p-2 border">Phone</th>
                            <th className="p-2 border">Cover Letter</th>
                            <th className="p-2 border">Resume</th>
                          </tr>
                        </thead>
                        <tbody>
                          {applicants.map((app, index) => (
                            <tr key={app.id} className="text-sm">
                              <td className="p-2 border">{index + 1}</td>
                              <td className="p-2 border">{app.user.name}</td>
                              <td className="p-2 border">{app.user.email}</td>
                              <td className="p-2 border">{app.user.phone}</td>
                              <td className="p-2 border">{app.cover_letter}</td>
                              <td className="p-2 border text-center">
                                {app.resume ? (
                                  <a
                                    href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${app.resume}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    <FaEye
                                      className="inline-block"
                                      title="View Resume"
                                    />
                                  </a>
                                ) : (
                                  <span className="text-gray-400">N/A</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Skills and Other Info */}
              <div className=" bg-gray-100 rounded-md shadow-lg p-5 lg:w-1/3 lg:h-80">
                <h2 className="text-xl font-bold mb-1">
                  ₹{job.min_salary} - ₹{job.max_salary}
                </h2>
                <p className="text-gray-600">Salary Range</p>
                <div className="flex flex-col gap-5 mt-8">
                  <div className="flex items-center w-full gap-5">
                    <div className="bg-white p-3 rounded-full border">
                      <MdOutlineWorkOutline color="black" />
                    </div>
                    <div>
                      <p className="text-black font-semibold">
                        {job.experience} Year
                      </p>
                      <p className="text-gray-600 text-sm">Experience</p>
                    </div>
                  </div>

                  <div className="flex items-center w-full gap-5">
                    <div className="bg-white p-3 rounded-full border">
                      <ImOffice color="black" />
                    </div>
                    <div>
                      <p className="text-black font-semibold">{job.type}</p>
                      <p className="text-gray-600 text-sm">Employment Type</p>
                    </div>
                  </div>

                  <div className="flex items-center w-full gap-5">
                    <div className="bg-white p-3 rounded-full border">
                      <MdDateRange color="black" />
                    </div>
                    <div>
                      <p className="text-black font-semibold">
                        {moment(job.created_at).fromNow()}
                      </p>
                      <p className="text-gray-600 text-sm">Posted</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Jobs Section */}
            <div className="mt-10 grid lg:grid-cols-3 gap-6 p-6">
              {/* Left Column: Related Jobs */}
              <div className="lg:col-span-2">
                <h2 className="text-xl font-bold mb-4">Related Jobs</h2>
                {isRelatedLoading ? (
                  <p>Loading related jobs...</p>
                ) : relatedJobs.length > 0 ? (
                  relatedJobs.map((item, index) => (
                    <div
                      key={index}
                      className="border w-full p-4 mb-3 shadow rounded-md flex gap-3 bg-white cursor-pointer"
                      onClick={() => router.push(`/jobs/${item.id}`)}
                    >
                      <img
                        className="w-12 rounded-md h-12"
                        alt="company"
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${item?.company?.image_url}`}
                      />
                      <div>
                        <p className="text-black">{item?.title}</p>
                        <div className="flex gap-5 my-1">
                          <div className="flex gap-1 items-center">
                            <MdOutlineWorkOutline color="gray" />
                            <p className="text-xs">{item?.experience}</p>
                          </div>
                          <div className="flex gap-1 items-center">
                            <IoLocationSharp color="gray" />
                            <p className="text-xs">
                              {item?.company?.city}, {item?.company?.state},{" "}
                              {item?.company?.country}
                            </p>
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
                        <p className=" text-gray-700 mt-2 text-sm">
                          {item?.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No related jobs found.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">Job not found.</p>
        )}
      </SectionContainer>
    </div>
  );
};

export default JobDetailsPage;
