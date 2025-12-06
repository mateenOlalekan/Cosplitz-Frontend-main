// src/store/authStore.js
import { create } from "zustand";
import { api } from "../services/api";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,

  /** REGISTER */
  register: async (formData) => {
    set({ loading: true, error: null });

    const res = await api.register(formData);

    if (res.status === "error") {
      set({ loading: false, error: res.message });
      return { success: false, message: res.message };
    }

    set({ loading: false });
    return { success: true };
  },

  /** LOGIN */
  login: async (credentials) => {
    set({ loading: true, error: null });

    const res = await api.login(credentials);

    if (!res.token) {
      set({ loading: false, error: res.message || "Login failed" });
      return { success: false };
    }

    localStorage.setItem("token", res.token);
    set({ token: res.token, loading: false });

    return { success: true };
  },

  /** USER INFO */
  fetchUserInfo: async () => {
    const token = get().token;
    if (!token) return;

    const res = await api.getUserInfo(token);
    set({ user: res?.data });
  },

  /** OTP SEND */
  sendOtp: async (emailOrId) => {
    const res = await api.sendOtp(emailOrId);
    return res;
  },

  /** OTP VERIFY */
  verifyOtp: async ({ email, otp }) => {
    const res = await api.verifyOtp({ email, otp });

    if (res.status === "success") {
      return { success: true };
    }

    return { success: false, message: res.message };
  },

  /** LOGOUT */
  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null });
  },
}));
