/**
 * Time-related constants for DualTrack OS
 */

// Pomodoro Timer
export const POMODORO_DURATION_MINUTES = 20;
export const POMODORO_DURATION_SECONDS = POMODORO_DURATION_MINUTES * 60;

// Active Hours (when wellness snacks are triggered)
export const ACTIVE_HOURS_START = 9;
export const ACTIVE_HOURS_END = 21;

// Box Breathing
export const BOX_BREATHING_CYCLES = 8;
export const BOX_BREATHING_PHASE_DURATION_SECONDS = 4;
export const BOX_BREATHING_PHASE_DURATION_MS = BOX_BREATHING_PHASE_DURATION_SECONDS * 1000;
export const BOX_BREATHING_CYCLE_DURATION_MS = BOX_BREATHING_PHASE_DURATION_MS * 4; // 4 phases per cycle
export const BOX_BREATHING_TOTAL_MS = BOX_BREATHING_CYCLES * BOX_BREATHING_CYCLE_DURATION_MS;

// Mindful Moment
export const MINDFUL_MOMENT_DURATION_SECONDS = 300; // 5 minutes

// Wellness Snack Snooze
export const WELLNESS_SNOOZE_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// Timer Update Intervals
export const CLOCK_UPDATE_INTERVAL_MS = 1000; // 1 second
export const BOX_BREATHING_UPDATE_INTERVAL_MS = 50; // 50ms for smooth animation (20 FPS)
