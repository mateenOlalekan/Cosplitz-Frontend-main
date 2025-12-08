// src/store/authStore.js
import { create } from "zustand";
import { authService } from "../services/api";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  role: null, // 'user' | 'admin'

  // -----------------------------------------
  // REGISTER
  // -----------------------------------------
  register: async (formData) => {
    set({ loading: true });
    try {
      const res = await authService.register(formData);
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.response?.data };
    } finally {
      set({ loading: false });
    }
  },

  // -----------------------------------------
  // LOGIN
  // -----------------------------------------
  login: async (credentials) => {
    set({ loading: true });
    try {
      const res = await authService.login(credentials);
      const { token, user } = res.data;

      set({ user, token, role: user?.role || "user" });
      localStorage.setItem("token", token);

      return { success: true, user };
    } catch (err) {
      return { success: false, error: err.response?.data };
    } finally {
      set({ loading: false });
    }
  },

  // -----------------------------------------
  // LOAD USER DETAILS
  // -----------------------------------------
  fetchUser: async () => {
    try {
      const res = await authService.getUserDetails();
      set({
        user: res.data,
        role: res.data.role || "user",
      });
    } catch {
      // token invalid
      get().logout();
    }
  },

  // -----------------------------------------
  // OTP
  // -----------------------------------------
  getOtp: async (phone) => {
    try {
      const res = await authService.getOtp(phone);
      return res.data;
    } catch (err) {
      return { error: err.response?.data };
    }
  },

  verifyOtp: async (payload) => {
    try {
      const res = await authService.verifyOtp(payload);
      return res.data;
    } catch (err) {
      return { error: err.response?.data };
    }
  },

  // -----------------------------------------
  // KYC SUBMIT
  // -----------------------------------------
  submitKyc: async (payload) => {
    try {
      const res = await authService.submitKyc(payload);
      return res.data;
    } catch (err) {
      return { error: err.response?.data };
    }
  },

  // -----------------------------------------
  // LOGOUT
  // -----------------------------------------
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null, role: null });
  },
}));
