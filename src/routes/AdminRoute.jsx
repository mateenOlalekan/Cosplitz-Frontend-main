import React, { lazy, Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const Loading = lazy(() => import("../components/Loading"));

const AdminProtectedRoute = () => {
  const {
    user,
    isAuthenticated,
    isVerified,
    loading,
  } = useAuthStore();

  const isAdmin = user?.is_admin === true;

  if (loading) {
    return (
      <Suspense fallback={null}>
        <Loading />
      </Suspense>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
