// src/store/authStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      error: null,
      isLoading: true,
      isVerified: false,

      // Add isVerified check
      setUser: (userObj) => {
        set({ 
          user: userObj,
          isVerified: userObj?.is_verified || false 
        });
        try {
          if (userObj) {
            localStorage.setItem("userInfo", JSON.stringify(userObj));
          } else {
            localStorage.removeItem("userInfo");
          }
        } catch (e) {}
      },

      setToken: (token, persistToken = true) => {
        set({ token });
        try {
          if (persistToken) {
            localStorage.setItem("authToken", token);
            sessionStorage.removeItem("authToken");
          } else {
            sessionStorage.setItem("authToken", token);
            localStorage.removeItem("authToken");
          }
        } catch (e) {}
      },

      // Update login to handle verification status
      login: (userData, token) => {
        set({
          user: userData,
          token: token,
          isVerified: userData?.is_verified || false,
          error: null
        });
        try {
          localStorage.setItem("authToken", token);
          localStorage.setItem("userInfo", JSON.stringify(userData));
        } catch (e) {}
      },

      // Mark user as verified after OTP verification
      markAsVerified: () => {
        set(state => ({
          user: { ...state.user, is_verified: true },
          isVerified: true
        }));
        try {
          const currentUser = get().user;
          localStorage.setItem("userInfo", JSON.stringify({
            ...currentUser,
            is_verified: true
          }));
        } catch (e) {}
      },

      // Clear registration data
      clearTempData: () => {
        set({ tempRegister: null });
      },

      logout: () => {
        set({ user: null, token: null, error: null, isVerified: false });
        localStorage.removeItem("authToken");
        localStorage.removeItem("userInfo");
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("userInfo");
        window.location.href = "/login";
      },

      setError: (msg) => set({ error: msg }),
      clearError: () => set({ error: null }),

      isAuthenticated: () => {
        const token = get().token;
        return !!token;
      },

      isAdmin: () => {
        const u = get().user;
        return u?.role === "admin" || u?.is_admin === true;
      },

      // Check if user needs verification
      requiresVerification: () => {
        const u = get().user;
        return !u?.is_verified && get().isAuthenticated();
      },

      initializeAuth: () => {
        try {
          const token =
            localStorage.getItem("authToken") ||
            sessionStorage.getItem("authToken");

          const userRaw =
            localStorage.getItem("userInfo") ||
            sessionStorage.getItem("userInfo");

          const user = userRaw ? JSON.parse(userRaw) : null;

          set({
            token: token || null,
            user: user,
            isVerified: user?.is_verified || false,
            isLoading: false,
          });
        } catch {
          set({ token: null, user: null, isLoading: false, isVerified: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);

export default useAuthStore;