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

  // Debug: Log current path
  console.log('StickyLogoBanner - Current path:', location.pathname);

  // Only show on story page (which doesn't have a header with navigation)
  // Also show on story-bank but position below the header
  const showPaths = ['/story', '/story-bank'];
  const shouldShow = showPaths.includes(location.pathname);

  console.log('StickyLogoBanner - Should show:', shouldShow);

  if (!shouldShow) {
    return null;
  }

  console.log('StickyLogoBanner - RENDERING');

  // Adjust position for pages with headers
  const hasHeader = location.pathname === '/story-bank';
  const topPosition = hasHeader ? '5rem' : '1rem'; // Below header on story-bank, top on story

  const handleClick = () => {
    // Navigate back to landing page from story
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={handleClick}
      className="fixed left-4 z-[9999] group"
      title="Back to Home"
      aria-label="Back to Home"
      style={{
        position: 'fixed',
        top: topPosition,
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
            console.error('Logo failed to load:', e);
            e.target.style.display = 'none';
          }}
          onLoad={() => console.log('Logo loaded successfully')}
        />
        <span className="text-xs font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent pr-1 hidden sm:inline">
          DualTrack
        </span>
      </div>
    </button>
  );
};

export default StickyLogoBanner;
