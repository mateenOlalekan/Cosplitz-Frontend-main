// src/services/api.js
const API_BASE_URL = "https://cosplitz-backend.onrender.com/api";

/**
 * Helper to get token from storage
 */
function getAuthToken() {
  try {
    return (
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("authToken") ||
      null
    );
  } catch (e) {
    return null;
  }
}

/**
 * Generic request handler
 */
async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // detect FormData
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

  // stringify JSON body
  if (opts.body && typeof opts.body === "object" && !isFormData) {
    opts.body = JSON.stringify(opts.body);
  }

  let res;

  try {
    res = await fetch(url, opts);
  } catch (networkErr) {
    return { status: 0, data: { error: "Network error" }, rawError: networkErr };
  }

  let parsed = null;

  try {
    const text = await res.text();
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = null;
  }

  // handle 401 invalid token
  if (res.status === 401) {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {}

    try {
      window.location.href = "/login";
    } catch (e) {}

    return { status: 401, data: parsed };
  }

  return { status: res.status, data: parsed };
}

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

  getOTP: async (userId) => {
    if (!userId)
      return { status: 400, data: { message: "Missing userId" } };

    return await request(`/otp/11/${encodeURIComponent(userId)}/`, {
      method: "GET",
    });
  },

  verifyOTP: async ({ user_id, otp_code }) => {
    return await request("/verify_otp/", {
      method: "POST",
      body: { user_id, otp_code },
    });
  },

  submitKYC: async (kycData) => {
    return await request("/kyc/submit/", {
      method: "POST",
      body: kycData,
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
