import React, { lazy } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const Loading = lazy(() => import("../components/Loading"));

const AdminProtectedRoute = () => {
  const { isAuthenticated, isLoading, isAdmin } = useAuthStore();

  if (isLoading) return <Loading />;

  // Not logged in
  if (!isAuthenticated()) return <Navigate to="/admin/login" replace />;

  // Logged in but not admin
  if (!isAdmin()) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};

export default AdminProtectedRoute;
