// src/pages/Register.jsx - FULL FIXED VERSION
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
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const navigate = useNavigate();
  const reloadTimer = useRef(null);
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

  // Enhanced debug function
  const debugAPIResponse = (response, endpoint) => {
    console.group(`🔍 API Response Debug - ${endpoint}`);
    console.log("Full response:", response);
    console.log("Response keys:", Object.keys(response));
    
    if (response.data) {
      console.log("response.data:", response.data);
      console.log("Type of response.data:", typeof response.data);
      
      if (typeof response.data === 'object') {
        console.log("response.data keys:", Object.keys(response.data));
        
        // Check for common Django/DRF structures
        const commonFields = ['non_field_errors', 'email', 'password', 'username', 
                             'first_name', 'last_name', 'details', 'error', 'message'];
        
        commonFields.forEach(field => {
          if (response.data[field]) {
            console.log(`response.data.${field}:`, response.data[field]);
          }
        });
      }
    }
    
    console.groupEnd();
    
    // Find user ID in various possible locations
    const possiblePaths = [
      response.data?.data?.user?.id,
      response.data?.user?.id,
      response.data?.data?.id,
      response.data?.id,
      response.data?.user_id,
    ];
    
    return possiblePaths.find(id => id !== undefined);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setLoading(true);

    console.log("=== REGISTRATION STARTED ===");

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

    // TEST WITH DIFFERENT PAYLOADS - Try one at a time
    
    // Option 1: Minimal required fields (most likely to work)
    const registrationData = {
      email: formData.email.toLowerCase().trim(),
      password: formData.password,
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
    };

    // Option 2: Add optional fields
    // const registrationData = {
    //   email: formData.email.toLowerCase().trim(),
    //   password: formData.password,
    //   first_name: formData.firstName.trim(),
    //   last_name: formData.lastName.trim(),
    //   username: formData.email.split("@")[0],
    //   nationality: formData.nationality || null,
    // };

    // Option 3: With boolean fields from previous error
    // const registrationData = {
    //   email: formData.email.toLowerCase().trim(),
    //   password: formData.password,
    //   first_name: formData.firstName.trim(),
    //   last_name: formData.lastName.trim(),
    //   is_verified: false,
    //   is_active: true,
    // };

    console.log("📤 Sending registration data:", registrationData);
    console.log("📤 JSON stringified:", JSON.stringify(registrationData));

    try {
      console.log("📤 Calling authService.register()...");
      const response = await authService.register(registrationData);
      
      // Debug the response
      const backendUserId = debugAPIResponse(response, "register");
      
      console.log("📥 Raw API Response Status:", response.status);
      console.log("📥 Has error flag:", response.error);
      console.log("📥 Has success flag:", response.success);
      
      // Check for errors
      if (response.error || response.status === 400 || response.status >= 300) {
        console.error("❌ REGISTRATION FAILED");
        
        let errorMessage = "Registration failed. Please try again.";
        
        if (response.data) {
          // Handle Django/DRF error structures
          if (Array.isArray(response.data.non_field_errors)) {
            errorMessage = response.data.non_field_errors[0];
          } 
          else if (Array.isArray(response.data.email)) {
            errorMessage = `Email: ${response.data.email[0]}`;
          }
          else if (Array.isArray(response.data.password)) {
            errorMessage = `Password: ${response.data.password[0]}`;
          }
          else if (Array.isArray(response.data.username)) {
            errorMessage = `Username: ${response.data.username[0]}`;
          }
          else if (response.data.details) {
            errorMessage = response.data.details;
          }
          else if (response.data.error) {
            errorMessage = response.data.error;
          }
          else if (response.data.message) {
            errorMessage = response.data.message;
          }
          else if (typeof response.data === 'string') {
            errorMessage = response.data;
          }
          else {
            // Show first error found
            const errorKeys = Object.keys(response.data);
            if (errorKeys.length > 0) {
              const firstError = response.data[errorKeys[0]];
              if (Array.isArray(firstError)) {
                errorMessage = `${errorKeys[0]}: ${firstError[0]}`;
              } else {
                errorMessage = `${errorKeys[0]}: ${firstError}`;
              }
            }
          }
        }
        
        console.error("Error to display:", errorMessage);
        setError(errorMessage);
        setLoading(false);
        return;
      }

      // Handle success
      console.log("✅ REGISTRATION SUCCESSFUL");
      
      if (!backendUserId) {
        console.warn("⚠️ No user ID found in response. Checking alternative locations...");
        
        // Try direct access if nested structure exists
        if (response.data?.data?.user) {
          console.log("Found user in response.data.data.user:", response.data.data.user);
        } else if (response.data?.user) {
          console.log("Found user in response.data.user:", response.data.user);
        } else if (response.data) {
          console.log("response.data might be the user object:", response.data);
        }
      }

      const userEmail = response.data?.user?.email || 
                       response.data?.data?.user?.email || 
                       response.data?.email || 
                       formData.email;

      console.log("Extracted user ID:", backendUserId);
      console.log("Extracted email:", userEmail);

      // Store user info
      if (backendUserId) {
        setUserId(backendUserId);
      } else {
        // Generate temporary ID if not provided
        const tempId = `temp-${Date.now()}`;
        setUserId(tempId);
        console.warn("Using temporary ID:", tempId);
      }
      
      setRegisteredEmail(userEmail);

      // Store pending verification
      setPendingVerification({
        email: userEmail,
        userId: backendUserId || `temp-${Date.now()}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      // Move to verification step
      console.log("➡️ Moving to email verification step");
      setCurrentStep(2);

      // Try to auto-send OTP (non-critical)
      if (backendUserId && !backendUserId.toString().startsWith('temp-')) {
        setTimeout(async () => {
          try {
            console.log("📤 Auto-sending OTP...");
            const otpResponse = await authService.getOTP(backendUserId);
            console.log("📥 OTP auto-send response:", otpResponse);
          } catch (otpError) {
            console.warn("OTP auto-send failed (user can resend manually):", otpError);
          }
        }, 1000);
      }

      setLoading(false);

    } catch (err) {
      console.error("💥 UNEXPECTED ERROR:", err);
      console.error("Error details:", {
        name: err.name,
        message: err.message,
        stack: err.stack
      });
      
      let errorMsg = "Registration failed. Please try again.";
      
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        errorMsg = "Network error. Please check your internet connection.";
      } else if (err.message.includes('Network')) {
        errorMsg = "Network error. Please check your connection and try again.";
      }
      
      setError(errorMsg);
      setLoading(false);
    }
  };

  // Alternative test function (for debugging)
  const testRegistrationAPI = async () => {
    console.group("🧪 TESTING REGISTRATION API");
    
    const testPayloads = [
      {
        name: "Minimal Test",
        data: {
          email: `test_${Date.now()}@example.com`,
          password: "Test123!",
          first_name: "Test",
          last_name: "User"
        }
      },
      {
        name: "With Username",
        data: {
          email: `test_${Date.now() + 1}@example.com`,
          password: "Test123!",
          first_name: "Test",
          last_name: "User",
          username: `testuser_${Date.now()}`
        }
      },
      {
        name: "Full Data",
        data: {
          email: `test_${Date.now() + 2}@example.com`,
          password: "Test123!",
          first_name: "Test",
          last_name: "User",
          username: `testuser_${Date.now() + 1}`,
          nationality: "Testland",
          is_verified: false,
          is_active: true
        }
      }
    ];

    for (const test of testPayloads) {
      console.log(`\n📤 Testing: ${test.name}`);
      console.log("Payload:", test.data);
      
      try {
        const response = await authService.register(test.data);
        console.log("Response:", response);
        
        if (response.success) {
          console.log(`✅ ${test.name}: SUCCESS`);
        } else {
          console.log(`❌ ${test.name}: FAILED -`, response.data);
        }
      } catch (err) {
        console.log(`💥 ${test.name}: ERROR -`, err.message);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 sec between tests
    }
    
    console.groupEnd();
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) clearError();
  };

  const handleEmailVerificationSuccess = async () => {
    try {
      console.log("✅ Email verified, attempting auto-login...");
      
      const loginResponse = await authService.login({
        email: registeredEmail || formData.email,
        password: formData.password
      });
      
      console.log("Auto-login response:", loginResponse);
      
      if (loginResponse.success && loginResponse.data?.token) {
        const userData = loginResponse.data?.user || loginResponse.data?.data?.user || {
          id: userId,
          email: registeredEmail || formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          name: `${formData.firstName} ${formData.lastName}`,
          email_verified: true,
          role: "user"
        };
        
        completeRegistration(userData, loginResponse.data.token);
        setCurrentStep(3);
        
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        console.log("Auto-login failed, redirecting to login page");
        setCurrentStep(3);
        
        setTimeout(() => {
          navigate("/login", { 
            state: { 
              preFilledEmail: registeredEmail || formData.email,
              message: "Email verified! Please sign in." 
            }
          });
        }, 3000);
      }
    } catch (err) {
      console.error("Auto-login error:", err);
      setCurrentStep(3);
      
      setTimeout(() => {
        navigate("/login", { 
          state: { 
            preFilledEmail: registeredEmail || formData.email,
            message: "Email verified! Please sign in." 
          }
        });
      }, 3000);
    }
  };

  const handleVerificationFailed = (msg) => {
    setError(msg || "Verification failed. Please try again.");

    reloadTimer.current = setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  useEffect(() => {
    return () => {
      if (reloadTimer.current) {
        clearTimeout(reloadTimer.current);
      }
    };
  }, []);

  const handleBackToStep1 = () => {
    clearError();
    setCurrentStep(1);
  };

  const handleSocialRegister = (provider) => {
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

          {/* DEBUG BUTTON - Temporary */}
          <button 
            onClick={testRegistrationAPI}
            className="mb-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            Test API (Dev Only)
          </button>

          <div className="w-full max-w-2xl p-5 rounded-xl shadow-none md:shadow-md border-none md:border border-gray-100 bg-white">
            {/* STEPS */}
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