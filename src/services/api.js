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
   AUTH SERVICE — MATCHED EXACTLY WITH YOUR BACKEND
----------------------------------------------------------------*/
/* -------------------------------------------------------------
   AUTH SERVICE — CLEAN & CONSISTENT
----------------------------------------------------------------*/
export const authService = {
  register: async (userData) =>
    request("/register/", {
      method: "POST",
      body: userData,
    }),

  login: async (credentials) =>
    request("/login/", {
      method: "POST",
      body: credentials,
    }),

  /** VERIFY OTP — EMAIL + OTP */
  verifyOTP: async (email, otp) =>
    request("/verify_otp", {
      method: "POST",
      body: {
        email: email.toLowerCase().trim(),
        otp: otp.trim(),
      },
    }),

  /** RESEND OTP — SAME BACKEND FLOW */
  resendOTP: async (email) =>
    request("/resend_otp", {
      method: "POST",
      body: {
        email: email.toLowerCase().trim(),
      },
    }),
};

/* -------------------------------------------------------------
   DASHBOARD SERVICE
----------------------------------------------------------------*/
export const dashboardService = {
  getOverview: async () =>
    request("/dashboard/overview", { method: "GET" }),

  getAnalytics: async (period = "monthly") =>
    request(`/dashboard/analytics?period=${period}`, {
      method: "GET",
    }),

  createSplit: async (splitData) =>
    request("/splits/create", {
      method: "POST",
      body: splitData,
    }),

  getWalletBalance: async () =>
    request("/wallet/balance", { method: "GET" }),

  getNotifications: async () =>
    request("/notifications", { method: "GET" }),
};

/* -------------------------------------------------------------
   ADMIN SERVICE
----------------------------------------------------------------*/
export const adminService = {
  getDashboardStats: async () =>
    request("/admin/dashboard", { method: "GET" }),

  getUsers: async (page = 1, limit = 20) =>
    request(`/admin/users?page=${page}&limit=${limit}`, {
      method: "GET",
    }),

  getSplits: async (page = 1, limit = 20) =>
    request(`/admin/splits?page=${page}&limit=${limit}`, {
      method: "GET",
    }),
};

export default {
  request,
  authService,
  dashboardService,
  adminService,
};
