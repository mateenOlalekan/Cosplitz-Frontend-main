import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const AdminProtectedRoute = () => {
  const { isAuthenticated, isLoading, isAdmin } = useAuthStore();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  if (!isAdmin()) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};

export default AdminProtectedRoute;