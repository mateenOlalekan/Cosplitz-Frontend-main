import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService, storeToken, clearAuthData } from "../services/api";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      /* ---------------- AUTH ACTIONS ---------------- */

      registerUser: async (formData) => {
        set({ isLoading: true, error: null });

        const res = await authService.register(formData);

        if (res.error) {
          set({ error: res.data?.message, isLoading: false });
          return null;
        }

        set({ isLoading: false });
        return res.data.user; // used for OTP
      },

      loginUser: async (credentials, remember = true) => {
        set({ isLoading: true, error: null });

        const res = await authService.login(credentials);

        if (res.error) {
          set({ error: res.data?.message, isLoading: false });
          return false;
        }

        storeToken(res.data.token, remember);

        const userRes = await authService.getUserInfo();
        if (userRes.success) {
          set({ user: userRes.data, token: res.data.token });
          localStorage.setItem("userInfo", JSON.stringify(userRes.data));
        }

        set({ isLoading: false });
        return true;
      },

      verifyOTP: async (email, otp) => {
        set({ isLoading: true, error: null });

        const res = await authService.verifyOTP(email, otp);

        if (res.error) {
          set({ error: res.data?.message, isLoading: false });
          return false;
        }

        set({ isLoading: false });
        return true;
      },

      sendOTP: async (userId) => authService.getOTP(userId),

      logout: () => {
        clearAuthData();
        set({ user: null, token: null });
        window.location.href = "/login";
      },

      initializeAuth: () => {
        const token =
          localStorage.getItem("authToken") ||
          sessionStorage.getItem("authToken");

        const user =
          localStorage.getItem("userInfo") ||
          sessionStorage.getItem("userInfo");

        set({
          token: token || null,
          user: user ? JSON.parse(user) : null,
        });
      },

      isAuthenticated: () => !!get().token,
      isAdmin: () => get().user?.is_admin === true,
    }),
    {
      name: "auth-storage",
      partialize: (s) => ({ user: s.user, token: s.token }),
    }
  )
);

export default useAuthStore;
