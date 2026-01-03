const API_BASE_URL = 'https://cosplitz-backend.onrender.com/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
  };
};

const handleResponse = async (response) => {
  const text = await response.text();
  let data;
  
  try {
    data = text ? JSON.parse(text) : {};
  } catch (error) {
    throw new Error('Invalid JSON response');
  }
  
  if (!response.ok) {
    throw new Error(data.message || data.detail || `HTTP error! status: ${response.status}`);
  }
  
  if (data.status === 'success') {
    return data.data || data;
  }
  
  // If no status field, assume success
  if (response.ok) {
    return data;
  }
  
  throw new Error(data.message || 'Request failed');
};

export const splitApi = {
  // Get all available splits
  getAllSplits: async () => {
    const response = await fetch(`${API_BASE_URL}/splits/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return handleResponse(response);
  },

  // Get user's splits
  getMySplits: async () => {
    const response = await fetch(`${API_BASE_URL}/splits/my_splits/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return handleResponse(response);
  },

  // Create split with image upload support
  createSplit: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/splits/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    });
    return handleResponse(response);
  },

  // Get split details
  getSplitDetails: async (id) => {
    const response = await fetch(`${API_BASE_URL}/splits/${id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return handleResponse(response);
  },

  // Update split
  updateSplit: async (id, formData) => {
    const response = await fetch(`${API_BASE_URL}/splits/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: formData,
    });
    return handleResponse(response);
  },

  // Join split
  joinSplit: async (splitId, userId) => {
    const response = await fetch(`${API_BASE_URL}/splits/${splitId}/join_splits/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ user_id: userId }),
    });
    return handleResponse(response);
  },

  // Get split participants
  getSplitParticipants: async (splitId) => {
    const response = await fetch(`${API_BASE_URL}/splits/${splitId}/participants/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return handleResponse(response);
  },
};