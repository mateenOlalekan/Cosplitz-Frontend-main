import { create } from "zustand";
import axios from "axios";

export const useRegisterStore = create((set, get) => ({
  currentStep: 1,
  loading: false,
  error: null,
  userEmail: "",   // store email to resend OTP

  setStep: (step) => set({ currentStep: step }),

  clearError: () => set({ error: null }),

  /* ================= REGISTER USER ================= */
  registerUser: async (formData) => {
    try {
      set({ loading: true, error: null });

      const res = await axios.post("/api/auth/register", formData);

      if (res.data.success) {
        set({
          currentStep: 2,
          userEmail: formData.email,
        });
      } else {
        set({ error: res.data.message || "Registration failed." });
      }
    } catch (err) {
      set({
        error: err?.response?.data?.message || "Registration error.",
      });
    } finally {
      set({ loading: false });
    }
  },

  /* ================= VERIFY OTP ================= */
  verifyOtp: async (otp) => {
    try {
      set({ loading: true, error: null });

      const res = await axios.post("/api/auth/verify-otp", {
        email: get().userEmail,
        otp,
      });

      if (res.data.success) {
        set({ currentStep: 3 });
      } else {
        set({ error: res.data.message || "Invalid code." });
      }
    } catch (err) {
      set({
        error: err?.response?.data?.message || "OTP verification failed.",
      });
    } finally {
      set({ loading: false });
    }
  },

  /* ================= RESEND OTP ================= */
  resendOtp: async () => {
    try {
      set({ loading: true, error: null });

      const res = await axios.post("/api/auth/resend-otp", {
        email: get().userEmail,
      });

      if (!res.data.success) {
        set({ error: res.data.message || "Failed to resend OTP." });
      }
    } catch (err) {
      set({
        error:
          err?.response?.data?.message ||
          "Something went wrong while resending OTP.",
      });
    } finally {
      set({ loading: false });
    }
  },
}));
