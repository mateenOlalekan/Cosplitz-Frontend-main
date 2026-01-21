// src/services/endpoints/auth.js
// Centralized API endpoints for authentication

const API_BASE_URL = "https://cosplitz-backend.onrender.com/api";

/**
 * Login API endpoint
 * POST /api/login/
 * 
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise<Object>} Response with token, refresh_token, and user data
 */
export const loginEndpoint = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: "Login failed. Please check your credentials.",
    }));
    throw new Error(errorData.message || errorData.detail || "Login failed");
  }

  const data = await response.json();
  
  // Expected response structure:
  // {
  //   "message": "Login successful",
  //   "token": "access_token_here",
  //   "refresh_token": "refresh_token_here",
  //   "data": {
  //     "id": 3,
  //     "email": "21l54o8q@qejjyl.com",
  //     "username": "dylanjoe",
  //     "is_active": false
  //   }
  // }
  
  return {
    message: data.message || "Login successful",
    token: data.token,
    refresh_token: data.refresh_token,
    user: data.data || data.user || data,
  };
};

/**
 * Register API endpoint
 * POST /api/register/
 */
export const registerEndpoint = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: "Registration failed.",
    }));
    throw new Error(errorData.message || errorData.detail || "Registration failed");
  }

  return await response.json();
};

/**
 * Get user info endpoint
 * GET /api/user/info
 */
export const getUserInfoEndpoint = async (token) => {
  const response = await fetch(`${API_BASE_URL}/user/info`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: "Failed to fetch user info",
    }));
    throw new Error(errorData.message || errorData.detail || "Failed to fetch user info");
  }

  return await response.json();
};



