// src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://cosplitz-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
      // ensure headers object exists
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // clear stored auth and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('userInfo');
      // you may want to use history.push in-app, but window.location is safe here
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Register
  register: async (userData) => {
    return api.post('/register/', userData);
  },

  // Login
  login: async (credentials) => {
    return api.post('/login/', credentials);
  },

  // Get OTP
  // Accepts either a userId string/number OR an object like { email: 'x@x' }
  getOTP: async (identifier) => {
    if (!identifier) {
      throw new Error('getOTP requires userId or { email }');
    }

    // If identifier is primitive (id), call endpoint by id
    if (typeof identifier === 'string' || typeof identifier === 'number') {
      return api.get(`/otp/11/${identifier}/`);
    }

    // If identifier is an object (likely contains email), call endpoint with query or body as needed
    // We'll POST to a resend endpoint if API expects body, else GET with query param
    if (identifier.email) {
      // Try POST first (common pattern), fallback to GET with query param
      try {
        return await api.post('/otp/resend/', { email: identifier.email });
      } catch (err) {
        // fallback to GET with query param
        return api.get('/otp/', { params: { email: identifier.email } });
      }
    }

    throw new Error('Unable to determine OTP identifier format.');
  },

  // Verify OTP
  verifyOTP: async (otpData) => {
    // expect { email, otp_code } or { user_id, otp_code }
    return api.post('/verify_otp/', otpData);
  },

  // Get user info
  getUserInfo: async () => {
    return api.get('/user/info/');
  },

  // Submit KYC
  submitKYC: async (kycData) => {
    return api.post('/kyc/submit/', kycData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Forgot password
  forgotPassword: async (email) => {
    return api.post('/forgot-password/', { email });
  },

  // Reset password
  resetPassword: async (resetData) => {
    return api.post('/reset-password/', resetData);
  },

  // Update profile
  updateProfile: async (profileData) => {
    return api.put('/user/profile/', profileData);
  }
};

export default api;
