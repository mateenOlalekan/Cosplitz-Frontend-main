// src/store/authStore.js - UPDATED
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      error: null,
      isLoading: true,
      tempRegister: null,

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
        } catch (e) {
          console.warn("Storage error:", e);
        }
      },

      setUser: (userObj) => {
        set({ user: userObj });
        try {
          if (userObj) {
            localStorage.setItem("userInfo", JSON.stringify(userObj));
          } else {
            localStorage.removeItem("userInfo");
          }
        } catch (e) {
          console.warn("Storage error:", e);
        }
      },

      setPendingVerification: (data) => set({ tempRegister: data }),

      register: (payload) => set({ tempRegister: payload }),

      // NEW FUNCTION: Complete registration flow
      completeRegistration: (userData, token) => {
        set({
          user: userData,
          token: token,
          tempRegister: null,
          error: null
        });
        try {
          localStorage.setItem("authToken", token);
          localStorage.setItem("userInfo", JSON.stringify(userData));
        } catch (e) {
          console.warn("Storage error:", e);
        }
      },

      logout: () => {
        set({ user: null, token: null, error: null, tempRegister: null });
        try {
          localStorage.removeItem("authToken");
          localStorage.removeItem("userInfo");
          sessionStorage.removeItem("authToken");
          sessionStorage.removeItem("userInfo");
        } catch (e) {
          console.warn("Storage error:", e);
        }
        window.location.href = "/login";
      },

      setError: (msg) => set({ error: msg }),
      clearError: () => set({ error: null }),

      isAuthenticated: () => !!get().token,

      isAdmin: () => {
        const u = get().user;
        return u?.role === "admin" || u?.is_admin === true;
      },

      initializeAuth: () => {
        try {
          const token =
            localStorage.getItem("authToken") ||
            sessionStorage.getItem("authToken");

          const userRaw =
            localStorage.getItem("userInfo") ||
            sessionStorage.getItem("userInfo");

          set({
            token: token || null,
            user: userRaw ? JSON.parse(userRaw) : null,
            isLoading: false,
          });
        } catch (err) {
          console.error("Auth initialization error:", err);
          set({ token: null, user: null, isLoading: false });
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