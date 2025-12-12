// src/pages/EmailVerificationStep.jsx
import React, { useState, useEffect } from "react";
import { ChevronLeft, Mail } from "lucide-react";
import { authService } from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import TimerDisplay from "../../components/TimerDisplay";

function EmailVerificationStep({ email, userId, onVerify, onBack, error, loading }) {
  const [emailOtp, setEmailOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(180);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  const setError = useAuthStore((state) => state.setError);
  const clearError = useAuthStore((state) => state.clearError);

  // If userId not passed, try from store
  const storeUser = useAuthStore((s) => s.user);

  const resolvedUserId = userId || storeUser?.id;

  useEffect(() => {
    if (timeLeft === 0) return;
    const timer = setInterval(() => setTimeLeft(prev => Math.max(prev - 1, 0)), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...emailOtp];
    newOtp[index] = value;
    setEmailOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }

    if (newOtp.every(d => d !== "")) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !emailOtp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  const handleVerify = async (otp) => {
    if (!resolvedUserId) {
      setLocalError("Missing user ID — cannot verify OTP.");
      return;
    }

    setVerificationLoading(true);
    setLocalError("");
    clearError();

    try {
      const response = await authService.verifyOTP({
        user_id: resolvedUserId,
        otp_code: otp,
      });

      if (response.status === 200 || response.status === 201) {
        onVerify();
      } else {
        setLocalError(response.data?.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setLocalError(err?.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLocalError("");
    clearError();

    if (!resolvedUserId) {
      setLocalError("Missing user ID — cannot resend OTP.");
      return;
    }

    try {
      const response = await authService.getOTP(resolvedUserId);
      if (response.status === 200) {
        setTimeLeft(180);
        setEmailOtp(["", "", "", "", "", ""]);
      } else {
        setLocalError(response.data?.message || "Failed to resend OTP.");
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      setLocalError("Failed to resend OTP. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 py-8 relative w-full">
      <button
        onClick={onBack}
        className="absolute left-4 top-4 text-gray-600 hover:text-green-600 transition"
        disabled={verificationLoading}
      >
        <ChevronLeft size={28} />
      </button>

      <h2 className="text-xl font-bold text-gray-800 mt-8">Verify Your Email</h2>
      <p className="text-gray-500 text-sm text-center max-w-xs">
        Enter the code sent to <span className="text-green-600 font-medium">{email}</span>.
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
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            disabled={verificationLoading}
            className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none disabled:opacity-50"
          />
        ))}
      </div>

      <TimerDisplay onResend={handleResendOTP} timeLeft={timeLeft} />

      {(localError || error) && (
        <p className="text-red-600 text-sm text-center max-w-xs">{localError || error}</p>
      )}

      <button
        onClick={() => handleVerify(emailOtp.join(""))}
        disabled={verificationLoading || emailOtp.some((d) => d === "")}
        className={`w-full bg-green-600 text-white py-3 rounded-lg font-semibold mt-4 ${
          verificationLoading || emailOtp.some((d) => d === "")
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-green-700"
        }`}
      >
        {verificationLoading ? "Verifying..." : "Verify Email"}
      </button>
    </div>
  );
}

export default EmailVerificationStep;
