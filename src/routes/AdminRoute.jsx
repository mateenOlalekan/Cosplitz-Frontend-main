import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { lazy, Suspense } from "react";

const LoadingScreen = lazy(() => import("../components/Loading"));

export default function AdminRoute({ children }) {
  const { role, loading } = useAuthStore();

  if (loading) return <LoadingScreen />;

  return role === "admin" ? children : <Navigate to="/admin/login" replace />;
}
