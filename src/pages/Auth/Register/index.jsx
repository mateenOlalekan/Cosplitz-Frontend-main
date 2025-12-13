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
  const [userId, setUserId] = useState(null);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [debugInfo, setDebugInfo] = useState("");
  const navigate = useNavigate();

  const setError = useAuthStore((state) => state.setError);
  const clearError = useAuthStore((state) => state.clearError);
  const error = useAuthStore((state) => state.error);
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    nationality: "Nigeria", // Default to Nigeria based on your API
    password: "",
    agreeToTerms: false,
  });

  const steps = [
    { id: 1, label: "Account", description: "Create your account" },
    { id: 2, label: "Verify Email", description: "Verify your email address" },
    { id: 3, label: "Success", description: "Account created successfully" },
  ];

  useEffect(() => {
    clearError();
  }, [currentStep]);

  // Handle social registration
  const handleSocialRegister = async (provider) => {
    try {
      console.log(`Social register with ${provider}`);
      // You would typically redirect to OAuth provider
      alert(`${provider} registration will be available soon!`);
    } catch (error) {
      setError(`Failed to register with ${provider}. Please try again.`);
    }
  };

  // -------------------------
  // HANDLE REGISTER SUBMIT - UPDATED
  // -------------------------
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setLoading(true);
    setDebugInfo("");

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError("Please fill out all required fields.");
      setLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the terms & conditions.");
      setLoading(false);
      return;
    }

    // Password validation
    const passwordValid =
      formData.password.length >= 8 &&
      /[A-Z]/.test(formData.password) &&
      /\d/.test(formData.password);

    if (!passwordValid) {
      setError("Password must contain at least 8 characters, one uppercase letter, and a number.");
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

    // Prepare data EXACTLY as backend expects
    const registrationData = {
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      email: formData.email.toLowerCase().trim(),
      password: formData.password,
      username: formData.email.toLowerCase().trim().split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_"), // Safe username
      nationality: formData.nationality || "Nigeria", // Default to Nigeria
    };

    console.log("📤 Final registration data being sent:", registrationData);
    setDebugInfo(JSON.stringify(registrationData, null, 2));

    try {
      const response = await authService.register(registrationData);
      console.log("✅ REGISTER RESPONSE =>", response);

      // Handle 400 Bad Request
      if (response.status === 400) {
        const errorMsg = response.data?.message || "Registration failed. Please check your details.";
        const details = response.data?.errors 
          ? Object.entries(response.data.errors).map(([key, val]) => `${key}: ${val}`).join(", ")
          : "";
        
        setError(`${errorMsg} ${details ? `(${details})` : ''}`);
        setLoading(false);
        return;
      }

      // Handle other errors
      if (response.error || !response.success) {
        const errorMsg = response.data?.message || "Registration failed. Please try again.";
        setError(errorMsg);
        setLoading(false);
        return;
      }

      // Success - extract user data
      const userData = response.data?.user || response.data;
      
      if (!userData) {
        console.error("❌ No user data in response:", response);
        setError("Registration successful but no user data received.");
        setLoading(false);
        return;
      }

      const backendUserId = userData.id || userData.user_id;
      const userEmail = userData.email || formData.email;

      if (!backendUserId) {
        console.error("❌ User ID missing:", response);
        setError("Registration successful but user ID is missing. Please try logging in.");
        setLoading(false);
        return;
      }

      console.log("✅ Registration successful:", { userId: backendUserId, email: userEmail });

      setUserId(backendUserId);
      setRegisteredEmail(userEmail);

      // Store token if provided
      if (response.data?.token) {
        authService.storeToken(response.data.token, true);
        setToken(response.data.token);
        
        // Update user store
        setUser({
          id: backendUserId,
          email: userEmail,
          firstName: formData.firstName,
          lastName: formData.lastName,
          name: `${formData.firstName} ${formData.lastName}`,
          nationality: formData.nationality,
          isVerified: false,
        });
      }

      // Move to verification step
      setCurrentStep(2);

      // Auto-send OTP after a delay
      setTimeout(async () => {
        try {
          console.log("📤 Sending OTP to user ID:", backendUserId);
          const otpResponse = await authService.resendOTP(backendUserId);
          if (otpResponse.error) {
            console.warn("⚠️ OTP sending warning:", otpResponse.data?.message);
          } else {
            console.log("✅ OTP sent successfully");
          }
        } catch (otpError) {
          console.warn("⚠️ OTP sending error:", otpError);
        }
      }, 1000);

    } catch (err) {
      console.error("❌ REGISTRATION ERROR =>", err);
      setError(err.message || "Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) clearError();
  };

  const handleEmailVerificationSuccess = () => {
    setCurrentStep(3);
    setTimeout(() => {
      navigate("/dashboard");
    }, 3000);
  };

  const handleBackToStep1 = () => {
    clearError();
    setCurrentStep(1);
  };

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

            {/* STEP CONTENT */}
            {currentStep === 1 && (
              <>
                <RegistrationForm
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleFormSubmit={handleFormSubmit}
                  handleSocialRegister={handleSocialRegister}
                  loading={loading}
                  error={error}
                />
                {/* Debug info - remove in production */}
                {process.env.NODE_ENV === "development" && debugInfo && (
                  <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
                    <p className="font-semibold">Debug Info:</p>
                    <pre className="whitespace-pre-wrap">{debugInfo}</pre>
                  </div>
                )}
              </>
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