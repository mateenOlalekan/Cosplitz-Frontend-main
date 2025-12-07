import { useState, useEffect } from "react";
import { ChevronLeft, Mail } from "lucide-react";
import TimerDisplay from "./TimerDisplay";
import { useRegisterStore } from "../../../store/registerStore";

export default function EmailVerificationStep({ email }) {
  const [otp, setOtp] = useState("");
  const { verifyOtp, resendOtp, error, setStep } = useRegisterStore();

  useEffect(() => {
    if (otp.length === 6) verifyOtp(otp);
  }, [otp]);

  const handleChange = (index, value) => {
    const updated = otp.split("");
    updated[index] = value;
    setOtp(updated.join(""));

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 py-8 relative w-full">

      {/* Back Button */}
      <button
        onClick={() => setStep(1)}
        className="absolute left-4 top-4 text-gray-600 hover:text-green-600 transition"
      >
        <ChevronLeft size={28} />
      </button>

      <h2 className="text-xl font-bold text-gray-800 mt-8">Verify Your Email</h2>
      <p className="text-gray-500 text-sm text-center max-w-xs">
        Enter the 6-digit code sent to{" "}
        <span className="text-green-600">{email}</span>
      </p>

      <div className="bg-[#1F82250D] rounded-full w-14 h-14 flex items-center justify-center">
        <Mail className="text-[#1F8225]" />
      </div>

      {/* OTP Inputs */}
      <div className="flex gap-2 mt-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <input
            key={i}
            id={`otp-${i}`}
            maxLength={1}
            inputMode="numeric"
            type="text"
            value={otp[i] || ""}
            onChange={(e) => handleChange(i, e.target.value.replace(/\D/g, ""))}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !otp[i] && i > 0) {
                document.getElementById(`otp-${i - 1}`).focus();
              }
            }}
            className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
          />
        ))}
      </div>

      <TimerDisplay onResend={() => resendOtp(email)} />

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}
