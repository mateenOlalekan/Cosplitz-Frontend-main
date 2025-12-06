import { create } from "zustand";

const API_BASE = "https://cosplitz-backend.onrender.com";

export const useRegisterStore = create((set) => ({
  loading: false,
  error: "",
  currentStep: 1, // 1 = form, 2 = OTP, 3 = success
  emailForOtp: "",
  otpSent: false,

  // REGISTER USER
  registerUser: async (formData) => {
    set({ loading: true, error: "" });

    try {
      const res = await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok)
        return set({ error: data.message || "Registration failed.", loading: false });

      set({
        emailForOtp: formData.email,
        currentStep: 2,
        loading: false,
      });
    } catch (err) {
      set({ error: "Network error.", loading: false });
    }
  },

  // VERIFY OTP
  verifyOtp: async (otp) => {
    set({ loading: true, error: "" });

    try {
      const res = await fetch(`${API_BASE}/api/verify_otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });

      const data = await res.json();

      if (!res.ok)
        return set({ error: data.message || "Invalid OTP", loading: false });

      set({
        currentStep: 3,
        loading: false,
      });
    } catch (err) {
      set({ error: "Network error.", loading: false });
    }
  },

  // RESEND OTP
  resendOtp: async (email) => {
    try {
      await fetch(`${API_BASE}/api/resend_otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      set({ otpSent: true });
    } catch (err) {
      set({ error: "Could not resend OTP." });
    }
  },

  setStep: (step) => set({ currentStep: step }),
  clearError: () => set({ error: "" }),
}));
