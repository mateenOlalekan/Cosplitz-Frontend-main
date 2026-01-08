import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const AdminRoute = () => {
  // Get helpers and state
  const { isAuthenticated, isAdmin, isLoading } = useAuthStore();

  if (isLoading) {
    return null;
  }

  // 1. First check if user is logged in at all
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // 2. Then check if they have admin privileges using the store's helper
  if (!isAdmin()) {
    // Redirect regular users to the dashboard instead of login
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;