// src/services/api.js
const API_BASE_URL = "https://cosplitz-backend.onrender.com/api";

/**
 * Get token
 */
function getAuthToken() {
  try {
    return (
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("authToken") ||
      null
    );
  } catch {
    return null;
  }
}

/**
 * Core request handler (fetch)
 */
async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const token = getAuthToken();
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : defaultHeaders),
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const finalOptions = {
    method: options.method || "GET",
    headers,
    ...options,
  };

  if (finalOptions.body && !isFormData && typeof finalOptions.body === "object") {
    finalOptions.body = JSON.stringify(finalOptions.body);
  }

  let response;
  try {
    response = await fetch(url, finalOptions);
  } catch (err) {
    console.error("Network error:", err);
    return {
      status: 0,
      data: { message: "Network error. Please try again." },
      error: true,
    };
  }

  let json = null;
  try {
    const text = await response.text();
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { message: "Invalid JSON response from server." };
  }

  // Handle 401
  if (response.status === 401) {
    localStorage.clear();
    sessionStorage.clear();

    if (!window.location.pathname.includes("/login")) {
      window.location.href = "/login";
    }

    return {
      status: 401,
      data: json || { message: "Unauthorized" },
      unauthorized: true,
    };
  }

  // Generic error handling
  if (!response.ok) {
    return {
      status: response.status,
      data: json,
      error: true,
    };
  }

  return {
    status: response.status,
    data: json,
    success: true,
  };
}

/* -------------------------------------------------------------
   AUTH SERVICE — SIMPLIFIED FOR OTP VERIFICATION ONLY
----------------------------------------------------------------*/
export const authService = {
  /** REGISTER — /api/register/ */
  register: async (userData) => {
    return await request("/register/", {
      method: "POST",
      body: userData,
    });
  },

  /** LOGIN — /api/login/ */
  login: async (credentials) => {
    return await request("/login/", {
      method: "POST",
      body: credentials,
    });
  },

  /** USER INFO */
  getUserInfo: async () => {
    return await request("/user/info", { method: "GET" });
  },

  /** SEND OTP — /api/otp/{user_id}/ (GET method as per your backend) */
  sendOTP: async (userId) => {
    return await request(`/otp/${userId}/`, { 
      method: "GET" 
    });
  },

  /** VERIFY OTP — /api/verify_otp (POST with email + otp) */
  verifyOTP: async (email, otp) => {
    return await request("/verify_otp", {
      method: "POST",
      body: { email, otp },
    });
  },

  /** RESEND OTP — Same as sendOTP */
  resendOTP: async (userId) => {
    return await request(`/otp/${userId}/`, { 
      method: "GET" 
    });
  },

  /** FORGOT PASSWORD */
  forgotPassword: async (email) =>
    request("/forgot-password/", {
      method: "POST",
      body: { email },
    }),

  /** RESET PASSWORD */
  resetPassword: async (data) =>
    request("/reset-password/", {
      method: "POST",
      body: data,
    }),

  /** LOGOUT */
  logout: async () =>
    request("/logout/", { method: "POST" }),
};

export default {
  request,
  authService,
};