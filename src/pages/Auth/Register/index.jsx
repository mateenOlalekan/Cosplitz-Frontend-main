// src/pages/Register.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import loginlogo from "../../../assets/login.jpg";
import logo from "../../../assets/logo.svg";
import { authService } from "../../../services/api";
import { useAuthStore } from "../../../store/authStore";
import EmailVerificationStep from "./EmailVerificationStep";
import RegistrationForm from "./RegistrationForm";
import Successful from "./Successful";

export default function Register() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [userId, setUserId] = useState(null);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const navigate = useNavigate();

  const setError = useAuthStore((state) => state.setError);
  const clearError = useAuthStore((state) => state.clearError);
  const error = useAuthStore((state) => state.error);
  const registerStore = useAuthStore((state) => state.register);
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    nationality: "",
    password: "",
    agreeToTerms: false,
  });

  const steps = [
    { id: 1, label: "Account", description: "Create your account" },
    { id: 2, label: "Verify Email", description: "Verify your email address" },
    { id: 3, label: "Success", description: "Account created successfully" },
  ];

  // Clear error when component mounts or step changes
  useEffect(() => {
    clearError();
  }, [currentStep, clearError]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearError();

    // Basic validation
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

    // Password validation
    const validPassword =
      formData.password.length >= 8 &&
      /[A-Z]/.test(formData.password) &&
      /\d/.test(formData.password);

    if (!validPassword) {
      setError("Your password must be at least 8 characters long, contain an uppercase letter and a number.");
      setLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the terms & conditions.");
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      // Prepare registration data
      const registrationData = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        email: formData.email.toLowerCase().trim(),
        nationality: formData.nationality.trim(),
        password: formData.password,
      };

      console.log("Sending registration request:", registrationData);

      const response = await authService.register(registrationData);
      console.log("Registration response:", response);

      if (response.status === 200 || response.status === 201) {
        // Handle different possible response structures
        const backendUserId = 
          response.data?.user?.id || 
          response.data?.id || 
          response.data?.user_id ||
          response.data?.userId;

        const userEmail = response.data?.user?.email || formData.email;
        const userName = response.data?.user?.name || `${formData.firstName} ${formData.lastName}`;
        const userToken = response.data?.token || response.data?.access_token;

        if (!backendUserId) {
          console.error("User ID not found in response:", response.data);
          setError("Registration successful but user ID not received. Please try logging in.");
          setLoading(false);
          return;
        }

        setUserId(backendUserId);
        setRegisteredEmail(userEmail);

        // Store user data temporarily for verification
        registerStore({
          email: userEmail,
          firstName: formData.firstName,
          lastName: formData.lastName,
          nationality: formData.nationality,
          userId: backendUserId,
        });

        // If token is returned, set it
        if (userToken) {
          setToken(userToken);
          setUser({
            id: backendUserId,
            email: userEmail,
            name: userName,
            role: "user",
            isVerified: false
          });
        }

        setRegistrationSuccess(true);
        setCurrentStep(2);

        // Request OTP for verification
        try {
          console.log("Requesting OTP for userId:", backendUserId);
          const otpResponse = await authService.getOTP(backendUserId);
          console.log("OTP response:", otpResponse);
          
          if (otpResponse.status !== 200 && otpResponse.status !== 201) {
            console.warn("OTP request returned non-200 status:", otpResponse);
          }
        } catch (otpErr) {
          console.warn("OTP request failed:", otpErr);
          // Don't block the flow if OTP request fails
          // User can still resend OTP from verification step
        }

      } else {
        // Handle registration errors
        const errorMessage = 
          response.data?.message || 
          response.data?.error || 
          response.data?.detail || 
          "Registration failed. Please try again.";
        
        setError(errorMessage);
        
        // If email already exists
        if (errorMessage.toLowerCase().includes("email") || 
            errorMessage.toLowerCase().includes("already") ||
            response.status === 400) {
          // You could highlight the email field here
        }
      }

    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Network error. Please check your connection and try again."
      );

    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = (provider) => {
    setError(`${provider} registration is not available yet. We're working on it!`);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) clearError();
  };

  const handleEmailVerificationSuccess = () => {
    setCurrentStep(3);
    
    // Auto-redirect to dashboard after 3 seconds
    setTimeout(() => {
      navigate("/dashboard");
    }, 3000);
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
    clearError();
  };

  // Handle OTP verification failure
  const handleVerificationFailed = (errorMsg) => {
    setError(errorMsg);
  };

  return (
    <div className="flex bg-[#F7F5F9] w-full h-screen justify-center overflow-hidden md:px-6 md:py-4 rounded-2xl">
      <div className="flex max-w-screen-2xl w-full h-full rounded-xl overflow-hidden">

        {/* Left section */}
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

        {/* Right section */}
        <div className="flex flex-1 flex-col items-center p-3 sm:p-5 overflow-y-auto">
          <div className="w-full mb-4 flex justify-center md:justify-start items-center md:items-start">
            <img src={logo} alt="Logo" className="h-10 md:h-12" />
          </div>

          <div className="w-full max-w-2xl p-5 rounded-xl shadow-none md:shadow-md border-none md:border border-gray-100 bg-white">

            {/* Step indicators */}
            <div className="w-full flex flex-col items-center py-4 mb-4">
              <div className="flex items-center gap-2 justify-center mb-2">
                {steps.map((s, i) => (
                  <div key={s.id} className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                      currentStep >= s.id 
                        ? "bg-green-600 border-green-600 text-white" 
                        : "bg-white border-gray-300 text-gray-400"
                    }`}>
                      {s.id}
                    </div>
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
              <p className="text-sm text-gray-600 text-center">
                {steps.find(s => s.id === currentStep)?.description}
              </p>
            </div>

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

            {currentStep === 2 && (
              <EmailVerificationStep
                email={registeredEmail || formData.email}
                userId={userId}
                onBack={handleBackToStep1}
                onSuccess={handleEmailVerificationSuccess}
                onVerificationFailed={handleVerificationFailed}
              />
            )}

            {currentStep === 3 && (
              <Successful 
                email={registeredEmail || formData.email}
                name={`${formData.firstName} ${formData.lastName}`}
              />
            )}




          </div>
        </div>
      </div>
    </div>
  );
}