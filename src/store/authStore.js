// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

      // Actions
      login: (user, token) => {
        try {
          // default to localStorage (but calling code may use sessionStorage)
          localStorage.setItem('authToken', token);
          localStorage.setItem('userInfo', JSON.stringify(user));
        } catch (e) {
          // ignore storage errors
        }
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      },

      register: (userData) => {
        set({
          user: { email: userData.email, ...userData },
          isAuthenticated: false,
          error: null,
        });
      },

      logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('userInfo');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          userDetails: null,
          error: null,
        });
      },

      setUserDetails: (details) => {
        set({ userDetails: details });
      },

      setError: (error) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      initializeAuth: () => {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const userInfo = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');

        if (token && userInfo) {
          try {
            const user = JSON.parse(userInfo);
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error) {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } else {
          set({ isLoading: false });
        }
      },

      // Check if user is admin
      isAdmin: () => {
        const { user } = get();
        return user?.role === 'admin' || user?.is_admin === true;
      },

      // Get user info from API
      fetchUserInfo: async () => {
        try {
          const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
          if (!token) return;

          const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://cosplitz-backend.onrender.com'}/api/user/info`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            set({ userDetails: data });
          }
        } catch (error) {
          console.error('Failed to fetch user info:', error);
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
