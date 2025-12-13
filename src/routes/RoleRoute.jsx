import React, { lazy, Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const Loading = lazy(() => import("../components/Loading"));

const RoleRoute = ({ allowedRoles = [] }) => {
  const {
    user,
    isAuthenticated,
    isVerified,
    loading,
  } = useAuthStore();

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

  if (!isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  const role = user?.role || "user";

  if (allowedRoles.length && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
 