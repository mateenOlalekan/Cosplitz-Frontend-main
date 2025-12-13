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
 * Core request handler with detailed logging for debugging
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log(`🔄 API Request: ${options.method || "GET"} ${url}`);
  
  // Default headers
  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  
  // Get auth token
  const token = getAuthToken();
  
  // Prepare headers
  const headers = {
    ...defaultHeaders,
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
    credentials: "omit", // Changed from "include" to avoid CORS issues
    ...options,
  };
  
  // Stringify body if it's an object
  if (requestOptions.body && typeof requestOptions.body === "object" && !(requestOptions.body instanceof FormData)) {
    console.log("📤 Request Body:", requestOptions.body);
    requestOptions.body = JSON.stringify(requestOptions.body);
  }
  
  console.log("📝 Request Options:", {
    method: requestOptions.method,
    headers: requestOptions.headers,
    body: requestOptions.body,
  });
  
  try {
    const response = await fetch(url, requestOptions);
    
    console.log(`📥 Response Status: ${response.status} ${response.statusText}`);
    
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
      console.error("❌ Error parsing response:", error);
      responseData = { message: "Invalid server response" };
    }
    
    console.log("📦 Response Data:", responseData);
    
    // Handle 400 Bad Request specifically
    if (response.status === 400) {
      console.error("❌ 400 Bad Request Details:", {
        endpoint,
        requestBody: options.body,
        response: responseData
      });
      
      return {
        status: 400,
        data: responseData,
        error: true,
        badRequest: true,
        validationErrors: responseData.errors || responseData.message,
      };
    }
    
    // Handle 401 Unauthorized
    if (response.status === 401) {
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
      
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
    
  } catch (error) {
    console.error("❌ Network/Fetch Error:", error);
    
    return {
      status: 0,
      data: { 
        message: "Network error. Please check your internet connection.",
        error: error.message 
      },
      error: true,
      networkError: true,
    };
  }
}

/* -------------------------------------------------------------
   AUTH SERVICE - UPDATED TO MATCH YOUR BACKEND EXACTLY
----------------------------------------------------------------*/
export const authService = {
  /** REGISTER — /api/register/ */
  register: async (userData) => {
    console.log("👤 Registration Data:", userData);
    
    // Based on your API response, backend expects:
    // first_name, last_name, email, password, username, nationality
    const dataToSend = {
      first_name: userData.first_name || userData.firstName,
      last_name: userData.last_name || userData.lastName,
      email: userData.email,
      password: userData.password,
      username: userData.username || userData.email.split("@")[0],
      nationality: userData.nationality || "Unknown",
    };
    
    console.log("📨 Sending to backend:", dataToSend);
    
    return await request("/register/", {
      method: "POST",
      body: dataToSend,
    });
  },

  /** LOGIN — /api/login/ */
  login: async (credentials) => {
    return await request("/login/", {
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
  console.log("🔐 Verifying OTP:", { email, otp });
  
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

  /** RESEND OTP */
  resendOTP: async (userId) => {
    return await authService.getOTP(userId);
  },

  /** FORGOT PASSWORD */
  forgotPassword: async (email) => {
    return await request("/forgot-password/", {
      method: "POST",
      body: { email },
    });
  },

  /** RESET PASSWORD */
  resetPassword: async (data) => {
    return await request("/reset-password/", {
      method: "POST",
      body: data,
    });
  },

  /** UPDATE PROFILE */
  updateProfile: async (profileData) => {
    return await request("/user/profile/", {
      method: "PUT",
      body: profileData,
    });
  },

  /** Helper functions */
  storeToken,
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
};

// Export all services
export default {
  request,
  authService,
  dashboardService,
};