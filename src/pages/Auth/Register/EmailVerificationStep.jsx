import { useState, useEffect } from "react";
import { authService } from "../../services/api";
import { ArrowLeft } from "lucide-react";

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
  const [timer, setTimer] = useState(60);

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // Handle OTP input
  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input automatically
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  // Submit OTP
  const handleVerify = async () => {
    const code = otp.join("");

    if (code.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authService.verifyOTP(userId, code);

      if (response.success) {
        onSuccess();
      } else {
        setError(response.message || "Invalid OTP");
      }
    } catch (err) {
      setError(
        err?.message || "Verification failed. Please try again."
      );
    }

    setLoading(false);
  };

  // Resend OTP
  const handleResend = async () => {
    setResendLoading(true);
    setError("");

    try {
      const response = await authService.resendOTP(userId);

      if (!response.success) {
        setError(response.message || "Could not resend OTP");
      } else {
        setTimer(60); // reset countdown
      }
    } catch (err) {
      setError("Something went wrong while resending code.");
    }

    setResendLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <button onClick={onBack} className="flex items-center gap-1 mb-4 text-gray-600">
        <ArrowLeft size={18} /> Back
      </button>

      <h2 className="text-2xl font-bold">Verify your email</h2>
      <p className="text-gray-500 mt-1">
        Enter the 6-digit code sent to <span className="font-semibold">{email}</span>
      </p>

      {/* OTP Inputs */}
      <div className="flex justify-between mt-6">
        {otp.map((digit, i) => (
          <input
            key={i}
            id={`otp-${i}`}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(e.target.value, i)}
            className="w-12 h-12 border rounded-lg text-center text-lg font-semibold focus:ring-2 focus:ring-blue-500"
          />
        ))}
      </div>

      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full bg-blue-600 text-white rounded-lg py-3 mt-6 hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Verify Email"}
      </button>

      <div className="text-center mt-4 text-sm text-gray-600">
        {timer > 0 ? (
          <p>Resend code in <b>{timer}s</b></p>
        ) : (
          <button
            onClick={handleResend}
            disabled={resendLoading}
            className="text-blue-600 hover:underline"
          >
            {resendLoading ? "Resending..." : "Resend Code"}
          </button>
        )}
      </div>
    </div>
  );
}
