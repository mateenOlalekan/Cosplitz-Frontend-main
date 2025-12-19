// src/pages/EmailVerificationStep.jsx - UPDATED
import React, { useState, useEffect } from "react";
import { authService } from "../../../services/api";
import { ArrowLeft, Mail } from "lucide-react";

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
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text/plain").trim();

    if (/^\d{6}$/.test(pasted)) {
      const digits = pasted.split("");
      setOtp(digits);
      setError("");
      handleVerify(pasted);
    }
  };

  // Verify OTP - FIXED: Now uses email instead of userId
  const handleVerify = async (code = null) => {
    const otpCode = code || otp.join("");

    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // FIXED: Verify OTP with email, not userId
      const response = await authService.verifyOTP(email, otpCode);
      
      console.log("OTP Verification Response:", response);

      if (response?.success) {
        onSuccess();
      } else {
        const errorMsg = response?.data?.message || "Invalid OTP. Please try again.";
        setError(errorMsg);
        if (onVerificationFailed) {
          onVerificationFailed(errorMsg);
        }
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      const errorMsg = "Verification failed. Please try again.";
      setError(errorMsg);
      if (onVerificationFailed) {
        onVerificationFailed(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;

    setResendLoading(true);
    setError("");

    try {
      const response = await authService.resendOTP(userId);
      
      if (response?.success) {
        setTimer(180); // Reset timer to 3 minutes
        setOtp(["", "", "", "", "", ""]);
        document.getElementById(`otp-input-0`)?.focus();
      } else {
        setError(response?.data?.message || "Could not resend OTP.");
      }
    } catch (err) {
      console.error("OTP resend error:", err);
      setError("Failed to resend OTP. Try again.");
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
            className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
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

      {/* Verify button */}
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
    </div>
  );
}