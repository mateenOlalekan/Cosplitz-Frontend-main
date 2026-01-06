import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import "./App.css";

/* Route Guards */
const ProtectedRoute = lazy(() => import("./routes/ProtectedRoute"));
// const AdminRoute = lazy(() => import("./routes/AdminRoute"));

/* Loading */
const LoadingScreen = lazy(() => import("./components/Other/Loading"));

/* Public Pages */
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Auth/Login"));
const Register = lazy(() => import("./pages/Auth/Register"));
const PreOnboard = lazy(() => import("./pages/Onboard/pre-onboarding"));
const PostOnboard = lazy(() => import("./pages/Onboard/post-onboard"));
const Identify = lazy(() => import("./pages/Identification/KYCFlow"));
const ForgetPassword = lazy(() => import("./pages/Auth/ForgetPassword"));
const VerifyEmail = lazy(() => import("./pages/Auth/VerifyEmail"));
const PasswordResetSuccess = lazy(() => import("./pages/Auth/PasswordReset"));

/* Dashboard Layout */
const DashboardLayout = lazy(() =>
  import("./components/Layout/DashboardLayout")
);

/* Dashboard Pages */
const Overview = lazy(() => import("./pages/Dashboard/Overview"));
const Messages = lazy(() => import("./pages/Dashboard/Messages"));
const Analytics = lazy(() => import("./pages/Dashboard/Analytics"));
const Payment = lazy(() => import("./pages/Dashboard/Payment"));
const Wallet = lazy(() => import("./pages/Dashboard/Wallet"));
const Notification = lazy(() => import("./pages/Dashboard/Notification"));

/* Splitz Pages */
// const CreateSplitz = lazy(() => import("./pages/Dashboard/CreateSplitz"));
// const MySplitz = lazy(() => import("./pages/Dashboard/MySplitz"));
// const SplitzDetail = lazy(() => import("./pages/Dashboard/SplitzDetail"));

// const AllSplits = lazy(() => import("./components/Splitz/AllSplitsPage"));
// const MySplits = lazy(() => import("./pages/Dashboard/MySplits"));
// const SplitzSuccessful = lazy(() => import("./pages/Dashboard/SplitzSuccessful")); // ✅ Updated import name for clarity

/* Settings */
const SettingsLayout = lazy(() =>
  import("./pages/Dashboard/Settings/SettingsLayout")
);
const MyProfile = lazy(() => import("./pages/Dashboard/Settings/MyProfile"));
const NotificationSettings = lazy(() =>
  import("./pages/Dashboard/Settings/Notifications")
);
const Verification = lazy(() =>
  import("./pages/Dashboard/Settings/Verification")
);
const Support = lazy(() => import("./pages/Dashboard/Settings/Support"));
const ResetPassword = lazy(() =>
  import("./pages/Dashboard/Settings/ResetPassword")
);

/* KYC */
const KYCConfirmation = lazy(() =>
  import("./pages/Identification/KYCConfirmation")
);

/* 404 */
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* ============================================
            PUBLIC ROUTES
        ============================================ */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pre-onboard" element={<PreOnboard />} />
        <Route path="/identify" element={<Identify />} />

        {/* Password Recovery */}
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/password-reset-success" element={<PasswordResetSuccess />}        />

        {/* ============================================
            PROTECTED ROUTES (Require Authentication)
        ============================================ */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            {/* Main Dashboard Pages */}
            <Route index element={<Overview />} />
            <Route path="post-onboarding" element={<PostOnboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="messages" element={<Messages />} />
            <Route path="kyc-flow" element={<KYCConfirmation />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="payment" element={<Payment />} />
            <Route path="notification" element={<Notification />} />

            {/* ============================================
                SPLITZ ROUTES
            ============================================ */}
            {/* <Route path="create-splitz" element={<CreateSplitz />} />
            <Route path="mysplitz" element={<MySplitz />} />
            <Route path="allsplits" element={<AllSplits />} />
            <Route path="my-splits" element={<MySplits />} />
            <Route path="splitz-details/:id" element={<SplitzDetail />} /> */}
            
            {/* ✅ SUCCESS PAGE - Already configured correctly! */}
            <Route path="splitz-success" element={<SplitzSuccessful />} />

            {/* ============================================
                SETTINGS ROUTES (Nested)
            ============================================ */}
            <Route path="settings" element={<SettingsLayout />}>
              <Route index element={<MyProfile />} />
              <Route path="profile" element={<MyProfile />} />
              <Route path="notifications" element={<NotificationSettings />} />
              <Route path="verification" element={<Verification />} />
              <Route path="reset-password" element={<ResetPassword />} />
              <Route path="support" element={<Support />} />
            </Route>
          </Route>
        </Route>

        {/* ============================================
            404 - NOT FOUND
        ============================================ */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}