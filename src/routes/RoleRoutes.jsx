import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleRoute({ children, allowed }) {
  const { role } = useAuth();

  return allowed.includes(role) ? children : <Navigate to="/dashboard" />;
}
