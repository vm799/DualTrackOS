import React, { useState, useEffect, useRef } from 'react';
import { Info, X } from 'lucide-react';

const InfoTooltip = ({ title, text, children, darkMode, dismissKey, size = 16 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [wasDismissed, setWasDismissed] = useState(false);
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (dismissKey) {
      const dismissed = localStorage.getItem(`tooltip-dismissed-${dismissKey}`);
      if (dismissed) setWasDismissed(true);
    }
  }, [dismissKey]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  const handleDismiss = () => {
    setIsOpen(false);
    setWasDismissed(true);
    if (dismissKey) {
      localStorage.setItem(`tooltip-dismissed-${dismissKey}`, 'true');
    }
  };

  return (
    <span className="relative inline-flex items-center" ref={tooltipRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-0.5 rounded-full transition-all hover:scale-110 ${
          darkMode
            ? 'text-gray-500 hover:text-purple-400 hover:bg-purple-500/10'
            : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'
        }`}
        title={wasDismissed ? `${title} (click to show again)` : title}
        aria-label={`Info: ${title}`}
      >
        <Info size={size} />
      </button>

      {isOpen && (
        <div
          className={`absolute z-50 left-1/2 -translate-x-1/2 top-full mt-2 w-72 rounded-xl shadow-2xl border p-4 transition-all ${
            darkMode
              ? 'bg-gray-800 border-gray-700 shadow-purple-500/10'
              : 'bg-white border-gray-200 shadow-lg'
          }`}
          style={{ animation: 'fadeIn 0.2s ease-out' }}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className={`text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              {title}
            </h4>
            <button
              onClick={handleDismiss}
              className={`p-1 rounded-lg transition-all flex-shrink-0 ${
                darkMode
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
              }`}
              aria-label="Dismiss tooltip"
            >
              <X size={14} />
            </button>
          </div>
          {text && (
            <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {text}
            </p>
          )}
          {children}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-4px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </span>
  );
};

export default InfoTooltip;
