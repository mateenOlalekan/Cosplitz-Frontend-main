/* CLEANED + UI OPTIMIZED VERSION */
import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, ChevronLeft, Check, X } from "lucide-react";
import loginlogo from "../assets/login.jpg";
import logo from "../assets/logo.svg";
import { FcGoogle } from "react-icons/fc";
import { PiAppleLogoBold } from "react-icons/pi";
import Checknow from "../assets/Check.svg";
import { Link, useNavigate } from "react-router-dom";

/* ================= TIMER ================= */
function TimerDisplay() {
  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    if (timeLeft === 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <p className="text-gray-600 text-sm mt-3">
      Resend available in{" "}
      <span className="text-green-600 font-semibold">
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </span>
    </p>
  );
}

/* ================= PASSWORD VALIDATION ================= */
function PasswordValidation({ password }) {
  const validations = [
    { label: "8+ characters", isValid: password.length >= 8 },
    { label: "Uppercase letter", isValid: /[A-Z]/.test(password) },
    { label: "Digit", isValid: /\d/.test(password) },
  ];

  return (
    <div className="flex flex-col gap-2 mt-2">
      {validations.map((v, i) => (
        <div key={i} className="flex items-center gap-3">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center ${
              v.isValid ? "bg-green-100" : "bg-gray-100"
            }`}
          >
            {v.isValid ? (
              <Check size={14} className="text-green-600" />
            ) : (
              <X size={14} className="text-gray-400" />
            )}
          </div>
          <span
            className={`text-xs ${
              v.isValid ? "text-green-600" : "text-gray-500"
            }`}
          >
            {v.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ================= EMAIL OTP STEP ================= */
function EmailVerificationStep({ onVerify, onBack, error }) {
  const [emailOtp, setEmailOtp] = useState("");
  const correctEmailOTP = "654321";

  useEffect(() => {
    if (emailOtp.length === 6 && emailOtp === correctEmailOTP) {
      onVerify();
    }
  }, [emailOtp]);

  const handleChange = (index, value) => {
    const otp = emailOtp.split("");
    otp[index] = value;
    setEmailOtp(otp.join(""));

    if (value && index < 5) {
      document.getElementById(`email-otp-${index + 1}`).focus();
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 py-8 relative w-full">
      <button
        onClick={onBack}
        className="absolute left-4 top-4 text-gray-600 hover:text-green-600 transition"
      >
        <ChevronLeft size={28} />
      </button>

      <h2 className="text-xl font-bold text-gray-800 mt-8">
        Verify Your Email
      </h2>
      <p className="text-gray-500 text-sm text-center max-w-xs">
        Enter the code sent to your{" "}
        <span className="text-green-600">email</span>.
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
            onChange={(e) =>
              handleChange(i, e.target.value.replace(/\D/g, ""))
            }
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

      <TimerDisplay />

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}

/* ================= MAIN LOGIN ================= */
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    nationality: "",
    password: "",
    agreeToTerms: false,
  });

  const steps = [
    { id: 1, label: "Account" },
    { id: 2, label: "Verify Email" },
    { id: 3, label: "Success" },
  ];

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const valid =
      formData.password.length >= 8 &&
      /[A-Z]/.test(formData.password) &&
      /\d/.test(formData.password);

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    )
      return setError("Please fill out all fields.");

    if (!valid)
      return setError("Your password does not meet all requirements.");

    if (!formData.agreeToTerms)
      return setError("Please agree to the terms & conditions.");

    setError("");
    setCurrentStep(2);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#F7F5F9] overflow-hidden md:px-6 md:py-4 rounded-2xl">
      {/* LEFT IMAGE SIDE */}
      <div className="hidden lg:flex w-1/2 bg-[#F8EACD] rounded-xl p-6 items-center justify-center">
        <div className="max-w-md w-full flex flex-col items-center">
          <img src={loginlogo} className="rounded-lg" />
          <div className="bg-gradient-to-br from-[#FAF3E8] to-[#F8EACD] mt-4 p-4 rounded-2xl shadow-sm text-center">
            <h1 className="text-3xl font-semibold text-[#2D0D23] mb-1">
              Share Expenses & Resources in Real Time
            </h1>
            <p className="text-sm text-[#4B4B4B] leading-relaxed">
              Connect with students, travelers, and locals securely.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT FORM SIDE */}
      <div className="flex flex-1 flex-col items-center bg-white p-3 sm:p-5 overflow-y-auto">
        <div className="w-full mb-4">
          <img src={logo} className="h-10 md:h-12" />
        </div>

        <div className="w-full max-w-2xl bg-white p-5 rounded-xl shadow-md border border-gray-100">
          {/* STEP INDICATOR */}
<div className="w-full flex justify-center  items-center py-4">
  <div className="flex items-center gap-2 justify-center">
    {steps.map((s, i) => (
      <div key={s.id} className="flex items-center">
        <div
          className={`w-4 h-4 rounded-full ${
            currentStep >= s.id
              ? "bg-green-600 shadow-md"
              : "bg-gray-300"
          }`}
        ></div>

        {i < steps.length - 1 && (
          <div
            className={`w-28 sm:w-32 border-t-2 mx-2 ${
              currentStep > s.id
                ? "border-green-600"
                : "border-gray-300"
            }`}
          ></div>
        )}
      </div>
    ))}
  </div>
</div>


          {/* ================= STEP 1 ================= */}
          {currentStep === 1 && (
            <div>
              <h1 className="text-2xl sm:text-3xl text-center font-bold text-gray-900">
                Create Your Account
              </h1>
              <p className="text-gray-500 text-center text-sm mt-1 mb-4">
                Let's get started with real-time cost sharing.
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-2 rounded-lg mb-3 text-center">
                  {error}
                </div>
              )}

              {/* Social */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                <button className="flex items-center justify-center gap-3 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <FcGoogle size={20} />
                  <span className="text-gray-700 text-sm">Sign Up with Google</span>
                </button>

                <button className="flex items-center justify-center gap-3 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <PiAppleLogoBold size={20} />
                  <span className="text-gray-700 text-sm">Sign Up with Apple</span>
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-2 text-gray-500 text-sm">Or</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              {/* FORM */}
              <form onSubmit={handleFormSubmit} className="space-y-3">
                {/* Fields */}
                {["firstName", "lastName", "email", "nationality"].map((field) => (
                  <div key={field}>
                    <label className="text-sm font-medium text-gray-700 capitalize mb-1 block">
                      {field.replace(/([A-Z])/g, " $1")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      placeholder={`Enter your ${field}`}
                      value={formData[field]}
                      name={field}
                      onChange={(e) =>
                        setFormData({ ...formData, [field]: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                ))}

                {/* PASSWORD */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>

                  <div className="flex items-center border border-gray-300 px-3 rounded-lg focus-within:ring-2 focus-within:ring-green-500">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      name="password"
                      placeholder="Create your password"
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full py-2 outline-none"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                <PasswordValidation password={formData.password} />

                {/* TERMS */}
                <label className="flex gap-2 text-sm text-gray-600 mt-2">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        agreeToTerms: e.target.checked,
                      })
                    }
                  />
                  I agree to the{" "}
                  <a className="text-green-600">Terms</a>,{" "}
                  <a className="text-green-600">Privacy</a> &{" "}
                  <a className="text-green-600">Fees</a>.
                </label>

                <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
                  Create Account
                </button>

                <p className="text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link className="text-green-600" to="/login">
                    Log In
                  </Link>
                </p>
              </form>
            </div>
          )}

          {/* ================= STEP 2 ================= */}
          {currentStep === 2 && (
            <EmailVerificationStep
              onVerify={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
              error={error}
            />
          )}

          {/* ================= STEP 3 ================= */}
          {currentStep === 3 && (
            <div className="flex flex-col items-center text-center py-6">
              <img src={Checknow} className="w-24 h-24" />
              <h2 className="text-2xl font-bold text-gray-800 mt-4">
                Email Verified!
              </h2>
              <p className="text-gray-600 mt-2">
                Your email has been successfully verified.
              </p>

              <button
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
                onClick={() => navigate("/onboarding-steps")}
              >
                Continue to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}