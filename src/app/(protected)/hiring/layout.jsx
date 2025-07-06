"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Proposals from "./proposals/page";
import Applications from "./applications/page";
import Company from "./company/page";

function RecruiterDashboard() {
  const pathname = usePathname();

  const renderContent = () => {
    if (pathname === "/hiring/proposals") return <Proposals />;
    if (pathname === "/hiring/applications") return <Applications />;
    if (pathname === "/hiring/company") return <Company />;
    return <div>Select an option from the sidebar.</div>;
  };

  return (
    <div className="flex h-full min-h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Jobkar</h2>
        <ul>
          {[
            { name: "Proposals", path: "/hiring/proposals" },
            { name: "Applications", path: "/hiring/applications" },
            { name: "Company", path: "/hiring/company" },
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

export default RecruiterDashboard;
