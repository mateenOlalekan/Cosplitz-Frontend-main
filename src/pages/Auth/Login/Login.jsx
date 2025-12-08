import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { PiAppleLogoBold } from "react-icons/pi";
import { useNavigate, Link } from "react-router-dom";

import loginlogo from "../../../assets/loginmain.jpg";
import logo from "../../../assets/logo.svg";
import { useForm } from "react-hook-form";
import { schema } from "./Schema";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError("");
    try {
      const response = await loginUser({
        email: data.email,
        password: data.password,
      });

      if (response.status === 200 && response.data?.token) {
        const { token, user } = response.data;

        localStorage.setItem("authToken", token);
        localStorage.setItem("userInfo", JSON.stringify(user));

        navigate("/dashboard");
      } else {
        setApiError(response.data?.message || "Login failed. Check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setApiError(error.response?.data?.message || "An error occurred during login.");
    }
    setLoading(false);
  };

  return (
    <div className="h-screen flex flex-col px-8 py-2 lg:flex-row bg-white relative xl:flex-row w-full overflow-y-auto rounded-2xl">

      {/* LEFT IMAGE PANEL */}
      <div className="hidden lg:block lg:w-1/2 h-screen">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative flex items-center justify-center bg-gray-50 h-full"
        >
          <img
            src={loginlogo}
            alt="Illustration"
            className="w-full h-full object-cover rounded-tl-2xl rounded-bl-2xl"
          />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="absolute bottom-10 mx-6 bg-white/40 backdrop-blur-xl rounded-2xl p-6 max-w-lg shadow-xl text-center"
          >
            <h1 className="text-3xl lg:text-4xl font-semibold text-[#2D0D23] mb-2">
              Share Expenses & Resources in Real Time
            </h1>
            <p className="text-base lg:text-[18px] text-[#4B4B4B] leading-relaxed">
              Connect with students, travelers, and locals to effortlessly manage costs and resources — anonymously and securely.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* RIGHT LOGIN PANEL */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-1/2 px-2 sm:px-10 md:px-16 py-2 flex flex-col justify-center items-center overflow-y-hidden"
      >
        {/* Logo */}
        <div className="w-full mb-6 flex justify-start">
          <img src={logo} alt="Logo" className="h-10 md:h-12 w-auto" />
        </div>

        {/* Header */}
        <div className="w-full text-center mb-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Log in to your account
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mt-3 leading-relaxed">
            Welcome back to your peer-to-peer cost <br className="hidden sm:block" /> sharing platform
          </p>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-1 gap-2 my-2 w-full">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FcGoogle size={22} />
            <span className="text-gray-700 font-medium text-sm sm:text-base">
              Log in with Google
            </span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <PiAppleLogoBold size={22} />
            <span className="text-gray-700 font-medium text-sm sm:text-base">
              Log in with Apple
            </span>
          </motion.button>
        </div>

        {/* Divider */}
        <div className="relative w-full my-2.5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-gray-500">Or</span>
          </div>
        </div>

        {/* FORM */}
        <form className="w-full space-y-3" onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="Enter your email"
              className={`w-full px-3 py-2 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-green-500 outline-none`}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Enter your password"
                className={`w-full px-3 py-2 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-lg pr-10 focus:ring-2 focus:ring-green-500 outline-none`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input type="checkbox" {...register("agreeToTerms")} className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
              <label className="text-sm text-gray-700">Remember me</label>
            </div>
            <Link to="forgot-password" className="text-green-600 text-sm cursor-pointer">
              Forgot Password?
            </Link>
          </div>

          {apiError && <p className="text-xs text-red-500">{apiError}</p>}

          {/* SUBMIT */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className={`w-full bg-green-600 text-white py-3 rounded-lg font-semibold transition ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-green-700"}`}
          >
            {loading ? "Processing..." : "Login"}
          </motion.button>

          {/* Sign Up */}
          <p className="text-center text-sm text-gray-600 mt-1">
            Don’t have an account?{" "}
            <Link to="/register" className="text-green-600 font-medium hover:underline">
              Sign Up
            </Link>
          </p>

          {/* Guest */}
          <p className="text-center text-sm">
            <a className="text-green-600 hover:underline cursor-pointer">Proceed as Guest</a>
            <span className="text-gray-400 ml-1">(Limited Features)</span>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
