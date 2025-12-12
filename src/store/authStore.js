// src/store/authStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * authStore responsibilities:
 * - store token & user object
 * - provide helpers: setToken, setUser, logout, register (store temp reg info)
 * - store error messages
 */

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // state
      user: null, // { id, email, ... } from backend
      token: null,
      error: null,

      // actions
      setToken: (token, persistToken = true) => {
        set({ token });
        if (persistToken) localStorage.setItem("authToken", token);
        else sessionStorage.setItem("authToken", token);
      },

      setUser: (userObj) => {
        set({ user: userObj });
        try {
          localStorage.setItem("userInfo", JSON.stringify(userObj));
        } catch (e) {}
      },

      // registration helper to keep minimal data across steps
      register: (payload) =>
        set({
          user: {
            ...get().user,
            ...payload,
          },
        }),

      logout: () => {
        set({ user: null, token: null, error: null });
        localStorage.removeItem("authToken");
        localStorage.removeItem("userInfo");
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("userInfo");
      },

      setError: (msg) => set({ error: msg }),
      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage", // storage key
      // only persist token & user
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);

export default useAuthStore;
