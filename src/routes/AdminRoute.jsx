import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../components/Loading";

export default function AdminRoute({ children }) {
  const { role, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (role !== "admin") return <Navigate to="/admin/login" />;

  return children;
}
