import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Loading from "../components/Loading";

export default function ProtectedRoute({ children }) {
  const { user,token, loading } = useAuthStore();

  if (loading) return <Loading />;
  if (!token || !user) return <Navigate to="/login" replace />;

  return children;
}
