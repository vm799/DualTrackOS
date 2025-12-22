import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPageView from './pages/LandingPage';
import StoryPageView from './pages/StoryPage';
import OnboardingPage from './pages/OnboardingPage';
import Dashboard from './pages/Dashboard';
import HormonalHealthPage from './pages/HormonalHealthPage';
import SettingsPage from './pages/SettingsPage';
import PricingPage from './pages/PricingPage';
import useStore from './store/useStore';

const AppRouter = () => {
  const darkMode = useStore((state) => state.darkMode);
  const userProfile = useStore((state) => state.userProfile);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPageView darkMode={darkMode} />} />
        <Route path="/story" element={<StoryPageView darkMode={darkMode} />} />
        <Route
          path="/onboarding"
          element={
            userProfile.hasCompletedOnboarding ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <OnboardingPage darkMode={darkMode} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            userProfile.hasCompletedOnboarding ? (
              <Dashboard />
            ) : (
              <Navigate to="/onboarding" replace />
            )
          }
        />
        <Route
          path="/hormonal-health"
          element={
            userProfile.hasCompletedOnboarding ? (
              <HormonalHealthPage />
            ) : (
              <Navigate to="/onboarding" replace />
            )
          }
        />
        <Route
          path="/progress"
          element={
            userProfile.hasCompletedOnboarding ? (
              <Dashboard />
            ) : (
              <Navigate to="/onboarding" replace />
            )
          }
        />
        <Route
          path="/settings"
          element={<SettingsPage />}
        />
        <Route
          path="/pricing"
          element={<PricingPage />}
        />
        {/* Add more routes here as we break down App.jsx */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;

