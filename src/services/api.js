// src/services/api.js
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://cosplitz-backend.onrender.com/api";

/**
 * Helper to get token from storage (local/session)
 */
function getAuthToken() {
  try {
    return localStorage.getItem("authToken") || sessionStorage.getItem("authToken") || null;
  } catch (e) {
    return null;
  }
}

/**
 * Generic request wrapper around fetch.
 * Returns { status, data } where data is parsed JSON or null.
 * Handles 401 by clearing tokens and redirecting to /login.
 */
async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // If body is FormData, do not set Content-Type (browser will set multipart boundary)
  const isFormData = options.body instanceof FormData;

  const token = getAuthToken();
  const headers = {
    ...(isFormData ? {} : defaultHeaders),
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const opts = {
    credentials: "omit",
    ...options,
    headers,
  };

  // If JSON body and it's an object, stringify
  if (opts.body && typeof opts.body === "object" && !(opts.body instanceof FormData)) {
    opts.body = JSON.stringify(opts.body);
  }

  let res;
  try {
    res = await fetch(url, opts);
  } catch (networkErr) {
    // network-level failure
    return { status: 0, data: { error: "Network error" }, rawError: networkErr };
  }

  // attempt parse JSON safely
  let parsed = null;
  try {
    const text = await res.text();
    parsed = text ? JSON.parse(text) : null;
  } catch (e) {
    parsed = null;
  }

  // handle unauthorized globally
  if (res.status === 401) {
    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userInfo");
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("userInfo");
    } catch (e) {}
    // redirect to login to force re-auth
    try {
      window.location.href = "/login";
    } catch (e) {}
    return { status: 401, data: parsed };
  }

  return { status: res.status, data: parsed };
}

/**
 * authService - methods used by UI
 * All methods return the object { status, data }
 */
export const authService = {
  register: async (userData) => {
    return await request("/register/", {
      method: "POST",
      body: userData,
    });
  },

  login: async (credentials) => {
    return await request("/login/", {
      method: "POST",
      body: credentials,
    });
  },

  getUserInfo: async () => {
    return await request("/user/info", {
      method: "GET",
    });
  },

  // Request OTP: GET /otp/<user_id>/
  getOTP: async (userId) => {
    if (!userId) return { status: 400, data: { message: "Missing userId" } };
    return await request(`/otp/${encodeURIComponent(userId)}/`, {
      method: "GET",
    });
  },

  // Verify OTP: POST /verify_otp/ with { user_id, otp_code }
  verifyOTP: async ({ user_id, otp_code }) => {
    return await request("/verify_otp/", {
      method: "POST",
      body: { user_id, otp_code },
    });
  },

  // KYC submit (multipart) - pass FormData
  submitKYC: async (kycData) => {
    return await request("/kyc/submit/", {
      method: "POST",
      body: kycData,
      // don't set Content-Type when using FormData -- request() handles it
    });
  },

  forgotPassword: async (email) => {
    return await request("/forgot-password/", {
      method: "POST",
      body: { email },
    });
  },

  resetPassword: async (data) => {
    return await request("/reset-password/", {
      method: "POST",
      body: data,
    });
  },

  updateProfile: async (profileData) => {
    return await request("/user/profile/", {
      method: "PUT",
      body: profileData,
    });
  },
};

export default { request, authService };
