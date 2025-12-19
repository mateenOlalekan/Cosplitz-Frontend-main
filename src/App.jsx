import { Suspense, lazy,useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import "./App.css";

// Import route components directly (not lazy)
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminProtectedRoute from "./routes/AdminRoute";
import RoleRoute from "./routes/RoleRoute";

// Loading Component
const Loading = lazy(() => import("./components/Loading"));

// Public Pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Auth/Login/index"));
const Register = lazy(() => import("./pages/Auth/Register/index")); // ✅ FIXED: Changed from Auth/Register/index
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Forget = lazy(() => import("./pages/Auth/ForgetPassword/ForgetPassword"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const ConfirmPassword = lazy(() => import("./pages/Auth/ConfirmPassword/ConfirmPassword"));
const PasswordResetSuccess = lazy(() => import("./pages/PasswordResetSuccess"));
const OnboardingSteps = lazy(() => import("./pages/OnBoardingSteps"));


// Dashboard Pages
const DashboardLayout = lazy(() => import("./components/Layout/DashboardLayout"));
const Overview = lazy(() => import("./pages/Dashboard/DashHome"));
const Analytics = lazy(() => import("./pages/Dashboard/Analytics"));
const SettingsLayout = lazy(() => import("./pages/Dashboard/Settings/SettingsLayout"));
const MyProfile = lazy(() => import("./pages/Dashboard/Settings/MyProfile"));
const NotificationSettings = lazy(() => import("./pages/Dashboard/Settings/Notifications"));
const Verification = lazy(() => import("./pages/Dashboard/Settings/Verification"));
const Support = lazy(() => import("./pages/Dashboard/Settings/Support"));
const Payment = lazy(() => import("./pages/Dashboard/Payment"));
const Successful = lazy(() => import("./pages/Dashboard/SplitzSuccessful"));
const Wallet = lazy(() => import("./pages/Dashboard/Wallet"));
const CreateSplitzPage = lazy(() => import("./pages/Dashboard/CreateSplitz"));
const ResetPassword = lazy(()=>import("./pages/Dashboard/Settings/ResetPassword"));
const NotificationPage = lazy(() => import("./pages/Dashboard/Notification"));
const Filter = lazy(() => import("./pages/Dashboard/Filter"));
const KYCFlow = lazy(() => import("./pages/Identification/KYCFlow"));

// Admin Pages
const AdminLogin = lazy(() => import("./pages/Admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/Admin/AdminUsers"));
const AdminSplits = lazy(() => import("./pages/Admin/AdminSplits"));

// Error Pages
const NotFound = lazy(() => import("./pages/NotFound"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));



function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboard" element={<Onboarding />} />
        <Route path="/forgot-password" element={<Forget />} />



        <Route path="/confirm-password" element={<ConfirmPassword />} />
        <Route path="/password-reset-success" element={<PasswordResetSuccess />} />
        <Route path="/kyc-flow" element={<KYCFlow />} />

        {/* PROTECTED USER DASHBOARD */}
        <Route element={<ProtectedRoute />}>
        <Route path="/onboarding-steps" element={<OnboardingSteps />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="create-split" element={<CreateSplitzPage />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="payment" element={<Payment />} />
            <Route path="notification" element={<NotificationPage />} />
            <Route path="filter" element={<Filter />} />
            <Route path="splitz-success" element={<Successful />} />

            <Route path="settings" element={<SettingsLayout />}>
              <Route index element={<MyProfile />} />
              <Route path="profile" element={<MyProfile />} />
              <Route path="notifications" element={<NotificationSettings />} />
              <Route path="verification" element={<Verification />} />
              <Route path="resetpassword" element={<ResetPassword />} />
              <Route path="support" element={<Support />} />
            </Route>
          </Route>
        </Route>

        {/* ADMIN ROUTES */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/splits" element={<AdminSplits />} />
        </Route>

        {/* ROLE RESTRICTED ROUTES */}
        <Route element={<RoleRoute allowedRoles={["admin", "moderator"]} />}>
          <Route path="/moderation" element={<div>Moderation Panel</div>} />
        </Route>

        {/* ERRORS */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;