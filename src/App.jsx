import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import "./App.css";

// Loading / Splash
const SplashLogo = lazy(() => import("./components/Loading"));

// Public Pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Identify = lazy(() => import("./pages/Identification"));
const Forget = lazy(() => import("./pages/ForgetPassword"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const ConfirmPassword = lazy(() => import("./pages/ConfirmPassword"));
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
const NotificationPage = lazy(() => import("./pages/Dashboard/Notification"));
const Filter = lazy(() => import("./pages/Dashboard/Filter"));

export default function App() {
  return (
    <Suspense fallback={<SplashLogo />}>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Onboarding */}
        <Route path="/onboard" element={<Onboarding />} />
        <Route path="/identify" element={<Identify />} />
        <Route path="/onboarding-steps" element={<OnboardingSteps />} />

        {/* Password / Recovery */}
        <Route path="/forgot-password" element={<Forget />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/confirm-password" element={<ConfirmPassword />} />
        <Route path="/password-reset-success" element={<PasswordResetSuccess />} />

        {/* Dashboard (Nested Layout) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="create-split" element={<CreateSplitzPage />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="payment" element={<Payment />} />
          <Route path="notification" element={<NotificationPage />} />
          <Route path="filter" element={<Filter />} />
          <Route path="splitz-success" element={<Successful />} /> {/* fixed casing */}

          {/* Dashboard Settings Nested */}
          <Route path="settings" element={<SettingsLayout />}>
            <Route index element={<MyProfile />} />
            <Route path="profile" element={<MyProfile />} />
            <Route path="notifications" element={<NotificationSettings />} />
            <Route path="verification" element={<Verification />} />
            <Route path="support" element={<Support />} />
          </Route>
        </Route>

      </Routes>
    </Suspense>
  );
}