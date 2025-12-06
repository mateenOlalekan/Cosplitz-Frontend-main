import api from "./apiClient";
import axios from "axios";

export const registerUser = (data) => api.post("https://cosplitz-backend.onrender.com/api/register/", data);

export const loginUser = (data) =>
  axios.post("http://localhost:8000/api/login/", data);

export const getUserInfo = () => api.get("user/info/");
export const logoutUser = () => api.post("logout/");