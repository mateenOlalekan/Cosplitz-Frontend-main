// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { PiAppleLogoBold } from "react-icons/pi";
import { Eye, EyeOff } from "lucide-react";
import { authService } from "../services/api";
import { useAuthStore } from "../store/authStore";
import logo from "../../../assets/logo.svg";
import loginlogo from "../../../assets/login.jpg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  
  // Get auth store functions
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);
  const setError = useAuthStore((state) => state.setError);
  const clearError = useAuthStore((state) => state.clearError);
  const error = useAuthStore((state) => state.error);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
    clearError();
  }, [initializeAuth, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    // Validation
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    
    setLoading(true);
    
    try {
      console.log("🔐 Attempting login with:", { email, password });
      
      const response = await authService.login({
        email: email.toLowerCase().trim(),
        password: password,
      });
      
      console.log("📨 Login response:", response);
      
      if (response.error || !response.success) {
        const errorMsg = response.data?.message || 
                        response.data?.error || 
                        "Login failed. Please check your credentials.";
        setError(errorMsg);
        setLoading(false);
        return;
      }
      
      // Extract token and user data
      const token = response.data?.token || 
                   response.data?.access_token || 
                   response.token;
      
      const userData = response.data?.user || 
                      response.data || 
                      response.user;
      
      if (!token) {
        console.error("❌ No token in response:", response);
        setError("Login successful but no authentication token received.");
        setLoading(false);
        return;
      }
      
      // Store token
      setToken(token, rememberMe);
      
      // Prepare user object
      const user = {
        id: userData?.id || userData?.user_id,
        email: userData?.email || email,
        firstName: userData?.first_name || userData?.firstName,
        lastName: userData?.last_name || userData?.lastName,
        name: userData?.name || 
              `${userData?.first_name || ''} ${userData?.last_name || ''}`.trim() || 
              email.split('@')[0],
        role: userData?.role || "user",
        isAdmin: userData?.is_admin || false,
        isVerified: userData?.is_verified || userData?.email_verified || false,
        nationality: userData?.nationality,
        createdAt: userData?.created_at,
      };
      
      // Store user
      setUser(user);
      
      console.log("✅ Login successful:", { user, token });
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
      
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Social login with ${provider}`);
    // Implement OAuth flow here
    alert(`${provider} login will be available soon!`);
  };

  return (
    <div className="flex bg-[#F7F5F9] w-full h-screen justify-center overflow-hidden md:px-6 md:py-4 rounded-2xl">
      <div className="flex max-w-screen-2xl w-full h-full rounded-xl overflow-hidden">
        
        {/* LEFT */}
        <div className="hidden lg:flex w-1/2 bg-[#F8EACD] rounded-xl p-6 items-center justify-center">
          <div className="w-full flex flex-col items-center">
            <img 
              src={loginlogo} 
              alt="Login" 
              className="rounded-lg w-full h-auto max-h-[400px] object-contain"
            />
            <div className="bg-gradient-to-br max-w-lg from-[#FAF3E8] to-[#F8EACD] mt-4 p-4 rounded-2xl shadow-sm text-center">
              <h1 className="text-3xl font-semibold text-[#2D0D23] mb-1">
                Share Expenses & Resources in Real Time
              </h1>
              <p className="text-xl font-medium text-[#4B4B4B] leading-relaxed">
                Connect with students, travelers, and locals to effortlessly manage costs and resources.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-1 flex-col items-center p-3 sm:p-5 overflow-y-auto">
          <div className="w-full mb-4 flex justify-center md:justify-start items-center md:items-start">
            <img src={logo} alt="Logo" className="h-10 md:h-12" />
          </div>

          <div className="w-full max-w-md p-5 rounded-xl shadow-none md:shadow-md border-none md:border border-gray-100 bg-white">
            
            <h1 className="text-2xl sm:text-3xl text-center font-bold text-gray-900 mb-1">
              Welcome Back
            </h1>
            <p className="text-gray-500 text-center text-sm mb-6">
              Sign in to continue managing your shared expenses.
            </p>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => handleSocialLogin("google")}
                className="flex items-center justify-center gap-3 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FcGoogle size={20} />
                <span className="text-gray-700 text-sm">Google</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => handleSocialLogin("apple")}
                className="flex items-center justify-center gap-3 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <PiAppleLogoBold size={20} />
                <span className="text-gray-700 text-sm">Apple</span>
              </motion.button>
            </div>

            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-2 text-gray-500 text-sm">Or continue with email</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg mb-4 text-center">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Password *
                </label>
                <div className="flex items-center border border-gray-300 px-3 rounded-lg focus-within:ring-2 focus-within:ring-green-500 transition-colors">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full py-2 outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded focus:ring-green-500"
                  />
                  <span>Remember me</span>
                </label>
                
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-green-600 hover:text-green-700 hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={`w-full bg-green-600 text-white py-3 rounded-lg font-semibold transition-all duration-200 ${
                  loading ? "opacity-60 cursor-not-allowed" : "hover:bg-green-700"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </motion.button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="text-green-600 hover:underline font-medium">
                  Create Account
                </Link>
              </p>
            </div>

            {/* Terms */}
            <p className="text-xs text-gray-500 text-center mt-6">
              By continuing, you agree to our{" "}
              <a href="/terms" className="text-green-600 hover:underline">Terms</a>,{" "}
              <a href="/privacy" className="text-green-600 hover:underline">Privacy</a>{" "}
              and{" "}
              <a href="/fees" className="text-green-600 hover:underline">Fees</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}