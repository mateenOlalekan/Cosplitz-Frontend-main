// src/store/authStore.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      error: null,
      isLoading: true,
      tempRegister: null,

      // -------------------
      // TOKEN HANDLING
      // -------------------
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
        } catch (error) {
          console.error("Error storing token:", error);
        }
      },

      // -------------------
      // USER HANDLING
      // -------------------
      setUser: (userObj) => {
        set({ user: userObj });
        try {
          if (userObj) {
            localStorage.setItem("userInfo", JSON.stringify(userObj));
          } else {
            localStorage.removeItem("userInfo");
          }
        } catch (error) {
          console.error("Error storing user:", error);
        }
      },

      // -------------------
      // TEMP REGISTER DATA
      // -------------------
      register: (payload) => set({ tempRegister: payload }),
      clearTempRegister: () => set({ tempRegister: null }),

      // -------------------
      // AUTH ACTIONS
      // -------------------
      logout: () => {
        set({ user: null, token: null, error: null, tempRegister: null });

        try {
          localStorage.removeItem("authToken");
          localStorage.removeItem("userInfo");
          sessionStorage.removeItem("authToken");
          sessionStorage.removeItem("userInfo");
        } catch (error) {
          console.error("Error clearing auth data:", error);
        }

        // Redirect to login
        window.location.href = "/login";
      },

      setError: (msg) => set({ error: msg }),
      clearError: () => set({ error: null }),

      setLoading: (loading) => set({ isLoading: loading }),

      isAuthenticated: () => {
        const token = get().token;
        const user = get().user;
        return Boolean(token) && Boolean(user);
      },

      isAdmin: () => {
        const user = get().user;
        return user?.role === "admin" || user?.is_admin === true;
      },

      // -------------------
      // INIT AUTH FROM STORAGE
      // -------------------
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
            isLoading: false,
          });

          // Validate token existence with user
          if (token && !user) {
            // Token exists but user data is missing - clear token
            console.warn("Token exists but user data is missing. Clearing auth data.");
            localStorage.removeItem("authToken");
            sessionStorage.removeItem("authToken");
            set({ token: null, isLoading: false });
          }

          return { token, user };
        } catch (error) {
          console.error("Error initializing auth:", error);
          set({ token: null, user: null, isLoading: false });
          return { token: null, user: null };
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error("Error hydrating auth store:", error);
          }
        };
      },
    }
  )
);

// For backward compatibility - if you have components using the old syntax
export default useAuthStore;