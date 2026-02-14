import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useEnergyMoodStore = create(
  persist(
    (set, get) => ({
  // State
  energyTracking: { morning: null, afternoon: null, evening: null },
  currentMood: null, // e.g., 'energized', 'focused', 'calm', 'tired', 'anxious', 'overwhelmed'
  selectedEnergyActions: [], // Track completed energy suggestions
  selectedMoodActions: [],   // Track completed mood suggestions
  showEnergyModal: false,
  showMoodModal: false,

  // Actions
  setEnergyTracking: (tracking) => set({ energyTracking: tracking }),
  setCurrentMood: (mood) => set({ currentMood: mood }),
  setSelectedEnergyActions: (actions) => set({ selectedEnergyActions: actions }),
  setSelectedMoodActions: (actions) => set({ selectedMoodActions: actions }),
  setShowEnergyModal: (show) => set({ showEnergyModal: show }),
  setShowMoodModal: (show) => set({ showMoodModal: show }),

  // Derived state / getters (using get() for current state)
  getTimeOfDay: () => {
    const hour = new Date().getHours(); // Use new Date() for current time if not passed in
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    return 'evening';
  },

  getCurrentPeriodEnergy: () => {
    const period = get().getTimeOfDay();
    return get().energyTracking[period];
  },

  getCurrentEnergy: () => {
    const values = Object.values(get().energyTracking).filter(v => v !== null);
    if (values.length === 0) return 0;
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  },

  setCurrentEnergy: (level) => {
    const period = get().getTimeOfDay();
    set((state) => ({
      energyTracking: {
        ...state.energyTracking,
        [period]: level
      }
    }));
  },

  handleEnergyActionSelect: (action) => {
    set((state) => {
      if (!state.selectedEnergyActions.includes(action)) {
        return { selectedEnergyActions: [...state.selectedEnergyActions, action] };
      }
      return state;
    });
  },

  handleMoodActionSelect: (action) => {
    set((state) => {
      if (!state.selectedMoodActions.includes(action)) {
        return { selectedMoodActions: [...state.selectedMoodActions, action] };
      }
      return state;
    });
  },

  // Logic for suggestions (moved from App.old.jsx)
  getEnergyBasedSuggestions: (energyLevel) => {
    const energySuggestions = {
      1: {
        title: "Critical Rest Needed",
        message: "Your body is signaling depletion. Honor it with rest.",
        tasks: [
          "Take a 20-min power nap (proven to restore alertness)",
          "Go for a gentle 10-min walk (boosts endorphins without strain)",
          "Do 5 minutes of deep breathing (activates parasympathetic nervous system)",
          "Listen to calming music while resting",
        ],
        snacks: [
          { name: "Greek yogurt with berries", protein: 20, note: "protein + quick energy" },
          { name: "Apple with almond butter", protein: 4, note: "slow-release energy" },
          { name: "Hard-boiled eggs", protein: 12, note: "sustained protein" },
          { name: "Banana with handful of nuts", protein: 6, note: "potassium + healthy fats" }
        ],
        warning: "⚠️ Working through this exhaustion damages your health. Rest is not optional.",
        color: "rose"
      },
      2: {
        title: "Gentle Mode Active",
        message: "Low energy requires light tasks and self-nourishment.",
        tasks: [
          "Clear inbox (low cognitive load, feels productive)",
          "Organize one drawer or desktop folder",
          "Watch an educational video (passive learning)",
          "Journal for 10 minutes (therapeutic, no pressure)",
        ],
        snacks: [
          { name: "Hummus with veggies", protein: 8, note: "sustained energy" },
          { name: "Trail mix with dark chocolate", protein: 8, note: "magnesium boost" },
          { name: "Cheese and whole grain crackers", protein: 10, note: "protein + complex carbs" },
          { name: "Smoothie with protein powder", protein: 25, note: "easy to digest" }
        ],
        proteinPrompt: true,
        color: "purple"
      },
      3: {
        title: "Steady Progress Mode",
        message: "Perfect energy for consistent, sustainable work.",
        tasks: [
          "Routine meetings and check-ins",
          "Email responses and communication",
          "Project planning and organization",
          "Administrative tasks and documentation"
        ],
        snacks: [
          { name: "Cottage cheese with pineapple", protein: 22, note: "protein + energy" },
          { name: "Turkey roll-ups with avocado", protein: 15, note: "lean protein + healthy fat" },
          { name: "Oatmeal with nuts", protein: 10, note: "sustained release" },
          { name: "Protein bar", protein: 20, note: "<5g sugar" }
        ],
        color: "cyan"
      },
      4: {
        title: "Peak Performance Window",
        message: "Your cognitive peak! Tackle your hardest challenges now.",
        tasks: [
          "Complex problem-solving (prefrontal cortex at peak)",
          "Important negotiations or difficult conversations",
          "Creative work requiring deep thinking",
          "Strategic planning for major decisions"
        ],
        snacks: [
          { name: "Salmon with leafy greens", protein: 25, note: "omega-3 for brain function" },
          { name: "Blueberries with almonds", protein: 6, note: "antioxidants + focus" },
          { name: "Green tea + dark chocolate", protein: 2, note: "L-theanine + polyphenols" },
          { name: "Chicken breast with quinoa", protein: 35, note: "complete protein + energy" }
        ],
        warning: "⚡ Protect this energy! Minimize distractions, close unnecessary tabs.",
        color: "orange"
      },
      5: {
        title: "Flow State Activated",
        message: "You're in the zone! This is your superpower hour.",
        tasks: [
          "Your ONE most important task (deep work, 90-min block)",
          "High-stakes presentations or pitches",
          "Breakthrough creative work",
          "Learning new complex skills"
        ],
        snacks: [
          { name: "Smoked salmon on whole grain", protein: 20, note: "brain-boosting omega-3" },
          { name: "Matcha latte with MCT oil", protein: 6, note: "sustained focus" },
          { name: "Beet juice + walnuts", protein: 4, note: "nitric oxide + DHA" },
          { name: "Steak with sweet potato", protein: 40, note: "iron + stable glucose" }
        ],
        warning: "⚡ Protect this energy! Minimize distractions, close unnecessary tabs.",
        color: "yellow"
      }
    };
    return energySuggestions[energyLevel] || energySuggestions[3];
  },

  getMoodBasedWellness: (moodState) => {
    const moodWellness = {
      energized: {
        title: "Channel Your Energy Wisely",
        message: "Great mood! Direct this energy into meaningful action.",
        activities: [
          "Tackle a challenge you've been avoiding",
          "Connect with colleagues or friends (social energy peak)",
          "Start a new project or initiative",
          "Exercise (capitalize on natural motivation)"
        ],
        snacks: [
          { name: "Protein smoothie", protein: 25, note: "maintain the momentum" },
          { name: "Mixed berries with Greek yogurt", protein: 18, note: "antioxidants" },
          { name: "Energy balls", protein: 8, note: "dates, nuts, cacao" },
          { name: "Green juice with ginger", protein: 2, note: "sustained vitality" }
        ],
        color: "orange"
      },
      focused: {
        title: "Deep Work Opportunity",
        message: "Your attention is sharp. Protect this focused state.",
        activities: [
          "90-minute deep work block (no interruptions)",
          "Complex analytical work requiring concentration",
          "Learning or skill development",
          "Writing or detailed planning"
        ],
        snacks: [
          { name: "Blueberries", protein: 1, note: "improve cognitive function" },
          { name: "Dark chocolate 70%+", protein: 2, note: "flavonoids for focus" },
          { name: "Walnuts", protein: 4, note: "omega-3 for sustained attention" },
          { name: "Green tea with honey", protein: 0, note: "L-theanine + stable energy" }
        ],
        color: "blue"
      },
      calm: {
        title: "Reflective State",
        message: "Beautiful calm. Perfect for thoughtful, intentional work.",
        activities: [
          "Strategic thinking and big-picture planning",
          "Journaling or reflective writing",
          "Gentle yoga or stretching",
          "Meaningful conversations (listening mode)"
        ],
        snacks: [
          { name: "Chamomile tea with honey", protein: 0, note: "maintain calm" },
          { name: "Avocado toast", protein: 8, note: "healthy fats for sustained calm" },
          { name: "Warm oatmeal with cinnamon", protein: 6, note: "grounding" },
          { name: "Sliced pear with cheese", protein: 7, note: "balanced satisfaction" }
        ],
        color: "cyan"
      },
      tired: {
        title: "Rest & Recovery Mode",
        message: "Your body needs restoration. Self-care is your priority.",
        activities: [
          "20-minute power nap (research-proven restoration)",
          "Gentle walk in nature (cortisol reduction)",
          "Passive learning (podcast, audiobook)",
          "Light stretching or restorative yoga"
        ],
        snacks: [
          { name: "Tart cherry juice", protein: 1, note: "melatonin, aids rest" },
          { name: "Banana with almond butter", protein: 4, note: "tryptophan + magnesium" },
          { name: "Whole grain toast with turkey", protein: 12, note: "sleep-promoting" },
          { name: "Warm milk with honey", protein: 8, note: "traditional rest aid" }
        ],
        warning: "💤 Pushing through exhaustion backfires. Rest is productive.",
        color: "purple"
      },
      anxious: {
        title: "Grounding & Soothing",
        message: "Anxiety needs grounding. These activities calm your nervous system.",
        activities: [
          "Box breathing (4-4-4-4 proven to reduce cortisol)",
          "5-minute meditation or body scan",
          "Write down worries (externalization reduces rumination)",
          "Call a trusted friend (social support regulates nervous system)"
        ],
        snacks: [
          { name: "Complex carbs (whole grain)", protein: 6, note: "serotonin boost" },
          { name: "Chamomile or lavender tea", protein: 0, note: "calming compounds" },
          { name: "Dark leafy greens", protein: 3, note: "magnesium for relaxation" },
          { name: "Pumpkin seeds", protein: 9, note: "zinc for anxiety reduction" }
        ],
        supplement: "Consider: Magnesium glycinate, L-theanine, or ashwagandha (consult provider)",
        color: "blue"
      },
      overwhelmed: {
        title: "🌸 GENTLE MODE ACTIVATED",
        message: "You're doing too much. Simplify everything. Your only job: survive with grace.",
        activities: [
          "ONE tiny task only (build back confidence)",
          "10-minute walk outside (perspective shift)",
          "Brain dump all worries to paper (cognitive offload)",
          "Ask for help (vulnerability is strength)"
        ],
        snacks: [
          { name: "Comfort food that nourishes: soup, oatmeal", protein: 8, note: "gentle nourishment" },
          { name: "Herbal tea (lemon balm, passionflower)", protein: 0, note: "nervous system support" },
          { name: "Dark chocolate", protein: 2, note: "proven mood elevator" },
          { name: "Whatever you can manage", protein: 5, note: "no judgment" }
        ],
        warning: "🌸 PERMISSION TO PAUSE: Rest is not quitting. It's regrouping.",
        color: "rose"
      }
    };
    return moodWellness[moodState] || null;
  },

  getSmartSuggestions: () => {
    const energyLevel = get().getCurrentPeriodEnergy() || get().getCurrentEnergy() || 3;
    const mood = get().currentMood;

    const energySuggestion = get().getEnergyBasedSuggestions(energyLevel);
    const moodWellness = mood ? get().getMoodBasedWellness(mood) : null;

    if (energyLevel <= 2 && mood === 'overwhelmed') {
      return {
        message: "🌸 ULTIMATE GENTLE MODE: Rest is your only job today.",
        tasks: ["Take a bath or shower", "Nap for 20-30 minutes", "Watch comfort TV", "Order takeout (no cooking)"],
        snacks: [
          { name: "Whatever brings comfort", protein: 5, note: "no rules today" },
          { name: "Warm soup", protein: 10, note: "gentle nourishment" },
          { name: "Herbal tea", protein: 0, note: "calming ritual" },
          { name: "Dark chocolate", protein: 2, note: "mood support" }
        ],
        warning: "🌸 You are enough. Rest is productive. Healing takes time.",
        color: "rose",
        type: "crisis"
      };
    }

    return {
      ...energySuggestion,
      moodWellness: moodWellness,
      combinedMessage: mood && moodWellness ?
        `Energy: ${energySuggestion.title} | Mood: ${moodWellness.title}` :
        energySuggestion.title
    };
  },
    }),
    {
      name: 'dualtrack-energy-mood',
      partialize: (state) => ({
        energyTracking: state.energyTracking,
        currentMood: state.currentMood,
        selectedEnergyActions: state.selectedEnergyActions,
        selectedMoodActions: state.selectedMoodActions,
      }),
    }
  )
);

export default useEnergyMoodStore;