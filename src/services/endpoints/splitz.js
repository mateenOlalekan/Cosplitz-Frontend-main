const API_BASE_URL = "https://cosplitz-backend.onrender.com/api";


export const getUserInfoEndpoint = async (token) => {
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
        message: "Failed to fetch user info",
      }));
      throw new Error(errorData.message || errorData.detail || "Failed to fetch user info");
    }
  
    return await response.json();
  };