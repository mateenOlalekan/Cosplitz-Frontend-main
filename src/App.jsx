import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import "./App.css";

/* Loading */
const SplashLogo = lazy(() => import("./components/Other/Loading"));

/* Public Pages */
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Auth/Login/index"));
const Register = lazy(() => import("./pages/Auth/Register/index"));
const PreOnboard = lazy(() => import("./pages/Onboard/pre-onboarding"));
const PostOnboard = lazy(() => import("./pages/Onboard/post-onboard"));
const Identify = lazy(() => import("./pages/Identification/KYCFlow"));
const ForgetPassword = lazy(() =>  import("./pages/Auth/ForgetPassword/index"));
const VerifyEmail = lazy(() => import("./pages/Auth/VerifyEmail/index"));
const PasswordResetSuccess = lazy(() => import("./pages/Auth/PasswordReset/index"));

/* Dashboard Layout */
const DashboardLayout = lazy(() => import("./components/Layout/DashboardLayout"));

/* Dashboard Pages */
const Overview = lazy(() => import("./pages/Dashboard/Overview"));
const Messages = lazy(() => import("./pages/Dashboard/Messages"));
const Analytics = lazy(() => import("./pages/Dashboard/Analytics"));
const Payment = lazy(() => import("./pages/Dashboard/Payment"));
const Successful = lazy(() =>  import("./pages/Dashboard/SplitzSuccessful"));
const Wallet = lazy(() => import("./pages/Dashboard/Wallet"));
const CreateSplitzPage = lazy(() =>  import("./pages/Dashboard/CreateSplitz"));
const NotificationPage = lazy(() =>  import("./pages/Dashboard/Notification"));
const MySplitz = lazy(() => import("./pages/Dashboard/MySplitz"));
const SplitzDetail = lazy(() => import("./components/SplitCard/index"));
const AllSplitsPage = lazy(()=> import("./pages/Dashboard/AllSplitsPage"));
const MySplitsPage = lazy(()=> import("./pages/Dashboard/MySplitsPage"));

/* Settings */
const SettingsLayout = lazy(() =>  import("./pages/Dashboard/Settings/SettingsLayout"));
const MyProfile = lazy(() =>  import("./pages/Dashboard/Settings/MyProfile"));
const NotificationSettings = lazy(() =>  import("./pages/Dashboard/Settings/Notifications"));
const Verification = lazy(() =>  import("./pages/Dashboard/Settings/Verification"));
const Support = lazy(() =>  import("./pages/Dashboard/Settings/Support"));
const ResetPassword = lazy(() =>  import("./pages/Dashboard/Settings/ResetPassword"));

/* KYC */
const KYCConfirmation = lazy(() =>  import("./pages/Identification/KYCConfirmation"));

/* 404 */
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  return (
    <Suspense fallback={<SplashLogo />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pre-onboard" element={<PreOnboard />} />
        <Route path="/identify" element={<Identify />} />

        {/* Password */}
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/password-reset-success"  element={<PasswordResetSuccess />}/>

        {/* Dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="post-onboarding" element={<PostOnboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="messages" element={<Messages />} />

          <Route path="kyc-flow" element={<KYCConfirmation />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="payment" element={<Payment />} />
          <Route path="notification" element={<NotificationPage />} />
          <Route path="SplitzDetail" element={<SplitzDetail/>}/>
          <Route path="mysplitz" element={<MySplitz />} />
          <Route path="splitz-success" element={<Successful />} />

          <Route path="create-splitz" element={<CreateSplitzPage/>} />
          <Route path="Allsplits" element={<AllSplitsPage />} />
          <Route path="my-splits" element={<MySplitsPage />} />
          <Route path="other" element={<AllSplitsPage />} />

          {/* Settings */}
          <Route path="settings" element={<SettingsLayout />}>
            <Route index element={<MyProfile />} />
            <Route path="profile" element={<MyProfile />} />
            <Route path="notifications" element={<NotificationSettings />}/>
            <Route path="verification" element={<Verification />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="support" element={<Support />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
