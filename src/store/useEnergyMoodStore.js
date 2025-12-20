import { create } from 'zustand';

const useEnergyMoodStore = create((set, get) => ({
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
    const hour = new Date().getHours(); // Use new Date() for current time if not passed in
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
          "Greek yogurt with berries (protein + quick energy)",
          "Apple with almond butter (slow-release energy)",
          "Hard-boiled eggs (sustained protein)",
          "Banana with handful of nuts (potassium + healthy fats)"
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
          "Hummus with veggies (sustained energy)",
          "Trail mix with dark chocolate (magnesium boost)",
          "Cheese and whole grain crackers (protein + complex carbs)",
          "Smoothie with protein powder (easy to digest)"
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
          "Cottage cheese with pineapple (protein + energy)",
          "Turkey roll-ups with avocado (lean protein + healthy fat)",
          "Oatmeal with nuts (sustained release)",
          "Protein bar with <5g sugar"
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
          "Salmon with leafy greens (omega-3 for brain function)",
          "Blueberries with almonds (antioxidants + focus)",
          "Green tea + dark chocolate (L-theanine + polyphenols)",
          "Chicken breast with quinoa (complete protein + energy)"
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
          "Smoked salmon on whole grain (brain-boosting omega-3)",
          "Matcha latte with MCT oil (sustained focus)",
          "Beet juice + walnuts (nitric oxide + DHA)",
          "Steak with sweet potato (iron + stable glucose)"
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
          "Protein smoothie (maintain the momentum)",
          "Mixed berries with Greek yogurt (antioxidants)",
          "Energy balls (dates, nuts, cacao)",
          "Green juice with ginger (sustained vitality)"
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
          "Blueberries (improve cognitive function)",
          "Dark chocolate 70%+ (flavonoids for focus)",
          "Walnuts (omega-3 for sustained attention)",
          "Green tea with honey (L-theanine + stable energy)"
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
          "Chamomile tea with honey (maintain calm)",
          "Avocado toast (healthy fats for sustained calm)",
          "Warm oatmeal with cinnamon (grounding)",
          "Sliced pear with cheese (balanced satisfaction)"
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
          "Tart cherry juice (melatonin, aids rest)",
          "Banana with almond butter (tryptophan + magnesium)",
          "Whole grain toast with turkey (sleep-promoting)",
          "Warm milk with honey (traditional rest aid)"
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
          "Complex carbs (whole grain) - serotonin boost",
          "Chamomile or lavender tea (calming compounds)",
          "Dark leafy greens (magnesium for relaxation)",
          "Pumpkin seeds (zinc for anxiety reduction)"
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
          "Comfort food that nourishes: soup, oatmeal",
          "Herbal tea (lemon balm, passionflower)",
          "Dark chocolate (proven mood elevator)",
          "Whatever you can manage - no judgment"
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
        snacks: ["Whatever brings comfort - no rules today", "Warm soup", "Herbal tea", "Dark chocolate"],
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
}));

export default useEnergyMoodStore;