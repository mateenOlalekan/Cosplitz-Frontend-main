import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../../../store/authStore"; // Import Store
import { ArrowLeft, Mail } from "lucide-react";

export default function EmailVerificationStep({
  email,
  onBack,
  onSuccess,
}) {
  // Local UI state for the inputs
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(180); // 3 minutes
  const inputRefs = useRef([]);

  // Get Store Actions and State
  const { verifyOTP, resendOTP, isLoading, error, setError, tempRegister } = useAuthStore();

  // If page is refreshed, tempRegister might be lost. 
  // We should handle that gracefully (optional, but recommended).
  const userId = tempRegister?.userId || tempRegister?.id;

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // We don't clear store error immediately here to avoid flickering, 
    // but you could call setError(null) if desired.

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify
    if (newOtp.every((d) => d !== "") && !isLoading) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text/plain").trim();
    if (/^\d{6}$/.test(pasted)) {
      const digits = pasted.split("");
      setOtp(digits);
      inputRefs.current[5]?.focus();
      if (!isLoading) {
        handleVerify(pasted);
      }
    }
  };

  const handleVerify = async (code = null) => {
    const otpCode = code || otp.join("");

    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    // Use the store action
    const result = await verifyOTP(email, otpCode);

    if (result.success) {
      if (onSuccess) onSuccess();
    } else {
      // Store automatically sets 'error', but we can clear inputs if we want
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    
    if (!userId) {
      setError("Session expired. Please restart registration.");
      return;
    }

    const result = await resendOTP(userId);
    
    if (result.success) {
      setTimer(180);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="flex flex-col items-center gap-5 py-4 relative w-full">
      <button
        onClick={onBack}
        className="absolute left-4 top-4 text-gray-600 hover:text-green-600 transition-colors disabled:opacity-50"
        type="button"
        disabled={isLoading}
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

      <div className="flex gap-2 mt-2" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            maxLength={1}
            inputMode="numeric"
            value={digit}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            disabled={isLoading}
            className={`w-10 h-10 sm:w-12 sm:h-12 text-center text-lg font-bold border-2 rounded-lg outline-none transition-all ${
              error 
                ? "border-red-400 focus:ring-2 focus:ring-red-300" 
                : "border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-green-600"
            }`}
          />
        ))}
      </div>

      <div className="text-center mt-4">
        {timer > 0 ? (
          <p className="text-sm text-gray-600">
            Resend code in{" "}
            <span className="font-semibold text-green-600">{formatTime(timer)}</span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={isLoading} // Use store loading state
            className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors disabled:opacity-50"
          >
            Resend Code
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg text-center max-w-xs mt-2">
          {error}
        </div>
      )}

      <button
        type="button"
        disabled={isLoading || otp.some((d) => d === "")}
        onClick={() => handleVerify()}
        className={`w-full py-3 rounded-lg font-semibold mt-2 transition-all ${
          isLoading || otp.some((d) => d === "")
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-green-600 text-white hover:bg-green-700"
        }`}
      >
        {isLoading ? (
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