"use client";

import { useEffect, useState } from "react";
import {
  FaUser,
  FaBell,
  FaLock,
  FaGraduationCap,
  FaTools,
  FaFileAlt,
  FaShieldAlt,
  FaUserShield,
  FaFileContract,
  FaQuestionCircle,
  FaSignOutAlt,
  FaEye,
} from "react-icons/fa";
import { FaBusinessTime } from "react-icons/fa";
import { useAuthContext } from "../../hooks/auth/useAuthContext";
import Qualification from "./Qualification";
import Experience from "./Experience";
import Skill from "./Skill";
import axiosInstance from "../../utils/axios";
import axios from "axios";
import ChangePasswordModal from "./ChangePasswordModal";
import { HiOfficeBuilding } from "react-icons/hi";
import { useRouter } from "next/navigation";
import Link from "next/link";

function DialogBox({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
      <div className="bg-white px-6 py-12 rounded-lg shadow-lg lg:w-2/3 relative  max-h-[80vh] overflow-y-auto">
        <button
          className="absolute top-2 right-5 text-gray-700"
          onClick={onClose}
        >
          ✖
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
}

function UserControlCard() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [file, setFile] = useState(null);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const { user } = useAuthContext();
  const [companies, setCompanies] = useState([]);

  const fetchResume = async () => {
    try {
      const res = await axiosInstance.get("/api/resume");
      console.log(res, "abcd");
      setResumes(res?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await axiosInstance.get("/api/companies");
      setCompanies(res.data.companies || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleOpenCompaniesModal = async () => {
    setDialogContent(renderCompaniesList());
    setDialogOpen(true);
  };

  useEffect(() => {
    fetchResume();
  }, [dialogOpen]);

  const handleFileUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);
    const token = localStorage.getItem("accesstoken");
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/resume`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setModalOpen(false);
    } catch (err) {
      console.error("Error uploading resume:", err);
    }
  };

  const handleDeleteResume = async (resumeId) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;

    try {
      const token = localStorage.getItem("accesstoken");
      await axiosInstance.delete(`/api/resume/delete/${resumeId}`, {});

      // Update state after deletion
      setResumes(resumes.filter((resume) => resume.id !== resumeId));

      alert("Resume deleted successfully!");
    } catch (error) {
      console.error("Error deleting resume:", error);
      alert(error.response?.data?.message || "Failed to delete resume");
    }
  };

  const handleSendProposal = (companyId) => {
    alert(`Proposal sent to company ID: ${companyId}`);
    // Here, you can make an API call to send the proposal
  };

  const options = [
    { label: "Account", icon: <FaUser />, link: "/profile" },
    ...(user?.role_id == "3"
      ? [
          {
            label: "Hiring",
            icon: <HiOfficeBuilding />,
            link: "hiring/proposals",
          },
        ]
      : []),
    ...(user?.role_id == "5"
      ? [
          {
            label: "Company",
            icon: <HiOfficeBuilding />,
            link: "company",
          },
        ]
      : []),

    { label: "Notification", icon: <FaBell />, link: "notifications" },
    // { label: "Company", icon: <FaBell />, link: "company" },
    // { label: "Hiring", icon: <FaBell />, link: "hiring" },

    {
      label: "Change password",
      icon: <FaLock />,
      action: () => setPasswordModalOpen(true),
    },
    {
      label: "Qualification",
      icon: <FaGraduationCap />,
      action: () => handleOpenDialog(<Qualification />),
    },
    {
      label: "Experience",
      icon: <FaBusinessTime />,
      action: () => handleOpenDialog(<Experience />),
    },
    {
      label: "Skills",
      icon: <FaTools />,
      action: () => handleOpenDialog(<Skill />),
    },
    { label: "Resume", icon: <FaFileAlt />, action: () => setModalOpen(true) },
  ];
  const handleOpenDialog = (content) => {
    setDialogContent(content);
    setDialogOpen(true);
  };

  const renderCompaniesList = () => (
    <div>
      <h2 className="text-xl font-semibold mb-4">Companies List</h2>
      {companies.length === 0 ? (
        <p>No companies found.</p>
      ) : (
        <ul className="space-y-4">
          {companies.map((company) => (
            <li
              key={company.id}
              className="p-4 border rounded-lg flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-bold">{company.name}</h3>
                <p className="text-sm text-gray-600">{company.address}</p>
                <p className="text-sm text-gray-600">{company.website}</p>
              </div>
              <button
                className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                onClick={() => handleSendProposal(company.id)}
              >
                Send Proposal
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-3">
        {options.map((option, index) => (
          <Link key={index} href={option.link || "#"}>
            <div
              onClick={() => {
                if (option?.action) option.action();
              }}
              className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 transition cursor-pointer"
            >
              <span className="text-gray-600 text-lg">{option.icon}</span>
              <p className="text-sm text-gray-700 font-semibold">
                {option.label}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <DialogBox isOpen={dialogOpen} onClose={() => setDialogOpen(false)}>
        {dialogContent}
      </DialogBox>
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg">
            <h2 className="text-2xl font-semibold mb-4">Manage Resumes</h2>

            {/* Resume List */}
            <ul className="mb-4">
              {resumes.map((resume, index) => (
                <li
                  key={index}
                  className="p-2 bg-gray-100 rounded mb-2 flex justify-between items-center"
                >
                  <span>{resume.resume.split("/").pop()}</span>
                  <div className="flex items-center gap-2">
                    {/* View Resume */}
                    <a
                      href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${resume.resume}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEye />
                    </a>

                    {/* Delete Resume */}
                    <button
                      onClick={() => handleDeleteResume(resume.id)}
                      className="text-red-600 ml-3 hover:text-red-800"
                    >
                      ❌
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* File Upload Input */}
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="mb-4"
            />

            {/* Upload Button */}
            <button
              onClick={handleFileUpload}
              className="p-2 bg-green-600 text-white rounded shadow-md hover:bg-green-700"
            >
              Upload Resume
            </button>

            {/* Close Button */}
            <button
              onClick={() => setModalOpen(false)}
              className="ml-4 p-2 bg-red-600 text-white rounded shadow-md hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <ChangePasswordModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />
    </>
  );
}

function PolicyControlCard() {
  const options = [
    {
      label: "Data Security",
      icon: <FaShieldAlt />,
      link: "/data-and-security",
    },
    { label: "Privacy Policy", icon: <FaUserShield />, link: "privacy-policy" },
    {
      label: "Terms and Conditions",
      icon: <FaFileContract />,
      link: "terms-condition",
    },
    {
      label: "Help and Support",
      icon: <FaQuestionCircle />,
      link: "help-and-support",
    },
  ];

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-3 mt-6">
        {options.map((option, index) => (
          <a
            key={index}
            href={option.link}
            className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 transition cursor-pointer"
          >
            <span className="text-gray-600 text-lg">{option.icon}</span>
            <p className="text-sm text-gray-700 font-semibold">
              {option.label}
            </p>
          </a>
        ))}
      </div>
    </>
  );
}

function LogoutCard() {
  const router = useRouter();
  const { logout } = useAuthContext();

  const handleLogout = async () => {
    try {
      const res = await logout();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-md px-6 flex flex-col gap-3 mt-6">
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 transition cursor-pointer"
      >
        <span className="text-gray-600 text-lg">
          <FaSignOutAlt />
        </span>
        <p className="text-sm text-gray-700 font-semibold">Logout</p>
      </button>
    </div>
  );
}

export { UserControlCard, PolicyControlCard, LogoutCard };
