// src/services/api.js
import axios from 'axios';

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  'https://cosplitz-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// =======================
// REQUEST INTERCEPTOR
// =======================
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('authToken') ||
      sessionStorage.getItem('authToken');

    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =======================
// RESPONSE INTERCEPTOR
// =======================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('userInfo');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// =======================
// AUTH SERVICE
// =======================
export const authService = {
  // Register
  register: async (userData) => api.post('/register/', userData),

  // Login
  login: async (credentials) => api.post('/login/', credentials),

  // =======================
  // GET OTP (resend)
  // backend: GET /otp/<user_id>/
  // =======================
  getOTP: async (userId) => {
    return api.get(`/otp/${userId}/`);
  },

  // =======================
  // VERIFY OTP
  // backend: POST /verify_otp
  // payload: { user_id, otp }
  // =======================
  verifyOTP: async (payload) => {
    return api.post('/verify_otp', payload);
  },

  // Fetch user info (protected)
  getUserInfo: async () => api.get('/user/info'),

  // KYC submission
  submitKYC: async (kycData) =>
    api.post('/kyc/submit/', kycData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  forgotPassword: async (email) =>
    api.post('/forgot-password/', { email }),

  resetPassword: async (resetData) =>
    api.post('/reset-password/', resetData),

  updateProfile: async (profileData) =>
    api.put('/user/profile/', profileData),
};

export default api;
