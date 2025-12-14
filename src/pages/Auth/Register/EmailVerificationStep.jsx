// src/pages/Auth/Register/EmailVerificationStep.jsx
import React, { useState, useEffect } from "react";
import { authService } from "../../../services/api";
import { ArrowLeft, Mail, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";

export default function EmailVerificationStep({
  email,
  userId,
  otpSent,
  onBack,
  onSuccess,
  onVerificationFailed,
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(180);
  const [localOtpSent, setLocalOtpSent] = useState(otpSent);

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // Auto-send OTP if not already sent
  useEffect(() => {
    if (userId && email && !localOtpSent) {
      sendOTP();
    }
  }, [userId, email, localOtpSent]);

  const sendOTP = async () => {
    if (!userId) {
      setError("User ID not found. Please restart registration.");
      return;
    }

    try {
      console.log("Sending OTP to user ID:", userId);
      const response = await authService.sendOTP(userId);
      console.log("OTP Send Response:", response);
      
      if (response.success) {
        setLocalOtpSent(true);
        setTimer(180);
        setError("");
        setSuccess("Verification code sent to your email!");
        
        // Clear success message after 5 seconds
        setTimeout(() => setSuccess(""), 5000);
      } else {
        const errorMsg = response.data?.message || 
                        response.data?.detail || 
                        "Failed to send verification code.";
        setError(errorMsg);
      }
    } catch (err) {
      console.error("OTP send error:", err);
      setError("Network error. Please check your connection.");
    }
  };

  // Handle OTP input
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

  // Verify OTP
  const handleVerify = async (code = null) => {
    const otpCode = code || otp.join("");

    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    if (!email) {
      setError("Email not found. Please restart registration.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("Verifying OTP:", otpCode, "for email:", email);
      const response = await authService.verifyOTP(email, otpCode);

      if (response.success) {
        setSuccess("Email verified successfully! Redirecting...");
        // Give a small delay for user to see success message
        setTimeout(() => {
          onSuccess();
        }, 1000);
      } else {
        const errorMsg = response.data?.message || 
                        response.data?.detail || 
                        "Invalid verification code. Please try again.";
        setError(errorMsg);
        if (onVerificationFailed) onVerificationFailed(errorMsg);
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      const errorMsg = "Network error. Please try again.";
      setError(errorMsg);
      if (onVerificationFailed) onVerificationFailed(errorMsg);
    }

    setLoading(false);
  };

  // Resend OTP
  const handleResend = async () => {
    if (timer > 0) return;

    if (!userId) {
      setError("User information missing. Please restart registration.");
      return;
    }

    setResendLoading(true);
    setError("");

    try {
      await sendOTP();
    } catch (err) {
      console.error("OTP resend error:", err);
      setError("Failed to resend verification code.");
    }

    setResendLoading(false);
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
        Enter the 6-digit code sent to{" "}
        <span className="text-green-600 font-medium">{email}</span>
      </p>

      <div className="bg-[#1F82250D] rounded-full w-14 h-14 flex items-center justify-center">
        <Mail className="text-[#1F8225]" size={24} />
      </div>

      {/* Success Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 text-sm p-3 rounded-lg text-center max-w-xs flex items-center gap-2">
          <CheckCircle size={16} />
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg text-center max-w-xs flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* OTP fields */}
      <div className="flex gap-2 mt-2">
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
            disabled={loading}
            className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none disabled:opacity-50"
            autoFocus={i === 0}
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
            onClick={handleResend}
            disabled={resendLoading}
            className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={16} className={resendLoading ? "animate-spin" : ""} />
            {resendLoading ? "Resending..." : "Resend Code"}
          </button>
        )}
      </div>

      {/* Manual Verify button */}
      <button
        type="button"
        disabled={loading || otp.some((d) => d === "")}
        onClick={() => handleVerify()}
        className={`w-full bg-green-600 text-white py-3 rounded-lg font-semibold mt-4 ${
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

      {/* Troubleshooting Tips */}
      <div className="mt-4 text-center text-xs text-gray-500 max-w-xs">
        <p className="font-medium mb-1">Not receiving the email?</p>
        <ul className="text-left space-y-1">
          <li>• Check your spam/junk folder</li>
          <li>• Verify email: {email}</li>
          <li>• Wait 1-2 minutes for delivery</li>
          <li>• Request new code after timer expires</li>
        </ul>
      </div>
    </div>
  );
}