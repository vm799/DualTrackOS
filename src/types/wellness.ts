/**
 * Wellness system type definitions
 */

export type WellnessSnackType = 'exercise' | 'breathing' | 'hydration';

export type ExerciseType = 'squats' | 'calves' | 'stairs' | 'deadhang' | 'gorilla';

export type BreathingPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

export interface WellnessCompletion {
  type: WellnessSnackType;
  timestamp: Date;
  hour: number;
}

export interface ExerciseSnack {
  id: ExerciseType;
  name: string;
  icon: string;
  target: number;
  description: string;
}

export interface BoxBreathingState {
  totalElapsedMs: number;
  currentPhase: BreathingPhase;
  progress: number; // 0-1
  countdown: number; // 4,3,2,1
  cycleNumber: number; // 0-7
}
