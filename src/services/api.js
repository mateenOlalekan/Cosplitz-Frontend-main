// src/store/authStore.js
import { create } from "zustand";
import { authService, storeAuthToken, clearAuthToken } from "../services/api";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isVerified: false,
  loading: false,
  error: null,

  /* ----------------------------------------------------
     REGISTER → LOGIN → OTP (SILENT FLOW)
  ---------------------------------------------------- */
  registerAndLogin: async (registerData) => {
    try {
      set({ loading: true, error: null });

      // 1️⃣ Register
      await authService.register(registerData);

      // 2️⃣ Login silently
      const loginRes = await authService.login({
        email: registerData.email,
        password: registerData.password,
      });

      const token = loginRes.access || loginRes.token;
      storeAuthToken(token);

      set({
        token,
        isAuthenticated: true,
      });

      return loginRes.user; // contains id + email
    } catch (err) {
      set({
        error: err?.response?.data || "Registration failed",
      });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  /* ----------------------------------------------------
     REQUEST OTP
  ---------------------------------------------------- */
  requestOtp: async (userId) => {
    try {
      set({ loading: true, error: null });
      await authService.getOtp(userId);
    } catch (err) {
      set({
        error: err?.response?.data || "Failed to send OTP",
      });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  /* ----------------------------------------------------
     VERIFY OTP
  ---------------------------------------------------- */
  verifyOtp: async (email, otp) => {
    try {
      set({ loading: true, error: null });

      await authService.verifyOtp({ email, otp });

      const user = await authService.getUserInfo();

      set({
        user,
        isVerified: true,
      });
    } catch (err) {
      set({
        error: err?.response?.data || "Invalid OTP",
      });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  /* ----------------------------------------------------
     LOAD USER (ON REFRESH)
  ---------------------------------------------------- */
  loadUser: async () => {
    try {
      const user = await authService.getUserInfo();
      set({
        user,
        isAuthenticated: true,
      });
    } catch {
      clearAuthToken();
    }
  },

  /* ----------------------------------------------------
     LOGOUT
  ---------------------------------------------------- */
  logout: () => {
    clearAuthToken();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isVerified: false,
    });
  },
}));
