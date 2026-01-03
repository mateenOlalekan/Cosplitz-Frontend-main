import { create } from 'zustand';

const useSplitStore = create((set, get) => ({
  splits: [],
  cardedSplits: [],
  mySplits: [],
  currentSplit: null,
  isLoading: false,
  error: null,

  // Actions
  setSplits: (splits) => set({ splits }),
  
  setCardedSplits: (splits) => set({ cardedSplits: splits }),
  
  setMySplits: (splits) => set({ mySplits: splits }),
  
  addSplit: (split) => 
    set((state) => ({ 
      splits: [split, ...state.splits],
      mySplits: [split, ...state.mySplits],
      cardedSplits: [split, ...state.cardedSplits]
    })),
  
  addToCardedSplits: (split) => 
    set((state) => ({ 
      cardedSplits: [split, ...state.cardedSplits] 
    })),

  updateSplit: (id, splitData) =>
    set((state) => ({
      splits: state.splits.map(split =>
        split.id === id ? { ...split, ...splitData } : split
      ),
      cardedSplits: state.cardedSplits.map(split =>
        split.id === id ? { ...split, ...splitData } : split
      ),
      mySplits: state.mySplits.map(split =>
        split.id === id ? { ...split, ...splitData } : split
      ),
      currentSplit: state.currentSplit?.id === id 
        ? { ...state.currentSplit, ...splitData }
        : state.currentSplit,
    })),

  removeSplit: (id) =>
    set((state) => ({
      splits: state.splits.filter(split => split.id !== id),
      cardedSplits: state.cardedSplits.filter(split => split.id !== id),
      mySplits: state.mySplits.filter(split => split.id !== id),
      currentSplit: state.currentSplit?.id === id ? null : state.currentSplit,
    })),

  setCurrentSplit: (split) => set({ currentSplit: split }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  addParticipant: (splitId, participant) =>
    set((state) => ({
      splits: state.splits.map(split =>
        split.id === splitId
          ? {
              ...split,
              participants: [...(split.participants || []), participant],
            }
          : split
      ),
      cardedSplits: state.cardedSplits.map(split =>
        split.id === splitId
          ? {
              ...split,
              participants: [...(split.participants || []), participant],
            }
          : split
      ),
      currentSplit: state.currentSplit?.id === splitId
        ? {
            ...state.currentSplit,
            participants: [...(state.currentSplit.participants || []), participant],
          }
        : state.currentSplit,
    })),

  // Load all splits
  loadSplits: async () => {
    set({ isLoading: true });
    try {
      const splits = await get().fetchAllSplits();
      set({ splits, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Load my splits
  loadMySplits: async () => {
    set({ isLoading: true });
    try {
      const mySplits = await get().fetchMySplits();
      set({ mySplits, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Fetch all splits (internal)
  fetchAllSplits: async () => {
    const { splitService } = await import('../services/splitService');
    return await splitService.getSplits();
  },

  // Fetch my splits (internal)
  fetchMySplits: async () => {
    const { splitService } = await import('../services/splitService');
    return await splitService.getMySplits();
  },
}));

export default useSplitStore;