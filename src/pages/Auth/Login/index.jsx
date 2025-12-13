// src/pages/Login.jsx
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { PiAppleLogoBold } from "react-icons/pi";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import loginlogo from "../../../assets/loginmain.jpg";
import logo from "../../../assets/logo.svg";
import { authService } from "../../../services/api";
import { useAuthStore } from "../../../store/authStore";
import { loginSchema } from "../../../schemas/authSchemas";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [guestMode, setGuestMode] = useState(false);

  const navigate = useNavigate();

  // ✅ NEW AUTH STORE USAGE
  const setAuth = useAuthStore.getState().setAuth;
  const setError = useAuthStore((s) => s.setError);
  const clearError = useAuthStore((s) => s.clearError);
  const apiError = useAuthStore((s) => s.error);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = async (data) => {
    setLoading(true);
    clearError();

    try {
      const res = await authService.login({
        email: data.email.toLowerCase().trim(),
        password: data.password,
      });

      if (!res?.data) {
        setError("Invalid login response.");
        return;
      }

      const token = res.data.access_token || res.data.token;
      const user = res.data.user || res.data;
      const isVerified = !!res.data.is_verified;

      if (!token || !user) {
        setError("Invalid email or password.");
        return;
      }

      /* 🔁 UNVERIFIED USER FLOW */
      if (!isVerified) {
        await authService.getOTP(user.id);

        setAuth({
          token,
          user,
          isVerified: false,
        });

        navigate("/verify-email", { replace: true });
        return;
      }

      /* ✅ VERIFIED USER */
      setAuth({
        token,
        user,
        isVerified: true,
      });

      if (user?.role === "admin" || user?.is_admin === true) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }

    } catch (error) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Login failed. Please try again.";

      setError(errorMessage);
      reset({ password: "" });
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SOCIAL LOGIN ---------------- */
  const handleSocialLogin = (provider) => {
    clearError();
    setError(`${provider} login is not available yet.`);
  };

  /* ---------------- GUEST LOGIN (UNCHANGED) ---------------- */
  const handleGuestLogin = () => {
    clearError();
    setGuestMode(true);

    const guestUser = {
      id: "guest_" + Date.now(),
      email: "guest@example.com",
      name: "Guest User",
      role: "guest",
      is_admin: false,
      is_guest: true,
    };

    setAuth({
      token: "guest_token_" + Date.now(),
      user: guestUser,
      isVerified: true,
    });

    navigate("/dashboard", {
      replace: true,
      state: { isGuest: true },
    });
  };

  const handleInputFocus = () => {
    if (apiError) clearError();
  };

  /* ---------------- UI (UNCHANGED) ---------------- */
  return (
    <div className="flex bg-[#F7F5F9] w-full h-screen justify-center overflow-hidden md:px-6 md:py-2 rounded-2xl">
      <div className="flex max-w-screen-2xl w-full h-full bg-white rounded-xl overflow-hidden">

        {/* LEFT IMAGE */}
        <div className="hidden lg:block lg:w-1/2 lg:h-screen">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative w-full h-full"
          >
            <img src={loginlogo} alt="Illustration" className="w-full h-full object-cover" />
          </motion.div>
        </div>

        {/* FORM */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 flex flex-col justify-center p-6"
        >
          <img src={logo} alt="Logo" className="h-12 mb-6" />

          {apiError && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{apiError}</p>
            </div>
          )}

          {guestMode && (
            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-600 text-sm text-center">
                You are browsing in guest mode with limited features.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <input
              type="email"
              {...register("email")}
              onFocus={handleInputFocus}
              placeholder="Email"
              className="w-full px-4 py-3 border rounded-lg"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                onFocus={handleInputFocus}
                placeholder="Password"
                className="w-full px-4 py-3 border rounded-lg pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <button
            type="button"
            onClick={handleGuestLogin}
            className="mt-4 text-green-600 text-sm"
          >
            Proceed as Guest
          </button>
        </motion.div>
      </div>
    </div>
  );
}
