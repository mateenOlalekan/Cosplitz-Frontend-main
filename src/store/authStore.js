import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '../services/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,
      userDetails: null,
      otpData: null,
      isGuest: false,

      // Actions
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => {
        console.error('Auth Store Error:', error);
        set({ 
          error: error?.response?.data?.message || error?.message || error || 'An error occurred',
          isLoading: false 
        });
      },

      clearError: () => set({ error: null }),

      login: async (credentials, rememberMe = false) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await authService.login(credentials);
          const token = response.data?.access_token || response.data?.token || response.token;
          const user = response.data?.user || response.user || response.data;
          
          if (!token || !user) {
            throw new Error('Invalid login response');
          }

          // Store based on rememberMe preference
          const storage = rememberMe ? localStorage : sessionStorage;
          storage.setItem('authToken', token);
          storage.setItem('userInfo', JSON.stringify(user));

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            isGuest: false,
          });

          return { success: true, user };
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || error.message || 'Login failed' 
          });
          throw error;
        }
      },

      register: async (userData) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await authService.register(userData);
          const user = response.data?.user || response.user || response.data;
          
          if (!user) {
            throw new Error('Registration failed');
          }

          // Store user data temporarily for OTP verification
          const otpData = {
            email: user.email || userData.email,
            userId: user.id,
            expiresAt: Date.now() + (15 * 60 * 1000), // 15 minutes
          };

          set({
            user,
            isAuthenticated: false,
            isLoading: false,
            otpData,
            error: null,
          });

          // Automatically request OTP after registration
          try {
            await authService.getOTP({ email: otpData.email });
          } catch (otpError) {
            console.warn('OTP request failed:', otpError);
          }

          return { success: true, user, otpData };
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || error.message || 'Registration failed' 
          });
          throw error;
        }
      },

      requestOTP: async (identifier) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await authService.getOTP(identifier);
          
          set({ 
            isLoading: false,
            otpData: {
              ...get().otpData,
              requestedAt: Date.now(),
            }
          });
          
          return { success: true };
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || error.message || 'Failed to send OTP' 
          });
          throw error;
        }
      },

      verifyOTP: async (email, otp) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await authService.verifyOTP({ email, otp_code: otp });
          
          if (response.success || response.status === 200 || response.status === 201) {
            // Get the stored user data
            const { otpData, user } = get();
            
            // Clear OTP data after successful verification
            set({ 
              isLoading: false,
              otpData: null,
              error: null,
            });

            return { 
              success: true, 
              message: response.data?.message || 'Email verified successfully' 
            };
          }
          
          throw new Error(response.data?.message || 'OTP verification failed');
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || error.message || 'OTP verification failed' 
          });
          throw error;
        }
      },

      resendOTP: async (email) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await authService.resendOTP(email);
          
          set({ 
            isLoading: false,
            otpData: {
              ...get().otpData,
              requestedAt: Date.now(),
              resendCount: (get().otpData?.resendCount || 0) + 1,
            }
          });
          
          return { success: true };
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || error.message || 'Failed to resend OTP' 
          });
          throw error;
        }
      },

      logout: () => {
        // Clear storage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('userInfo');
        
        // Clear store
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          userDetails: null,
          otpData: null,
          isGuest: false,
          error: null,
        });
      },

      setUserDetails: (details) => {
        set({ userDetails: details });
      },

      initializeAuth: () => {
        try {
          const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
          const userInfo = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');

          if (token && userInfo) {
            const user = JSON.parse(userInfo);
            const isGuest = user?.is_guest === true;
            
            set({
              user,
              token,
              isAuthenticated: !isGuest, // Guests are not fully authenticated
              isLoading: false,
              isGuest,
            });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false, 
            isLoading: false,
            isGuest: false,
          });
        }
      },

      fetchUserInfo: async () => {
        try {
          const token = get().token || localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
          
          if (!token) {
            throw new Error('No authentication token found');
          }

          const response = await authService.getUserInfo();
          
          if (response.data || response.user) {
            const userDetails = response.data || response.user || response;
            
            // Update user info in storage
            const storage = localStorage.getItem('authToken') ? localStorage : sessionStorage;
            const existingUser = JSON.parse(storage.getItem('userInfo') || '{}');
            storage.setItem('userInfo', JSON.stringify({ ...existingUser, ...userDetails }));
            
            set({ 
              userDetails,
              user: { ...get().user, ...userDetails }
            });
          }
        } catch (error) {
          console.error('Failed to fetch user info:', error);
          // Don't throw - this is a background update
        }
      },

      // Check if user is admin
      isAdmin: () => {
        const { user } = get();
        return user?.role === 'admin' || user?.is_admin === true;
      },

      // Guest mode
      setGuestMode: (isGuest) => set({ isGuest }),
      
      // Get OTT data
      getOTPData: () => get().otpData,
      
      // Check if OTP is expired
      isOTPExpired: () => {
        const otpData = get().otpData;
        if (!otpData?.expiresAt) return true;
        return Date.now() > otpData.expiresAt;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isGuest: state.isGuest,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.initializeAuth();
        }
      },
    }
  )
);

// Initialize auth on store creation
useAuthStore.getState().initializeAuth();