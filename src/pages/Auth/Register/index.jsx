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
  const navigate = useNavigate();

  const setError = useAuthStore((state) => state.setError);
  const clearError = useAuthStore((state) => state.clearError);
  const error = useAuthStore((state) => state.error);
  const setPendingVerification = useAuthStore((state) => state.setPendingVerification);
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const completeRegistration = useAuthStore((state) => state.completeRegistration);

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

  useEffect(() => {
    clearError();
  }, [currentStep]);

  // -------------------------
  // HANDLE REGISTER SUBMIT
  // -------------------------
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setLoading(true);

    // --- BASIC VALIDATION ---
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

    const passwordValid =
      formData.password.length >= 8 &&
      /[A-Z]/.test(formData.password) &&
      /\d/.test(formData.password);

    if (!passwordValid) {
      setError("Password must contain at least 8 characters, one uppercase letter, and a number.");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    // --- PREPARE BACKEND DATA ---
    const registrationData = {
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      email: formData.email.toLowerCase().trim(),
      password: formData.password,
      username: formData.email.split("@")[0],
      nationality: formData.nationality || "",
    };

    try {
      const response = await authService.register(registrationData);
      console.log("REGISTER RESPONSE =>", response);

      if (!response.success) {
        setError(response.data?.message || response.message || "Registration failed.");
        setLoading(false);
        return;
      }

      // Extract user information from response
      const backendUserId =
        response.data?.user?.id ||
        response.data?.user_id ||
        response.data?.id ||
        response.user?.id ||
        null;

      const userEmail =
        response.data?.user?.email ||
        response.data?.email ||
        formData.email;

      if (!backendUserId) {
        setError("Registration worked, but user ID is missing. Try logging in.");
        setLoading(false);
        return;
      }

      setUserId(backendUserId);
      setRegisteredEmail(userEmail);

      // Store pending verification in auth store
      setPendingVerification({
        email: userEmail,
        userId: backendUserId,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      // Save token if provided (some backends return token on register)
      if (response.data?.token || response.token) {
        const token = response.data?.token || response.token;
        setToken(token);
        setUser({
          id: backendUserId,
          email: userEmail,
          first_name: formData.firstName,
          last_name: formData.lastName,
          name: `${formData.firstName} ${formData.lastName}`,
          role: "user",
          is_active: false,
          email_verified: false
        });
      }

      // Move to Step 2 (email verification)
      setCurrentStep(2);

      // AUTO SEND OTP - Use getOTP with userId
      setTimeout(async () => {
        try {
          console.log("Sending OTP to userId:", backendUserId);
          const otpResponse = await authService.getOTP(backendUserId);
          console.log("OTP Response:", otpResponse);
          
          if (!otpResponse.success) {
            console.warn("OTP sending failed:", otpResponse.data?.message);
            // User can resend manually
          }
        } catch (otpError) {
          console.error("OTP sending error:", otpError);
          // Don't fail the flow
        }
      }, 500);

    } catch (err) {
      console.error("REGISTRATION ERROR =>", err);
      setError(err.message || "Network error.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) clearError();
  };

  const handleEmailVerificationSuccess = async () => {
    try {
      // Auto-login after successful verification
      const loginResponse = await authService.login({
        email: registeredEmail || formData.email,
        password: formData.password
      });
      
      console.log("Auto-login response:", loginResponse);
      
      if (loginResponse.success && loginResponse.data?.token) {
        // Use completeRegistration to update store
        completeRegistration(
          {
            id: userId,
            email: registeredEmail || formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            name: `${formData.firstName} ${formData.lastName}`,
            role: "user",
            is_active: true,
            email_verified: true,
            username: formData.email.split("@")[0]
          },
          loginResponse.data.token
        );
        
        // Also get full user info if available
        try {
          const userInfo = await authService.getUserInfo();
          if (userInfo.success && userInfo.data) {
            setUser(userInfo.data);
          }
        } catch (userInfoError) {
          console.warn("Could not fetch user info:", userInfoError);
        }
        
        setCurrentStep(3);
        
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      } else {
        // Login failed but OTP verified
        setError("Account verified! Please login manually.");
        setCurrentStep(3);
        
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (err) {
      console.error("Auto-login failed:", err);
      // OTP verified but login failed
      setError("Email verified! Please login with your credentials.");
      setCurrentStep(3);
      
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  };

  const handleVerificationFailed = (msg) => {
    setError(msg);
  };

  const handleBackToStep1 = () => {
    clearError();
    setCurrentStep(1);
  };

  const handleSocialRegister = (provider) => {
    // Placeholder for social registration
    console.log(`Social register with ${provider}`);
    setError(`${provider} registration coming soon!`);
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

            {currentStep === 3 && <Successful />}
          </div>
        </div>
      </div>
    </div>
  );
}