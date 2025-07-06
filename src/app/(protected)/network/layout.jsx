"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SectionContainer from "../../components/SectionContainer";

export default function NetworkLayout({ children }) {
  const pathname = usePathname();

  return (
    <SectionContainer className="p-2">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="col-span-1 bg-gray-100 p-4 rounded space-y-1 shadow min-h-screen">
          <ul>
            {[
              { name: "Followers", path: "/network/followers" },
              { name: "Following", path: "/network/following" },
              { name: "Company", path: "/network/company" },
              { name: "People", path: "/network/people" },
              { name: "Blogging", path: "/network/blogging" },
            ].map((menu) => (
              <li key={menu.name} className="p-2 cursor-pointer rounded-lg">
                <Link
                  href={menu.path}
                  className={`block w-full h-full px-3 py-1 rounded-lg ${
                    pathname === menu.path ? "bg-gray-400" : ""
                  }`}
                >
                  {menu.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Main content */}
        <div className="col-span-1 md:col-span-3 space-y-6">{children}</div>
      </div>
    </SectionContainer>
  );
}
