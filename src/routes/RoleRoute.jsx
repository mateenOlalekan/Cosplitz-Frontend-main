import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const RoleRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const userRole = user?.role || "user";
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;