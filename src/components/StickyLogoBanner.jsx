import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Sticky Lioness Logo Banner
 *
 * Small persistent logo banner that appears on select pages
 * Only shows on pages without their own header/logo
 * Clickable to navigate to dashboard
 */
const StickyLogoBanner = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Only show on story page (which doesn't have a header with navigation)
  // Don't show on pages that already have logos/headers:
  // - Dashboard, Health, Productivity, Settings, Preview (have headers with logos)
  // - CheckIn, Onboarding (have fixed logos at top)
  const showPaths = ['/story'];
  if (!showPaths.includes(location.pathname)) {
    return null;
  }

  const handleClick = () => {
    // Navigate back to landing page from story
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={handleClick}
      className="fixed top-4 left-4 z-50 group"
      title="Back to Home"
      aria-label="Back to Home"
    >
      <div className="flex items-center gap-2 px-3 py-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-full shadow-lg border-2 border-purple-200 dark:border-purple-500/50 transition-all hover:scale-105 hover:shadow-xl hover:border-purple-400 dark:hover:border-purple-400 active:scale-95">
        <img
          src="/lioness-logo.png"
          alt="DualTrack OS"
          className="w-8 h-8 drop-shadow-lg"
        />
        <span className="text-xs font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent pr-1 hidden sm:inline">
          DualTrack
        </span>
      </div>
    </button>
  );
};

export default StickyLogoBanner;
