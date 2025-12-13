import React, { lazy, Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const Loading = lazy(() => import("../components/Loading"));

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) {
    return (
      <Suspense fallback={null}>
        <Loading />
      </Suspense>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/register" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
