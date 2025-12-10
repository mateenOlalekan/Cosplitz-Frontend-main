import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { PiAppleLogoBold } from "react-icons/pi";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import loginlogo from "../../assets/loginmain.jpg";
import logo from "../../assets/logo.svg";
import { authService } from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import { loginSchema } from "../../schemas/authSchemas";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [guestMode, setGuestMode] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const setError = useAuthStore((state) => state.setError);
  const clearError = useAuthStore((state) => state.clearError);
  const apiError = useAuthStore((state) => state.error);

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

  const onSubmit = async (data) => {
    setLoading(true);
    clearError();

    try {
      const response = await authService.login({
        email: data.email.toLowerCase().trim(),
        password: data.password,
      });

      console.log("Login response:", response);

      if (response.data?.access_token || response.data?.token) {
        const token = response.data.access_token || response.data.token;
        const user = response.data.user || response.data;
        
        // If remember me is checked, store in localStorage
        if (data.rememberMe) {
          localStorage.setItem("authToken", token);
          localStorage.setItem("userInfo", JSON.stringify(user));
        } else {
          // Store in sessionStorage for session-only persistence
          sessionStorage.setItem("authToken", token);
          sessionStorage.setItem("userInfo", JSON.stringify(user));
        }
        
        // Update Zustand store
        login(user, token);
        
        // Navigate based on user role
        setTimeout(() => {
          if (user?.role === 'admin' || user?.is_admin === true) {
            navigate("/admin/dashboard", { replace: true });
          } else {
            navigate("/dashboard", { replace: true });
          }
        }, 100);
        
      } else {
        setError(response.data?.message || "Invalid email or password. Please try again.");
      }
    } catch (error) {
      console.error("Login error details:", error);
      
      // Better error handling
      const errorMessage = 
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "An error occurred during login. Please check your credentials and try again.";
      
      setError(errorMessage);
      
      // Clear form password on error
      reset({ password: "" });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    clearError();
    console.log(`Login with ${provider}`);
    setError(`${provider} login is not available yet.`);
  };

  const handleGuestLogin = () => {
    clearError();
    setGuestMode(true);
    
    // Create a guest user object
    const guestUser = {
      id: 'guest_' + Date.now(),
      email: 'guest@example.com',
      name: 'Guest User',
      role: 'guest',
      is_admin: false,
      is_guest: true,
    };
    
    const guestToken = 'guest_token_' + Date.now();
    
    // Store in sessionStorage for session-only
    sessionStorage.setItem("authToken", guestToken);
    sessionStorage.setItem("userInfo", JSON.stringify(guestUser));
    
    // Update Zustand store
    login(guestUser, guestToken);
    
    // Navigate to dashboard with guest limitations
    navigate("/dashboard", { 
      replace: true,
      state: { isGuest: true }
    });
  };

  const handleInputFocus = () => {
    if (apiError) {
      clearError();
    }
  };

  return (
    <div className="flex bg-[#F7F5F9] w-full h-screen justify-center overflow-hidden md:px-6 md:py-2 rounded-2xl">

<div className="flex max-w-screen-2xl w-full h-full bg-white rounded-xl  overflow-hidden">
{/* // LEFT IMAGE SIDE */}
<div className="hidden lg:block lg:w-1/2 lg:h-screen">
  <motion.div
    initial={{ opacity: 0, x: -60 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8 }}
    className="relative w-full h-full flex items-center justify-center"
  >
    {/* Background Image */}
    <img
      src={loginlogo}
      alt="Illustration"
      className="w-full h-full object-cover"
    />

    {/* Floating Card - Bottom Center */}
    <div className="absolute bottom-6  bg-transparent backdrop-blur-2xl mt-4 p-4 rounded-2xl shadow-sm text-center
                     max-w-lg lg:max-w-lg mb-4">
      <h1 className="text-3xl font-semibold text-[#2D0D23] mb-2">
        Share Expenses & Resources in Real Time
      </h1>
      <p className="text-xl font-medium text-[#4B4B4B] leading-6">
        Connect with students, travelers, and locals to effortlessly manage costs 
        and resources, anonymously and securely.
      </p>
    </div>

  </motion.div>
</div>

{/* //Right FORM SIDE */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex flex-col items-center h-screen overflow-y-auto justify-center p-4 sm:p-6 lg:p-8 xl:p-12"
      >
        <div className="w-full lg:max-w-xl">
          {/* Logo */}
<div className="w-full  mb-4 flex justify-center md:justify-start items-center md:items-start">
  <img src={logo} alt="Logo" className="h-10 md:h-12" />
</div>

          {/* Header */}
          <div className="w-full text-center lg:text-left mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Log in to your account
            </h1>
            <p className="text-gray-500 text-sm sm:text-base mt-2">
              Welcome back to your peer-to-peer cost sharing platform
            </p>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-1 gap-2 mb-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => handleSocialLogin('google')}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FcGoogle size={22} />
              <span className="text-gray-700 font-medium text-sm sm:text-base">
                Log in with Google
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => handleSocialLogin('apple')}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <PiAppleLogoBold size={22} />
              <span className="text-gray-700 font-medium text-sm sm:text-base">
                Log in with Apple
              </span>
            </motion.button>
          </div>

          {/* Divider */}
          <div className="relative w-full my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-gray-500 text-sm">Or</span>
            </div>
          </div>

          {/* API Error Display */}
          {apiError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-2 p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-red-600 text-sm text-center">{apiError}</p>
            </motion.div>
          )}

          {/* Guest Mode Notice */}
          {guestMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-2 p-3 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <p className="text-blue-600 text-sm text-center">
                You are browsing in guest mode with limited features.
              </p>
            </motion.div>
          )}

          {/* FORM */}
          <form className="w-full space-y-2" onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="Enter your email"
                onFocus={handleInputFocus}
                className={`w-full px-4 py-3 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Enter your password"
                  onFocus={handleInputFocus}
                  className={`w-full px-4 py-3 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-lg pr-12 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  {...register("rememberMe")}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="rememberMe" className="text-sm text-gray-700 cursor-pointer">
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-green-600 text-sm font-medium hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* SUBMIT BUTTON */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className={`w-full bg-green-600 text-white py-3 rounded-lg font-semibold transition-all mt-4 duration-200 ${
                loading ? "opacity-60 cursor-not-allowed" : "hover:bg-green-700"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Logging in...
                </span>
              ) : (
                "Log In"
              )}
            </motion.button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link 
                to="/register" 
                className="text-green-600 font-medium hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>

          {/* Guest Access */}
          <div className="mt-4 text-center">
            <p className="text-sm">
              <button
                type="button"
                onClick={handleGuestLogin}
                disabled={loading}
                className="text-green-600 font-medium hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed as Guest
              </button>
              <span className="text-gray-400 ml-1">(Limited Features)</span>
            </p>
          </div>


        </div>


      </motion.div>
</div>

    </div>
  );
}