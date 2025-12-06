import api from "./apiClient";

export const getNotifications = () => api.get("notifications/");
export const getNotification = (id) => api.get(`notifications/${id}/`);
export const markAllRead = () => api.post("notifications/mark_all_read/");
export const markRead = (id) => api.post(`notifications/${id}/mark_read/`);
