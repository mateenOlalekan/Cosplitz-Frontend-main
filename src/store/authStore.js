import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  role: null,
  loading: true,
  token: null,

  setAuth: ({ user, role, token }) =>
    set({
      user,
      role,
      token,
      loading: false,
    }),

  logout: () =>
    set({
      user: null,
      role: null,
      token: null,
      loading: false,
    }),

  finishLoading: () => set({ loading: false }),
}));
