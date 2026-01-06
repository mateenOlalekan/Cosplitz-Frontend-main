// import axios from "axios";
// import useAuthStore from "../store/authStore";

// const api = axios.create({
//   baseURL: "https://cosplitz-backend.onrender.com/api",
// });

// // Inject token automatically
// api.interceptors.request.use((config) => {
//   const token = useAuthStore.getState().token;
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Handle auth errors globally
// api.interceptors.response.use(
//   (res) => res,
//   (error) => {
//     if (error.response?.status === 401) {
//       useAuthStore.getState().logout();
//     }
//     return Promise.reject(error);
//   }
// );

// export const splitService = {
//   getSplits: async () => {
//     const res = await api.get('/splits/');
//     return res.data.data;
//   },

//   getMySplits: async () => {
//     const res = await api.get('/splits/my_splits/');
//     return res.data.data;
//   },

//   createSplit: async (payload) => {
//     const res = await api.post('/splits/', payload);
//     return res.data.data;
//   },

//   updateSplit: async (id, payload) => {
//     const res = await api.patch(`/splits/${id}/`, payload);
//     return res.data.data;
//   },

//   joinSplit: async (id) => {
//     const res = await api.post(`/splits/${id}/join_splits/`);
//     return res.data;
//   },
// };
