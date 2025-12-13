// src/services/api.js
const API_BASE_URL = "https://cosplitz-backend.onrender.com/api";

/**
 * Get token from storage
 */
function getAuthToken() {
  try {
    return localStorage.getItem("authToken") || sessionStorage.getItem("authToken") || null;
  } catch (error) {
    console.error("Error accessing storage:", error);
    return null;
  }
}

/**
 * Store token
 */
function storeToken(token, rememberMe = false) {
  try {
    if (rememberMe) {
      localStorage.setItem("authToken", token);
      sessionStorage.removeItem("authToken");
    } else {
      sessionStorage.setItem("authToken", token);
      localStorage.removeItem("authToken");
    }
  } catch (error) {
    console.error("Error storing token:", error);
  }
}

/**
 * Clear auth data
 */
function clearAuthData() {
  try {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
  } catch (error) {
    console.error("Error clearing auth data:", error);
  }
}

/**
 * Core request handler
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Default headers
  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  
  // Get auth token
  const token = getAuthToken();
  
  // Check if body is FormData
  const isFormData = options.body instanceof FormData;
  
  // Prepare headers
  const headers = {
    ...(isFormData ? {} : defaultHeaders), // Remove Content-Type for FormData
    ...(options.headers || {}),
  };
  
  // Add Authorization header if token exists
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  // Prepare request options
  const requestOptions = {
    method: options.method || "GET",
    headers,
    credentials: "include", // Important for cookies/sessions
    ...options,
  };
  
  // Stringify body if it's an object and not FormData
  if (requestOptions.body && !isFormData && typeof requestOptions.body === "object") {
    requestOptions.body = JSON.stringify(requestOptions.body);
  }
  
  // Set timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
  requestOptions.signal = controller.signal;
  
  let response;
  try {
    response = await fetch(url, requestOptions);
    clearTimeout(timeoutId);
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === "AbortError") {
      return {
        status: 408,
        data: { message: "Request timeout. Please try again." },
        error: true,
        timeout: true,
      };
    }
    
    return {
      status: 0,
      data: { message: "Network error. Please check your connection." },
      error: true,
      networkError: true,
    };
  }
  
  // Parse response
  let responseData;
  const contentType = response.headers.get("content-type");
  
  try {
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      responseData = text ? { message: text } : {};
    }
  } catch (error) {
    console.error("Error parsing response:", error);
    responseData = { message: "Invalid server response" };
  }
  
  // Handle 401 Unauthorized
  if (response.status === 401) {
    clearAuthData();
    
    // Only redirect if not already on login page
    if (!window.location.pathname.includes("/login")) {
      window.location.href = "/login?session_expired=true";
    }
    
    return {
      status: 401,
      data: responseData,
      unauthorized: true,
      error: true,
    };
  }
  
  // Handle other error statuses
  if (!response.ok) {
    return {
      status: response.status,
      data: responseData,
      error: true,
      serverError: true,
    };
  }
  
  // Successful response
  return {
    status: response.status,
    data: responseData,
    success: true,
  };
}

/* -------------------------------------------------------------
   AUTH SERVICE
----------------------------------------------------------------*/
export const authService = {
  /** REGISTER — /api/register/ */
  register: async (userData) => {
    // Ensure username is provided (required by backend)
    const dataToSend = {
      ...userData,
      username: userData.username || userData.email.split("@")[0],
    };
    
    return await request("/register", {
      method: "POST",
      body: dataToSend,
    });
  },

  /** LOGIN — /api/login/ */
  login: async (credentials) => {
    return await request("/login", {
      method: "POST",
      body: credentials,
    });
  },

  /** GET USER INFO — /api/user/info */
  getUserInfo: async () => {
    return await request("/user/info", { method: "GET" });
  },

  /** GET OTP — /api/otp/<user_id>/ */
  getOTP: async (userId) => {
    if (!userId) {
      return {
        success: false,
        message: "User ID is required",
        error: true,
      };
    }
    
    return await request(`/otp/${userId}/`, { method: "GET" });
  },

  /** VERIFY OTP — /api/verify_otp */
  verifyOTP: async (email, otp) => {
    if (!email || !otp) {
      return {
        success: false,
        message: "Email and OTP are required",
        error: true,
      };
    }
    
    return await request("/verify_otp", {
      method: "POST",
      body: { email, otp },
    });
  },

  /** RESEND OTP — Uses same endpoint as getOTP */
  resendOTP: async (userId) => {
    return await authService.getOTP(userId);
  },

  /** FORGOT PASSWORD — /api/forgot-password/ */
  forgotPassword: async (email) => {
    return await request("/forgot-password/", {
      method: "POST",
      body: { email },
    });
  },

  /** RESET PASSWORD — /api/reset-password/ */
  resetPassword: async (data) => {
    return await request("/reset-password/", {
      method: "POST",
      body: data,
    });
  },

  /** UPDATE PROFILE — /api/user/profile/ */
  updateProfile: async (profileData) => {
    return await request("/user/profile/", {
      method: "PUT",
      body: profileData,
    });
  },

  /** CHECK EMAIL — /api/check-email/ */
  checkEmail: async (email) => {
    return await request("/check-email/", {
      method: "POST",
      body: { email },
    });
  },

  /** SOCIAL LOGIN — /api/social/<provider>/ */
  socialLogin: async (provider, token) => {
    return await request(`/social/${provider}/`, {
      method: "POST",
      body: { access_token: token },
    });
  },

  /** LOGOUT — /api/logout/ */
  logout: async () => {
    return await request("/logout/", { method: "POST" });
  },

  /** Helper functions */
  storeToken,
  clearAuthData,
  getAuthToken,
};

/* -------------------------------------------------------------
   DASHBOARD SERVICE
----------------------------------------------------------------*/
export const dashboardService = {
  getOverview: async () => {
    return await request("/dashboard/overview", { method: "GET" });
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
    return await request("/wallet/balance", { method: "GET" });
  },

  getNotifications: async () => {
    return await request("/notifications", { method: "GET" });
  },
};

/* -------------------------------------------------------------
   ADMIN SERVICE
----------------------------------------------------------------*/
export const adminService = {
  getDashboardStats: async () => {
    return await request("/admin/dashboard", { method: "GET" });
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
  },
};

// Export all services
export default {
  request,
  authService,
  dashboardService,
  adminService,
};