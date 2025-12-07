/* REGISTER PAGE — CLEANED + FULLY FIXED */
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import loginlogo from "../../../assets/login.jpg";
import logo from "../../../assets/logo.svg";
import { FcGoogle } from "react-icons/fc";
import { PiAppleLogoBold } from "react-icons/pi";
import Checknow from "../../../assets/Check.svg";
import { Link, useNavigate } from "react-router-dom";
import EmailVerificationStep from "./EmailVerificationStep";
import PasswordValidation from "./PasswordValidation";
import { useRegisterStore } from "../../../store/registerStore";

export default function Register() {
  const navigate = useNavigate();

  const {
    registerUser,
    currentStep,
    setStep,
    error,
    clearError,
  } = useRegisterStore();

  const [showPassword, setShowPassword] = useState(false);

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

  /* ================= HANDLE SUBMIT ================= */
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const valid =
      formData.password.length >= 8 &&
      /[A-Z]/.test(formData.password) &&
      /\d/.test(formData.password);

    if (!valid) return alert("Password does not meet requirements.");
    if (!formData.agreeToTerms) return alert("You must agree to the terms.");

    clearError();

    try {
      await registerUser(formData); // Store handles moving to step 2
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#F7F5F9] overflow-hidden lg:px-6 lg:py-4 rounded-2xl">

      {/* LEFT SIDE */}
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

      {/* RIGHT SIDE */}
      <div className="flex flex-1 flex-col items-center rounded-xl bg-white p-3 sm:p-5 overflow-y-auto">

        <div className="w-full mb-4">
          <img src={logo} className="h-10 md:h-12" />
        </div>

        <div className="w-full max-w-2xl bg-white p-5 rounded-xl">

          {/* STEPS INDICATOR */}
          <div className="w-full flex justify-center items-center py-4">
            <div className="flex items-center gap-2 justify-center">
              {steps.map((s, i) => (
                <div key={s.id} className="flex items-center">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      currentStep >= s.id ? "bg-green-600 shadow-md" : "bg-gray-300"
                    }`}
                  ></div>

                  {i < steps.length - 1 && (
                    <div
                      className={`w-28 sm:w-32 border-t-2 mx-2 ${
                        currentStep > s.id ? "border-green-600" : "border-gray-300"
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

              {/* SOCIAL BUTTONS */}
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

              {/* DIVIDER */}
              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-2 text-gray-500 text-sm">Or</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-3">
                {["firstName", "lastName", "email", "nationality"].map((field) => (
                  <div key={field}>
                    <label className="text-sm font-medium text-gray-700 capitalize mb-1 block">
                      {field.replace(/([A-Z])/g, " $1")} *
                    </label>

                    <input
                      type={field === "email" ? "email" : "text"}
                      value={formData[field]}
                      placeholder={`Enter your ${field}`}
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
                    Password *
                  </label>

                  <div className="flex items-center border border-gray-300 px-3 rounded-lg focus-within:ring-2 focus-within:ring-green-500">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
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
                  I agree to the <a className="text-green-600">Terms</a>,{" "}
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
            <EmailVerificationStep email={formData.email} />
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
                Continue
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
