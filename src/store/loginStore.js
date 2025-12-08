import { create } from "zustand";
import axios from "axios";

const API = import.meta.env.VITE_API_URL; 
// Example: https://api.example.com

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  /** -------------------------
   * LOGIN USER
   --------------------------*/
  login: async ({ email, password }) => {
    set({ loading: true, error: null });

    try {
      const res = await axios.post(`${API}/auth/login`, {
        email,
        password,
      });

      const { user, token } = res.data;

      // Save token locally
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      set({ user, token, loading: false });

      return { success: true, user };
    } catch (err) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Login failed",
      });

      return {
        success: false,
        error: err?.response?.data || { message: "Login failed" },
      };
    }
  },

  /** -------------------------
   * LOAD STORED USER (AUTO LOGIN)
   --------------------------*/
  loadUser: () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      set({
        token,
        user: JSON.parse(user),
      });
    }
  },

  /** -------------------------
   * LOGOUT
   --------------------------*/
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({
      user: null,
      token: null,
    });
  },
}));
