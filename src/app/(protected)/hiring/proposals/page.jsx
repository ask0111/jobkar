"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../../../../utils/axios";
import {
  FaExternalLinkAlt,
  FaPaperPlane,
  FaPlus,
  FaArrowLeft,
} from "react-icons/fa";

function Proposals() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sendingProposal, setSendingProposal] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [addMode, setAddMode] = useState(false); // 🔥 NEW STATE
  const [reqruiterCompany, setReqruiterCompany] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axiosInstance.get("/api/companies");
        if (response.data.status === "success") {
          setCompanies(response.data.companies);
        } else {
          throw new Error("Failed to fetch companies");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    const FetchRecruiterCompany = async () => {
      try {
        const response = await axiosInstance.get("/api/companies-by-recruiter");
        if (response.data.status === "success") {
          setReqruiterCompany(response.data.data);
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

  const sendProposal = async (companyId, ownerId) => {
    setSendingProposal(companyId);
    setSuccessMessage(null);
    try {
      const formData = new FormData();
      formData.append("company_id", companyId);
      formData.append("owner_id", ownerId);

      await axiosInstance.post("api/companies-requiters", formData);
      setSuccessMessage(`Proposal sent successfully`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSendingProposal(null);
    }
  };

  if (loading)
    return <div className="text-center text-lg">Loading companies...</div>;
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">
          {addMode ? "Add New Proposal" : "Companies"}
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* 🔍 Show Search Box Only in Add Mode */}

          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
          />

          <button
            onClick={() => setAddMode(!addMode)}
            className={`flex items-center px-4 py-2 rounded-lg text-white shadow transition ${
              addMode
                ? "bg-gray-600 hover:bg-gray-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {addMode ? (
              <>
                <FaArrowLeft className="mr-2" /> Back to Proposals
              </>
            ) : (
              <>
                <FaPlus className="mr-2" /> Add Proposal
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Message */}
      {!addMode && successMessage && (
        <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4">
          {successMessage}
        </div>
      )}

      {/* Different Views */}
      {addMode ? (
        // 🔥 Add Proposal View (alternate listing)
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <tr>
                <th className="px-4 py-3">Logo</th>
                <th className="px-4 py-3">Company Name</th>
                <th className="px-4 py-3">Industry</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Website</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {companies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${company.image_url}`}
                      alt={company.name}
                      className="h-10 w-10 object-contain rounded-md border"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {company.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {company.industry_type?.name}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{company.address}</td>
                  <td className="px-4 py-3">
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      <FaExternalLinkAlt className="mr-1" /> Website
                    </a>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      className={`flex items-center justify-center w-full px-4 py-2 rounded-md text-white text-sm ${
                        sendingProposal === company.id
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                      onClick={() =>
                        sendProposal(company.id, company?.requiter_id)
                      }
                      disabled={sendingProposal === company.id}
                    >
                      {sendingProposal === company.id ? (
                        <span>Sending...</span>
                      ) : (
                        <>
                          <FaPaperPlane className="mr-2" /> Send Proposal
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // 📄 Normal CRM Table View
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <tr>
                <th className="px-4 py-3">Logo</th>
                <th className="px-4 py-3">Company Name</th>

                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {reqruiterCompany.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${company.company.image_url}`}
                      alt={company.company.name}
                      className="h-10 w-10 object-contain rounded-md border"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {company.company.name}
                  </td>

                  <td className="px-4 py-3 text-gray-500">
                    {company.company.address}
                  </td>
                  <td className="px-4 py-3">
                    <p
                      className={`${
                        company?.status === "accepted"
                          ? "bg-green-700"
                          : "bg-yellow-600"
                      } max-w-fit px-3 rounded text-white capitalize`}
                    >
                      {company?.status}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Proposals;
