// src/pages/Register.jsx
import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, ChevronLeft, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { PiAppleLogoBold } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import loginlogo from "../../assets/login.jpg";
import logo from "../../assets/logo.svg";
import Checknow from "../../assets/Check.svg";
import { useAuthStore } from "../../store/authStore";

// Timer Component
function TimerDisplay({ onResend, timeLeft }) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="text-center">
      {timeLeft > 0 ? (
        <p className="text-gray-600 text-sm mt-3">
          Resend available in{" "}
          <span className="text-green-600 font-semibold">
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </span>
        </p>
      ) : (
        <button
          type="button"
          onClick={onResend}
          className="text-green-600 font-semibold text-sm mt-3 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Resend OTP
        </button>
      )}
    </div>
  );
}

// Password Validation Component
function PasswordValidation({ password }) {
  const validations = [
    { label: "8+ characters", isValid: password.length >= 8 },
    { label: "Uppercase letter", isValid: /[A-Z]/.test(password) },
    { label: "Digit", isValid: /\d/.test(password) },
  ];

  return (
    <div className="flex flex-col gap-2 mt-2">
      {validations.map((v, i) => (
        <div key={i} className="flex items-center gap-3">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center ${
              v.isValid ? "bg-green-100" : "bg-gray-100"
            }`}
          >
            {v.isValid ? (
              <Check size={14} className="text-green-600" />
            ) : (
              <X size={14} className="text-gray-400" />
            )}
          </div>
          <span
            className={`text-xs ${
              v.isValid ? "text-green-600" : "text-gray-500"
            }`}
          >
            {v.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// Email Verification Step Component
function EmailVerificationStep({ email, onVerify, onBack }) {
  const [emailOtp, setEmailOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [localError, setLocalError] = useState("");
  
  // Get Zustand actions
  const verifyOTP = useAuthStore((state) => state.verifyOTP);
  const resendOTP = useAuthStore((state) => state.resendOTP);
  const clearError = useAuthStore((state) => state.clearError);
  const error = useAuthStore((state) => state.error);
  const isLoading = useAuthStore((state) => state.isLoading);

  // Timer effect
  useEffect(() => {
    if (timeLeft === 0) return;
    const timer = setInterval(() => setTimeLeft(prev => Math.max(prev - 1, 0)), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Handle OTP input changes
  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...emailOtp];
    newOtp[index] = value;
    setEmailOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }

    // Auto-submit when all digits are filled
    if (newOtp.every(digit => digit !== "")) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !emailOtp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  const handleVerify = async (otp) => {
    setVerificationLoading(true);
    setLocalError("");
    clearError();

    try {
      const result = await verifyOTP(email, otp);

      if (result.success) {
        onVerify();
      } else {
        setLocalError(result.message || "Invalid OTP. Please try again.");
        // Reset OTP on error
        setEmailOtp(["", "", "", "", "", ""]);
        document.getElementById("otp-input-0")?.focus();
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setLocalError(error.message || "Invalid OTP. Please try again.");
      // Reset OTP on error
      setEmailOtp(["", "", "", "", "", ""]);
      document.getElementById("otp-input-0")?.focus();
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (timeLeft > 0) return;
    
    try {
      setLocalError("");
      clearError();

      const result = await resendOTP(email);

      if (result.success) {
        // Reset timer
        setTimeLeft(120);
        // Reset OTP inputs
        setEmailOtp(["", "", "", "", "", ""]);
        document.getElementById("otp-input-0")?.focus();
      } else {
        setLocalError(result.message || "Failed to resend OTP.");
      }
    } catch (error) {
      console.error("Resend OTP Error:", error);
      setLocalError(error.message || "Failed to resend OTP. Try again.");
    }
  };

  const displayError = localError || error;

  return (
    <div className="flex flex-col items-center gap-5 py-8 relative w-full">
      <button
        type="button"
        onClick={onBack}
        className="absolute left-4 top-4 text-gray-600 hover:text-green-600 transition disabled:opacity-50"
        disabled={verificationLoading}
      >
        <ChevronLeft size={28} />
      </button>

      <h2 className="text-xl font-bold text-gray-800 mt-8">Verify Your Email</h2>
      <p className="text-gray-500 text-sm text-center max-w-xs">
        Enter the code sent to your <span className="text-green-600 font-medium">{email}</span>.
      </p>

      <div className="bg-[#1F82250D] rounded-full w-14 h-14 flex items-center justify-center">
        <Mail className="text-[#1F8225]" />
      </div>

      <div className="flex gap-2 mt-2">
        {emailOtp.map((digit, index) => (
          <input
            key={index}
            id={`otp-input-${index}`}
            type="text"
            inputMode="numeric"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            disabled={verificationLoading || isLoading}
            className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none disabled:opacity-50 transition-colors"
            autoFocus={index === 0}
          />
        ))}
      </div>

      <TimerDisplay onResend={handleResendOTP} timeLeft={timeLeft} />

      {displayError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-50 border border-red-200 rounded-lg max-w-xs"
        >
          <p className="text-red-600 text-sm text-center">{displayError}</p>
        </motion.div>
      )}

      <button
        type="button"
        onClick={() => handleVerify(emailOtp.join(""))}
        disabled={verificationLoading || isLoading || emailOtp.some(digit => digit === "")}
        className={`w-full bg-green-600 text-white py-3 rounded-lg font-semibold mt-4 transition-colors duration-200 ${
          verificationLoading || isLoading || emailOtp.some(digit => digit === "")
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-green-700"
        }`}
      >
        {verificationLoading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Verifying...
          </span>
        ) : (
          "Verify Email"
        )}
      </button>
    </div>
  );
}

// Main Register Component
export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();
  
  // Get Zustand state and actions
  const { 
    isLoading, 
    error, 
    clearError, 
    register: registerStore,
    requestOTP
  } = useAuthStore();

  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    nationality: "",
    password: "",
    agreeToTerms: false,
  });

  const steps = [
    { id: 1, label: "Account" },
    { id: 2, label: "Verify Email" },
    { id: 3, label: "Success" },
  ];

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    clearError();

    // Validation
    const validPassword = formData.password.length >= 8 &&
      /[A-Z]/.test(formData.password) &&
      /\d/.test(formData.password);

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      useAuthStore.getState().setError("Please fill out all required fields.");
      return;
    }

    if (!formData.nationality) {
      useAuthStore.getState().setError("Please select your nationality.");
      return;
    }

    if (!validPassword) {
      useAuthStore.getState().setError("Your password does not meet all requirements.");
      return;
    }

    if (!formData.agreeToTerms) {
      useAuthStore.getState().setError("Please agree to the terms & conditions.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      useAuthStore.getState().setError("Please enter a valid email address.");
      return;
    }

    try {
      const result = await registerStore({
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        email: formData.email.toLowerCase().trim(),
        nationality: formData.nationality.trim(),
        password: formData.password,
      });

      if (result.success) {
        setRegistrationSuccess(true);
        setCurrentStep(2);
        
        // Request OTP after successful registration
        try {
          await requestOTP({ email: formData.email });
        } catch (otpError) {
          console.warn("OTP request failed:", otpError);
          // Continue anyway - user can request OTP manually in verification step
        }
      }
    } catch (error) {
      // Error is already set by the store
      console.error("Registration error:", error);
    }
  };

  const handleSocialRegister = (provider) => {
    console.log(`Register with ${provider}`);
    // Implement social registration
    useAuthStore.getState().setError(`${provider} registration is not available yet.`);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) {
      clearError();
    }
  };

  const handleVerifySuccess = () => {
    setCurrentStep(3);
  };

  const handleBackToRegistration = () => {
    if (registrationSuccess) {
      setCurrentStep(1);
    } else {
      navigate("/register");
    }
  };

  const nationalities = [
    "American", "British", "Canadian", "Australian", "Indian", 
    "Chinese", "German", "French", "Japanese", "Brazilian",
    "Mexican", "Spanish", "Italian", "Russian", "South Korean",
    "Other"
  ];

  return (
    <div className="flex bg-[#F7F5F9] w-full min-h-screen justify-center overflow-auto md:px-6 md:py-4 rounded-2xl">
      <div className="flex max-w-screen-2xl w-full h-full rounded-xl overflow-hidden">
        {/* LEFT IMAGE SIDE */}
        <div className="hidden lg:flex w-1/2 bg-[#F8EACD] rounded-xl p-6 items-center justify-center">
          <div className="w-full flex flex-col items-center">
            <img 
              src={loginlogo} 
              alt="Register" 
              className="rounded-lg w-full h-auto max-h-[400px] object-contain" 
            />
            <div className="bg-gradient-to-br max-w-lg bottom-0 from-[#FAF3E8] to-[#F8EACD] mt-4 p-4 rounded-2xl shadow-sm text-center">
              <h1 className="text-3xl font-semibold text-[#2D0D23] mb-1">
                Share Expenses & Resources in Real Time
              </h1>
              <p className="text-xl font-medium text-[#4B4B4B] leading-relaxed">
                Connect with students, travelers, and locals to effortlessly manage costs and resources, anonymously and securely.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT FORM SIDE */}
        <div className="flex flex-1 flex-col items-center p-3 sm:p-5 overflow-y-auto">
          <div className="w-full mb-4 flex justify-center md:justify-start items-center md:items-start">
            <img src={logo} alt="Logo" className="h-10 md:h-12" />
          </div>

          <div className="w-full max-w-2xl p-5 rounded-xl shadow-none md:shadow-md border-none md:border border-gray-100">
            {/* STEP INDICATOR */}
            <div className="w-full flex justify-center items-center py-4">
              <div className="flex items-center gap-2 justify-center">
                {steps.map((s, i) => (
                  <div key={s.id} className="flex items-center">
                    <div
                      className={`w-4 h-4 rounded-full transition-all duration-300 ${
                        currentStep >= s.id
                          ? "bg-green-600 shadow-md"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    {i < steps.length - 1 && (
                      <div
                        className={`w-16 md:w-24 lg:w-32 border-t-2 mx-2 transition-all duration-300 ${
                          currentStep > s.id
                            ? "border-green-600"
                            : "border-gray-300"
                        }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* STEP 1: Registration Form */}
            {currentStep === 1 && (
              <div>
                <h1 className="text-2xl sm:text-3xl text-center font-bold text-gray-900">
                  Create Your Account
                </h1>
                <p className="text-gray-500 text-center text-sm mt-1 mb-4">
                  Let's get started with real-time cost sharing.
                </p>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg mb-3 text-center"
                  >
                    {error}
                  </motion.div>
                )}

                {/* SOCIAL BUTTONS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => handleSocialRegister('google')}
                    className="flex items-center justify-center gap-3 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FcGoogle size={20} />
                    <span className="text-gray-700 text-sm">Sign Up with Google</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => handleSocialRegister('apple')}
                    className="flex items-center justify-center gap-3 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <PiAppleLogoBold size={20} />
                    <span className="text-gray-700 text-sm">Sign Up with Apple</span>
                  </motion.button>
                </div>

                {/* DIVIDER */}
                <div className="flex items-center my-4">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="mx-2 text-gray-500 text-sm">Or</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {/* First Name */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      placeholder="Enter your first name"
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-colors"
                      required
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      placeholder="Enter your last name"
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-colors"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      placeholder="Enter your email address"
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-colors"
                      required
                    />
                  </div>

                  {/* Nationality */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Nationality *
                    </label>
                    <select
                      value={formData.nationality}
                      onChange={(e) => handleInputChange("nationality", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-colors"
                      required
                    >
                      <option value="">Select your nationality</option>
                      {nationalities.map((nationality) => (
                        <option key={nationality} value={nationality}>
                          {nationality}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Password *
                    </label>
                    <div className="flex items-center border border-gray-300 px-3 rounded-lg focus-within:ring-2 focus-within:ring-green-500 transition-colors">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        placeholder="Create your password"
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="w-full py-2 outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <PasswordValidation password={formData.password} />
                  </div>

                  {/* TERMS */}
                  <label className="flex gap-2 items-start text-sm text-gray-600 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
                      className="mt-1 rounded focus:ring-green-500"
                    />
                    <span>
                      I agree to the{" "}
                      <a href="/terms" className="text-green-600 hover:underline font-medium">
                        Terms
                      </a>
                      ,{" "}
                      <a href="/privacy" className="text-green-600 hover:underline font-medium">
                        Privacy
                      </a>{" "}
                      &{" "}
                      <a href="/fees" className="text-green-600 hover:underline font-medium">
                        Fees
                      </a>
                      .
                    </span>
                  </label>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className={`w-full bg-green-600 text-white py-3 rounded-lg font-semibold transition-all duration-200 ${
                      isLoading ? "opacity-60 cursor-not-allowed" : "hover:bg-green-700"
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating Account...
                      </span>
                    ) : (
                      "Create Account"
                    )}
                  </motion.button>

                  <p className="text-center text-sm text-gray-600 mt-3">
                    Already have an account?{" "}
                    <Link to="/login" className="text-green-600 hover:underline font-medium">
                      Log In
                    </Link>
                  </p>
                </form>
              </div>
            )}

            {/* STEP 2: Email Verification */}
            {currentStep === 2 && (
              <EmailVerificationStep
                email={formData.email}
                onVerify={handleVerifySuccess}
                onBack={handleBackToRegistration}
              />
            )}

            {/* STEP 3: Success */}
            {currentStep === 3 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center text-center py-6"
              >
                <img src={Checknow} alt="Success" className="w-24 h-24 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Email Verified!
                </h2>
                <p className="text-gray-600 mt-2 max-w-sm">
                  Your email has been successfully verified. You can now log in to your account.
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/login")}
                  className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Continue to Login
                </motion.button>
                <p className="text-sm text-gray-500 mt-3">
                  Didn't receive the email?{" "}
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-green-600 hover:underline font-medium"
                  >
                    Go back to verification
                  </button>
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}