import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPageView from './pages/LandingPage';
import StickyLogoBanner from './components/StickyLogoBanner';
import useStore from './store/useStore';

// Lazy-loaded pages for code splitting
const StoryPageView = React.lazy(() => import('./pages/StoryPage'));
const DashboardPreview = React.lazy(() => import('./pages/DashboardPreview'));
const OnboardingPage = React.lazy(() => import('./pages/OnboardingPage'));
const CheckInPage = React.lazy(() => import('./pages/CheckInPage'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const HealthPage = React.lazy(() => import('./pages/HealthPage'));
const ProductivityPage = React.lazy(() => import('./pages/ProductivityPage'));
const StoryBankPage = React.lazy(() => import('./pages/StoryBankPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const PricingPage = React.lazy(() => import('./pages/PricingPage'));
const RedeemCodePage = React.lazy(() => import('./pages/RedeemCodePage'));
const PrivacyPolicyPage = React.lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = React.lazy(() => import('./pages/TermsOfServicePage'));
const FAQPage = React.lazy(() => import('./pages/FAQPage'));

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

const PageLoader = ({ darkMode }) => (
  <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-[#191919]' : 'bg-gray-50'}`}>
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading...</p>
    </div>
  </div>
);

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
      <Suspense fallback={<PageLoader darkMode={darkMode} />}>
        <Routes>
          <Route path="/" element={<LandingPageView darkMode={darkMode} />} />
          <Route path="/story" element={<StoryPageView darkMode={darkMode} />} />
          <Route path="/preview" element={<DashboardPreview />} />
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
      </Suspense>
    </Router>
  );
};

export default AppRouter;
