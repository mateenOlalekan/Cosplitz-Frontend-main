import axios from "axios";

export const adminLogin = (data) =>
  axios.post("https://cosplitz-backend.onrender.com/admin-api/login/", data);
