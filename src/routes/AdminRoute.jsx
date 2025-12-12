import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Loading from "../components/Loading"; // Import directly

const AdminProtectedRoute = () => {
  const { isAuthenticated, isLoading, isAdmin } = useAuthStore();

  if (isLoading) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  if (!isAdmin()) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};

export default AdminProtectedRoute;