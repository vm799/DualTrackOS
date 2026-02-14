import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * NDM Store - Non-Negotiables Daily Manager
 *
 * Tracks the 4 daily non-negotiables:
 * - Nutrition: Protein-rich breakfast
 * - Movement: HIIT/exercise session
 * - Mindfulness: Meditation/breathing practice
 * - Brain Dump: Thought capture/planning
 */
const useNDMStore = create(
  persist(
    (set) => ({
  // State
  ndm: {
    nutrition: false,
    movement: false,
    mindfulness: false,
    brainDump: false
  },

  // Actions - Individual setters
  setNutrition: (value) => set((state) => ({
    ndm: { ...state.ndm, nutrition: value }
  })),

  setMovement: (value) => set((state) => ({
    ndm: { ...state.ndm, movement: value }
  })),

  setMindfulness: (value) => set((state) => ({
    ndm: { ...state.ndm, mindfulness: value }
  })),

  setBrainDump: (value) => set((state) => ({
    ndm: { ...state.ndm, brainDump: value }
  })),

  // Bulk update
  updateNDM: (updates) => set((state) => ({
    ndm: { ...state.ndm, ...updates }
  })),

  // Reset all (called at midnight)
  resetNDM: () => set({
    ndm: {
      nutrition: false,
      movement: false,
      mindfulness: false,
      brainDump: false
    }
  }),

  // Helper to get completion count
  getCompletionCount: () => {
    const state = useNDMStore.getState();
    return [
      state.ndm.nutrition,
      state.ndm.movement,
      state.ndm.mindfulness,
      state.ndm.brainDump
    ].filter(Boolean).length;
  }
    }),
    {
      name: 'dualtrack-ndm',
      partialize: (state) => ({
        ndm: state.ndm,
      }),
    }
  )
);

export default useNDMStore;
