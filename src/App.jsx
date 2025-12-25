/**
 * DualTrack OS - Main Application Entry Point
 *
 * Single Responsibility: Application initialization and routing
 *
 * Architecture:
 * - Auth initialization delegated to useAuthInitialization hook
 * - Data persistence delegated to useDataPersistence hook
 * - Routing delegated to AppRouter component
 * - State management handled by Zustand stores
 * - UI components organized by feature
 *
 * This file should remain small (<50 lines) and focused only on:
 * 1. Initializing app-level concerns (auth, persistence)
 * 2. Rendering the router
 *
 * All business logic belongs in hooks, stores, or components.
 */

import React from 'react';
import AppRouter from './Router';
import ErrorBoundary from './components/ErrorBoundary';
import OnboardingTour from './components/OnboardingTour';
import useStore from './store/useStore';
import { useAuthInitialization } from './hooks/useAuthInitialization';
import { useDataPersistence } from './hooks/useDataPersistence';

const DualTrackOS = () => {
  // Initialize authentication and load user data
  useAuthInitialization();

  // Auto-save data to localStorage and Supabase
  useDataPersistence();

  // Get dark mode state for onboarding tour
  const darkMode = useStore((state) => state.darkMode);

  // Render the application wrapped in Error Boundary for production error handling
  return (
    <ErrorBoundary>
      <OnboardingTour
        darkMode={darkMode}
        onComplete={() => console.log('Onboarding tour completed!')}
      />
      <AppRouter />
    </ErrorBoundary>
  );
};

export default DualTrackOS;
