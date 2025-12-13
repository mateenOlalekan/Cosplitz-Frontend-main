import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useAuthStore } from "../../../store/authStore";

const OTP_LEN = 6;

export default function EmailVerificationStep({
  email,
  userId,
  onBack,
  onSuccess,
}) {
  const { verifyOtp, requestOtp } = useAuthStore();

  const [otp, setOtp] = useState(Array(OTP_LEN).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputs = useRef([]);

  /* ---------------- VERIFY ---------------- */
  const submit = async () => {
    const code = otp.join("");
    if (code.length !== OTP_LEN) {
      setError("Enter full OTP");
      return;
    }

    try {
      setLoading(true);
      await verifyOtp(email, code);
      onSuccess();
    } catch {
      setError("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RESEND ---------------- */
  const resend = async () => {
    await requestOtp(userId);
    setOtp(Array(OTP_LEN).fill(""));
    inputs.current[0]?.focus();
  };

  return (
    <div className="text-center space-y-4">
      <button onClick={onBack}>
        <ArrowLeft />
      </button>

      <h3 className="font-bold">Verify Email</h3>
      <p className="text-sm">Code sent to {email}</p>

      <div className="flex justify-center gap-2">
        {otp.map((d, i) => (
          <input
            key={i}
            ref={(el) => (inputs.current[i] = el)}
            value={d}
            maxLength={1}
            onChange={(e) => {
              if (!/^\d?$/.test(e.target.value)) return;
              const next = [...otp];
              next[i] = e.target.value;
              setOtp(next);
              if (e.target.value) inputs.current[i + 1]?.focus();
            }}
            className="w-10 h-10 border text-center"
          />
        ))}
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        onClick={submit}
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded"
      >
        {loading ? "Verifying..." : "Verify"}
      </button>

      <button onClick={resend} className="text-sm text-green-600">
        Resend OTP
      </button>
    </div>
  );
}
