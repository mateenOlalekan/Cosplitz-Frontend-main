// src/services/api.js

const API_BASE_URL = "https://cosplitz-backend.onrender.com/api";

/* -------------------------------------------------------------
   AUTH TOKEN
------------------------------------------------------------- */
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

/* -------------------------------------------------------------
   LOGGER (DEV ONLY)
------------------------------------------------------------- */
const logRequest = (type, payload) => {
  if (process.env.NODE_ENV === "development") {
    console.group(`[API ${type}]`);
    console.log(payload);
    console.groupEnd();
  }
};

/* -------------------------------------------------------------
   CORE REQUEST (FETCH)
------------------------------------------------------------- */
async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const token = getAuthToken();
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const finalOptions = {
    method: options.method || "GET",
    headers,
    body: options.body,
  };

  if (finalOptions.body && !isFormData && typeof finalOptions.body === "object") {
    finalOptions.body = JSON.stringify(finalOptions.body);
  }

  logRequest("REQUEST", { url, finalOptions });

  let response;
  try {
    response = await fetch(url, finalOptions);
  } catch (error) {
    logRequest("NETWORK_ERROR", error);
    return {
      status: 0,
      success: false,
      error: true,
      data: { message: "Network error. Please try again." },
    };
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = { message: "Invalid JSON response" };
  }

  logRequest("RESPONSE", { status: response.status, data });

  if (response.status === 401) {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
    return { status: 401, unauthorized: true, data };
  }

  if (!response.ok) {
    return {
      status: response.status,
      success: false,
      error: true,
      data,
    };
  }

  return {
    status: response.status,
    success: true,
    data,
  };
}

/* -------------------------------------------------------------
   AUTH SERVICE (DJANGO ALIGNED)
------------------------------------------------------------- */
export const authService = {
  register: (payload) =>
    request("/register/", {
      method: "POST",
      body: payload,
    }),

  login: (payload) =>
    request("/login/", {
      method: "POST",
      body: payload,
    }),

  verifyOTP: (email, otp) =>
    request("/verify_otp/", {
      method: "POST",
      body: { email, otp },
    }),

  resendOTP: (email) =>
    request("/otp/", {
      method: "POST",
      body: { email },
    }),
};

export default { request, authService };
