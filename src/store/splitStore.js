import { create } from 'zustand';
import  splitService  from '../services/SplitServices';
import useAuthStore from './authStore';

const useSplitStore = create((set, get) => ({
  // State
  allSplits: [],          // For Overview page (all users)
  mySplits: [],           // For My Splitz page (logged-in user only)
  isLoading: false,
  error: null,
  
  // Actions
  setAllSplits: (splits) => set({ allSplits: splits }),
  setMySplits: (splits) => set({ mySplits: splits }),
  
  // Fetch all splits (for Overview page)
  fetchAllSplits: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await splitService.getSplits();
      set({ allSplits: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  // Fetch user's splits (for My Splitz page)
  fetchMySplits: async () => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;
    
    set({ isLoading: true, error: null });
    try {
      const data = await splitService.getMySplits();
      set({ mySplits: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  // Create new split (with real-time updates)
  createSplit: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const newSplit = await splitService.createSplit(formData);
      const user = useAuthStore.getState().user;
      
      // Update both allSplits and mySplits immediately
      set((state) => ({
        allSplits: [newSplit, ...state.allSplits],
        mySplits: user?.id === newSplit.creator?.id 
          ? [newSplit, ...state.mySplits] 
          : state.mySplits,
        isLoading: false
      }));
      
      return newSplit;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // Join a split
  joinSplit: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const result = await splitService.joinSplit(id);
      
      // Update the split in both arrays
      set((state) => ({
        allSplits: state.allSplits.map(split => 
          split.id === id 
            ? { ...split, participants: [...(split.participants || []), result.participant] }
            : split
        ),
        mySplits: state.mySplits.map(split => 
          split.id === id 
            ? { ...split, participants: [...(split.participants || []), result.participant] }
            : split
        ),
        isLoading: false
      }));
      
      return result;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // Clear errors
  clearError: () => set({ error: null }),
}));

export default useSplitStore;