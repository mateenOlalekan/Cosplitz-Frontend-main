// src/services/api.js
import axios from "axios";

// Base URL
const API_BASE_URL = "https://cosplitz-backend.onrender.com/api";

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach token
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

// Response interceptor for 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
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
  register: async (userData) => api.post("/register", userData),

  // Login
  login: async (credentials) => api.post("/login", credentials),

  // Get OTP for a user
  getOTP: async (userIdOrEmail) => {
    if (!userIdOrEmail) throw new Error("getOTP requires userId or { email }");

    // If it's an object with email
    if (typeof userIdOrEmail === "object" && userIdOrEmail.email) {
      return api.get(`/otp/${userIdOrEmail.email}`);
    }

    // If it's a primitive (assume userId)
    return api.get(`/otp/${userIdOrEmail}`);
  },

  // Verify OTP
  verifyOTP: async (otpData) => api.post("/verify_otp", otpData),

  // Get user info
  getUserInfo: async () => api.get("/user/info"),

  // Optional: KYC submit
  submitKYC: async (kycData) =>
    api.post("/kyc/submit", kycData, { headers: { "Content-Type": "multipart/form-data" } }),

  // Password reset
  forgotPassword: async (email) => api.post("/forgot-password", { email }),
  resetPassword: async (resetData) => api.post("/reset-password", resetData),

  // Update profile
  updateProfile: async (profileData) => api.put("/user/profile", profileData),
};

export default api;
