import React, { lazy, Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const Loading = lazy(() => import("../components/Loading"));

const RoleRoute = ({ allowedRoles = [] }) => {
  const { user, isVerified } = useAuthStore();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) {
    return (
      <Suspense fallback={null}>
        <Loading />
      </Suspense>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (!isVerified) return <Navigate to="/verify-email" replace />;

  const role = user?.role || "user";
  if (allowedRoles.length && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
