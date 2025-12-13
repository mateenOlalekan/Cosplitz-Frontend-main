// src/services/api.js
const API_BASE_URL = "https://cosplitz-backend.onrender.com/api";

/* ----------------------------------------------------
   TOKEN HELPERS
---------------------------------------------------- */
export const getAuthToken = () => {
  try {
    return (
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("authToken")
    );
  } catch {
    return null;
  }
};

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

/* ----------------------------------------------------
   CORE REQUEST HANDLER
---------------------------------------------------- */
async function request(endpoint, options = {}) {
  const token = getAuthToken();

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    method: options.method || "GET",
    headers,
    credentials: "include",
    body:
      options.body && typeof options.body === "object"
        ? JSON.stringify(options.body)
        : options.body,
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { error: true, status: res.status, data };
    }

    return { success: true, status: res.status, data };
  } catch (err) {
    return {
      error: true,
      status: 0,
      data: { message: "Network error" },
    };
  }
}

/* ----------------------------------------------------
   RUNTIME GUARD
---------------------------------------------------- */
function safeCall(fn, name) {
  if (typeof fn !== "function") {
    console.error(`[API GUARD] ${name} is not a function`);
    return async () => ({
      error: true,
      data: { message: `${name} is not a function` },
    });
  }
  return fn;
}

/* ----------------------------------------------------
   AUTH SERVICE (BACKEND-ALIGNED + SAFE)
---------------------------------------------------- */
export const authService = {
  register: safeCall(
    async (payload) =>
      request("/register/", { method: "POST", body: payload }),
    "authService.register"
  ),

  login: safeCall(
    async (payload) =>
      request("/login/", { method: "POST", body: payload }),
    "authService.login"
  ),

  getUserInfo: safeCall(
    async () => request("/user/info", { method: "GET" }),
    "authService.getUserInfo"
  ),

  getOTP: safeCall(
    async (userId) => request(`/otp/${userId}/`, { method: "GET" }),
    "authService.getOTP"
  ),

  // Alias for resend OTP
  resendOTP: safeCall(
    async (userId) => request(`/otp/${userId}/`, { method: "GET" }),
    "authService.resendOTP"
  ),

  verifyOTP: safeCall(
    async (email, otp) =>
      request("/verify_otp", { method: "POST", body: { email, otp } }),
    "authService.verifyOTP"
  ),

  logout: safeCall(async () => request("/logout/", { method: "POST" }), "authService.logout"),
};

/* ----------------------------------------------------
   EXPORT
---------------------------------------------------- */
export default { request, authService };
