const API_BASE_URL = "https://cosplitz-backend.onrender.com/api";

// ================================
// Helper: Get Token
// ================================
function getToken() {
  return (
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("authToken")
  );
}

// ================================
// Helper: Fetch Wrapper (Interceptors Simulation)
// ================================
async function apiFetch(endpoint, options = {}) {
  const token = getToken();

  // Headers - don't set Content-Type for FormData
  let headers = {
    ...(options.headers || {}),
  };

  // Only set Content-Type to JSON if not FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // Attach token automatically
  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Handle FormData - let browser set boundary
  let body = options.body;
  if (body && !(body instanceof FormData)) {
    body = JSON.stringify(body);
  }

  const finalOptions = {
    ...options,
    headers,
    body,
  };

  const response = await fetch(API_BASE_URL + endpoint, finalOptions);

  // Handle 401 globally (auto logout)
  if (response.status === 401) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userInfo");
    window.location.href = "/login";
    throw new Error("Session expired. Please login again.");
  }

  // Parse JSON safely
  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(data?.message || "Request failed");
    error.response = { data };
    throw error;
  }

  return data;
}

// ================================
// AUTH SERVICE (Complete API)
// ================================
export const authService = {
  // Register
  register: (userData) =>
    apiFetch("/register", {
      method: "POST",
      body: userData,
    }),

  // Login
  login: (credentials) =>
    apiFetch("/login", {
      method: "POST",
      body: credentials,
    }),

  // Get OTP (by userId or email)
  getOTP: (identifier) => {
    if (!identifier) throw new Error("getOTP requires userId or email");
    
    if (typeof identifier === "object" && identifier.email) {
      return apiFetch(`/otp/11/${identifier.email}`, { method: "POST" });
    }
    
    return apiFetch(`/otp/${identifier}`, { method: "POST" });
  },

  // Verify OTP
  verifyOTP: (otpData) =>
    apiFetch("/verify_otp", {
      method: "POST",
      body: otpData,
    }),

  // Resend OTP
  resendOTP: (email) =>
    apiFetch("/resend_otp", {
      method: "POST",
      body: { email },
    }),

  // Get user info (token-based)
  getUserInfo: () => apiFetch("/user/info", { method: "GET" }),

  // Submit KYC
  submitKYC: (kycData) => {
    const formData = new FormData();
    
    // Append all KYC data
    Object.keys(kycData).forEach(key => {
      if (kycData[key] instanceof File) {
        formData.append(key, kycData[key]);
      } else {
        formData.append(key, kycData[key]);
      }
    });

    return apiFetch("/kyc/submit", {
      method: "POST",
      body: formData,
      headers: {}, // Let browser set content-type with boundary
    });
  },

  // Forgot password
  forgotPassword: (email) =>
    apiFetch("/forgot-password", {
      method: "POST",
      body: { email },
    }),

  // Reset password
  resetPassword: (resetData) =>
    apiFetch("/reset-password", {
      method: "POST",
      body: resetData,
    }),

  // Update profile
  updateProfile: (profileData) =>
    apiFetch("/user/profile", {
      method: "PUT",
      body: profileData,
    }),

  // Logout (invalidate token)
  logout: () =>
    apiFetch("/logout", {
      method: "POST",
    }),
};

export default apiFetch;