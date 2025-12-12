import { useState, useEffect } from "react";
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
  const [timer, setTimer] = useState(180); // Changed to 180 seconds (3 minutes)

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
    setError(""); // Clear error when user types

    // Move to next input automatically
    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }

    // Auto-verify when all digits are entered
    if (newOtp.every(digit => digit !== "")) {
      handleVerify(newOtp.join(""));
    }
  };

  // Handle key down
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
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
      setError("");
      
      // Focus the last input
      document.getElementById(`otp-input-5`)?.focus();
      
      // Auto-verify
      handleVerify(pastedData);
    }
  };

  // Submit OTP
  const handleVerify = async (code = null) => {
    const otpCode = code || otp.join("");

    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authService.verifyOTP(userId, otpCode);
      
      if (response.status === 200 || response.status === 201) {
        onSuccess();
      } else {
        setError(response.data?.message || response.data?.error || "Invalid OTP. Please try again.");
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
    if (timer > 0) return;
    
    setResendLoading(true);
    setError("");

    try {
      const response = await authService.resendOTP(userId);

      if (response.status === 200 || response.status === 201) {
        setTimer(180); // reset countdown to 3 minutes
        setOtp(["", "", "", "", "", ""]); // Clear OTP inputs
        document.getElementById(`otp-input-0`)?.focus(); // Focus first input
      } else {
        setError(response.data?.message || "Could not resend OTP");
      }
    } catch (err) {
      console.error("Resend error:", err);
      setError("Something went wrong while resending code.");
    }

    setResendLoading(false);
  };

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
        Enter the code sent to <span className="text-green-600 font-medium">{email}</span>.
      </p>

      <div className="bg-[#1F82250D] rounded-full w-14 h-14 flex items-center justify-center">
        <Mail className="text-[#1F8225]" size={24} />
      </div>

      {/* OTP Inputs */}
      <div className="flex gap-2 mt-2" onPaste={handlePaste}>
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-input-${index}`}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            disabled={loading}
            className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none disabled:opacity-50"
            autoFocus={index === 0}
          />
        ))}
      </div>

      {/* Timer Display and Resend Button */}
      <div className="text-center mt-4">
        {timer > 0 ? (
          <p className="text-sm text-gray-600">
            Resend code in <span className="font-semibold">{formatTime(timer)}</span>
          </p>
        ) : (
          <button
            onClick={handleResend}
            disabled={resendLoading}
            className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
            type="button"
          >
            {resendLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                Resending...
              </span>
            ) : "Resend Code"}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-600 text-sm text-center max-w-xs mt-2">{error}</p>
      )}

      {/* Verify Button */}
      <button
        onClick={() => handleVerify()}
        disabled={loading || otp.some(d => d === "")}
        className={`w-full bg-green-600 text-white py-3 rounded-lg font-semibold mt-4 ${
          loading || otp.some(d => d === "")
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-green-700"
        }`}
        type="button"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Verifying...
          </span>
        ) : "Verify Email"}
      </button>
    </div>
  );
}