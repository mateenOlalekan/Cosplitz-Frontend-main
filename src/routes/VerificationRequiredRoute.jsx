// src/routes/VerificationRequiredRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
const Loading = React.lazy(() => import("../components/Loading"));

const VerificationRequiredRoute = () => {
  const { isAuthenticated, isLoading, isVerified } = useAuthStore();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user is not verified, redirect to verification page
  if (!isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return <Outlet />;
};

export default VerificationRequiredRoute;