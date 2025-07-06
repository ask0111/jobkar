"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../../../../utils/axios";
import { useAuthContext } from "../../../../hooks/auth/useAuthContext";

function RecruiterList() {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const { companyID } = useAuthContext();

  useEffect(() => {
    const fetchRecruiters = async () => {
      try {
        const res = await axiosInstance.get(
          `/api/companies-requiters/company/${companyID}`
        );
        setRecruiters(res.data.data);
      } catch (err) {
        console.error("Error fetching recruiters:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecruiters();
  }, [companyID]);

  const handleAccept = async (id) => {
    try {
      const formData = new FormData();
      formData.append("status", "accepted");

      await axiosInstance.post(`/api/companies-requiters/${id}`, formData);

      // Update UI
      const updated = recruiters.map((r) =>
        r.id === id ? { ...r, status: "accepted" } : r
      );
      setRecruiters(updated);
    } catch (err) {
      console.error("Error accepting recruiter:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Recruiter List</h1>

      {loading ? (
        <div className="text-center text-gray-500 text-lg">
          Loading recruiters...
        </div>
      ) : recruiters.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          No recruiters found.
        </div>
      ) : (
        <div className="space-y-6">
          {recruiters.map(({ id, status, recruiter }) => (
            <div
              key={id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-zinc-200 flex items-start p-6 gap-5"
            >
              <img
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${recruiter.imageUrl}`}
                alt={recruiter.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-indigo-100 shadow"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {recruiter.name}
                  </h2>
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${
                      status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {recruiter.description}
                </p>
                <div className="text-sm text-gray-500 space-y-0.5">
                  <p>
                    <strong>Email:</strong> {recruiter.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {recruiter.phone}
                  </p>
                  <p>
                    <strong>Location:</strong> {recruiter.city},{" "}
                    {recruiter.state}, {recruiter.country}
                  </p>
                </div>

                {status === "pending" && (
                  <button
                    onClick={() => handleAccept(id)}
                    className="mt-4 bg-indigo-600 text-white text-sm px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
                  >
                    Accept
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecruiterList;
