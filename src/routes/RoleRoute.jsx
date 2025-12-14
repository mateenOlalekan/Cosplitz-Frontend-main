import React, { lazy } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const Loading = lazy(() => import("../components/Loading"));

const RoleRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  if (isLoading) return <Loading />;

  if (!isAuthenticated()) return <Navigate to="/login" replace />;

  // Map backend boolean fields to roles
  const userRole = user?.is_admin ? "admin" : "customer";

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
