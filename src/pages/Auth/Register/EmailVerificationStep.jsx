// src/pages/EmailVerificationStep.jsx
import React, { useState, useEffect } from "react";
import { authService } from "../../../services/api";
import { ArrowLeft, Mail } from "lucide-react";

export default function EmailVerificationStep({
  email,
  userId,
  onBack,
  onSuccess,
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

  // Initialize timer and auto-send OTP on mount
  useEffect(() => {
    if (userId && email) {
      // Auto-send OTP when component mounts
      handleResend(true);
    }
  }, [userId, email]);

  // Handle OTP input
  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
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
        document.getElementById(`otp-input-${index - 1}`)?.focus();
      } else if (otp[index]) {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
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
      document.getElementById(`otp-input-5`)?.focus();
      
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

    try {
      // Note: Backend expects { email, otp } according to your API
      const response = await authService.verifyOTP(email, otpCode);

      if (response.error) {
        setVerificationAttempts(prev => prev + 1);
        setError(response.data?.message || "Invalid OTP. Please try again.");
        
        // Clear OTP on multiple failures
        if (verificationAttempts >= 3) {
          setOtp(["", "", "", "", "", ""]);
          document.getElementById(`otp-input-0`)?.focus();
        }
      } else if (response.success) {
        // Verification successful
        onSuccess();
      } else {
        // Handle unexpected response format
        setError("Verification failed. Please try again.");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async (isInitial = false) => {
    if (timer > 0 && !isInitial) {
      setError(`Please wait ${Math.floor(timer / 60)}:${timer % 60 < 10 ? '0' : ''}${timer % 60} before resending.`);
      return;
    }

    if (!userId) {
      setError("Cannot resend OTP. User ID is missing.");
      return;
    }

    setResendLoading(true);
    setError("");
    setOtp(["", "", "", "", "", ""]);

    try {
      const response = await authService.resendOTP(userId);

      if (response.error) {
        setError(response.data?.message || "Failed to resend OTP. Please try again.");
      } else {
        // Reset timer to 3 minutes
        setTimer(180);
        setVerificationAttempts(0);
        
        // Focus first input field
        document.getElementById(`otp-input-0`)?.focus();
        
        if (!isInitial) {
          console.log("OTP resent successfully");
        }
      }
    } catch (err) {
      console.error("OTP resend error:", err);
      setError("Network error. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="flex flex-col items-center gap-5 py-8 relative w-full">
      <button
        onClick={onBack}
        className="absolute left-4 top-4 text-gray-600 hover:text-green-600 transition"
        type="button"
        disabled={loading}
      >
        <ArrowLeft size={28} />
      </button>

      <h2 className="text-xl font-bold text-gray-800 mt-8">Verify Your Email</h2>
      <p className="text-gray-500 text-sm text-center max-w-xs">
        Enter the code sent to{" "}
        <span className="text-green-600 font-medium">{email}</span>.
      </p>

      <div className="bg-[#1F82250D] rounded-full w-14 h-14 flex items-center justify-center">
        <Mail className="text-[#1F8225]" size={24} />
      </div>

      {/* OTP fields */}
      <div className="flex gap-2 mt-2" onPaste={handlePaste}>
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
            disabled={loading}
            className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none disabled:opacity-50 transition-colors"
            autoFocus={i === 0}
            autoComplete="one-time-code"
          />
        ))}
      </div>

      {/* Timer / Resend */}
      <div className="text-center mt-4">
        {timer > 0 ? (
          <p className="text-sm text-gray-600">
            Resend code in{" "}
            <span className="font-semibold">{formatTime(timer)}</span>
          </p>
        ) : (
          <button
            type="button"
            onClick={() => handleResend(false)}
            disabled={resendLoading}
            className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors disabled:opacity-50"
          >
            {resendLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                Resending...
              </span>
            ) : (
              "Resend Code"
            )}
          </button>
        )}
      </div>

      {/* Errors */}
      {error && (
        <p className="text-red-600 text-sm text-center max-w-xs mt-2">{error}</p>
      )}

      {/* Verify button (manual verification if auto-verify fails) */}
      <button
        type="button"
        disabled={loading || otp.some((d) => d === "")}
        onClick={() => handleVerify()}
        className={`w-full bg-green-600 text-white py-3 rounded-lg font-semibold mt-4 transition-colors ${
          loading || otp.some((d) => d === "")
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-green-700"
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

      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 text-xs text-gray-400">
          <p>User ID: {userId}</p>
          <p>Email: {email}</p>
          <p>Attempts: {verificationAttempts}</p>
        </div>
      )}
    </div>
  );
}