import React from 'react';
import useStore from '../store/useStore';

/**
 * SectionHeader - Standardized section titles with inviting micro-copy
 */
const SectionHeader = ({ emoji, title, description, badge, className = "" }) => {
  const darkMode = useStore((state) => state.darkMode);

  return (
    <div className={`mb-3 ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <h3 className={`text-lg font-bold flex items-center gap-2 ${
          darkMode ? 'text-gray-200' : 'text-gray-900'
        }`}>
          {emoji && <span className="text-xl">{emoji}</span>}
          {title}
        </h3>
        {badge && (
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            darkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'
          }`}>
            {badge}
          </span>
        )}
      </div>
      {description && (
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
