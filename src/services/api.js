// src/services/api.js
import axios from "axios";

// Base URL (hardcoded for browser usage)
const API_BASE_URL = "https://cosplitz-backend.onrender.com/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===== Request Interceptor =====
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ===== Response Interceptor =====
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth and redirect to login
      localStorage.removeItem("authToken");
      localStorage.removeItem("userInfo");
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("userInfo");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ===== Auth Service =====
export const authService = {
  // Register user
  register: async (userData) => api.post("/register/", userData),

  // Login
  login: async (credentials) => api.post("/login/", credentials),

  // Get OTP
  getOTP: async (identifier) => {
    if (!identifier) throw new Error("getOTP requires userId or { email }");

    // If identifier is a primitive (userId)
    if (typeof identifier === "string" || typeof identifier === "number") {
      return api.get(`/otp/11/${identifier}/`);
    }

    // If identifier is an object with email
    if (identifier.email) {
      try {
        return await api.post("/otp/resend/", { email: identifier.email });
      } catch (err) {
        return api.get("/otp/11/", { params: { email: identifier.email } });
      }
    }

    throw new Error("Invalid OTP identifier format.");
  },

  // Verify OTP
  verifyOTP: async (otpData) => api.post("/verify_otp/", otpData),

  // Get user info
  getUserInfo: async () => api.get("/user/info/"),

  // Optional: Additional endpoints
  submitKYC: async (kycData) =>
    api.post("/kyc/submit/", kycData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  forgotPassword: async (email) => api.post("/forgot-password/", { email }),
  resetPassword: async (resetData) => api.post("/reset-password/", resetData),
  updateProfile: async (profileData) => api.put("/user/profile/", profileData),
};

export default api;
