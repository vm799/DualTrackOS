import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCycleStore = create(
  persist(
    (set, get) => ({
      // State
      cycleStart: null, // ISO string
      cycleDay: 1, // 1-28+
      cycleLength: 28, 
      
      // Actions
      setCycleStart: (date) => {
        const start = new Date(date);
        const today = new Date();
        // Calculate difference in days
        const diffTime = Math.abs(today - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        set({ 
          cycleStart: start.toISOString(),
          cycleDay: diffDays 
        });
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

      // Logic: Perimenopausal / Mojo Specifics
      getPhase: () => {
        const day = get().cycleDay;
         // Day 1-14 Follicular (Power), 15-28 Luteal (Gentle)
        if (day <= 14) return 'Follicular';
        return 'Luteal';
      },

      getMojoMode: () => {
        const phase = get().getPhase();
        if (phase === 'Follicular') return 'Power/PR';
        return 'Gentle/Mobility';
      },
      
      getRecommendations: () => {
        const mode = get().getMojoMode();
        if (mode === 'Power/PR') {
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
