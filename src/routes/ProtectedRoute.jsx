// import { Navigate, Outlet } from "react-router-dom";
// import useAuthStore from "../store/authStore";

// const ProtectedRoute = () => {
//   const { user, isAuthenticated, isLoading } = useAuthStore();

//   if (isLoading) return null; 

//   if (!isAuthenticated() || !user) {
//     return <Navigate to="/login" replace />;
//   }

//   return <Outlet />;
// };

// export default ProtectedRoute;
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import SplashScreen from "../components/Other/Loading";

const ProtectedRoute = () => {
  // Get helper function and state from store
  const { isAuthenticated, isLoading } = useAuthStore();

  // Optional: You can replace 'null' with a <LoadingSpinner /> component
  if (isLoading) {
    return <SplashScreen/>
  }

  // Use the store's check function
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;