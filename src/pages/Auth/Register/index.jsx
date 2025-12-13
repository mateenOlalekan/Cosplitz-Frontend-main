// src/pages/Register.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import loginlogo from "../../../assets/login.jpg";
import logo from "../../../assets/logo.svg";
import { authService } from "../../../services/api";
import EmailVerificationStep from "./EmailVerificationStep";
import RegistrationForm from "./RegistrationForm";
import Successful from "./Successful";

export default function Register() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1); // 1=form, 2=verify, 3=success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  /* ----------------------------------------
     CLEAR ERROR ON STEP CHANGE
  ---------------------------------------- */
  useEffect(() => {
    setError(null);
  }, [currentStep]);

  /* ----------------------------------------
     REGISTER SUBMIT (STEP 1 → STEP 2)
  ---------------------------------------- */
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError("Please fill all required fields.");
      setLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the terms & conditions.");
      setLoading(false);
      return;
    }

    if (
      formData.password.length < 8 ||
      !/[A-Z]/.test(formData.password) ||
      !/\d/.test(formData.password)
    ) {
      setError("Password must be at least 8 characters, include an uppercase letter and a number.");
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

    const res = await authService.register(payload);

    if (!res?.success) {
      setError(res?.data?.message || "Registration failed.");
      setLoading(false);
      return;
    }

    const user = res.data?.user;

    if (!user?.id || !user?.email) {
      setError("Registration succeeded but user data is incomplete.");
      setLoading(false);
      return;
    }

    // Persist minimal verification context (refresh-safe)
    localStorage.setItem(
      "pending_verification",
      JSON.stringify({ userId: user.id, email: user.email })
    );

    setUserId(user.id);
    setRegisteredEmail(user.email);
    setCurrentStep(2); // OTP already sent by backend
    setLoading(false);
  };

  /* ----------------------------------------
     INPUT CHANGE
  ---------------------------------------- */
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  /* ----------------------------------------
     VERIFY SUCCESS (STEP 2 → STEP 3)
  ---------------------------------------- */
  const handleVerificationSuccess = () => {
    localStorage.removeItem("pending_verification");
    setCurrentStep(3);

    // Short success screen → dashboard
    setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 2500);
  };

  /* ----------------------------------------
     BACK TO FORM
  ---------------------------------------- */
  const handleBackToStep1 = () => {
    setError(null);
    setCurrentStep(1);
  };

  /* ----------------------------------------
     RESTORE VERIFICATION STATE ON REFRESH
  ---------------------------------------- */
  useEffect(() => {
    const pending = localStorage.getItem("pending_verification");
    if (!pending) return;

    try {
      const { userId, email } = JSON.parse(pending);
      if (userId && email) {
        setUserId(userId);
        setRegisteredEmail(email);
        setCurrentStep(2);
      }
    } catch (_) {}
  }, []);

  /* ----------------------------------------
     UI (UNCHANGED)
  ---------------------------------------- */
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
        <div className="flex flex-1 flex-col items-center p-4 overflow-y-auto">
          <img src={logo} alt="Logo" className="h-10 mb-4" />

          <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-md">
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
                onBack={handleBackToStep1}
                onSuccess={handleVerificationSuccess}
              />
            )}

            {currentStep === 3 && <Successful />}
          </div>
        </div>
      </div>
    </div>
  );
}
