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
   AUTH SERVICE — UPDATED TO MATCH FLOW
----------------------------------------------------------------*/
export const authService = {
  /** REGISTER — /api/register/ */
  register: async (userData) => {
    return await request("/register/", {
      method: "POST",
      body: userData,
    });
  },

  /** LOGIN — After registration, automatically login */
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

  /** GET OTP — Backend: /api/otp/<user_id>/ */
  getOTP: async (userId) => {
    return await request(`/otp/${userId}/`, { method: "GET" });
  },

  /** VERIFY OTP — FIXED: MUST SEND email + otp (not userId) */
  verifyOTP: async (email, otp) => {
    return await request("/verify_otp", {
      method: "POST",
      body: { email, otp }, // Send email, not userId
    });
  },

  /** RESEND OTP — Using correct backend endpoint */
  resendOTP: async (userId) => {
    return await request(`/otp/${userId}/`, { method: "GET" });
  },

  forgotPassword: async (email) =>
    request("/forgot-password/", {
      method: "POST",
      body: { email },
    }),

  resetPassword: async (data) =>
    request("/reset-password/", {
      method: "POST",
      body: data,
    }),

  updateProfile: async (profileData) =>
    request("/user/profile/", {
      method: "PUT",
      body: profileData,
    }),

  checkEmail: async (email) =>
    request("/check-email/", {
      method: "POST",
      body: { email },
    }),

  socialLogin: async (provider, token) =>
    request(`/social/${provider}/`, {
      method: "POST",
      body: { access_token: token },
    }),

  logout: async () =>
    request("/logout/", { method: "POST" }),
};

export default {
  request,
  authService,
};