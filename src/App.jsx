import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import "./App.css";

/* Loading */
const SplashLogo = lazy(() => import("./components/Loading"));

/* Public Pages */
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

/* Dashboard */
const DashboardLayout = lazy(() => import("./components/Layout/DashboardLayout"));
const Overview = lazy(() => import("./pages/Dashboard/DashHome"));
const Messages = lazy(() => import("./pages/Dashboard/Messages"));
const Analytics = lazy(() => import("./pages/Dashboard/Analytics"));
const MySplitz = lazy(() => import("./pages/Dashboard/MySplitz"));
const Payment = lazy(() => import("./pages/Dashboard/Payment"));
const Successful = lazy(() => import("./pages/Dashboard/SplitzSuccessful"));
const Wallet = lazy(() => import("./pages/Dashboard/Wallet"));
const CreateSplitzPage = lazy(() => import("./pages/Dashboard/CreateSplitz"));
const NotificationPage = lazy(() => import("./pages/Dashboard/Notification"));
const Filter = lazy(() => import("./pages/Dashboard/Filter"));
const AllTasksPage = lazy(() => import("./pages/Dashboard/AllTasksPage"));
const SplitzDescriptionPage = lazy(() => import("./pages/Dashboard/SplitzDescriptionPage"));
const SplitDetailPage = lazy(() => import("./pages/Dashboard/splitCardPage"));
const SplitCardPage = lazy(() => import("./pages/Dashboard/splitCardPage"));
const Other = lazy(() => import("./pages/Dashboard/Other"));

/* Settings */
const SettingsLayout = lazy(() => import("./pages/Dashboard/Settings/SettingsLayout"));
const MyProfile = lazy(() => import("./pages/Dashboard/Settings/MyProfile"));
const NotificationSettings = lazy(() => import("./pages/Dashboard/Settings/Notifications"));
const Verification = lazy(() => import("./pages/Dashboard/Settings/Verification"));
const Support = lazy(() => import("./pages/Dashboard/Settings/Support"));
const ResetPassword = lazy(() => import("./pages/Dashboard/Settings/ResetPassword"));





/* KYC */
const KYCConfirmation = lazy(() =>
  import("./pages/Identification/KYCConfirmation")
);

export default function App() {
  return (
    <Suspense fallback={<SplashLogo />}>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Onboarding */}
        <Route path="/onboard" element={<Onboarding />} />
        <Route path="/identify" element={<Identify />} />
        <Route path="/onboarding-steps" element={<OnboardingSteps />} />

        {/* Password */}
        <Route path="/forgot-password" element={<Forget />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/confirm-password" element={<ConfirmPassword />} />
        <Route path="/password-reset-success" element={<PasswordResetSuccess />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="mysplitz" element={<MySplitz />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="messages" element={<Messages />} />
          <Route path="create-splitz" element={<CreateSplitzPage />} />
          <Route path="kyc-flow" element={<KYCConfirmation />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="payment" element={<Payment />} />
          <Route path="notification" element={<NotificationPage />} />
          <Route path="filter" element={<Filter />} />
          <Route path="splitz-success" element={<Successful />} />
          <Route path="all-tasks" element={<AllTasksPage />} />
          <Route path="splitz/:id" element={<SplitzDescriptionPage />} />
          <Route path="other" element={<Other />} />
                  <Route path="/create-split" element={<CreateSplitzPage />} />
        <Route path="/splits/:id" element={<SplitDetailPage />} />
        <Route path="/split-card/:id" element={<SplitCardPage />} />
        <Route path="/all-tasks" element={<AllTasksPage />} />

          {/* Settings */}
          <Route path="settings" element={<SettingsLayout />}>
            <Route index element={<MyProfile />} />
            <Route path="profile" element={<MyProfile />} />
            <Route path="notifications" element={<NotificationSettings />} />
            <Route path="verification" element={<Verification />} />
            <Route path="resetpassword" element={<ResetPassword />} />
            <Route path="support" element={<Support />} />
          </Route>
        </Route>

      </Routes>
    </Suspense>
  );
}
