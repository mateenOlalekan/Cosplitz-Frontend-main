// // src/pages/RegistrationForm.jsx
// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { FcGoogle } from "react-icons/fc";
// import { PiAppleLogoBold } from "react-icons/pi";
// import { Eye, EyeOff } from "lucide-react";
// import PasswordValidation from "./PasswordValidation";

// function RegistrationForm({
//   formData,
//   handleInputChange,
//   handleFormSubmit,
//   handleSocialRegister,
//   loading,
//   error,
// }) {
//   const [showPassword, setShowPassword] = useState(false);

//   return (
//     <div>
//       <h1 className="text-2xl sm:text-3xl text-center font-bold text-gray-900">
//         Create Your Account
//       </h1>
//       <p className="text-gray-500 text-center text-sm mt-1 mb-4">
//         Let's get started with real-time cost sharing.
//       </p>

//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg mb-3 text-center">
//           {error}
//         </div>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           type="button"
//           onClick={() => handleSocialRegister("google")}
//           className="flex items-center justify-center gap-3 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//         >
//           <FcGoogle size={20} />
//           <span className="text-gray-700 text-sm">Sign Up with Google</span>
//         </motion.button>

//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           type="button"
//           onClick={() => handleSocialRegister("apple")}
//           className="flex items-center justify-center gap-3 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//         >
//           <PiAppleLogoBold size={20} />
//           <span className="text-gray-700 text-sm">Sign Up with Apple</span>
//         </motion.button>
//       </div>

//       <div className="flex items-center my-4">
//         <div className="flex-grow border-t border-gray-300"></div>
//         <span className="mx-2 text-gray-500 text-sm">Or</span>
//         <div className="flex-grow border-t border-gray-300"></div>
//       </div>

//       <form onSubmit={handleFormSubmit} className="space-y-3">
//         {[
//           { key: "firstName", label: "First Name", type: "text" },
//           { key: "lastName", label: "Last Name", type: "text" },
//           { key: "email", label: "Email Address", type: "email" },
//           { key: "nationality", label: "Nationality", type: "text" },
//         ].map((field) => (
//           <div key={field.key}>
//             <label className="text-sm font-medium text-gray-700 mb-1 block">
//               {field.label} *
//             </label>
//             <input
//               type={field.type}
//               value={formData[field.key]}
//               placeholder={`Enter your ${field.label.toLowerCase()}`}
//               onChange={(e) => handleInputChange(field.key, e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-colors"
//               required
//             />
//           </div>
//         ))}

//         <div className="mb-4">
//           <label className="text-sm font-medium text-gray-700 mb-1 block">
//             Password *
//           </label>
//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               value={formData.password}
//               placeholder="Create your password"
//               onChange={(e) => handleInputChange("password", e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors pr-10"
//               required
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute inset-y-0 right-2 pr-1 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
//             >
//               {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           </div>
//           <PasswordValidation password={formData.password} />
//         </div>

//         <label className="flex gap-2 text-sm text-gray-600 mt-2 cursor-pointer">
//           <input
//             type="checkbox"
//             checked={formData.agreeToTerms}
//             onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
//             className="rounded focus:ring-green-500"
//           />
//           <span>
//             I agree to the{" "}
//             <a href="/terms" className="text-green-600 hover:underline font-medium">
//               Terms
//             </a>
//             ,{" "}
//             <a href="/privacy" className="text-green-600 hover:underline font-medium">
//               Privacy
//             </a>{" "}
//             &{" "}
//             <a href="/fees" className="text-green-600 hover:underline font-medium">
//               Fees
//             </a>
//             .
//           </span>
//         </label>

//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           type="submit"
//           disabled={loading}
//           className={`w-full bg-green-600 text-white py-3 rounded-lg font-semibold transition-all duration-200 ${
//             loading ? "opacity-60 cursor-not-allowed" : "hover:bg-green-700"
//           }`}
//         >
//           {loading ? (
//             <span className="flex items-center justify-center gap-2">
//               <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//               Creating Account...
//             </span>
//           ) : (
//             "Create Account"
//           )}
//         </motion.button>

//         <p className="text-center text-sm text-gray-600 mt-3">
//           Already have an account?{" "}
//           <Link to="/login" className="text-green-600 hover:underline font-medium">
//             Log In
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// }

// export default RegistrationForm;

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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setLoading(true);

    // Validation
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

    const registrationData = {
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      email: formData.email.toLowerCase().trim(),
      password: formData.password,
      nationality: formData.nationality || "",
    };

    try {
      const response = await authService.register(registrationData);
      console.log("REGISTER RESPONSE =>", response);

      if (response.error) {
        setError(response.data?.message || response.message || "Registration failed.");
        setLoading(false);
        return;
      }

      // Extract user information
      const backendUserId = response.data?.user?.id || response.data?.user_id || response.data?.id;
      const userEmail = response.data?.user?.email || response.data?.email || formData.email;

      if (!backendUserId) {
        setError("Registration worked, but user ID is missing. Try logging in.");
        setLoading(false);
        return;
      }

      setUserId(backendUserId);
      setRegisteredEmail(userEmail);

      // Store pending verification
      setPendingVerification({
        email: userEmail,
        userId: backendUserId,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      // Move to Step 2
      setCurrentStep(2);

      // Auto-send OTP
      setTimeout(async () => {
        try {
          const otpResponse = await authService.getOTP(backendUserId);
          console.log("OTP Response:", otpResponse);
          
          if (otpResponse.error) {
            console.warn("OTP sending failed:", otpResponse.data?.message);
          }
        } catch (otpError) {
          console.error("OTP sending error:", otpError);
        }
      }, 500);

    } catch (err) {
      console.error("REGISTRATION ERROR =>", err);
      setError(err.message || "Network error.");
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) clearError();
  };

  const handleEmailVerificationSuccess = async () => {
    try {
      // Auto-login after verification
      const loginResponse = await authService.login({
        email: registeredEmail || formData.email,
        password: formData.password
      });
      
      console.log("Auto-login response:", loginResponse);
      
      if (loginResponse.success && loginResponse.data?.token) {
        // Complete registration
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
          },
          loginResponse.data.token
        );
      } else {
        // OTP verified but login failed
        console.warn("Auto-login failed, but email is verified. User can login manually.");
      }
      
      // Always go to step 3 (Successful page)
      setCurrentStep(3);
      
    } catch (err) {
      console.error("Auto-login failed:", err);
      // Still go to successful page even if auto-login fails
      setCurrentStep(3);
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