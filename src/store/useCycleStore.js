import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCycleStore = create(
  persist(
    (set, get) => ({
      // State
      cycleStart: null, // ISO string - when last period started
      cycleDay: 1, // 1-28+
      cycleLength: 28,
      lastPeriodDate: null, // ISO string - alias used by CycleTracker component

      // Actions
      setCycleStart: (date) => {
        const start = new Date(date);
        const today = new Date();
        const diffTime = Math.abs(today - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        set({
          cycleStart: start.toISOString(),
          lastPeriodDate: start.toISOString(),
          cycleDay: diffDays
        });
      },

      // Set last period date (used by CycleTracker setup form)
      setLastPeriodDate: (dateStr) => {
        const start = new Date(dateStr);
        const today = new Date();
        const diffTime = today - start;
        let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
        const cycleLength = get().cycleLength;

        // Normalize to cycle
        if (diffDays > cycleLength) {
          diffDays = ((diffDays - 1) % cycleLength) + 1;
        }
        if (diffDays < 1) diffDays = 1;

        set({
          cycleStart: start.toISOString(),
          lastPeriodDate: start.toISOString(),
          cycleDay: diffDays
        });
      },

      // Set cycle day directly (user can type "I'm on day X")
      setCycleDay: (day) => {
        const d = Math.max(1, Math.min(day, get().cycleLength));
        set({ cycleDay: d });
      },

      setCycleLength: (length) => set({ cycleLength: length }),

      updateCycleDay: () => {
        const { cycleStart, cycleLength } = get();
        if (!cycleStart) return;

        const start = new Date(cycleStart);
        const today = new Date();
        const diffTime = today - start;
        let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

        // Normalize
        if (diffDays > cycleLength) {
          diffDays = ((diffDays - 1) % cycleLength) + 1;
        }

        set({ cycleDay: diffDays });
      },

      // 4-phase model for richer recommendations
      getPhase: () => {
        const day = get().cycleDay;
        if (day <= 5) return 'Menstrual';
        if (day <= 14) return 'Follicular';
        if (day <= 17) return 'Ovulatory';
        return 'Luteal';
      },

      getMojoMode: () => {
        const phase = get().getPhase();
        if (phase === 'Menstrual') return 'Gentle/Recovery';
        if (phase === 'Follicular') return 'Power/PR';
        if (phase === 'Ovulatory') return 'Peak/Social';
        return 'Gentle/Mobility';
      },

      // Phase info with emoji, color, description, energy level
      getPhaseInfo: () => {
        const phase = get().getPhase();
        const day = get().cycleDay;

        const phases = {
          Menstrual: {
            emoji: '🌑',
            name: 'Menstrual',
            description: 'Rest & restore — honour your body',
            energyLevel: 2,
            color: 'red',
            dayRange: '1-5'
          },
          Follicular: {
            emoji: '🌱',
            name: 'Follicular',
            description: 'Rising energy — build & create',
            energyLevel: 4,
            color: 'green',
            dayRange: '6-14'
          },
          Ovulatory: {
            emoji: '🌕',
            name: 'Ovulatory',
            description: 'Peak power — social & strength',
            energyLevel: 5,
            color: 'yellow',
            dayRange: '15-17'
          },
          Luteal: {
            emoji: '🍂',
            name: 'Luteal',
            description: 'Wind down — detail work & nesting',
            energyLevel: 3,
            color: 'purple',
            dayRange: '18-28'
          }
        };

        return phases[phase] || phases.Follicular;
      },

      // Workout recommendations based on phase
      getWorkoutRecommendations: () => {
        const phase = get().getPhase();

        const workouts = {
          Menstrual: [
            { type: 'Gentle Yoga', duration: '20-30 min', emoji: '🧘', intensity: 'low' },
            { type: 'Walking', duration: '20-40 min', emoji: '🚶‍♀️', intensity: 'low' },
            { type: 'Stretching / Foam Rolling', duration: '15-20 min', emoji: '🦁', intensity: 'low' },
          ],
          Follicular: [
            { type: 'Heavy Lifting', duration: '45-60 min', emoji: '🏋️‍♀️', intensity: 'high' },
            { type: 'HIIT / Sprints', duration: '20-30 min', emoji: '🏃‍♀️', intensity: 'peak' },
            { type: 'Complex Movements', duration: '30-45 min', emoji: '🧗', intensity: 'high' },
            { type: 'Try New Activities', duration: '30-60 min', emoji: '💃', intensity: 'medium' },
          ],
          Ovulatory: [
            { type: 'PR Attempts', duration: '45-60 min', emoji: '🏆', intensity: 'peak' },
            { type: 'Group Classes / Sports', duration: '45-60 min', emoji: '🤸‍♀️', intensity: 'peak' },
            { type: 'High-Intensity Cardio', duration: '30-40 min', emoji: '🔥', intensity: 'high' },
            { type: 'Social Workouts', duration: '30-60 min', emoji: '👯‍♀️', intensity: 'high' },
          ],
          Luteal: [
            { type: 'Pilates', duration: '30-45 min', emoji: '🧘', intensity: 'medium' },
            { type: 'Moderate Strength', duration: '30-45 min', emoji: '💪', intensity: 'medium' },
            { type: 'Swimming / Walking', duration: '30-45 min', emoji: '🏊‍♀️', intensity: 'low' },
            { type: 'Restorative Yoga', duration: '20-30 min', emoji: '🧠', intensity: 'low' },
          ],
        };

        return workouts[phase] || workouts.Follicular;
      },

      // Nutrition recommendations based on phase
      getNutritionRecommendations: () => {
        const phase = get().getPhase();

        const nutrition = {
          Menstrual: {
            proteinTarget: 1.0,
            focus: 'Anti-inflammatory & Iron-Rich Foods',
            foods: [
              { name: 'Red meat / liver', emoji: '🥩', benefit: 'Replenish iron stores' },
              { name: 'Dark leafy greens', emoji: '🥬', benefit: 'Iron + magnesium' },
              { name: 'Dark chocolate', emoji: '🍫', benefit: 'Magnesium + mood support' },
              { name: 'Turmeric / ginger tea', emoji: '🍵', benefit: 'Anti-inflammatory' },
            ],
            avoid: ['Excess caffeine', 'Alcohol', 'High-sodium foods', 'Refined sugar'],
          },
          Follicular: {
            proteinTarget: 1.2,
            focus: 'Building & Energy Foods',
            foods: [
              { name: 'Eggs', emoji: '🥚', benefit: 'Complete protein + choline' },
              { name: 'Fermented foods (kimchi, sauerkraut)', emoji: '🥗', benefit: 'Gut health + estrogen metabolism' },
              { name: 'Lean protein (chicken, fish)', emoji: '🍗', benefit: 'Muscle building' },
              { name: 'Sprouted grains & seeds', emoji: '🌾', benefit: 'Phytoestrogen balance' },
            ],
            avoid: ['Heavy processed foods', 'Excess dairy'],
          },
          Ovulatory: {
            proteinTarget: 1.2,
            focus: 'Light & Antioxidant-Rich Foods',
            foods: [
              { name: 'Berries', emoji: '🫐', benefit: 'Antioxidants for peak performance' },
              { name: 'Salmon / omega-3 fish', emoji: '🐟', benefit: 'Anti-inflammatory + brain fuel' },
              { name: 'Raw veggies & salads', emoji: '🥒', benefit: 'Light energy, easy digestion' },
              { name: 'Quinoa', emoji: '🍚', benefit: 'Complete plant protein' },
            ],
            avoid: ['Heavy carbs', 'Fried foods'],
          },
          Luteal: {
            proteinTarget: 1.0,
            focus: 'Serotonin & Magnesium-Rich Foods',
            foods: [
              { name: 'Sweet potatoes', emoji: '🍠', benefit: 'Complex carbs for serotonin' },
              { name: 'Dark chocolate', emoji: '🍫', benefit: 'Magnesium + cravings support' },
              { name: 'Pumpkin seeds', emoji: '🎃', benefit: 'Zinc + magnesium' },
              { name: 'Turkey / tryptophan-rich', emoji: '🦃', benefit: 'Sleep + mood support' },
            ],
            avoid: ['Excess salt', 'Caffeine after noon', 'Alcohol', 'Refined sugar'],
          },
        };

        return nutrition[phase] || nutrition.Follicular;
      },

      // Phase-specific tip/wisdom
      getPhaseTip: () => {
        const phase = get().getPhase();
        const day = get().cycleDay;

        const tips = {
          Menstrual: [
            'Your body is doing incredible work right now. Rest is not laziness — it is recovery.',
            'This is your inner winter. Slow down, reflect, and let your body reset.',
            'Iron-rich foods and gentle movement are your best friends this week.',
          ],
          Follicular: [
            'Estrogen is rising — your brain is primed for learning new skills and tackling hard problems.',
            'This is your power phase! Push for PRs, start new projects, and take on challenges.',
            'Your pain tolerance is higher now. Perfect time for intense training.',
          ],
          Ovulatory: [
            'You are at your communicative and social peak. Schedule important meetings and pitches now.',
            'Energy is at its highest — capitalize on this window for your biggest goals.',
            'Your body temperature rises slightly. Stay hydrated and fuel performance.',
          ],
          Luteal: [
            'Progesterone is dominant. You may crave carbs — choose complex ones for steady energy.',
            'Detail-oriented work suits this phase. Editing, organizing, and planning thrive now.',
            'Be patient with yourself. PMS symptoms peak in the late luteal phase — magnesium helps.',
          ],
        };

        const phaseTips = tips[phase] || tips.Follicular;
        // Rotate tip based on day
        return phaseTips[day % phaseTips.length];
      },

      // Days until next phase
      getDaysUntilNextPhase: () => {
        const day = get().cycleDay;
        const cycleLength = get().cycleLength;

        if (day <= 5) {
          return { nextPhase: 'Follicular', days: 6 - day };
        }
        if (day <= 14) {
          return { nextPhase: 'Ovulatory', days: 15 - day };
        }
        if (day <= 17) {
          return { nextPhase: 'Luteal', days: 18 - day };
        }
        return { nextPhase: 'Menstrual (New Cycle)', days: cycleLength - day + 1 };
      },

      // Legacy method used by CycleSyncWidget
      getRecommendations: () => {
        const mode = get().getMojoMode();
        if (mode === 'Power/PR' || mode === 'Peak/Social') {
          return [
            '🏋️‍♀️ Heavy Lifting',
            '🏃‍♀️ HIIT / Sprints',
            '🧗 Complex Movements',
            '💃 Social Events'
          ];
        } else {
          return [
            '🧘 Yoga / Pilates',
            '🚶‍♀️ Walking / Nature',
            '🦁 Fascia Stretching',
            '🧠 Deep Work / Reflection'
          ];
        }
      }
    }),
    {
      name: 'dualtrack-cycle-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useCycleStore;
