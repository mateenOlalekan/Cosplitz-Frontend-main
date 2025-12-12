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
export const authService = {
  /** REGISTER — /api/register/ */
  register: async (userData) => {
    return await request("/register/", {
      method: "POST",
      body: userData,
    });
  },

  /** LOGIN — Backend uses: http://localhost:8000/api/login/ */
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

  /** VERIFY OTP — MUST SEND email + otp */
verifyOTP: async (userId, otp) => {
  return await request("/verify-otp", {
    method: "POST",
    body: {
      user_id: userId,
      otp: otp,
    },
  });
},


  /** RESEND OTP — backend uses SAME endpoint as getOTP */
  resendOTP: async (userId) => {
    return await authService.getOTP(userId);
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
