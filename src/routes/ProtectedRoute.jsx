// routes/ProtectedRoute.js
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Loading from "../components/Loading"; // Import directly

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <Loading />;
  }
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;