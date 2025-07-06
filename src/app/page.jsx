"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Home from "./components/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function HomePage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accesstoken");

    if (!token) {
      router.replace("/login");
    } else {
      setCheckingAuth(false);
    }
  }, []);

  if (checkingAuth) return <p>Checking authentication...</p>;

  return (
    <>
      <Header />
      <Home />
      <Footer />
    </>
  );
}
