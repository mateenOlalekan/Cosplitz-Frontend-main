import React, { lazy, Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const Loading = lazy(() => import("../components/Loading"));

const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) {
    return (
      <Suspense fallback={null}>
        <Loading />
      </Suspense>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
