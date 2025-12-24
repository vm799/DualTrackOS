import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logo = ({ size = 'medium', className = '' }) => {
  const navigate = useNavigate();

  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-20 h-20',
    large: 'w-32 h-32',
    xlarge: 'w-40 h-40'
  };

  const handleClick = () => {
    // Reset to landing page
    navigate('/');
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={handleClick}
      className={`flex-shrink-0 transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-full ${className}`}
      title="Return to home"
      aria-label="Return to home page"
    >
      <img
        src="/lioness-logo.png"
        alt="DualTrack OS - Lioness Logo"
        className={`${sizeClasses[size]} drop-shadow-xl`}
      />
    </button>
  );
};

export default Logo;
