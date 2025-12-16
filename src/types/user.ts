/**
 * User-related type definitions
 */

export interface UserProfile {
  name: string;
  preferredName: string;
  initials: string;
  age: number | null;
  weight: number | null; // in lbs, for protein calculation
  avatar: string;
  hasCompletedOnboarding: boolean;
  disclaimerAccepted: boolean;
}

export interface EnergyTracking {
  morning: number | null;    // 1-5 scale
  afternoon: number | null;  // 1-5 scale
  evening: number | null;    // 1-5 scale
}

export type MoodType =
  | 'energized'
  | 'focused'
  | 'calm'
  | 'tired'
  | 'anxious'
  | 'overwhelmed'
  | null;
