import React, { lazy, Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const Loading = lazy(() => import("../components/Loading"));

const AdminProtectedRoute = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const isAdmin = useAuthStore((s) => s.isAdmin());
  const isVerified = useAuthStore((s) => s.isVerified);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) {
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
