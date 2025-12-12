// src/services/api.js
import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://cosplitz-backend.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// attach token from localStorage/sessionStorage
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// handle auth global responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // Clear tokens and redirect to login
      localStorage.removeItem("authToken");
      localStorage.removeItem("userInfo");
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("userInfo");
      // Use location assign to avoid SPA history issues in some dev setups
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Register: POST /register/
  register: async (userData) => api.post("/register/", userData),

  // Login: POST /login/
  login: async (credentials) => api.post("/login/", credentials),

  // Get user info: GET /user/info
  getUserInfo: async () => api.get("/user/info"),

  // Request OTP: GET /otp/<user_id>/
  getOTP: async (userId) => api.get(`/otp/${userId}/`),

  // Verify OTP: POST /verify_otp/ with { user_id, otp_code }
  verifyOTP: async ({ user_id, otp_code }) =>
    api.post("/verify_otp/", { user_id, otp_code }),

  // KYC submit (multipart)
  submitKYC: async (kycData) =>
    api.post("/kyc/submit/", kycData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Forgot / reset
  forgotPassword: async (email) => api.post("/forgot-password/", { email }),
  resetPassword: async (data) => api.post("/reset-password/", data),

  // Update profile
  updateProfile: async (profileData) => api.put("/user/profile/", profileData),
};

export default api;
