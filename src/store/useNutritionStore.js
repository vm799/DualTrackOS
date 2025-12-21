import { create } from 'zustand';
import useStore from './useStore'; // For userProfile.weight

const useNutritionStore = create((set, get) => ({
  // State
  meals: [],
  proteinToday: 0,

  // Actions
  setMeals: (meals) => set({ meals }),
  setProteinToday: (protein) => set({ proteinToday: protein }),

  addMeal: (name, protein) => {
    set((state) => ({
      meals: [...state.meals, { id: Date.now(), name, protein, time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) }],
      proteinToday: state.proteinToday + protein
    }));
  },

  addFoodFromModal: (foodName) => {
    set((state) => ({
      meals: [...state.meals, { id: Date.now(), name: foodName, protein: 0, time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) }],
      // Optional: Mark nutrition NDM as complete (this would be an action on the NDM store)
    }));
  },

  addProtein: (amount) => {
    set((state) => ({
      proteinToday: state.proteinToday + amount
    }));
  },

  // Getters
  getProteinTarget: () => {
    // Access userProfile from the main store
    const userProfile = useStore.getState().userProfile;
    if (!userProfile.weight) return 120; // Default if no weight set
    return Math.round(userProfile.weight * 0.9); // 0.9g per lb as middle ground
  },
}));

export default useNutritionStore;
