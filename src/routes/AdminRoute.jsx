import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
const Loading = React.lazy(() => import("../components/Loading"));


const AdminProtectedRoute = () => {
  const { isAuthenticated, isLoading, isAdmin } = useAuthStore();

  if (isLoading) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  if (!isAdmin()) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};

export default AdminProtectedRoute;