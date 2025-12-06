import api from "./apiClient";

export const getAllSplits = () => api.get("splits/");
export const createSplit = (data) => api.post("splits/", data);
export const getSplit = (id) => api.get(`splits/${id}/`);
export const updateSplit = (id, data) => api.put(`splits/${id}/`, data);
export const deleteSplit = (id) => api.delete(`splits/${id}/`);