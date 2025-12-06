// src/services/apiService.js
// Centralized API service for all endpoints

import axios from "axios";

// Create main axios instance
const api = axios.create({
  baseURL: "https://cosplitz-backend.onrender.com/api/",
  withCredentials: true,
});

// Admin API instance
const adminApi = axios.create({
  baseURL: "https://cosplitz-backend.onrender.com/admin-api/",
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// AUTH
export const registerUser = (data) => api.post("register/", data);
export const loginUser = (data) => axios.post("http://localhost:8000/api/login/", data);
export const getUserInfo = () => api.get("user/info");

// OTP
export const sendOtp = (id) => api.get(`otp/${id}/`);
export const verifyOtp = (data) => api.post("verify_otp", data);

// KYC
export const submitKyc = (data) => api.post("kyc/submit/", data, {
  headers: { "Content-Type": "multipart/form-data" },
});

// SPLITS
export const createSplit = (data) => api.post("splits/", data);
export const getSplits = () => api.get("splits/");
export const getSingleSplit = (id) => api.get(`splits/${id}/`);

// NOTIFICATIONS
export const getNotifications = () => api.get("notifications/");
export const getSingleNotification = (id) => api.get(`notifications/${id}/`);
export const markAllRead = () => api.post("notifications/mark_all_read/");
export const markOneRead = (id) => api.post(`notifications/${id}/mark_read/`);

// ADMIN LOGIN
export const adminLogin = (data) => adminApi.post("login/", data);

export default api;
