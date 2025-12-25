import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * CollapsibleSection Component
 *
 * Progressive disclosure pattern for hiding advanced features
 * Reduces cognitive load by showing only essential content by default
 *
 * Features:
 * - Smooth expand/collapse animations
 * - Remembers state in localStorage (optional)
 * - Accessible keyboard navigation
 * - Custom trigger content support
 *
 * @param {string} title - Section heading
 * @param {ReactNode} children - Content to show/hide
 * @param {boolean} defaultExpanded - Initial state (default: false)
 * @param {string} persistKey - localStorage key to remember state (optional)
 * @param {ReactNode} icon - Optional icon component
 * @param {string} badge - Optional badge text (e.g., "3 items")
 * @param {boolean} darkMode - Dark mode state
 * @param {function} onToggle - Callback when expanded/collapsed
 */
const CollapsibleSection = ({
  title,
  children,
  defaultExpanded = false,
  persistKey,
  icon: Icon,
  badge,
  darkMode = false,
  onToggle
}) => {
  // Load initial state from localStorage if persistKey provided
  const getInitialState = () => {
    if (persistKey) {
      const saved = localStorage.getItem(`collapse-${persistKey}`);
      if (saved !== null) {
        return saved === 'true';
      }
    }
    return defaultExpanded;
  };

  const [isExpanded, setIsExpanded] = useState(getInitialState);

  const handleToggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);

    // Save to localStorage if persistKey provided
    if (persistKey) {
      localStorage.setItem(`collapse-${persistKey}`, String(newState));
    }

    // Call onToggle callback
    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <div className={`
      rounded-xl overflow-hidden transition-all duration-300
      ${darkMode
        ? 'bg-slate-800/50 border border-slate-700/50'
        : 'bg-white border border-purple-200/50'
      }
    `}>
      {/* Header / Trigger */}
      <button
        onClick={handleToggle}
        className={`
          w-full px-4 py-3 sm:px-5 sm:py-4
          flex items-center justify-between gap-3
          transition-all duration-200
          ${darkMode
            ? 'hover:bg-slate-700/50 active:bg-slate-700'
            : 'hover:bg-purple-50/50 active:bg-purple-100/50'
          }
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500
        `}
        aria-expanded={isExpanded}
      >
        {/* Left Side: Icon + Title + Badge */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Icon */}
          {Icon && (
            <div className={`
              flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
              ${darkMode ? 'bg-purple-500/20' : 'bg-purple-500/10'}
            `}>
              <Icon size={20} className={darkMode ? 'text-purple-400' : 'text-purple-600'} />
            </div>
          )}

          {/* Title */}
          <h3 className={`
            font-semibold text-base sm:text-lg text-left truncate
            ${darkMode ? 'text-white' : 'text-slate-900'}
          `}>
            {title}
          </h3>

          {/* Badge */}
          {badge && (
            <span className={`
              flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium
              ${darkMode
                ? 'bg-purple-500/20 text-purple-400'
                : 'bg-purple-500/10 text-purple-600'
              }
            `}>
              {badge}
            </span>
          )}
        </div>

        {/* Right Side: Expand/Collapse Icon */}
        <div className={`
          flex-shrink-0 transition-transform duration-300
          ${isExpanded ? 'rotate-180' : 'rotate-0'}
        `}>
          <ChevronDown
            size={20}
            className={darkMode ? 'text-slate-400' : 'text-slate-600'}
          />
        </div>
      </button>

      {/* Content */}
      <div
        className={`
          transition-all duration-300 ease-in-out overflow-hidden
          ${isExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className={`
          px-4 pb-4 sm:px-5 sm:pb-5 pt-2
          ${darkMode ? 'text-slate-300' : 'text-slate-700'}
        `}>
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * CollapsibleGroup Component
 *
 * Groups multiple CollapsibleSections with accordion behavior (optional)
 *
 * @param {ReactNode} children - CollapsibleSection components
 * @param {boolean} accordion - Only one section open at a time (default: false)
 * @param {boolean} darkMode - Dark mode state
 */
export const CollapsibleGroup = ({
  children,
  accordion = false,
  darkMode = false
}) => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index, isExpanded) => {
    if (accordion && isExpanded) {
      setOpenIndex(index);
    }
  };

  return (
    <div className="space-y-3">
      {React.Children.map(children, (child, index) => {
        if (accordion) {
          return React.cloneElement(child, {
            defaultExpanded: index === openIndex,
            onToggle: (isExpanded) => handleToggle(index, isExpanded),
            darkMode
          });
        }
        return React.cloneElement(child, { darkMode });
      })}
    </div>
  );
};

export default CollapsibleSection;
