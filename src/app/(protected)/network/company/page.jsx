"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "../../../../hooks/auth/useAuthContext";
import axiosInstance from "../../../../utils/axios";
import SectionContainer from "../../../components/SectionContainer";
import { FaBuilding } from "react-icons/fa";
import { useRouter } from "next/navigation";

function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [filters, setFilters] = useState({ city: "", state: "", country: "" });
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    axiosInstance
      .get("/api/companies")
      .then((res) => {
        setCompanies(res.data.companies || []);
      })
      .catch((err) => {
        console.error("Failed to fetch companies", err);
      });
  }, []);

  const filteredCompanies = companies.filter((company) => {
    const matchesCity = company.city
      ?.toLowerCase()
      .includes(filters.city.toLowerCase());
    const matchesState = company.state
      ?.toLowerCase()
      .includes(filters.state.toLowerCase());
    const matchesCountry = company.country
      ?.toLowerCase()
      .includes(filters.country.toLowerCase());
    return matchesCity && matchesState && matchesCountry;
  });

  return (
    <SectionContainer className="gap-6 flex flex-col">
      <h2 className="text-2xl font-bold text-indigo-700">Top Companies</h2>

      {/* Filters Section */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="City"
          value={filters.city}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, city: e.target.value }))
          }
          className="px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm"
        />
        <input
          type="text"
          placeholder="State"
          value={filters.state}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, state: e.target.value }))
          }
          className="px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm"
        />
        <input
          type="text"
          placeholder="Country"
          value={filters.country}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, country: e.target.value }))
          }
          className="px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm"
        />
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map((company) => (
            <div
              key={company.id}
              onClick={() => router.push(`/companies/${company.requiter_id}`)}
              className="group bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-transform transform hover:-translate-y-2 hover:border-indigo-400 cursor-pointer overflow-hidden flex flex-col"
            >
              {/* Top Icon Section */}
              <div className="flex justify-center items-center bg-gray-50 p-6">
                <FaBuilding className="text-5xl text-indigo-500" />
              </div>

              {/* Info Section */}
              <div className="flex-1 p-5 flex flex-col gap-2 text-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  {company.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {company.city}, {company.state}, {company.country}
                </p>

                <div className="mt-4 flex flex-col gap-1 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Industry:</span>{" "}
                    {company.industry_type?.name || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Company Size:</span>{" "}
                    {company.size}
                  </p>
                </div>

                {company.website && (
                  <div className="mt-4">
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline text-sm"
                      onClick={(e) => e.stopPropagation()} // prevent card click
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            <p className="text-lg">No companies found</p>
            <p className="text-sm">Try adjusting your filters!</p>
          </div>
        )}
      </div>
    </SectionContainer>
  );
}

export default CompanyList;
