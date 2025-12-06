import { useState, useEffect } from "react";
import { ChevronLeft, Mail } from "lucide-react";
import TimerDisplay from "./TimerDisplay";
import { verifyOTP, resendOTP } from "../../../api/apiClient";

export default function EmailVerificationStep({ email, onVerify, onBack, error }) {
  const [emailOtp, setEmailOtp] = useState("");

  const handleVerify = async () => {
    try {
      await verifyOTP(email, emailOtp);
      onVerify();
    } catch (err) {
      alert(err?.response?.data?.message || "Invalid OTP");
    }
  };

  useEffect(() => {
    if (emailOtp.length === 6) handleVerify();
  }, [emailOtp]);

  const handleResend = async () => {
    try {
      await resendOTP(email);
      alert("OTP resent successfully!");
    } catch {
      alert("Could not resend OTP.");
    }
  };

  const handleChange = (index, value) => {
    const otp = emailOtp.split("");
    otp[index] = value;
    setEmailOtp(otp.join(""));
    if (value && index < 5) document.getElementById(`email-otp-${index + 1}`).focus();
  };

  return (
    <div className="flex flex-col items-center gap-5 py-8 relative w-full">
      <button onClick={onBack} className="absolute left-4 top-4 text-gray-600 hover:text-green-600 transition">
        <ChevronLeft size={28} />
      </button>

      <h2 className="text-xl font-bold text-gray-800 mt-8">Verify Your Email</h2>
      <p className="text-gray-500 text-sm text-center max-w-xs">
        Enter the 6-digit code sent to your <span className="text-green-600">email</span>.
      </p>

      <div className="bg-[#1F82250D] rounded-full w-14 h-14 flex items-center justify-center">
        <Mail className="text-[#1F8225]" />
      </div>

      <div className="flex gap-2 mt-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <input
            key={i}
            type="text"
            maxLength={1}
            inputMode="numeric"
            value={emailOtp[i] || ""}
            onChange={(e) => handleChange(i, e.target.value.replace(/\D/g, ""))}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !emailOtp[i] && i > 0) {
                document.getElementById(`email-otp-${i - 1}`).focus();
              }
            }}
            id={`email-otp-${i}`}
            className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
          />
        ))}
      </div>

      <TimerDisplay onResend={handleResend} />
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}
