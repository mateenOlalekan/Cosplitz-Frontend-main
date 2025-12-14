import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({

      user: null,
      token: null,
      error: null,
      isLoading: true,

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

      setUser: (userObj) => {
        set({ user: userObj });
        try {
          if (userObj)
            localStorage.setItem("userInfo", JSON.stringify(userObj));
          else localStorage.removeItem("userInfo");
        } catch (e) {}
      },

      tempRegister: null,
      register: (payload) => set({ tempRegister: payload }),

      logout: () => {
        set({ user: null, token: null, error: null });
        localStorage.removeItem("authToken");
        localStorage.removeItem("userInfo");
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("userInfo");

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
        } catch {
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
