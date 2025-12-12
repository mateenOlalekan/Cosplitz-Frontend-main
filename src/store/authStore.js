// src/store/authStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Responsibilities:
 * - store token & user object
 * - provide helpers: setToken, setUser, logout, register (store temp reg info)
 * - store error messages
 * - expose helpers: isAuthenticated(), isAdmin(), initializeAuth()
 */

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // state
      user: null, // { id, email, role, ... }
      token: null,
      error: null,
      isLoading: true, // until initializeAuth runs

      // actions
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
          // ignore storage errors
          console.warn("Storage setToken error", e);
        }
      },

      setUser: (userObj) => {
        set({ user: userObj });
        try {
          if (userObj) localStorage.setItem("userInfo", JSON.stringify(userObj));
          else localStorage.removeItem("userInfo");
        } catch (e) {
          console.warn("Storage setUser error", e);
        }
      },

      // store minimal registration payload across steps
      register: (payload) =>
        set({
          user: {
            ...get().user,
            ...payload,
          },
        }),

      logout: () => {
        set({ user: null, token: null, error: null });
        try {
          localStorage.removeItem("authToken");
          localStorage.removeItem("userInfo");
          sessionStorage.removeItem("authToken");
          sessionStorage.removeItem("userInfo");
        } catch (e) {
          // ignore
        }
        // send user to login page to force re-auth
        try {
          window.location.href = "/login";
        } catch (e) {}
      },

      setError: (msg) => set({ error: msg }),
      clearError: () => set({ error: null }),

      // helpers
      isAuthenticated: () => {
        const t = get().token;
        return !!t;
      },

      isAdmin: () => {
        const u = get().user;
        if (!u) return false;
        // adapt to your backend role property (role or is_admin)
        return u.role === "admin" || u.role === "superadmin" || u.is_admin === true;
      },

      // initialize from storage (call once in App)
      initializeAuth: () => {
        try {
          const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
          const userRaw = localStorage.getItem("userInfo") || sessionStorage.getItem("userInfo");
          const user = userRaw ? JSON.parse(userRaw) : null;
          set({ token: token || null, user: user || null, isLoading: false });
        } catch (e) {
          console.warn("initializeAuth error:", e);
          set({ token: null, user: null, isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);

export default useAuthStore;
