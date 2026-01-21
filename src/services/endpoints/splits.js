// src/services/endpoints/splits.js
// Centralized API endpoints for splits

const API_BASE_URL = "https://cosplitz-backend.onrender.com/api";

/**
 * Get all splits
 * GET /api/splits
 * 
 * @returns {Promise<Object>} Response with splits data
 * Expected response structure:
 * {
 *   "status": "success",
 *   "data": [
 *     {
 *       "id": 1,
 *       "created_at": "2025-12-05T08:36:32.737315Z",
 *       "title": "Groceries",
 *       "category": "Housing",
 *       "image_url": null,
 *       "amount": 0,
 *       "max_participants": 0,
 *       "split_method": "SpecificAmounts",
 *       "location": "Apartment 3B"
 *     }
 *   ]
 * }
 */
export const getSplitsEndpoint = async () => {
  const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  
  const response = await fetch(`${API_BASE_URL}/splits/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: "Failed to fetch splits",
    }));
    throw new Error(errorData.message || errorData.detail || "Failed to fetch splits");
  }

    const data = await response.json();
    console.log(data);
  
  // Return the data array from the response
  return data.data || data;
};

/**
 * Get split by ID
 * GET /api/splits/:id
 */
export const getSplitByIdEndpoint = async (id) => {
  const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  
  const response = await fetch(`${API_BASE_URL}/splits/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: "Failed to fetch split",
    }));
    throw new Error(errorData.message || errorData.detail || "Failed to fetch split");
  }

  return await response.json();
};

/**
 * Create a new split
 * POST /api/splits
 */
export const createSplitEndpoint = async (splitData) => {
  const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  
  const response = await fetch(`${API_BASE_URL}/splits`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(splitData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: "Failed to create split",
    }));
    throw new Error(errorData.message || errorData.detail || "Failed to create split");
  }

  return await response.json();
};

