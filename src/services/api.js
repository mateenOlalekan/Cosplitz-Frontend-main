// src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://cosplitz-backend.onrender.com/api';

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
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
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
  // Register user
  register: async (userData) => api.post('/register/', userData),

  // Login
  login: async (credentials) => api.post('/login/', credentials),

  // =======================
  // SEND OTP
  // backend:  POST /otp/send/  { email }
  // =======================
  sendOTP: async (email) => {
    return api.post('/otp/send/', { email });
  },

  // =======================
  // RESEND OTP
  // backend: POST /otp/resend/ { email }
  // =======================
  resendOTP: async (email) => {
    return api.post('/otp/resend/', { email });
  },

  // =======================
  // VERIFY OTP
  // backend: POST /otp/verify/ { email, otp_code }
  // =======================
  verifyOTP: async (payload) => {
    return api.post('/otp/verify/', payload);
  },

  // Fetch user info
  getUserInfo: async () => api.get('/user/info/'),

  // KYC submission
  submitKYC: async (kycData) =>
    api.post('/kyc/submit/', kycData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  forgotPassword: async (email) => api.post('/forgot-password/', { email }),

  resetPassword: async (resetData) => api.post('/reset-password/', resetData),

  updateProfile: async (profileData) => api.put('/user/profile/', profileData)
};

export default api;
