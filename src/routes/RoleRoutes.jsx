import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function RoleRoute({ children, allowed }) {
  const { role } = useAuthStore();

  return allowed.includes(role)
    ? children
    : <Navigate to="/dashboard" replace />;
}
