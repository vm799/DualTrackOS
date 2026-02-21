import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Info, X } from 'lucide-react';

const InfoTooltip = ({ title, text, children, darkMode, dismissKey, size = 16 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [wasDismissed, setWasDismissed] = useState(false);
  const [hasBeenSeen, setHasBeenSeen] = useState(false);
  const tooltipRef = useRef(null);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (dismissKey) {
      const dismissed = localStorage.getItem(`tooltip-dismissed-${dismissKey}`);
      if (dismissed) setWasDismissed(true);
      const seen = localStorage.getItem(`tooltip-seen-${dismissKey}`);
      if (seen) setHasBeenSeen(true);
    }
  }, [dismissKey]);

  // Position the tooltip panel within viewport bounds
  const positionPanel = useCallback(() => {
    if (!panelRef.current || !buttonRef.current) return;
    const panel = panelRef.current;
    const btn = buttonRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const panelWidth = Math.min(288, vw - 24); // w-72 = 288px, leave 12px margin each side

    panel.style.width = `${panelWidth}px`;

    // Horizontal: center on button, but clamp to viewport
    let idealLeft = btn.left + btn.width / 2 - panelWidth / 2;
    const minLeft = 12;
    const maxLeft = vw - panelWidth - 12;
    const clampedLeft = Math.max(minLeft, Math.min(idealLeft, maxLeft));

    panel.style.position = 'fixed';
    panel.style.left = `${clampedLeft}px`;
    panel.style.top = `${btn.bottom + 8}px`;

    // If it would go below viewport, show above instead
    const panelRect = panel.getBoundingClientRect();
    if (panelRect.bottom > window.innerHeight - 12) {
      panel.style.top = `${btn.top - panelRect.height - 8}px`;
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    // Mark as seen on first open
    if (!hasBeenSeen && dismissKey) {
      setHasBeenSeen(true);
      localStorage.setItem(`tooltip-seen-${dismissKey}`, 'true');
    }
    // Position immediately and on scroll/resize
    requestAnimationFrame(positionPanel);
    window.addEventListener('scroll', positionPanel, true);
    window.addEventListener('resize', positionPanel);
    return () => {
      window.removeEventListener('scroll', positionPanel, true);
      window.removeEventListener('resize', positionPanel);
    };
  }, [isOpen, positionPanel, hasBeenSeen, dismissKey]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target) &&
          panelRef.current && !panelRef.current.contains(e.target)) {
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

  // Show pulse affordance if not yet dismissed and not yet seen
  const showAffordance = !wasDismissed && !hasBeenSeen;

  return (
    <span className="relative inline-flex items-center" ref={tooltipRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex items-center justify-center min-w-[28px] min-h-[28px] p-1.5 rounded-full transition-all hover:scale-110 active:scale-95 ${
          darkMode
            ? 'text-amber-400 bg-amber-500/15 hover:bg-amber-500/25 ring-1 ring-amber-500/30'
            : 'text-amber-600 bg-amber-50 hover:bg-amber-100 ring-1 ring-amber-300/50'
        }`}
        title={wasDismissed ? `${title} (tap to show again)` : title}
        aria-label={`Info: ${title}`}
      >
        <Info size={size} />
        {/* Pulse ring affordance for undiscovered tooltips */}
        {showAffordance && (
          <span
            className="absolute inset-0 rounded-full animate-info-ping"
            style={{
              boxShadow: darkMode
                ? '0 0 0 0 rgba(251, 191, 36, 0.5)'
                : '0 0 0 0 rgba(245, 158, 11, 0.4)',
            }}
          />
        )}
      </button>

      {/* First-time hint label */}
      {showAffordance && !isOpen && (
        <span
          className={`absolute left-full ml-1 whitespace-nowrap text-[10px] font-bold pointer-events-none animate-info-fade ${
            darkMode ? 'text-amber-400' : 'text-amber-600'
          }`}
        >
          why?
        </span>
      )}

      {isOpen && (
        <div
          ref={panelRef}
          className={`fixed z-[60] rounded-xl shadow-2xl border p-4 ${
            darkMode
              ? 'bg-gray-800 border-gray-700 shadow-purple-500/10'
              : 'bg-white border-gray-200 shadow-lg'
          }`}
          style={{ animation: 'tooltipFadeIn 0.2s ease-out', maxHeight: 'calc(100vh - 24px)', overflowY: 'auto' }}
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
        @keyframes tooltipFadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes info-ping {
          0% { box-shadow: 0 0 0 0 ${darkMode ? 'rgba(251, 191, 36, 0.5)' : 'rgba(245, 158, 11, 0.4)'}; }
          70% { box-shadow: 0 0 0 ${size * 0.6}px transparent; }
          100% { box-shadow: 0 0 0 0 transparent; }
        }
        .animate-info-ping {
          animation: info-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes info-fade {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        .animate-info-fade {
          animation: info-fade 3s ease-in-out infinite;
        }
      `}</style>
    </span>
  );
};

export default InfoTooltip;
