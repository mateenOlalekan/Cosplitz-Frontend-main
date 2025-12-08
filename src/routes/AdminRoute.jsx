import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function AdminRoute({ children }) {
  const { token, role } = useAuthStore();

  if (!token) return <Navigate to="/admin/login" replace />;
  if (role !== "admin") return <Navigate to="/dashboard" replace />;

  return children;
}
