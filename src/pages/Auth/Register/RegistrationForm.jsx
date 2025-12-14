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

  const setError = useAuthStore((s) => s.setError);
  const clearError = useAuthStore((s) => s.clearError);
  const error = useAuthStore((s) => s.error);
  const registerStore = useAuthStore((s) => s.register);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    nationality: "",
    password: "",
    agreeToTerms: false,
  });

  useEffect(() => {
    clearError();
  }, [currentStep]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setLoading(true);

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      setError("Please fill out all required fields.");
      setLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the terms & conditions.");
      setLoading(false);
      return;
    }

    const payload = {
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      email: formData.email.toLowerCase().trim(),
      password: formData.password,
      username: formData.email.split("@")[0],
    };

    const response = await authService.register(payload);
    console.log("REGISTER RESPONSE:", response);

    if (!response.success) {
      setError(response.data?.message || "Registration failed.");
      setLoading(false);
      return;
    }

    const backendUser =
      response.data?.user || response.data;

    if (!backendUser?.id) {
      setError("User created but ID missing. Please login.");
      setLoading(false);
      return;
    }

    setUserId(backendUser.id);
    setRegisteredEmail(backendUser.email);

    registerStore({
      userId: backendUser.id,
      email: backendUser.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
    });

    // ⚠️ DO NOT resend OTP here (backend already sent it)
    setCurrentStep(2);
    setLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((p) => ({ ...p, [field]: value }));
    if (error) clearError();
  };

  const handleEmailVerificationSuccess = () => {
    setCurrentStep(3);
    setTimeout(() => navigate("/login"), 2500);
  };

  return (
    <div className="flex bg-[#F7F5F9] w-full h-screen justify-center overflow-hidden md:px-6 md:py-4 rounded-2xl">
      <div className="flex max-w-screen-2xl w-full h-full rounded-xl overflow-hidden">
        {/* LEFT */}
        <div className="hidden lg:flex w-1/2 bg-[#F8EACD] rounded-xl p-6 items-center justify-center">
          <div className="w-full flex flex-col items-center">
            <img src={loginlogo} alt="Register" className="rounded-lg w-full max-h-[400px] object-contain" />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-1 flex-col items-center p-3 sm:p-5 overflow-y-auto">
          <img src={logo} alt="Logo" className="h-10 md:h-12 mb-4" />

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
              email={registeredEmail}
              userId={userId}
              onBack={() => setCurrentStep(1)}
              onSuccess={handleEmailVerificationSuccess}
            />
          )}

          {currentStep === 3 && <Successful />}
        </div>
      </div>
    </div>
  );
}
