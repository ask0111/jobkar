"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../../../../utils/axios";
import JobPostModal from "../../../components/JobPostModal";
import { IoLocationSharp } from "react-icons/io5";
import { MdOutlineWorkOutline } from "react-icons/md";
import { GoClock } from "react-icons/go";
import { GiMoneyStack } from "react-icons/gi";
import { useAuthContext } from "../../../../hooks/auth/useAuthContext";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useRouter } from "next/navigation";

function Applicants() {
  const [jobs, setJobs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, companyID } = useAuthContext();
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const router = useRouter();

  const recruiterId = user?.id;

  const fetchJobs = async () => {
    await axiosInstance
      .get(`/api/job-posts/company/${companyID}`)
      .then((res) => {
        if (res.data.success) {
          setJobs(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch jobs:", err);
      });
  };

  useEffect(() => {
    fetchJobs();
  }, [isModalOpen]);

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      const res = await axiosInstance.delete(`/api/jobs-post/${jobId}`);
      if (res.data.status === "success") {
        setJobs(jobs.filter((j) => j.id !== jobId));
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Your Job Posts</h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* 🔍 Search Box */}
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
          />

          {/* ➕ Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow transition"
          >
            + New Job
          </button>
        </div>
      </div>

      {/* Job List - 1 per row */}
      <div className="space-y-4 mt-6">
        {jobs.length > 0 ? (
          jobs.map((job) => {
            const isMenuOpen = openMenuId === job.id;
            return (
              <div
                key={job.id}
                onClick={() => router.push(`/jobs/${job.id}`)}
                className="w-full relative  p-4 flex gap-3 bg-white rounded-xl shadow-sm hover:shadow-md cursor-pointer transition"
                // You can handle navigation or a modal open here
              >
                <div className="absolute top-4 right-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent click from reaching parent div
                      setOpenMenuId(openMenuId === job.id ? null : job.id);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <BsThreeDotsVertical />
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-md z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // prevents navigation
                          setEditingJob(job);
                          setIsModalOpen(true);
                          setOpenMenuId(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // prevents navigation
                          handleDelete(job.id);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-red-100 text-sm text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-3 w-full">
                  {/* Job Title & Type */}
                  <div className="flex items-center flex-wrap gap-2">
                    <p className="text-black font-semibold text-lg">
                      {job.title}
                    </p>
                    <div className="bg-green-100 text-green-700 px-3 py-1 text-xs rounded-md w-max">
                      {job.type}
                    </div>
                  </div>

                  {/* Company & Location */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 items-center">
                    {job.company_details?.name && (
                      <div className="flex items-center gap-2">
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${job.company_details.image_url}`}
                          alt="company logo"
                          className="w-4 h-4 rounded object-cover"
                        />
                        <p className="text-blue-600">
                          {job.company_details.name}
                        </p>
                      </div>
                    )}
                    {job.company_details?.city && (
                      <div className="flex items-center gap-1">
                        <IoLocationSharp className="text-green-600" />
                        <p className="text-xs">
                          {job.company_details.city},{" "}
                          {job.company_details.state},{" "}
                          {job.company_details.country}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 text-sm line-clamp-2">
                    {job.description}
                  </p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-5 text-xs text-gray-600 mt-2">
                    <div className="flex items-center gap-1">
                      <MdOutlineWorkOutline />
                      <span>{job.experience} yrs experience</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GoClock />
                      <span>
                        {new Date(job.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GiMoneyStack />
                      <span>
                        ₹{Number(job.min_salary).toLocaleString()} - ₹
                        {Number(job.max_salary).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 mt-10">
            No job posts yet.
          </div>
        )}
      </div>

      <JobPostModal
        companyId={jobs[0]?.company_id}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingJob(null);
        }}
        editingJob={editingJob}
      />
    </div>
  );
}

export default Applicants;
