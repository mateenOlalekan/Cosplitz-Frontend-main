import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function RequireAuth() {
const { user, loading } = useAuth();


if (loading) return <p>Loading...</p>;


return user ? <Outlet /> : <Navigate to="/login" />;
}