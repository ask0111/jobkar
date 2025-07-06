"use client";
export const dynamic = 'force-dynamic';
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("accesstoken");

    if (!token) {
      router.replace("/login");
    }
  }, [pathname]);

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
