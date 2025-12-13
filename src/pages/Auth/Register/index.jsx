import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import loginlogo from "../../../assets/login.jpg";
import logo from "../../../assets/logo.svg";
import RegistrationForm from "./RegistrationForm";
import EmailVerificationStep from "./EmailVerificationStep";
import Successful from "./Successful";
import { useAuthStore } from "../../../store/authStore";

export default function Register() {
  const navigate = useNavigate();
  const {
    registerAndLogin,
    requestOtp,
  } = useAuthStore();

  const [step, setStep] = useState("register"); // register | verify | success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState("");

  /* ---------------------------------------
     REGISTER → LOGIN → OTP
  --------------------------------------- */
  const handleRegister = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      const user = await registerAndLogin(formData);

      await requestOtp(user.id);

      setUserId(user.id);
      setEmail(user.email);

      // persist refresh-safe state
      localStorage.setItem(
        "pending_verification",
        JSON.stringify({ userId: user.id, email: user.email })
      );

      setStep("verify");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------------
     OTP VERIFIED
  --------------------------------------- */
  const handleVerified = () => {
    localStorage.removeItem("pending_verification");
    setStep("success");

    setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 2000);
  };

  /* ---------------------------------------
     RESTORE STATE ON REFRESH
  --------------------------------------- */
  useEffect(() => {
    const pending = localStorage.getItem("pending_verification");
    if (!pending) return;

    try {
      const parsed = JSON.parse(pending);
      if (parsed?.userId && parsed?.email) {
        setUserId(parsed.userId);
        setEmail(parsed.email);
        setStep("verify");
      }
    } catch {}
  }, []);

  /* ---------------------------------------
     UI
  --------------------------------------- */
  return (
    <div className="flex bg-[#F7F5F9] w-full h-screen justify-center overflow-hidden md:px-6 md:py-4">
      <div className="flex max-w-screen-2xl w-full h-full rounded-xl overflow-hidden">

        {/* LEFT */}
        <div className="hidden lg:flex w-1/2 bg-[#F8EACD] p-6 items-center justify-center">
          <img src={loginlogo} alt="Register" className="max-h-[420px]" />
        </div>

        {/* RIGHT */}
        <div className="flex flex-1 flex-col items-center p-4 overflow-y-auto">
          <img src={logo} alt="Logo" className="h-10 mb-4" />

          <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-md">
            {step === "register" && (
              <RegistrationForm
                onSubmit={handleRegister}
                loading={loading}
                error={error}
              />
            )}

            {step === "verify" && (
              <EmailVerificationStep
                email={email}
                userId={userId}
                onBack={() => setStep("register")}
                onSuccess={handleVerified}
              />
            )}

            {step === "success" && <Successful />}
          </div>
        </div>
      </div>
    </div>
  );
}
