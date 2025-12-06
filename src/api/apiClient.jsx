import axios from "axios";

// Create Axios instance
const api = axios.create({
  baseURL: "https://cosplitz-backend.onrender.com/api/",
  withCredentials: true,
});

// Attach JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh");
        if (!refreshToken) throw new Error("No refresh token");

        const refreshResponse = await api.post("token/refresh/", {
          refresh: refreshToken,
        });

        localStorage.setItem("token", refreshResponse.data.access);

        // Update the Authorization header for the retry request
        original.headers.Authorization = `Bearer ${refreshResponse.data.access}`;
        return api(original);
      } catch (err) {
        // Clear tokens and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// === Authentication APIs ===
export const registerUser = (data) => api.post("register/", data);
export const loginUser = (data) => api.post("login/", data);
export const verifyOTP = (email, otp) =>
  api.post(`verify_otp/post?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`);
export const resendOTP = (email) =>
  api.get(`otp/11/get?email=${encodeURIComponent(email)}`);
export const userDetails = () => api.get("user/info"); // No `data` for GET
