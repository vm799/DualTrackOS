import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPageView from './pages/LandingPage';
import StoryPageView from './pages/StoryPage';
import DashboardPreview from './pages/DashboardPreview';
import OnboardingPage from './pages/OnboardingPage';
import CheckInPage from './pages/CheckInPage';
import Dashboard from './pages/Dashboard';
import HealthPage from './pages/HealthPage';
import ProductivityPage from './pages/ProductivityPage';
import StoryBankPage from './pages/StoryBankPage';
import SettingsPage from './pages/SettingsPage';
import PricingPage from './pages/PricingPage';
import RedeemCodePage from './pages/RedeemCodePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import FAQPage from './pages/FAQPage';
import StickyLogoBanner from './components/StickyLogoBanner';
import useStore from './store/useStore';

/**
 * PathTracker Component
 * Tracks the current path and saves it to localStorage for error recovery
 */
const PathTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Save current path to localStorage for error recovery
    // This allows the ErrorBoundary "Try Again" button to navigate back to last known good path
    try {
      localStorage.setItem('last-good-path', location.pathname);
    } catch (error) {
      // Silently fail if localStorage is not available
      console.warn('Could not save last-good-path to localStorage:', error);
    }
  }, [location.pathname]);

  return null;
};

const AppRouter = () => {
  const darkMode = useStore((state) => state.darkMode);
  const userProfile = useStore((state) => state.userProfile);
  const isHydrated = useStore((state) => state.isHydrated);

  // Don't render routes until initial hydration is complete to avoid redirect loops
  // based on default fallback state
  if (!isHydrated) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-[#191919]' : 'bg-gray-50'}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading DualTrack OS...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <PathTracker />
      <StickyLogoBanner />
      <Routes>
        <Route path="/" element={<LandingPageView darkMode={darkMode} />} />
        <Route path="/story" element={<StoryPageView darkMode={darkMode} />} />
        <Route path="/preview" element={<DashboardPreview />} />
        <Route
          path="/onboarding"
          element={
            userProfile.hasCompletedOnboarding ? (
              <Navigate to="/check-in" replace />
            ) : (
              <OnboardingPage darkMode={darkMode} />
            )
          }
        />
        <Route
          path="/check-in"
          element={
            userProfile.hasCompletedOnboarding ? (
              <CheckInPage darkMode={darkMode} />
            ) : (
              <Navigate to="/onboarding" replace />
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
          path="/health"
          element={
            userProfile.hasCompletedOnboarding ? (
              <HealthPage />
            ) : (
              <Navigate to="/onboarding" replace />
            )
          }
        />
        <Route
          path="/productivity"
          element={
            userProfile.hasCompletedOnboarding ? (
              <ProductivityPage />
            ) : (
              <Navigate to="/onboarding" replace />
            )
          }
        />
        {/* Story Bank */}
        <Route
          path="/story-bank"
          element={
            userProfile.hasCompletedOnboarding ? (
              <StoryBankPage />
            ) : (
              <Navigate to="/onboarding" replace />
            )
          }
        />
        {/* Redirect old routes to new structure */}
        <Route path="/cycle" element={<Navigate to="/health" replace />} />
        <Route path="/strong50" element={<Navigate to="/health" replace />} />
        <Route path="/hormonal-health" element={<Navigate to="/health" replace />} />
        <Route
          path="/settings"
          element={<SettingsPage />}
        />
        <Route
          path="/pricing"
          element={<PricingPage />}
        />
        <Route
          path="/redeem"
          element={<RedeemCodePage />}
        />
        <Route
          path="/privacy"
          element={<PrivacyPolicyPage />}
        />
        <Route
          path="/terms"
          element={<TermsOfServicePage />}
        />
        <Route
          path="/faq"
          element={<FAQPage />}
        />
        {/* Add more routes here as we break down App.jsx */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;

