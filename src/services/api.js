export const authService = {
  // Register
  register: async (userData) => api.post('/register/', userData),

  // Login
  login: async (credentials) => api.post('/login/', credentials),

  // GET OTP
  // backend expects: GET /otp/<user_id>/
  getOTP: async (userId) => api.get(`/otp/${userId}/`),

  // VERIFY OTP
  // backend expects: POST /verify_otp/
  verifyOTP: async (payload) => api.post('/verify_otp/', payload),

  // Fetch user info
  getUserInfo: async () => api.get('/user/info/'),

  // KYC
  submitKYC: async (kycData) =>
    api.post('/kyc/submit/', kycData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  forgotPassword: async (email) =>
    api.post('/forgot-password/', { email }),

  resetPassword: async (resetData) =>
    api.post('/reset-password/', resetData),

  updateProfile: async (profileData) =>
    api.put('/user/profile/', profileData),
};
