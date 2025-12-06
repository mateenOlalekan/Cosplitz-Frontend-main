import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";


export function RequireRole({ allowedRoles }) {
const { user } = useAuth();


if (!user) return <Navigate to="/login" />;


const hasRole = allowedRoles.includes(user.role);
return hasRole ? <Outlet /> : <Navigate to="/unauthorized" />;
}