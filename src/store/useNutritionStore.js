import { create } from 'zustand';
import useStore from './useStore'; // For userProfile.weight

const useNutritionStore = create((set, get) => ({
  // State
  meals: [],
  proteinToday: 0,

  // Dairy-Free Protein Vault - Static Data
  proteinVault: [
    { name: 'Big Bowl (Salmon/Chicken)', protein: 45, type: 'main', details: '150g Smoked Salmon/Chicken + 2 Eggs + Avocado + Spinach', isHighLeucine: true },
    { name: 'Liquid Gold (Pea/Soy)', protein: 35, type: 'liquid', details: '1.5 scoops Isolate + 250ml Soy Milk', isHighLeucine: true },
    { name: 'Tofu Block Party', protein: 36, type: 'main', details: '200g Extra Firm Tofu (Marinated)', isHighLeucine: true },
    { name: 'Egg White Scramble', protein: 25, type: 'snack', details: '200g Egg Whites + Veggies', isHighLeucine: true },
    { name: 'Edamame/Lupini Snack', protein: 15, type: 'snack', details: '1 cup shelled Edamame or Lupini Beans', isHighLeucine: false },
    { name: 'Tempeh Stir-fry', protein: 30, type: 'main', details: '150g Tempeh + Broccoli', isHighLeucine: true },
    { name: 'Lentil Soup + Hemp', protein: 20, type: 'main', details: '1 cup Lentils + 3 tbsp Hemp Seeds', isHighLeucine: false },
    { name: 'Seitan Strips', protein: 45, type: 'main', details: '150g Seitan (Wheat Meat)', isHighLeucine: true }, // NOTE: Seitan is low in Lysine, but high protein
    { name: 'Pumpkin Seed Sprinkle', protein: 10, type: 'topping', details: '30g Pumpkin Seeds', isHighLeucine: false },
    { name: 'Nutritional Yeast Bomb', protein: 8, type: 'topping', details: '2 tbsp Nutritional Yeast', isHighLeucine: false }
  ],

  // Actions
  setMeals: (meals) => set({ meals }),
  setProteinToday: (protein) => set({ proteinToday: protein }),

  addMeal: (name, protein, isHighLeucine = false) => {
    set((state) => ({
      meals: [...state.meals, {
        id: Date.now(),
        name,
        protein,
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        isHighLeucine
      }],
      proteinToday: state.proteinToday + protein
    }));
  },

  addFoodFromModal: (foodItem) => {
    // foodItem comes from the vault or manual entry
    // expecting object { name, protein, isHighLeucine }
    set((state) => ({
      meals: [...state.meals, {
        id: Date.now(),
        name: foodItem.name,
        protein: foodItem.protein,
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        isHighLeucine: !!foodItem.isHighLeucine
      }],
      proteinToday: state.proteinToday + foodItem.protein
    }));
  },

  // Direct add for simple counter
  addProtein: (amount) => {
    set((state) => ({
      proteinToday: state.proteinToday + amount
    }));
  },

  // Getters
  getProteinTarget: () => {
    // Force constant 135g floor for perimenopause muscle synthesis
    return 135;
  },

  // Check for Leucine deficiency in last main meal (heuristic)
  checkLeucineStatus: () => {
    const { meals } = get();
    if (meals.length === 0) return 'neutral';

    // Check the most recent meal over 20g protein
    const lastBigMeal = [...meals].reverse().find(m => m.protein >= 20);

    if (lastBigMeal && !lastBigMeal.isHighLeucine) {
      return 'warning'; // Alert: "Missing Leucine trigger?"
    }
    return 'good';
  }
}));

export default useNutritionStore;
