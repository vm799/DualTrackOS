import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPageView from './pages/LandingPage';
import StoryPageView from './pages/StoryPage';
import OnboardingPage from './pages/OnboardingPage';
import Dashboard from './pages/Dashboard';
import useStore from './store/useStore';

const AppRouter = () => {
  const user = useStore((state) => state.user);
  const darkMode = useStore((state) => state.darkMode);
  const userProfile = useStore((state) => state.userProfile);
  const setUserProfile = useStore((state) => state.setUserProfile); // Needed for OnboardingPage

  const handleOnboardingComplete = (profile) => {
    setUserProfile(profile);
  };

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
              <OnboardingPage onComplete={handleOnboardingComplete} darkMode={darkMode} />
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
        {/* Add more routes here as we break down App.jsx */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
