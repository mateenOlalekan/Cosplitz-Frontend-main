import React, { useState, useEffect, useRef } from "react";
import { authService } from "../../../services/api";
import { ArrowLeft, Mail } from "lucide-react";

const OTP_LENGTH = 6;
const RESEND_DELAY = 180; // seconds

export default function EmailVerificationStep({
  email,
  userId, // kept for UI compatibility (not used by backend)
  onBack,
  onSuccess,
  onVerificationFailed,
}) {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(RESEND_DELAY);

  const inputsRef = useRef([]);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  /* ---------------- INPUT HANDLERS ---------------- */
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    setOtp((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });

    setError("");

    if (value && index < OTP_LENGTH - 1) {
      requestAnimationFrame(() => {
        inputsRef.current[index + 1]?.focus();
      });
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();

    if (!/^\d{6}$/.test(pasted)) return;

    setOtp(pasted.split(""));
    setError("");

    requestAnimationFrame(() => {
      inputsRef.current[5]?.focus();
    });
  };

  /* ---------------- VERIFY OTP ---------------- */
  const handleVerify = async () => {
    const code = otp.join("");

    if (code.length !== OTP_LENGTH) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    setLoading(true);
    setError("");

    console.info("[AUTH] OTP VERIFY →", { email });

    const res = await authService.verifyOTP(email, code);

    if (res?.success) {
      onSuccess();
    } else {
      const msg = res?.data?.message || "Invalid OTP.";
      setError(msg);
      onVerificationFailed?.(msg);
      console.warn("[AUTH] OTP FAILED →", res);
    }

    setLoading(false);
  };

  /* ---------------- RESEND OTP ---------------- */
  const handleResend = async () => {
    if (timer > 0) return;

    setResendLoading(true);
    setError("");

    console.info("[AUTH] OTP RESEND →", { userId });

    const res = await authService.getOTP(userId);

    if (res?.success) {
      setOtp(Array(OTP_LENGTH).fill(""));
      setTimer(RESEND_DELAY);
      inputsRef.current[0]?.focus();
    } else {
      setError(res?.data?.message || "Could not resend OTP.");
    }

    setResendLoading(false);
  };

  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  /* ---------------- UI (UNCHANGED) ---------------- */
  return (
    <div className="flex flex-col items-center gap-5 py-8 relative w-full">
      <button
        onClick={onBack}
        className="absolute left-4 top-4 text-gray-600 hover:text-green-600"
        type="button"
        disabled={loading}
      >
        <ArrowLeft size={28} />
      </button>

      <h2 className="text-xl font-bold text-gray-800 mt-8">
        Verify Your Email
      </h2>

      <p className="text-gray-500 text-sm text-center max-w-xs">
        Enter the code sent to{" "}
        <span className="text-green-600 font-medium">{email}</span>
      </p>

      <div className="bg-[#1F82250D] rounded-full w-14 h-14 flex items-center justify-center">
        <Mail className="text-[#1F8225]" size={24} />
      </div>

      <div className="flex gap-2 mt-2" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputsRef.current[i] = el)}
            type="text"
            maxLength={1}
            inputMode="numeric"
            value={digit}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            disabled={loading}
            className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
          />
        ))}
      </div>

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
            className="text-green-600 hover:text-green-700 text-sm font-medium"
          >
            {resendLoading ? "Resending..." : "Resend Code"}
          </button>
        )}
      </div>

      {error && (
        <p className="text-red-600 text-sm text-center max-w-xs">{error}</p>
      )}

      <button
        type="button"
        onClick={handleVerify}
        disabled={loading || otp.some((d) => !d)}
        className={`w-full bg-green-600 text-white py-3 rounded-lg font-semibold mt-4 ${
          loading ? "opacity-60" : "hover:bg-green-700"
        }`}
      >
        {loading ? "Verifying..." : "Verify Email"}
      </button>
    </div>
  );
}
