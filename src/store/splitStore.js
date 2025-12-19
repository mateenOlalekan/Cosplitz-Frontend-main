// stores/splitStore.js
import { create } from 'zustand';

const useSplitStore = create((set) => ({
  splits: [],
  cardedSplits: [],
  currentSplit: null,
  isLoading: false,
  error: null,

  // Actions
  setSplits: (splits) => set({ splits }),
  
  setCardedSplits: (splits) => set({ cardedSplits: splits }),
  
  addSplit: (split) => 
    set((state) => ({ 
      splits: [split, ...state.splits],
      cardedSplits: split.split_method === 'SpecificAmounts' 
        ? [split, ...state.cardedSplits] 
        : state.cardedSplits 
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
      currentSplit: state.currentSplit?.id === id 
        ? { ...state.currentSplit, ...splitData }
        : state.currentSplit,
    })),

  removeSplit: (id) =>
    set((state) => ({
      splits: state.splits.filter(split => split.id !== id),
      cardedSplits: state.cardedSplits.filter(split => split.id !== id),
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
      currentSplit: state.currentSplit?.id === splitId
        ? {
            ...state.currentSplit,
            participants: [...(state.currentSplit.participants || []), participant],
          }
        : state.currentSplit,
    })),
}));

export default useSplitStore;