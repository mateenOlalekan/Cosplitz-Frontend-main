// src/pages/Auth/Register/index.jsx
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
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const setError = useAuthStore((state) => state.setError);
  const clearError = useAuthStore((state) => state.clearError);
  const error = useAuthStore((state) => state.error);
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const loginStore = useAuthStore((state) => state.login);

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

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) clearError();
  };

  // Handle registration form submission
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
      username: formData.email.split("@")[0].replace(/[^a-zA-Z0-9]/g, ""), // Clean username
      nationality: formData.nationality || "Nigeria"
    };

    try {
      console.log("Step 1: Registering user...", registrationData);
      
      // STEP 1: Register user
      const registerResponse = await authService.register(registrationData);
      console.log("Register Response:", registerResponse);

      if (!registerResponse.success) {
        const errorMsg = registerResponse.data?.message || 
                        registerResponse.data?.detail || 
                        "Registration failed. Please try again.";
        setError(errorMsg);
        setLoading(false);
        return;
      }

      // Extract user information from response
      const backendUserId = registerResponse.data?.user?.id || 
                           registerResponse.data?.id;
      const userEmail = registerResponse.data?.user?.email || 
                       registerResponse.data?.email || 
                       formData.email;

      if (!backendUserId) {
        setError("Registration successful, but user ID is missing. Please try logging in.");
        setLoading(false);
        return;
      }

      setUserId(backendUserId);
      setRegisteredEmail(userEmail);
      console.log("User registered. ID:", backendUserId, "Email:", userEmail);

      // STEP 2: Auto-login after registration
      try {
        console.log("Step 2: Auto-logging in...");
        const loginResponse = await authService.login({
          email: userEmail,
          password: formData.password
        });

        console.log("Login Response:", loginResponse);

        if (loginResponse.success && (loginResponse.data?.access_token || loginResponse.data?.token)) {
          const token = loginResponse.data.access_token || loginResponse.data.token;
          const user = loginResponse.data.user || registerResponse.data?.user || {
            id: backendUserId,
            email: userEmail,
            first_name: formData.firstName,
            last_name: formData.lastName,
            is_verified: false,
            role: "user"
          };

          console.log("Login successful. Token received.");
          
          // Store token and user info
          localStorage.setItem("authToken", token);
          localStorage.setItem("userInfo", JSON.stringify(user));
          
          setToken(token);
          setUser(user);
          loginStore(user, token);

          // STEP 3: Send OTP for verification
          console.log("Step 3: Sending OTP email...");
          try {
            const otpResponse = await authService.sendOTP(backendUserId);
            console.log("OTP Response:", otpResponse);
            
            if (otpResponse.success) {
              console.log("OTP email sent successfully");
              setOtpSent(true);
              
              // STEP 4: Advance to verification step
              setCurrentStep(2);
            } else {
              console.warn("OTP sending response not successful:", otpResponse.data);
              // Still advance to verification step - user can request OTP manually
              setCurrentStep(2);
              setError("OTP email not sent. Please request a new code.");
            }
          } catch (otpError) {
            console.error("OTP sending error:", otpError);
            // Still advance to verification step
            setCurrentStep(2);
            setError("Failed to send OTP. Please request a new code.");
          }
        } else {
          // Login failed but registration succeeded
          console.warn("Auto-login failed, but registration succeeded");
          setCurrentStep(2); // Still go to verification step
          setError("Account created! Please login manually and verify your email.");
        }
      } catch (loginError) {
        console.error("Auto-login error:", loginError);
        setCurrentStep(2); // Still go to verification step
        setError("Account created! Please login and verify your email.");
      }

    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Handle successful email verification
  const handleEmailVerificationSuccess = async () => {
    try {
      // Update user verification status
      const userInfo = await authService.getUserInfo();
      if (userInfo.success && userInfo.data) {
        const updatedUser = { ...userInfo.data, is_verified: true };
        setUser(updatedUser);
        localStorage.setItem("userInfo", JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error("Failed to fetch updated user info:", err);
      // Still mark as verified locally
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        const updatedUser = { ...currentUser, is_verified: true };
        setUser(updatedUser);
        localStorage.setItem("userInfo", JSON.stringify(updatedUser));
      }
    }
    
    // Advance to success step
    setCurrentStep(3);
    
    // Auto-redirect to dashboard after 3 seconds
    setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 3000);
  };

  // Handle verification failure
  const handleVerificationFailed = (msg) => {
    setError(msg);
  };

  // Go back to registration form
  const handleBackToStep1 = () => {
    clearError();
    setCurrentStep(1);
  };

  // Handle social registration (optional)
  const handleSocialRegister = (provider) => {
    setError(`${provider} registration is not available yet. Please use email registration.`);
  };

  return (
    <div className="flex bg-[#F7F5F9] w-full h-screen justify-center overflow-hidden md:px-6 md:py-4 rounded-2xl">
      <div className="flex max-w-screen-2xl w-full h-full rounded-xl overflow-hidden">

        {/* LEFT SIDE - IMAGE & TEXT */}
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

        {/* RIGHT SIDE - FORM */}
        <div className="flex flex-1 flex-col items-center p-3 sm:p-5 overflow-y-auto">
          <div className="w-full mb-4 flex justify-center md:justify-start items-center md:items-start">
            <img src={logo} alt="Logo" className="h-10 md:h-12" />
          </div>

          <div className="w-full max-w-2xl p-5 rounded-xl shadow-none md:shadow-md border-none md:border border-gray-100 bg-white">

            {/* STEP PROGRESS INDICATOR */}
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
                email={registeredEmail}
                userId={userId}
                otpSent={otpSent}
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