// ==============================
// src/services/api.js (NEW)
// ==============================

const API_BASE_URL = "https://cosplitz-backend.onrender.com/api";

/* ---------------- TOKEN HELPERS ---------------- */
export const getAuthToken = () =>
  localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

export const storeToken = (token, remember = true) => {
  if (!token) return;
  if (remember) {
    localStorage.setItem("authToken", token);
    sessionStorage.removeItem("authToken");
  } else {
    sessionStorage.setItem("authToken", token);
    localStorage.removeItem("authToken");
  }
};

export const clearAuthData = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userInfo");
  sessionStorage.removeItem("authToken");
  sessionStorage.removeItem("userInfo");
};

/* ---------------- CORE REQUEST ---------------- */
async function request(endpoint, options = {}) {
  const token = getAuthToken();

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return { success: false, status: res.status, data };
  }

  return { success: true, status: res.status, data };
}

/* ---------------- AUTH SERVICE ---------------- */
export const authService = {
  register: (payload) =>
    request("/register/", { method: "POST", body: payload }),

  login: (payload) =>
    request("/login/", { method: "POST", body: payload }),

  getUserInfo: () => request("/user/info"),

  sendOTP: (userId) => request(`/otp/${userId}/`),

  verifyOTP: (email, otp) =>
    request("/verify_otp", {
      method: "POST",
      body: { email, otp },
    }),

  logout: () => request("/logout/", { method: "POST" }),
};

export default authService;

