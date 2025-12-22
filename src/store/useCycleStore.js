import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Cycle Tracking Store
 * Manages women's health cycle data and provides phase-specific recommendations
 */
const useCycleStore = create(
  persist(
    (set, get) => ({
      // Core Data
      cycleDay: null, // Current day in cycle (1-28+)
      lastPeriodDate: null, // Date of last period start
      cycleLength: 28, // Average cycle length
      periodLength: 5, // Average period length

      // Symptom Tracking
      symptoms: {
        cramps: 0, // 0-5 scale
        bloating: 0,
        moodSwings: 0,
        energyLevel: 3, // 1-5 scale
        flow: 'none', // none, light, medium, heavy
      },

      // Actions
      setLastPeriodDate: (date) => {
        const today = new Date();
        const lastPeriod = new Date(date);
        const diffTime = Math.abs(today - lastPeriod);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        set({
          lastPeriodDate: date,
          cycleDay: diffDays + 1,
        });
      },

      setCycleLength: (length) => set({ cycleLength: length }),
      setPeriodLength: (length) => set({ periodLength: length }),

      updateSymptoms: (symptomData) => set((state) => ({
        symptoms: { ...state.symptoms, ...symptomData }
      })),

      // Calculate current phase based on cycle day
      getCurrentPhase: () => {
        const { cycleDay, periodLength } = get();

        if (!cycleDay) return null;

        if (cycleDay <= periodLength) {
          return 'menstrual';
        } else if (cycleDay <= 14) {
          return 'follicular';
        } else if (cycleDay <= 16) {
          return 'ovulation';
        } else {
          return 'luteal';
        }
      },

      // Get phase display info
      getPhaseInfo: () => {
        const phase = get().getCurrentPhase();
        const { cycleDay } = get();

        const phaseData = {
          menstrual: {
            name: 'Menstrual',
            emoji: '🌙',
            color: 'red',
            energyLevel: 2,
            description: 'Rest & Recovery',
            days: '1-5',
          },
          follicular: {
            name: 'Follicular',
            emoji: '🌱',
            color: 'green',
            energyLevel: 4,
            description: 'Build Strength',
            days: '6-14',
          },
          ovulation: {
            name: 'Ovulation',
            emoji: '⚡',
            color: 'yellow',
            energyLevel: 5,
            description: 'Peak Performance',
            days: '14-16',
          },
          luteal: {
            name: 'Luteal',
            emoji: '🌸',
            color: 'purple',
            energyLevel: cycleDay > 23 ? 2 : 3,
            description: cycleDay > 23 ? 'PMS - Be Gentle' : 'Maintain & Listen',
            days: '17-28',
          },
        };

        return phaseData[phase] || null;
      },

      // Get workout recommendations
      getWorkoutRecommendations: () => {
        const phase = get().getCurrentPhase();
        const { cycleDay } = get();

        const recommendations = {
          menstrual: [
            { type: 'Gentle Yoga', duration: '20-30 min', intensity: 'low', emoji: '🧘' },
            { type: 'Light Walking', duration: '15-20 min', intensity: 'low', emoji: '🚶' },
            { type: 'Swimming', duration: '20 min', intensity: 'low', emoji: '🏊' },
          ],
          follicular: [
            { type: 'Strength Training', duration: '30-40 min', intensity: 'high', emoji: '🏋️' },
            { type: 'HIIT Workouts', duration: '20-30 min', intensity: 'high', emoji: '🔥' },
            { type: 'New Challenges', duration: '30-45 min', intensity: 'medium', emoji: '🧗' },
          ],
          ovulation: [
            { type: 'High-Intensity Training', duration: '40-50 min', intensity: 'peak', emoji: '💪' },
            { type: 'Heavy Lifting', duration: '45 min', intensity: 'peak', emoji: '🏋️‍♀️' },
            { type: 'Long Cardio', duration: '45-60 min', intensity: 'high', emoji: '🏃‍♀️' },
          ],
          luteal: cycleDay > 23 ? [
            { type: 'Walking', duration: '20 min', intensity: 'low', emoji: '🚶' },
            { type: 'Gentle Yoga', duration: '20-30 min', intensity: 'low', emoji: '🧘' },
            { type: 'Swimming', duration: '20 min', intensity: 'low', emoji: '🏊' },
          ] : [
            { type: 'Moderate Strength', duration: '30 min', intensity: 'medium', emoji: '🏋️' },
            { type: 'Steady Cardio', duration: '25-30 min', intensity: 'medium', emoji: '🏃' },
            { type: 'Yoga + Weights', duration: '30 min', intensity: 'medium', emoji: '🧘' },
          ],
        };

        return recommendations[phase] || [];
      },

      // Get nutrition recommendations
      getNutritionRecommendations: () => {
        const phase = get().getCurrentPhase();
        const { cycleDay } = get();

        const recommendations = {
          menstrual: {
            focus: 'Iron-rich foods, Anti-inflammatory, Hydration',
            proteinTarget: 0.8,
            foods: [
              { name: 'Spinach & Leafy Greens', benefit: 'Iron replenishment', emoji: '🥬' },
              { name: 'Salmon & Walnuts', benefit: 'Omega-3 anti-inflammatory', emoji: '🐟' },
              { name: 'Dark Chocolate', benefit: 'Magnesium for cramping', emoji: '🍫' },
              { name: 'Oranges & Berries', benefit: 'Vitamin C for iron absorption', emoji: '🍊' },
            ],
            avoid: ['Caffeine', 'High sodium', 'Processed sugar'],
          },
          follicular: {
            focus: 'Lean Protein, Complex Carbs, Fermented Foods',
            proteinTarget: 1.0,
            foods: [
              { name: 'Chicken & Turkey', benefit: 'Lean protein for muscle', emoji: '🍗' },
              { name: 'Quinoa & Sweet Potato', benefit: 'Complex carbs for energy', emoji: '🍠' },
              { name: 'Greek Yogurt & Kimchi', benefit: 'Probiotics for gut health', emoji: '🥛' },
              { name: 'Oysters & Chickpeas', benefit: 'Zinc for estrogen', emoji: '🦪' },
            ],
            avoid: [],
          },
          ovulation: {
            focus: 'Antioxidants, Fiber, Balanced Macros',
            proteinTarget: 1.2,
            foods: [
              { name: 'Berries & Dark Greens', benefit: 'Antioxidants for egg health', emoji: '🫐' },
              { name: 'Broccoli & Flaxseeds', benefit: 'Fiber for estrogen balance', emoji: '🥦' },
              { name: 'Avocado & Nuts', benefit: 'Healthy fats for hormones', emoji: '🥑' },
              { name: 'Eggs & Nutritional Yeast', benefit: 'B vitamins for energy', emoji: '🥚' },
            ],
            avoid: [],
          },
          luteal: cycleDay > 23 ? {
            focus: 'Magnesium, Calcium, Complex Carbs (PMS Support)',
            proteinTarget: 0.8,
            foods: [
              { name: 'Almonds & Sunflower Seeds', benefit: 'Magnesium & Vitamin E', emoji: '🌰' },
              { name: 'Brown Rice & Oats', benefit: 'Serotonin boost', emoji: '🍚' },
              { name: 'Bananas & Potatoes', benefit: 'B6 for PMS', emoji: '🍌' },
              { name: 'Dark Chocolate (70%+)', benefit: 'Craving management', emoji: '🍫' },
            ],
            avoid: ['Excess caffeine', 'Alcohol', 'High sodium'],
          } : {
            focus: 'Complex Carbs, B6, Magnesium',
            proteinTarget: 0.8,
            foods: [
              { name: 'Chicken & Potatoes', benefit: 'B6 for PMS prevention', emoji: '🍗' },
              { name: 'Bananas & Avocado', benefit: 'Magnesium support', emoji: '🍌' },
              { name: 'Brown Rice & Quinoa', benefit: 'Complex carbs for serotonin', emoji: '🍚' },
              { name: 'Greek Yogurt', benefit: 'Calcium (1200mg goal)', emoji: '🥛' },
            ],
            avoid: [],
          },
        };

        return recommendations[phase] || null;
      },

      // Get phase-specific tip
      getPhaseTip: () => {
        const phase = get().getCurrentPhase();
        const { cycleDay } = get();

        const tips = {
          menstrual: [
            '🌙 Be gentle with yourself. Rest is productive.',
            '💧 Stay hydrated - aim for 8-10 glasses of water.',
            '🔥 Use heat therapy for cramps - heating pad is your friend.',
            '😴 Aim for 8-9 hours of sleep tonight.',
          ],
          follicular: [
            '💪 Perfect time for that challenging workout!',
            '🎯 Schedule important meetings - your brain is sharp.',
            '🌟 Try something new - your energy supports it.',
            '📈 Set ambitious goals - you have the energy to chase them.',
          ],
          ovulation: [
            '⚡ Peak energy! Go for that personal record.',
            '🗣️ Schedule presentations - communication is at its best.',
            '💃 Social events will feel amazing right now.',
            '🏆 This is your power window - use it wisely.',
          ],
          luteal: cycleDay > 23 ? [
            '🌸 PMS week - be extra kind to yourself.',
            '🛋️ Cancel non-essential commitments guilt-free.',
            '🍫 Dark chocolate cravings? That\'s your body asking for magnesium.',
            '😌 Say "no" without guilt - self-care is priority.',
          ] : [
            '🌿 Energy is still good - maintain your routine.',
            '🥗 Start increasing magnesium-rich foods.',
            '🧘 Balance intensity with rest days.',
            '📝 Prepare for PMS week - stock up on comfort foods.',
          ],
        };

        const phaseTips = tips[phase] || [];
        return phaseTips[Math.floor(Math.random() * phaseTips.length)];
      },

      // Calculate days until next phase
      getDaysUntilNextPhase: () => {
        const { cycleDay, periodLength } = get();

        if (!cycleDay) return null;

        if (cycleDay <= periodLength) {
          return { nextPhase: 'Follicular', days: periodLength - cycleDay + 1 };
        } else if (cycleDay <= 14) {
          return { nextPhase: 'Ovulation', days: 14 - cycleDay + 1 };
        } else if (cycleDay <= 16) {
          return { nextPhase: 'Luteal', days: 17 - cycleDay };
        } else {
          // Days until next period
          const daysInCycle = get().cycleLength;
          return { nextPhase: 'Period', days: daysInCycle - cycleDay + 1 };
        }
      },
    }),
    {
      name: 'cycle-storage',
    }
  )
);

export default useCycleStore;
