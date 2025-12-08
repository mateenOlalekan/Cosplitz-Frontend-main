// src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://cosplitz-backend.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor – attach token from Zustand
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");   // OR Zustand store
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authService = {
  register: (data) => API.post("/register/", data),

  login: (data) =>
    axios.post("http://localhost:8000/api/login/", data),

  getUserDetails: () => API.get("/user/info"),

  getOtp: (phone) => API.post(`/otp/${phone}/`),

  verifyOtp: (data) => API.post("/verify_otp", data),

  submitKyc: (data) => API.post("/kyc/submit/", data),
};

export default API;
