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
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

setUser:(email,id)=>set({email,userData:id})

export const authService = {
  // Register
  register: async (userData) => {
    const response = await api.post('/register/', userData);
    return response;
  },

  // Login
  login: async (credentials) => {
    const response = await api.post('/login/', credentials);
    return response;
  },

  // Get OTP
  getOTP: async (userId) => {
    const response = await api.get(`/otp/${userId}/`);
    return response;
  },

  // Verify OTP
  verifyOTP: async (otpData) => {
    const response = await api.post('/verify_otp', otpData);
    return response;
  },

  // Get user info
  getUserInfo: async () => {
    const response = await api.get('/user/info');
    return response;
  },

  // Submit KYC
  submitKYC: async (kycData) => {
    const response = await api.post('/kyc/submit/', kycData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/forgot-password/', { email });
    return response;
  },

  // Reset password
  resetPassword: async (resetData) => {
    const response = await api.post('/reset-password/', resetData);
    return response;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put('/user/profile/', profileData);
    return response;
  }
};

export default api;