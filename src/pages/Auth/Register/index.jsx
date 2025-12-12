// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginlogo from "../../assets/login.jpg";
import logo from "../../assets/logo.svg";
import { authService } from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import EmailVerificationStep from "./EmailVerificationStep";
import RegistrationForm from "./RegistrationForm";
import Successful from "./Successful";

export default function Register() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const setError = useAuthStore((state) => state.setError);
  const clearError = useAuthStore((state) => state.clearError);
  const error = useAuthStore((state) => state.error);
  const registerStore = useAuthStore((state) => state.register);

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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearError();

    // Basic validations
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError("Please fill out all required fields.");
      setLoading(false);
      return;
    }

    if (!formData.nationality) {
      setError("Please select your nationality.");
      setLoading(false);
      return;
    }

    const validPassword =
      formData.password.length >= 8 &&
      /[A-Z]/.test(formData.password) &&
      /\d/.test(formData.password);

    if (!validPassword) {
      setError("Your password does not meet all requirements.");
      setLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the terms & conditions.");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const response = await authService.register({
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        email: formData.email.toLowerCase().trim(),
        nationality: formData.nationality.trim(),
        password: formData.password,
      });

      if (response.status === 200 || response.status === 201) {
        const backendUserId = response.data?.id;
        setUserId(backendUserId);

        // Store user basic data
        registerStore({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          nationality: formData.nationality,
          userId: backendUserId,
        });

        setRegistrationSuccess(true);
        setCurrentStep(2);

        // Request OTP via GET /otp/<user_id>/
        try {
          await authService.getOTP(backendUserId);
        } catch (otpError) {
          console.warn("OTP request failed:", otpError);
        }
      } else {
        setError(response.data?.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Network error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = (provider) => {
    setError(`${provider} registration is not available yet.`);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) clearError();
  };

  const handleEmailVerificationSuccess = () => {
    setCurrentStep(3);
  };

  return (
    <div className="flex bg-[#F7F5F9] w-full h-screen justify-center overflow-hidden md:px-6 md:py-4 rounded-2xl">
      <div className="flex max-w-screen-2xl w-full h-full rounded-xl overflow-hidden">

        {/* LEFT IMAGE */}
        <div className="hidden lg:flex w-1/2 bg-[#F8EACD] rounded-xl p-6 items-center justify-center">
          <div className="w-full flex flex-col items-center">
            <img src={loginlogo} alt="Register" className="rounded-lg w-full h-auto max-h-[400px] object-contain" />
            <div className="bg-gradient-to-br max-w-lg bottom-0 from-[#FAF3E8] to-[#F8EACD] mt-4 p-4 rounded-2xl shadow-sm text-center">
              <h1 className="text-3xl font-semibold text-[#2D0D23] mb-1">
                Share Expenses & Resources in Real Time
              </h1>
              <p className="text-xl font-medium text-[#4B4B4B] leading-relaxed">
                Connect with students, travelers, and locals to effortlessly manage costs and resources.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="flex flex-1 flex-col items-center p-3 sm:p-5 overflow-y-auto">
          <div className="w-full mb-4 flex justify-center md:justify-start items-center md:items-start">
            <img src={logo} alt="Logo" className="h-10 md:h-12" />
          </div>

          <div className="w-full max-w-2xl p-5 rounded-xl shadow-none md:shadow-md border-none md:border border-gray-100">

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
                        className={`w-16 md:w-24 lg:w-32 border-t-2 mx-2 ${
                          currentStep > s.id ? "border-green-600" : "border-gray-300"
                        }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* STEP 1 */}
            {currentStep === 1 && (
              <RegistrationForm
                formData={formData}
                handleInputChange={handleInputChange}
                handleFormSubmit={handleFormSubmit}
                handleSocialRegister={handleSocialRegister}
                loading={loading}
                error={error}
              />
            )}

            {/* STEP 2 */}
            {currentStep === 2 && (
              <EmailVerificationStep
                email={formData.email}
                userId={userId}
                onVerify={handleEmailVerificationSuccess}
                onBack={() => {
                  if (registrationSuccess) setCurrentStep(1);
                  else navigate("/register");
                }}
                error={error}
                loading={loading}
              />
            )}

            {/* STEP 3 */}
            {currentStep === 3 && <Successful />}
          </div>
        </div>
      </div>
    </div>
  );
}
