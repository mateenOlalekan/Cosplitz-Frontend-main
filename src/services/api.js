// src/services/api.js - FIXED VERSION
const API_BASE_URL = "https://cosplitz-backend.onrender.com/api";

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

  // Handle 401 - Unauthorized
  if (response.status === 401) {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn("Failed to clear storage:", e);
    }

    if (!window.location.pathname.includes("/login")) {
      setTimeout(() => {
        window.location.href = "/login";
      }, 100);
    }

    return {
      status: 401,
      data: json || { message: "Unauthorized" },
      unauthorized: true,
    };
  }

  // Handle 400 - Bad Request (for OTP errors)
  if (response.status === 400) {
    return {
      status: 400,
      data: json,
      error: true,
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

export const authService = {
  /** REGISTER — POST /api/register/ */
  register: async (userData) => {
    return await request("/register/", {
      method: "POST",
      body: userData,
    });
  },

  /** LOGIN — POST /api/login/ */
  login: async (credentials) => {
    return await request("/login/", {
      method: "POST",
      body: credentials,
    });
  },

  /** USER INFO — GET /api/user/info */
  getUserInfo: async () => {
    return await request("/user/info", { method: "GET" });
  },

  /** GET OTP — GET /api/otp/{id}/ */
  getOTP: async (userId) => {
    return await request(`/otp/${userId}/`, { method: "GET" });
  },

  /** VERIFY OTP — POST /api/verify_otp */
  verifyOTP: async (email, otp) => {
    return await request("/verify_otp", {
      method: "POST",
      body: { email, otp },
    });
  },

  /** RESEND OTP — Same as getOTP */
  resendOTP: async (userId) => {
    return await authService.getOTP(userId);
  },

  /** User Data */
  userInfo: async (email) =>
    request("/user/info", {
      method: "GET",
      params: { email },
    }),

  /** LOGOUT */
  logout: async () =>
    request("/logout/", { method: "POST" }),

  // Forgot Password functions
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
};

export const splitsService = {
  /** GET all splits */
  getAllSplits: async () =>
    request("/splits/", { 
      method: "GET" 
    }),

  /** GET single split */
  getSplit: async (splitId) =>
    request(`/splits/${splitId}/`, { 
      method: "GET" 
    }),

  /** CREATE new split */
  createSplit: async (splitData) =>
    request("/splits/", {
      method: "POST",
      body: splitData,
    }),

  /** UPDATE split */
  updateSplit: async (splitId, splitData) =>
    request(`/splits/${splitId}/`, {
      method: "PATCH",  // Changed from PUT to PATCH as per your API
      body: splitData,
    }),

  /** DELETE split */
  deleteSplit: async (splitId) =>
    request(`/splits/${splitId}/`, {
      method: "DELETE",
    }),
};

export const dashboardService = {
  getOverview: async () =>
    request("/dashboard/overview", { method: "GET" }),

  getAnalytics: async (period = "monthly") =>
    request(`/dashboard/analytics?period=${period}`, {
      method: "GET",
    }),

  getWalletBalance: async () =>
    request("/wallet/balance", { method: "GET" }),

  getNotifications: async () =>
    request("/notifications", { method: "GET" }),
};

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
  splitsService,  // Changed from duplicated functions in authService
  dashboardService,
  adminService,
};