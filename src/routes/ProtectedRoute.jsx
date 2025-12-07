import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { lazy, Suspense } from "react";

const LoadingScreen = lazy(() => import("../components/Loading"));

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <LoadingScreen />
      </Suspense>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}
