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
  // Don't show on story-bank - logo is integrated into the header there
  const showPaths = ['/story'];
  const shouldShow = showPaths.includes(location.pathname);

  if (!shouldShow) {
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
      className="fixed top-4 left-4 z-[9999] group"
      title="Back to Home"
      aria-label="Back to Home"
      style={{
        position: 'fixed',
        top: '1rem',
        left: '1rem',
        zIndex: 9999
      }}
    >
      <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 backdrop-blur-lg rounded-full shadow-2xl border-2 border-purple-500 transition-all hover:scale-105 hover:shadow-xl hover:border-purple-400 active:scale-95">
        <img
          src="/lioness-logo.png"
          alt="DualTrack OS"
          className="w-8 h-8 drop-shadow-lg"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <span className="text-xs font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent pr-1 hidden sm:inline">
          DualTrack
        </span>
      </div>
    </button>
  );
};

export default StickyLogoBanner;
