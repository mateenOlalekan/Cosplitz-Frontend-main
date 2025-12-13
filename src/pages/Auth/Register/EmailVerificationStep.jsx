// src/pages/EmailVerificationStep.jsx
import React, { useState, useEffect, useRef } from "react";
import { authService } from "../../../services/api";
import { ArrowLeft, Mail, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function EmailVerificationStep({
  email,
  userId,
  onBack,
  onSuccess,
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60); // 1 minute timer
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const inputRefs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // Auto-send OTP on component mount
  useEffect(() => {
    if (email) {
      handleResend(true);
    }
  }, [email]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, []);

  // Handle OTP input
  const handleChange = (value, index) => {
    // Only allow numbers
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify once all digits are filled
    if (newOtp.every((d) => d !== "")) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Move focus to previous input
        inputRefs.current[index - 1]?.focus();
      } else if (otp[index]) {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle paste event
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text/plain").trim();

    if (/^\d{6}$/.test(pasted)) {
      const digits = pasted.split("");
      setOtp(digits);
      setError("");

      // Focus last input
      inputRefs.current[5]?.focus();
      
      // Auto verify
      setTimeout(() => {
        handleVerify(pasted);
      }, 100);
    } else {
      setError("Please paste a valid 6-digit OTP code.");
    }
  };

  // Verify OTP
  const handleVerify = async (code = null) => {
    const otpCode = code || otp.join("");

    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    // Prevent too many attempts
    if (verificationAttempts >= 5) {
      setError("Too many failed attempts. Please request a new OTP.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      console.log("🔐 Verifying OTP for email:", email, "OTP:", otpCode);
      
      // IMPORTANT: Your backend expects { email, otp }
      const response = await authService.verifyOTP(email, otpCode);
      console.log("📨 Verification response:", response);

      if (response.error) {
        setVerificationAttempts(prev => prev + 1);
        
        // Extract error message
        const errorMsg = response.data?.message || 
                        response.data?.error || 
                        response.data?.detail || 
                        "Invalid OTP. Please try again.";
        
        setError(errorMsg);
        
        // Clear OTP on multiple failures
        if (verificationAttempts >= 2) {
          setOtp(["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
        }
      } else if (response.success) {
        // Verification successful
        setSuccess("Email verified successfully! Redirecting...");
        
        // If there's a token in the response, store it
        if (response.data?.token) {
          authService.storeToken(response.data.token, true);
        }
        
        // Call success callback after a short delay
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        // Handle unexpected response format
        console.warn("Unexpected response format:", response);
        setError("Verification failed. Please try again.");
      }
    } catch (err) {
      console.error("❌ OTP verification error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP - IMPORTANT: Uses userId, not email
  const handleResend = async (isInitial = false) => {
    if (timer > 0 && !isInitial) {
      const minutes = Math.floor(timer / 60);
      const seconds = timer % 60;
      setError(`Please wait ${minutes}:${seconds < 10 ? '0' : ''}${seconds} before resending.`);
      return;
    }

    if (!userId) {
      setError("Cannot resend OTP. Please try registering again.");
      return;
    }

    setResendLoading(true);
    setError("");
    setSuccess("");

    try {
      console.log("📤 Resending OTP for user ID:", userId);
      
      // Your API endpoint: GET /api/otp/<user_id>/
      const response = await authService.resendOTP(userId);
      console.log("📨 Resend response:", response);

      if (response.error) {
        const errorMsg = response.data?.message || "Failed to resend OTP. Please try again.";
        setError(errorMsg);
      } else {
        // Success
        setTimer(60); // Reset to 1 minute
        setVerificationAttempts(0);
        setOtp(["", "", "", "", "", ""]);
        setSuccess("New OTP sent to your email!");
        
        // Focus first input
        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 100);
        
        if (!isInitial) {
          console.log("✅ OTP resent successfully");
        }
      }
    } catch (err) {
      console.error("❌ OTP resend error:", err);
      setError("Network error. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  // Manual verification button click
  const handleManualVerify = () => {
    if (otp.some(digit => digit === "")) {
      setError("Please enter all 6 digits.");
      return;
    }
    handleVerify();
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-5 py-8 relative w-full max-w-md mx-auto"
    >
      <button
        onClick={onBack}
        className="absolute left-0 top-0 text-gray-600 hover:text-green-600 transition p-2 rounded-lg hover:bg-gray-100"
        type="button"
        disabled={loading}
        aria-label="Go back"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Email</h2>
        <p className="text-gray-600 mb-1">
          We sent a 6-digit code to
        </p>
        <p className="text-green-600 font-medium text-lg break-all px-4">
          {email}
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Enter the code below to verify your email address.
        </p>
      </div>

      <div className="bg-green-50 rounded-full w-16 h-16 flex items-center justify-center border border-green-100">
        <Mail className="text-green-600" size={28} />
      </div>

      {/* Success Message */}
      {success && (
        <div className="w-full bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-lg text-center">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="w-full bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg text-center">
          {error}
        </div>
      )}

      {/* OTP Input Fields */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
          6-Digit Verification Code
        </label>
        <div 
          className="flex justify-center gap-2 sm:gap-3 mb-6" 
          onPaste={handlePaste}
        >
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              maxLength={1}
              inputMode="numeric"
              pattern="[0-9]*"
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onFocus={(e) => e.target.select()}
              disabled={loading}
              className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-bold border-2 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-200 disabled:opacity-50 disabled:bg-gray-100"
              aria-label={`Digit ${i + 1}`}
              autoComplete="one-time-code"
            />
          ))}
        </div>

        {/* Auto-verify notification */}
        <p className="text-sm text-gray-500 text-center mb-4">
          Code will auto-verify when all 6 digits are entered
        </p>
      </div>

      {/* Timer and Resend Section */}
      <div className="text-center w-full">
        {timer > 0 ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Resend code in{" "}
              <span className="font-semibold text-green-600">{formatTime(timer)}</span>
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(timer / 60) * 100}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => handleResend(false)}
            disabled={resendLoading}
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm transition-colors disabled:opacity-50 px-4 py-2 rounded-lg hover:bg-green-50"
          >
            {resendLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <RefreshCw size={16} />
                <span>Resend Verification Code</span>
              </>
            )}
          </motion.button>
        )}
      </div>

      {/* Manual Verify Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="button"
        disabled={loading || otp.some((d) => d === "")}
        onClick={handleManualVerify}
        className={`w-full bg-green-600 text-white py-3 rounded-lg font-semibold mt-4 transition-all duration-200 ${
          loading || otp.some((d) => d === "")
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-green-700 shadow-md hover:shadow-lg"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Verifying Email...
          </span>
        ) : (
          "Verify Email Address"
        )}
      </motion.button>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 w-full">
        <h4 className="font-medium text-blue-800 mb-1 flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Didn't receive the code?
        </h4>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>Check your spam/junk folder</li>
          <li>Wait 1 minute then click "Resend Verification Code"</li>
          <li>Make sure you entered the correct email address</li>
        </ul>
      </div>

      {/* Debug info (only in development) */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs w-full">
          <p className="font-semibold text-gray-700 mb-1">Debug Info:</p>
          <div className="space-y-1">
            <p>Email: <span className="font-mono">{email}</span></p>
            <p>User ID: <span className="font-mono">{userId}</span></p>
            <p>OTP: <span className="font-mono">{otp.join("")}</span></p>
            <p>Attempts: <span className="font-mono">{verificationAttempts}</span></p>
            <p>Timer: <span className="font-mono">{timer}s</span></p>
          </div>
        </div>
      )}
    </motion.div>
  );
}