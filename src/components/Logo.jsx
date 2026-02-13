import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logo = ({ size = 'medium', className = '', navigateTo = null }) => {
  const navigate = useNavigate();

  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-20 h-20',
    large: 'w-32 h-32',
    xlarge: 'w-full h-full max-w-[520px] max-h-[520px]'
  };

  const handleClick = () => {
    // If custom navigation target is provided, use it
    if (navigateTo) {
      navigate(navigateTo);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Default: go to landing page
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
