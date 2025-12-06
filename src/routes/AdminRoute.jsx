import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { lazy, Suspense } from "react";

const LoadingScreen = lazy(() => import("../components/Loading"));

export default function AdminRoute({ children }) {
  const { role, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (role !== "admin") return <Navigate to="/admin/login" />;

  return children;
}
