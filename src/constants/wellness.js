/**
 * Wellness system constants for DualTrack OS
 */

// Exercise Target Reps
export const EXERCISE_TARGETS = {
  squats: 25,
  calves: 30,
  stairs: 3,
  deadhang: 60,
  gorilla: 20,
};

// Box Breathing Phases
export const WELLNESS_PHASES = ['inhale', 'hold1', 'exhale', 'hold2'];

// Box Breathing Instructions
export const BREATHING_INSTRUCTIONS = {
  inhale: "Breathe IN through nose",
  hold1: "HOLD your breath",
  exhale: "Breathe OUT through mouth",
  hold2: "HOLD, lungs empty"
};

// Box Breathing Animation Paths (SVG coordinates for 264x264 box)
export const BREATHING_BOX_PATHS = [
  { fromX: 32, fromY: 232, toX: 232, toY: 232 },  // inhale: bottom-left → bottom-right
  { fromX: 232, fromY: 232, toX: 232, toY: 32 },  // hold1: bottom-right → top-right
  { fromX: 232, fromY: 32, toX: 32, toY: 32 },    // exhale: top-right → top-left
  { fromX: 32, fromY: 32, toX: 32, toY: 232 }     // hold2: top-left → bottom-left
];

// Daily Metrics Targets
export const DAILY_TARGETS = {
  hydration: 8,      // 8 glasses of water
  movement: 4,       // 4 movement sessions
  focus: 4,          // 4 focus sessions (pomodoros)
  ndms: 4,           // 4 non-negotiables
};

// Spirit Animal Score Thresholds
export const SPIRIT_ANIMAL_STAGES = {
  egg: 0,           // 0-19%
  kit: 20,          // 20-39%
  youngFox: 40,     // 40-59%
  spiritFox: 60,    // 60-79%
  nineTailed: 80,   // 80-100%
};
