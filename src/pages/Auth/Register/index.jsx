// src/pages/Register.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import loginlogo from "../../../assets/login.jpg";
import logo from "../../../assets/logo.svg";
import { authService } from "../../../services/api";
import { useAuthStore } from "../../../store/authStore";
import EmailVerificationStep from "./EmailVerificationStep";
import RegistrationForm from "./RegistrationForm";
import Successful from "./Successful";

export default function Register() {
  const navigate = useNavigate();

  /* -------------------------------------------------
     GLOBAL STORE
  -------------------------------------------------- */
  const setError = useAuthStore((s) => s.setError);
  const clearError = useAuthStore((s) => s.clearError);
  const error = useAuthStore((s) => s.error);
  const registerStore = useAuthStore((s) => s.register);
  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);

  /* -------------------------------------------------
     LOCAL STATE
  -------------------------------------------------- */
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [userId, setUserId] = useState(null);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    nationality: "",
    password: "",
    agreeToTerms: false,
  });

  /* -------------------------------------------------
     INP OPTIMIZATION (DEBOUNCED INPUT)
  -------------------------------------------------- */
  const inputTimer = useRef(null);

  const handleInputChange = (field, value) => {
    if (inputTimer.current) clearTimeout(inputTimer.current);

    inputTimer.current = setTimeout(() => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (error) clearError();
    }, 120); // INP-safe debounce
  };

  /* -------------------------------------------------
     STEPS CONFIG
  -------------------------------------------------- */
  const steps = [
    { id: 1, label: "Account", description: "Create your account" },
    { id: 2, label: "Verify Email", description: "Verify your email address" },
    { id: 3, label: "Success", description: "Account created successfully" },
  ];

  useEffect(() => {
    clearError();
  }, [currentStep]);

  /* -------------------------------------------------
     REGISTER SUBMIT (DJANGO ALIGNED)
  -------------------------------------------------- */
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return; // prevent double submit

    clearError();
    setSubmitting(true);
    setLoading(true);

    /* ---------- VALIDATION ---------- */
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError("Please fill out all required fields.");
      setLoading(false);
      setSubmitting(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the terms & conditions.");
      setLoading(false);
      setSubmitting(false);
      return;
    }

    const passwordValid =
      formData.password.length >= 8 &&
      /[A-Z]/.test(formData.password) &&
      /\d/.test(formData.password);

    if (!passwordValid) {
      setError("Password must contain at least 8 characters, one uppercase letter, and a number.");
      setLoading(false);
      setSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      setSubmitting(false);
      return;
    }

    /* ---------- BACKEND PAYLOAD ---------- */
    const payload = {
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      email: formData.email.toLowerCase().trim(),
      password: formData.password,
      username: formData.email.split("@")[0],
    };

    try {
      const response = await authService.register(payload);

      if (!response.success) {
        setError(response?.data?.message || "Registration failed.");
        return;
      }

      const backendUserId =
        response?.data?.user?.id ||
        response?.data?.id ||
        null;

      const userEmail =
        response?.data?.user?.email || payload.email;

      if (!backendUserId) {
        setError("Registration succeeded but user ID is missing.");
        return;
      }

      /* ---------- STORE ---------- */
      setUserId(backendUserId);
      setRegisteredEmail(userEmail);

      registerStore({
        userId: backendUserId,
        email: userEmail,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      if (response?.data?.token) {
        setToken(response.data.token);
        setUser({
          id: backendUserId,
          email: userEmail,
          name: `${formData.firstName} ${formData.lastName}`,
          role: "user",
          isVerified: false,
        });
      }

      /* ---------- STEP 2 (OTP SENT BY BACKEND) ---------- */
      setCurrentStep(2);

    } catch (err) {
      console.error("REGISTER ERROR:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  /* -------------------------------------------------
     STEP HANDLERS
  -------------------------------------------------- */
  const handleEmailVerificationSuccess = () => {
    setCurrentStep(3);
    setTimeout(() => navigate("/dashboard"), 3000);
  };

  const handleBackToStep1 = () => {
    clearError();
    setCurrentStep(1);
  };

  /* -------------------------------------------------
     UI (UNCHANGED)
  -------------------------------------------------- */
  return (
    <div className="flex bg-[#F7F5F9] w-full h-screen justify-center overflow-hidden md:px-6 md:py-4 rounded-2xl">
      <div className="flex max-w-screen-2xl w-full h-full rounded-xl overflow-hidden">

        {/* LEFT */}
        <div className="hidden lg:flex w-1/2 bg-[#F8EACD] rounded-xl p-6 items-center justify-center">
          <div className="w-full flex flex-col items-center">
            <img
              src={loginlogo}
              alt="Register"
              className="rounded-lg w-full h-auto max-h-[400px] object-contain"
            />
            <div className="bg-gradient-to-br max-w-lg from-[#FAF3E8] to-[#F8EACD] mt-4 p-4 rounded-2xl shadow-sm text-center">
              <h1 className="text-3xl font-semibold text-[#2D0D23] mb-1">
                Share Expenses & Resources in Real Time
              </h1>
              <p className="text-xl font-medium text-[#4B4B4B] leading-relaxed">
                Connect with students, travelers, and locals to effortlessly manage costs and resources.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-1 flex-col items-center p-3 sm:p-5 overflow-y-auto">
          <div className="w-full mb-4 flex justify-center md:justify-start items-center md:items-start">
            <img src={logo} alt="Logo" className="h-10 md:h-12" />
          </div>

          <div className="w-full max-w-2xl p-5 rounded-xl shadow-none md:shadow-md border-none md:border border-gray-100 bg-white">

            {/* STEPS */}
            <div className="w-full flex flex-col items-center py-4 mb-4">
              <div className="flex items-center gap-2 justify-center mb-2">
                {steps.map((s, i) => (
                  <div key={s.id} className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${currentStep >= s.id
                        ? "bg-green-600 border-green-600 text-white"
                        : "bg-white border-gray-300 text-gray-400"
                      }`}>
                      {s.id}
                    </div>
                    {i < steps.length - 1 && (
                      <div
                        className={`w-16 md:w-24 lg:w-32 border-t-2 mx-2 ${currentStep > s.id ? "border-green-600" : "border-gray-300"}`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 text-center">
                {steps.find((s) => s.id === currentStep)?.description}
              </p>
            </div>

            {currentStep === 1 && (
              <RegistrationForm
                formData={formData}
                handleInputChange={handleInputChange}
                handleFormSubmit={handleFormSubmit}
                loading={loading}
                error={error}
              />
            )}

            {currentStep === 2 && (
              <EmailVerificationStep
                email={registeredEmail || formData.email}
                userId={userId}
                onBack={handleBackToStep1}
                onSuccess={handleEmailVerificationSuccess}
              />
            )}

            {currentStep === 3 && <Successful />}
          </div>
        </div>
      </div>
    </div>
  );
}
