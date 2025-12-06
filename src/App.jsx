import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import "./App.css";


import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

// Loading
const SplashLogo = lazy(() => import("./components/Loading"));

// Public Pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Auth/Login/Login"));
const Register = lazy(() => import("./pages/Auth/Register/Register"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Identify = lazy(() => import("./pages/Identification"));
const Forget = lazy(() => import("./pages/ForgetPassword"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const ConfirmPassword = lazy(() => import("./pages/ConfirmPassword"));
const PasswordResetSuccess = lazy(() =>  import("./pages/PasswordResetSuccess"));
const OnboardingSteps = lazy(() => import("./pages/OnBoardingSteps"));

// Dashboard
const DashboardLayout = lazy(() =>  import("./components/Layout/DashboardLayout"));
const Overview = lazy(() => import("./pages/Dashboard/DashHome"));
const Analytics = lazy(() => import("./pages/Dashboard/Analytics"));
const SettingsLayout = lazy(() =>  import("./pages/Dashboard/Settings/SettingsLayout"));
const MyProfile = lazy(() => import("./pages/Dashboard/Settings/MyProfile"));
const NotificationSettings = lazy(() =>  import("./pages/Dashboard/Settings/Notifications"));
const Verification = lazy(() =>  import("./pages/Dashboard/Settings/Verification"));
const Support = lazy(() => import("./pages/Dashboard/Settings/Support"));
const Payment = lazy(() => import("./pages/Dashboard/Payment"));
const Successful = lazy(() => import("./pages/Dashboard/SplitzSuccessful"));
const Wallet = lazy(() => import("./pages/Dashboard/Wallet"));
const CreateSplitzPage = lazy(() =>  import("./pages/Dashboard/CreateSplitz"));
const NotificationPage = lazy(() =>  import("./pages/Dashboard/Notification"));
const Filter = lazy(() => import("./pages/Dashboard/Filter"));

// Admin Pages
const AdminLogin = lazy(() => import("./pages/Admin/AdminLogin"));
const AdminDashboard = lazy(() =>  import("./pages/Admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/Admin/AdminUsers"));
const AdminSplits = lazy(() => import("./pages/Admin/AdminSplits"));

export default function App() {
  return (

      <Suspense fallback={<SplashLogo />}>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/onboard" element={<Onboarding />} />
          <Route path="/identify" element={<Identify />} />
          <Route path="/onboarding-steps" element={<OnboardingSteps />} />

          <Route path="/forgot-password" element={<Forget />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/confirm-password" element={<ConfirmPassword />} />
          <Route
            path="/password-reset-success"
            element={<PasswordResetSuccess />}
          />

          {/* PROTECTED USER DASHBOARD */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
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
              <Route path="notifications"  element={<NotificationSettings />}              />
              <Route path="verification" element={<Verification />} />
              <Route path="support" element={<Support />} />
            </Route>
          </Route>

          {/* ADMIN ROUTES */}
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/splits"
            element={
              <AdminRoute>
                <AdminSplits />
              </AdminRoute>
            }
          />
        </Routes>
      </Suspense>

  );
}
