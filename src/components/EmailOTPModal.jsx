// src/components/EmailOTPModal.jsx
import { useState, useEffect } from "react";
import { Mail, Clock, AlertCircle } from "lucide-react";

export default function EmailOTPModal({ onClose }) {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(300);
  const [isExpired, setIsExpired] = useState(false);
  const [error, setError] = useState("");
  const correctOTP = "625243";

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) =>
    `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  const handleVerify = () => {
    if (otp === correctOTP) {
      setError("");
      alert("Email verified!");
      onClose();
    } else {
      setError("Invalid OTP. Try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 shadow-lg text-center">
        <Mail className="mx-auto text-green-600 w-10 h-10 mb-2" />
        <h2 className="text-xl font-bold mb-2">Verify Your Email</h2>
        <p className="text-gray-500 mb-4">Enter the 6-digit code sent to your email.</p>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          className="border w-full px-4 py-2 text-center rounded-lg mb-3"
          maxLength={6}
          disabled={isExpired}
        />

        <div className="text-gray-600 mb-4">
          {isExpired ? (
            <span className="text-red-600">OTP expired</span>
          ) : (
            <>Valid for {formatTime(timeLeft)}</>
          )}
        </div>

        {error && (
          <div className="text-red-500 text-sm mb-3 flex items-center justify-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <button
          onClick={handleVerify}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        >
          Verify
        </button>
        <button
          onClick={onClose}
          className="mt-3 text-sm text-gray-500 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
