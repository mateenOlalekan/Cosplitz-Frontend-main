import api from "./apiClient";

export const submitKYC = (data) => api.post("kyc/submit/", data);
export const getKYCStatus = (userId) => api.get(`kyc/status/${userId}/`);