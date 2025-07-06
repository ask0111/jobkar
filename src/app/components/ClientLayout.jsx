"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getUserCart } from "../redux/actions/cartActions";
import { useAuthContext } from "../contexts/AuthContext";
import { usePathname } from "next/navigation"; // ✅ Import this
import MainHeader from "./MainHeader";
import CommonHeader from "./CommonHeader";
import ScrollHeader from "./ScrollHeader";

const ClientLayout = ({ children }) => {
  const pathname = usePathname(); // ✅ Safe for server/client
  const isHomePage = pathname === "/";
  const [showScrollHeader, setShowScrollHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuthContext();

  useEffect(() => {
    if (!isAuthenticated) return;
    dispatch(getUserCart());
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 300 && lastScrollY > currentScrollY) {
        setShowScrollHeader(true);
      } else {
        setShowScrollHeader(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <React.Suspense fallback={<p>Loading...</p>}>
      {isHomePage ? <MainHeader /> : <CommonHeader />}
      {showScrollHeader && <ScrollHeader />}
      {children}
    </React.Suspense>
  );
};

export default ClientLayout;
