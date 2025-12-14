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
  const [timer, setTimer] = useState(180);

  useEffect(() => {
    if (timer <= 0) return;
    const i = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(i);
  }, [timer]);

  const handleVerify = async (code = otp.join("")) => {
    if (code.length !== 6) {
      setError("Enter the 6-digit code.");
      return;
    }

    setLoading(true);
    setError("");

    const response = await authService.verifyOTP(email, code);

    if (response.success) {
      onSuccess();
    } else {
      setError(response.data?.message || "Invalid OTP.");
    }

    setLoading(false);
  };

  const handleResend = async () => {
    if (timer > 0) return;

    const response = await authService.resendOTP(userId);
    if (response.success) {
      setOtp(["", "", "", "", "", ""]);
      setTimer(180);
    } else {
      setError(response.data?.message || "Failed to resend OTP.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 py-8 relative w-full">
      <button onClick={onBack} className="absolute left-4 top-4">
        <ArrowLeft size={28} />
      </button>

      <Mail size={28} />
      <p className="text-sm text-gray-600 text-center">
        Enter the code sent to <b>{email}</b>
      </p>

      <div className="flex gap-2">
        {otp.map((d, i) => (
          <input
            key={i}
            maxLength={1}
            value={d}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/, "");
              const copy = [...otp];
              copy[i] = v;
              setOtp(copy);
              if (v && i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
              if (copy.every(Boolean)) handleVerify(copy.join(""));
            }}
            id={`otp-${i}`}
            className="w-12 h-12 text-center border rounded-lg"
          />
        ))}
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button onClick={() => handleVerify()} disabled={loading}>
        {loading ? "Verifying..." : "Verify Email"}
      </button>

      {timer > 0 ? (
        <p>Resend in {timer}s</p>
      ) : (
        <button onClick={handleResend}>Resend Code</button>
      )}
    </div>
  );
}
