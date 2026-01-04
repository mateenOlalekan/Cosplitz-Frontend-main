import { create } from "zustand";
import useAuthStore from "./authStore";
import { splitService } from "../services/SplitServices";

const useSplitStore = create((set, get) => ({
  splits: [],
  mySplits: [],
  currentSplit: null,
  isLoading: false,
  error: null,

  reset: () => {
    set({
      splits: [],
      mySplits: [],
      currentSplit: null,
      error: null,
    });
  },

  // Fetch all splits
  loadSplits: async () => {
    const { token } = useAuthStore.getState();
    if (!token) return;

    set({ isLoading: true });
    try {
      const splits = await splitService.getSplits();
      set({ splits, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  // Fetch my splits
  loadMySplits: async () => {
    const { token } = useAuthStore.getState();
    if (!token) return;

    set({ isLoading: true });
    try {
      const mySplits = await splitService.getMySplits();
      set({ mySplits, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  // Create split
  createSplit: async (payload) => {
    set({ isLoading: true });
    try {
      const split = await splitService.createSplit(payload);
      set((state) => ({
        splits: [split, ...state.splits],
        mySplits: [split, ...state.mySplits],
        isLoading: false,
      }));
      return split;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  // Join split
  joinSplit: async (id) => {
    set({ isLoading: true });
    try {
      await splitService.joinSplit(id);
      await get().loadMySplits();
      set({ isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },
}));

export default useSplitStore;
