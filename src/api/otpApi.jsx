import api from "./apiClient";

export const requestOTP = (id) => api.get(`otp/${id}/`);
export const verifyOTP = (data) => api.post("verify_otp/", data);
export const resendOTP = (id) => api.get(`resend_otp/${id}/`);