// src/pages/Auth/Login/index.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { PiAppleLogoBold } from "react-icons/pi";
import { Eye, EyeOff } from "lucide-react";

import { useLoginMutation } from "../../../services/queries/auth";
import { useAuthStore } from "../../../store/authStore";
import { loginSchema } from "../../../schemas/authSchemas";
import LeftPanel from "../LeftPanel";
import logo from "../../../assets/logo.svg"; // ✅ FIXED PATH

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    setError,
    clearError,
    error,
    setUser,
    setToken,
  } = useAuthStore();

  const loginMutation = useLoginMutation({
    onError: (err) => {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please check your credentials.";

      setError(message);
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const email = watch("email");
  const password = watch("password");

  // Clear global error only when user starts correcting input
  useEffect(() => {
    if (error && (email.length > 2 || password.length > 2)) {
      clearError();
    }
  }, [email, password, error, clearError]);

  const onSubmit = async ({ email, password }) => {
    clearError();

    const response = await loginMutation.mutateAsync({
      email,
      password,
    });

    /**
     * Expected response:
     * {
     *   message: string,
     *   token: string,
     *   refresh_token?: string,
     *   user?: object
     * }
     */

    if (!response?.token) return;

    setToken(response.token);

    if (response.refresh_token) {
      localStorage.setItem("refreshToken", response.refresh_token);
    }

    setUser(
      response.user ?? {
        email,
        name: email.split("@")[0],
        role: "user",
      }
    );

    navigate("/dashboard");
  };

  const handleSocialLogin = (provider) => {
    setError(`${provider} login coming soon!`);
  };

  return (
    <div className="flex bg-[#F7F5F9] w-full h-screen justify-center overflow-hidden md:px-6 md:py-4 rounded-2xl">
      <div className="flex max-w-screen-2xl w-full h-full rounded-xl overflow-hidden">

        {/* LEFT */}
        <LeftPanel />

        {/* RIGHT */}
        <div className="flex flex-1 flex-col items-center p-3 overflow-y-auto">
          <div className="w-full mb-4 flex justify-center md:justify-start">
            <img src={logo} alt="Logo" className="h-10 md:h-12" />
          </div>

          <div className="w-full max-w-2xl p-5 rounded-xl md:shadow-md md:border bg-white space-y-6">
            <h1 className="text-3xl text-center font-bold text-gray-900">
              Welcome Back
            </h1>

            <p className="text-gray-500 text-center text-sm">
              Sign in to continue sharing expenses.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg text-center">
                {error}
              </div>
            )}

            {/* SOCIAL LOGIN */}
            <div className="grid gap-2">
              <SocialButton
                icon={<FcGoogle size={20} />}
                label="Sign in with Google"
                onClick={() => handleSocialLogin("Google")}
              />
              <SocialButton
                icon={<PiAppleLogoBold size={20} />}
                label="Sign in with Apple"
                onClick={() => handleSocialLogin("Apple")}
              />
            </div>

            <Divider />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* EMAIL */}
              <InputField
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                error={errors.email?.message}
                register={register("email")}
              />

              {/* PASSWORD */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Password *
                </label>
                <div
                  className={`flex items-center border px-3 rounded-lg focus-within:ring-2 ${
                    errors.password
                      ? "border-red-500 focus-within:ring-red-500"
                      : "border-gray-300 focus-within:ring-green-500"
                  }`}
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="w-full py-2 outline-none text-gray-900 placeholder:text-gray-400"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="text-gray-400 hover:text-gray-600 ml-2"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center">
                <label className="flex gap-2 text-sm text-gray-600">
                  <input type="checkbox" {...register("rememberMe")} />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-sm text-green-600">
                  Forgot Password?
                </Link>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold disabled:opacity-60"
              >
                {loginMutation.isPending ? "Signing In..." : "Sign In"}
              </motion.button>

              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="text-green-600 font-medium">
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =======================
   Small Reusable Components
======================= */

function SocialButton({ icon, label, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-3 px-3 py-2 border rounded-lg hover:bg-gray-50"
    >
      {icon}
      <span className="text-sm text-gray-700">{label}</span>
    </motion.button>
  );
}

function Divider() {
  return (
    <div className="flex items-center my-4">
      <div className="flex-grow border-t" />
      <span className="mx-2 text-gray-500 text-sm">Or</span>
      <div className="flex-grow border-t" />
    </div>
  );
}

function InputField({ label, type, placeholder, error, register }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 block mb-1">
        {label} *
      </label>
      <input
        type={type}
        placeholder={placeholder}
        {...register}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none text-gray-900 placeholder:text-gray-400 ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-green-500"
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
