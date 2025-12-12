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
    return { 
      status: 0, 
      data: { 
        error: "Network error. Please check your connection.",
        message: "Network error. Please check your connection."
      }, 
      rawError: networkErr 
    };
  }

  let parsed = null;

  try {
    const text = await res.text();
    parsed = text ? JSON.parse(text) : null;
  } catch (parseErr) {
    parsed = { 
      error: "Failed to parse response", 
      message: "Server returned an invalid response"
    };
  }

  // handle 401 invalid token
  if (res.status === 401) {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.error("Error clearing storage:", e);
    }

    // Only redirect if not on login page
    if (!window.location.pathname.includes('/login')) {
      try {
        window.location.href = "/login";
      } catch (e) {
        console.error("Redirect error:", e);
      }
    }

    return { 
      status: 401, 
      data: parsed || { message: "Unauthorized. Please login again." },
      unauthorized: true
    };
  }

  // Handle 400, 403, 404, 500 errors
  if (res.status >= 400 && res.status !== 401) {
    return {
      status: res.status,
      data: parsed || { 
        error: `Request failed with status ${res.status}`,
        message: `Request failed with status ${res.status}`
      },
      error: true
    };
  }

  return { 
    status: res.status, 
    data: parsed,
    success: res.status >= 200 && res.status < 300
  };
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
    if (!userId) {
      return { 
        status: 400, 
        data: { 
          message: "Missing userId",
          error: "User ID is required"
        } 
      };
    }

    return await request(`/otp/${encodeURIComponent(userId)}/`, {
      method: "GET",
    });
  },

  // ✅ MODIFIED: verifyOTP to accept email instead of userId
  verifyOTP: async (email, otp) => {
    return await request("/verify_otp", {
      method: "POST",
      body: { email, otp },
    });
  },

  // ✅ ADDED: Resend OTP method
  resendOTP: async (userId) => {
    return await authService.getOTP(userId);
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

  submitKYC: async (kycData) => {
    return await request("/kyc/submit/", {
      method: "POST",
      body: kycData,
    });
  },

  // Check email availability
  checkEmail: async (email) => {
    return await request("/check-email/", {
      method: "POST",
      body: { email },
    });
  },

  // Social login
  socialLogin: async (provider, token) => {
    return await request(`/social/${provider}/`, {
      method: "POST",
      body: { access_token: token },
    });
  },

  // Logout
  logout: async () => {
    return await request("/logout/", {
      method: "POST",
    });
  }
};

// Dashboard services
export const dashboardService = {
  getOverview: async () => {
    return await request("/dashboard/overview", {
      method: "GET",
    });
  },

  getAnalytics: async (period = "monthly") => {
    return await request(`/dashboard/analytics?period=${period}`, {
      method: "GET",
    });
  },

  createSplit: async (splitData) => {
    return await request("/splits/create", {
      method: "POST",
      body: splitData,
    });
  },

  getWalletBalance: async () => {
    return await request("/wallet/balance", {
      method: "GET",
    });
  },

  getNotifications: async () => {
    return await request("/notifications", {
      method: "GET",
    });
  }
};

// Admin services
export const adminService = {
  getDashboardStats: async () => {
    return await request("/admin/dashboard", {
      method: "GET",
    });
  },

  getUsers: async (page = 1, limit = 20) => {
    return await request(`/admin/users?page=${page}&limit=${limit}`, {
      method: "GET",
    });
  },

  getSplits: async (page = 1, limit = 20) => {
    return await request(`/admin/splits?page=${page}&limit=${limit}`, {
      method: "GET",
    });
  }
};

export default { 
  request, 
  authService, 
  dashboardService, 
  adminService 
};