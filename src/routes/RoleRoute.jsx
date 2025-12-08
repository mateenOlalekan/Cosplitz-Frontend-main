import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function RoleRoute({ children, allowedRoles }) {
  const { role, token } = useAuthStore();

  if (!token) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(role)) return <Navigate to="/" replace />;

  return children;
}
