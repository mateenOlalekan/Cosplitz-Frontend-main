import { useState, useEffect } from "react";
import { authService } from "../../../services/api";
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
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle paste OTP
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      const newOtp = [...otp];
      digits.forEach((digit, index) => {
        if (index < 6) newOtp[index] = digit;
      });
      setOtp(newOtp);
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
      // ✅ FIXED: Correct API call format
      const response = await authService.verifyOTP(userId, code);
      
      // ✅ FIXED: Check response structure based on your API
      if (response.status === 200 || response.status === 201) {
        onSuccess();
      } else {
        setError(response.data?.message || response.data?.error || "Invalid OTP");
      }
    } catch (err) {
      console.error("Verification error:", err);
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

      if (response.status === 200 || response.status === 201) {
        setTimer(60); // reset countdown
        setError(""); // Clear any previous errors
      } else {
        setError(response.data?.message || "Could not resend OTP");
      }
    } catch (err) {
      console.error("Resend error:", err);
      setError("Something went wrong while resending code.");
    }

    setResendLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <button 
        onClick={onBack} 
        className="flex items-center gap-1 mb-4 text-gray-600 hover:text-gray-800 transition-colors"
        type="button"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <h2 className="text-2xl font-bold">Verify your email</h2>
      <p className="text-gray-500 mt-1">
        Enter the 6-digit code sent to <span className="font-semibold">{email}</span>
      </p>

      {/* OTP Inputs */}
      <div className="flex justify-between mt-6" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            id={`otp-${i}`}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && !digit && i > 0) {
                document.getElementById(`otp-${i - 1}`).focus();
              }
            }}
            className="w-12 h-12 border rounded-lg text-center text-lg font-semibold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            autoFocus={i === 0}
          />
        ))}
      </div>

      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full bg-blue-600 text-white rounded-lg py-3 mt-6 hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
        type="button"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Verifying...
          </span>
        ) : "Verify Email"}
      </button>

      <div className="text-center mt-4 text-sm text-gray-600">
        {timer > 0 ? (
          <p>Resend code in <b>{timer}s</b></p>
        ) : (
          <button
            onClick={handleResend}
            disabled={resendLoading}
            className="text-blue-600 hover:underline font-medium transition-colors"
            type="button"
          >
            {resendLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                Resending...
              </span>
            ) : "Resend Code"}
          </button>
        )}
      </div>
    </div>
  );
}