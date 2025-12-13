import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { authService } from "../../../services/api";

export default function EmailVerificationStep({
  email,
  onSuccess,
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(180);

  const inputsRef = useRef([]);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (timer <= 0) return;
    const i = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(i);
  }, [timer]);

  /* ---------------- OTP CHANGE ---------------- */
  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  /* ---------------- VERIFY OTP ---------------- */
  const handleVerify = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authService.verifyOTP(
        email.toLowerCase().trim(),
        otpCode
      );

      console.log("VERIFY OTP RESPONSE:", response);

      if (response?.status === 200) {
        onSuccess();
      } else {
        setError(
          response?.data?.message ||
          "Invalid verification code."
        );
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RESEND OTP ---------------- */
  const handleResend = async () => {
    if (timer > 0) return;

    setResendLoading(true);
    setError(null);

    try {
      const response = await authService.resendOTP(
        email.toLowerCase().trim()
      );

      console.log("RESEND OTP RESPONSE:", response);

      if (response?.status === 200) {
        setOtp(["", "", "", "", "", ""]);
        setTimer(180);
        inputsRef.current[0]?.focus();
      } else {
        setError(
          response?.data?.message ||
          "Could not resend OTP."
        );
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      setError("Failed to resend OTP.");
    } finally {
      setResendLoading(false);
    }
  };

  /* ---------------- RENDER ---------------- */
  return (
    <div className="max-w-md mx-auto text-center">
      <h2 className="text-2xl font-bold text-gray-900">
        Verify Your Email
      </h2>

      <p className="text-gray-500 text-sm mt-2 mb-4">
        We sent a 6-digit code to{" "}
        <span className="font-medium text-gray-700">{email}</span>
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg mb-3">
          {error}
        </div>
      )}

      {/* OTP Inputs */}
      <div className="flex justify-center gap-2 mb-4">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputsRef.current[i] = el)}
            id={`otp-input-${i}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            className="w-12 h-12 text-center border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-green-500 outline-none"
          />
        ))}
      </div>

      {/* Verify Button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        disabled={loading}
        onClick={handleVerify}
        className={`w-full bg-green-600 text-white py-3 rounded-lg font-semibold transition ${
          loading ? "opacity-60 cursor-not-allowed" : "hover:bg-green-700"
        }`}
      >
        {loading ? "Verifying..." : "Verify Email"}
      </motion.button>

      {/* Resend */}
      <div className="text-sm text-gray-500 mt-4">
        {timer > 0 ? (
          <>Resend code in {timer}s</>
        ) : (
          <button
            onClick={handleResend}
            disabled={resendLoading}
            className="text-green-600 hover:underline font-medium"
          >
            {resendLoading ? "Resending..." : "Resend Code"}
          </button>
        )}
      </div>
    </div>
  );
}
