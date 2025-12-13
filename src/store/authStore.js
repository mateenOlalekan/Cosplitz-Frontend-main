// src/store/authStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      /* ---------------- STATE ---------------- */
      user: null,
      token: null,
      isVerified: false,
      isLoading: true,
      error: null,

      /* ---------------- SET AUTH ---------------- */
      setAuth: ({ token, user, isVerified }) => {
        set({
          token,
          user,
          isVerified: !!isVerified,
          isLoading: false,
        });

        if (token) localStorage.setItem("authToken", token);
        if (user) localStorage.setItem("userInfo", JSON.stringify(user));
        localStorage.setItem("isVerified", JSON.stringify(!!isVerified));
      },

      /* ---------------- INIT (CRASH FIX) ---------------- */
      initializeAuth: () => {
        try {
          const token = localStorage.getItem("authToken");
          const userRaw = localStorage.getItem("userInfo");
          const isVerified = JSON.parse(
            localStorage.getItem("isVerified") || "false"
          );

          set({
            token: token || null,
            user: userRaw ? JSON.parse(userRaw) : null,
            isVerified,
            isLoading: false,
          });
        } catch {
          set({
            token: null,
            user: null,
            isVerified: false,
            isLoading: false,
          });
        }
      },

      /* ---------------- HELPERS ---------------- */
      isAuthenticated: () => !!get().token,

      isAdmin: () => {
        const u = get().user;
        return u?.role === "admin" || u?.is_admin === true;
      },

      logout: () => {
        localStorage.clear();
        set({
          user: null,
          token: null,
          isVerified: false,
          error: null,
        });
        window.location.href = "/login";
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isVerified: state.isVerified,
      }),
    }
  )
);

export default useAuthStore;
