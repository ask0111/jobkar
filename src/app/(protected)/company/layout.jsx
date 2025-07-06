"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import RecruiterList from "./recruiters/page";
import Applicants from "./applicants/page";
import CompanyPage from "./page"; // Import the main company page component

function Company() {
  const pathname = usePathname(); // fixed naming

  const renderContent = () => {
    if (pathname === "/company/recruiters") return <RecruiterList />;
    if (pathname === "/company/applicants") return <Applicants />;
    if(pathname === "/company") return <CompanyPage />; // prevent recursive rendering of <Company />
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Jobkar</h2>
        <ul>
          {[
            { name: "Company", path: "/company" },
            { name: "Recruiters", path: "/company/recruiters" },
            { name: "Applicants", path: "/company/applicants" },
          ].map((menu) => (
            <li key={menu.name} className="p-2 cursor-pointer rounded-lg">
              <Link
                href={menu.path}
                className={`block w-full h-full p-2 rounded-lg ${
                  pathname === menu.path ? "bg-gray-600" : ""
                }`}
              >
                {menu.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">{renderContent()}</div>
    </div>
  );
}

export default Company;
