// src/pages/EmailVerificationStep.jsx - FIXED VERSION
import React, { useState, useEffect } from "react";
import { authService } from "../../../services/api";
import { ArrowLeft, Mail, RotateCcw } from "lucide-react";

export default function EmailVerificationStep({
  email,
  userId,
  onBack,
  onSuccess,
  onVerificationFailed,
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(180); // 3 minutes
  const [verificationAttempts, setVerificationAttempts] = useState(0);

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }

    // Auto-verify once all digits are filled
    if (newOtp.every((d) => d !== "")) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text/plain").trim();

    if (/^\d{6}$/.test(pasted)) {
      const digits = pasted.split("");
      setOtp(digits);
      setError("");
      handleVerify(pasted);
    } else {
      setError("Please paste exactly 6 digits.");
    }
  };

  const handleVerify = async (code = null) => {
    const otpCode = code || otp.join("");
    
    // Validation
    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }
    
    if (verificationAttempts >= 3) {
      setError("Too many attempts. Please request a new OTP.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("Verifying OTP for email:", email);
      
      // FIXED: Use email for OTP verification
      const response = await authService.verifyOTP(email, otpCode);
      
      console.log("OTP Verification Response:", response);
      
      if (response?.success) {
        // Successful verification
        setVerificationAttempts(0);
        onSuccess();
      } else if (response?.status === 400) {
        // Invalid OTP
        const errorMsg = response.data?.message || 
                        response.data?.data?.message || 
                        "Invalid OTP code. Please try again.";
        setError(errorMsg);
        setVerificationAttempts(prev => prev + 1);
        
        if (onVerificationFailed && verificationAttempts >= 2) {
          onVerificationFailed("Too many failed attempts.");
        }
      } else {
        // Other errors
        const errorMsg = response?.data?.message || 
                        "Verification failed. Please try again.";
        setError(errorMsg);
        
        if (onVerificationFailed) {
          onVerificationFailed(errorMsg);
        }
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setError("Network error. Please check your connection.");
      
      if (onVerificationFailed) {
        onVerificationFailed("Network error during verification.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) {
      setError(`Please wait ${timer} seconds before resending.`);
      return;
    }

    setResendLoading(true);
    setError("");
    setOtp(["", "", "", "", "", ""]); // Clear OTP fields
    setVerificationAttempts(0); // Reset attempts

    try {
      if (!userId) {
        throw new Error("User ID is required to resend OTP");
      }

      console.log("Resending OTP for user:", userId);
      const response = await authService.resendOTP(userId);
      
      console.log("OTP Resend Response:", response);
      
      if (response?.success) {
        setTimer(180); // Reset timer to 3 minutes
        document.getElementById(`otp-input-0`)?.focus();
        setError("New verification code sent successfully!");
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          if (!error.includes("failed") && !error.includes("Invalid")) {
            setError("");
          }
        }, 3000);
      } else {
        const errorMsg = response?.data?.message || 
                        response?.data?.data?.message || 
                        "Could not resend OTP. Please try again.";
        setError(errorMsg);
      }
    } catch (err) {
      console.error("OTP resend error:", err);
      setError(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const clearAllInputs = () => {
    setOtp(["", "", "", "", "", ""]);
    setError("");
    document.getElementById(`otp-input-0`)?.focus();
  };

  return (
    <div className="flex flex-col items-center gap-5 py-8 relative w-full max-w-md mx-auto">
      <button
        onClick={onBack}
        className="absolute left-0 top-0 text-gray-600 hover:text-green-600 transition flex items-center gap-2"
        type="button"
        disabled={loading}
      >
        <ArrowLeft size={20} />
        <span className="text-sm">Back</span>
      </button>

      <div className="bg-[#1F82250D] rounded-full w-16 h-16 flex items-center justify-center mb-4">
        <Mail className="text-[#1F8225]" size={28} />
      </div>

      <h2 className="text-2xl font-bold text-gray-800">Verify Your Email</h2>
      
      <p className="text-gray-600 text-center">
        We've sent a 6-digit verification code to
      </p>
      <p className="text-green-600 font-medium text-lg">{email}</p>
      <p className="text-gray-500 text-sm text-center">
        Enter the code below to verify your email address.
      </p>

      {/* OTP fields */}
      <div className="w-full mt-4">
        <div className="flex gap-3 justify-center" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-input-${i}`}
              type="text"
              maxLength={1}
              inputMode="numeric"
              pattern="[0-9]*"
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              disabled={loading || resendLoading}
              className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg 
                       focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none 
                       transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
              autoFocus={i === 0}
            />
          ))}
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <button
            type="button"
            onClick={clearAllInputs}
            className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1"
            disabled={loading}
          >
            <RotateCcw size={14} />
            Clear
          </button>
          
          {timer > 0 ? (
            <p className="text-sm text-gray-600">
              Resend in <span className="font-semibold">{formatTime(timer)}</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading}
              className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1"
            >
              {resendLoading ? (
                <>
                  <div className="w-3 h-3 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  Resend Code
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className={`w-full p-3 rounded-lg text-center text-sm ${
          error.includes("successfully") 
            ? "bg-green-50 text-green-700 border border-green-200" 
            : "bg-red-50 text-red-600 border border-red-200"
        }`}>
          {error}
        </div>
      )}

      {/* Verify button */}
      <button
        type="button"
        disabled={loading || otp.some((d) => d === "") || resendLoading}
        onClick={() => handleVerify()}
        className={`w-full py-3 rounded-lg font-semibold mt-2 transition-all duration-200 ${
          loading || otp.some((d) => d === "") || resendLoading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-green-600 text-white hover:bg-green-700"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Verifying...
          </span>
        ) : (
          "Verify Email"
        )}
      </button>

      {/* Additional help */}
      <div className="text-center text-sm text-gray-500 mt-4">
        <p>Didn't receive the code? Check your spam folder or</p>
        <button
          type="button"
          onClick={onBack}
          className="text-green-600 hover:text-green-700 font-medium underline"
        >
          update your email address
        </button>
      </div>
    </div>
  );
}