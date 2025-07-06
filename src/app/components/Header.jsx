// "use client";
// import { useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { FaPhoneAlt, FaEnvelope, FaBars, FaTimes } from "react-icons/fa";
// import "remixicon/fonts/remixicon.css";

// export default function Header() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

//   const navItems = [
//     { label: "Home", href: "/", icon: "ri-home-3-line" },
//     { label: "Network", href: "/network", icon: "ri-team-line" },
//     { label: "Career", href: "/job", icon: "ri-briefcase-line" },
//     { label: "Message", href: "/chat", icon: "ri-chat-3-line" },
//     { label: "Application", href: "/hiring", icon: "ri-briefcase-4-line" },
//     { label: "Profile", href: "/profile", icon: "ri-account-circle-line" },
//   ];

//   return (
//     <>
//       {/* Top Contact Bar (Responsive) */}
//       <div className="bg-[#005577] text-white text-sm px-4 py-2">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
//           <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
//             <div className="flex items-center space-x-1">
//               <FaPhoneAlt className="text-xs" />
//               <span>(629) 555-0129</span>
//             </div>
//             <div className="hidden sm:block border-l border-white h-4" />
//             <div className="flex items-center space-x-1">
//               <FaEnvelope className="text-xs" />
//               <span className="break-all">felicia.reid@example.com</span>
//             </div>
//           </div>

//           <Link href="/login" className="flex items-center text-xs hover:underline">
//             Sign In / Sign Up
//             <i className="ri-login-circle-line ml-1 text-sm"></i>
//           </Link>
//         </div>
//       </div>

//       {/* Main Header */}
//       <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 px-4 py-3 lg:px-8">
//         <div className="flex justify-between items-center">
//           {/* Logo */}
//           <Link href="/" className="flex items-center">
//             <Image
//               src="/assets/logo.png"
//               alt="Logo"
//               width={40}
//               height={40}
//               className="object-contain"
//             />
//           </Link>

//           {/* Desktop Nav (always visible on desktop) */}
//           <nav className="hidden lg:flex items-center space-x-6 text-sm">
//             {navItems.map((item) => (
//               <Link
//                 key={item.label}
//                 href={item.href}
//                 className="flex flex-col items-center text-gray-600 hover:text-blue-600"
//               >
//                 <i className={`${item.icon} text-xl`}></i>
//                 <span className="text-xs">{item.label}</span>
//               </Link>
//             ))}
//           </nav>

//           {/* Mobile Hamburger (only on small screens) */}
//           <button
//             onClick={toggleSidebar}
//             className="lg:hidden p-2 text-gray-700"
//             aria-label="Open Menu"
//           >
//             <FaBars size={20} />
//           </button>
//         </div>
//       </header>

//       {/* Right Sidebar Drawer (Mobile) */}
//       <div
//         className={`fixed top-0 right-0 h-full w-64 bg-white z-50 transform ${
//           sidebarOpen ? "translate-x-0" : "translate-x-full"
//         } transition-transform duration-300 ease-in-out shadow-lg`}
//       >
//         <div className="flex justify-end px-4 py-3 border-b">
//           <button onClick={toggleSidebar} aria-label="Close Menu">
//             <FaTimes className="text-gray-600" />
//           </button>
//         </div>

//         <nav className="flex flex-col items-center mt-4 space-y-4 text-gray-700 text-sm">
//           {navItems.map((item) => (
//             <Link
//               key={item.label}
//               href={item.href}
//               className="flex flex-col items-center text-gray-600 hover:text-blue-600"
//               onClick={toggleSidebar}
//             >
//               <i className={`${item.icon} text-2xl`}></i>
//               <span className="text-xs">{item.label}</span>
//             </Link>
//           ))}
//         </nav>
//       </div>

//       {/* Dark overlay when drawer is open */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-25 z-40"
//           onClick={toggleSidebar}
//         />
//       )}
//     </>
//   );
// }


"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaPhoneAlt, FaEnvelope, FaBars, FaTimes } from "react-icons/fa";
import "remixicon/fonts/remixicon.css";

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const navItems = [
    { label: "Home", href: "/", icon: "ri-home-3-line" },
    { label: "Network", href: "/network/followers", icon: "ri-team-line" },
    { label: "Career", href: "/job", icon: "ri-briefcase-line" },
    { label: "Message", href: "/chat", icon: "ri-chat-3-line" },
    { label: "Application", href: "/notice", icon: "ri-briefcase-4-line" },
    { label: "Profile", href: "/profile", icon: "ri-account-circle-line" },
  ];

  return (
    <>
      {/* Top Contact Bar */}
      <div className="bg-[#005577] text-white text-xs px-4 py-[6px]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <div className="flex items-center space-x-1">
              <FaPhoneAlt className="text-[10px]" />
              <span>(629) 555-0129</span>
            </div>
            <div className="hidden sm:block border-l border-white h-3" />
            <div className="flex items-center space-x-1">
              <FaEnvelope className="text-[10px]" />
              <span className="break-all">felicia.reid@example.com</span>
            </div>
          </div>

          <Link href="/login" className="flex items-center text-[10px] hover:underline">
            Sign In / Sign Up
            <i className="ri-login-circle-line ml-1 text-xs"></i>
          </Link>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 px-4 py-[10px] lg:px-8">
        <div className="flex justify-between items-center min-h-[52px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4">
            <Image
              src="/assets/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <div className="hidden md:block">
            <input
              type="search"
              placeholder="Search here"
              className="w-64 lg:w-96 px-3 py-2 border border-gray-200 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center text-gray-600 hover:text-blue-600"
              >
                <i className={`${item.icon} text-xl`}></i>
                <span className="text-xs">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Hamburger Menu */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 text-gray-700"
            aria-label="Open Menu"
          >
            <FaBars size={20} />
          </button>
        </div>
      </header>

      {/* Right Sidebar Drawer (Mobile) */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white z-50 transform ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out shadow-lg`}
      >
        <div className="flex justify-end px-4 py-3 border-b">
          <button onClick={toggleSidebar} aria-label="Close Menu">
            <FaTimes className="text-gray-600" />
          </button>
        </div>

        <nav className="flex flex-col items-center mt-4 space-y-4 text-gray-700 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center text-gray-600 hover:text-blue-600"
              onClick={toggleSidebar}
            >
              <i className={`${item.icon} text-2xl`}></i>
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
