import React from 'react';

const SectionContainer = ({
  id,
  icon: Icon,
  title,
  description,
  badge,
  accentColor = 'purple',
  children,
  darkMode
}) => {
  const colorClasses = {
    purple: {
      border: 'border-purple-500/30',
      bg: darkMode ? 'bg-purple-500/5' : 'bg-purple-50/50',
      icon: darkMode ? 'text-purple-400' : 'text-purple-600',
      badge: darkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'
    },
    cyan: {
      border: 'border-cyan-500/30',
      bg: darkMode ? 'bg-cyan-500/5' : 'bg-cyan-50/50',
      icon: darkMode ? 'text-cyan-400' : 'text-cyan-600',
      badge: darkMode ? 'bg-cyan-500/20 text-cyan-300' : 'bg-cyan-100 text-cyan-700'
    },
    pink: {
      border: 'border-pink-500/30',
      bg: darkMode ? 'bg-pink-500/5' : 'bg-pink-50/50',
      icon: darkMode ? 'text-pink-400' : 'text-pink-600',
      badge: darkMode ? 'bg-pink-500/20 text-pink-300' : 'bg-pink-100 text-pink-700'
    },
    orange: {
      border: 'border-orange-500/30',
      bg: darkMode ? 'bg-orange-500/5' : 'bg-orange-50/50',
      icon: darkMode ? 'text-orange-400' : 'text-orange-600',
      badge: darkMode ? 'bg-orange-500/20 text-orange-300' : 'bg-orange-100 text-orange-700'
    },
    emerald: {
      border: 'border-emerald-500/30',
      bg: darkMode ? 'bg-emerald-500/5' : 'bg-emerald-50/50',
      icon: darkMode ? 'text-emerald-400' : 'text-emerald-600',
      badge: darkMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
    },
    amber: {
      border: 'border-amber-500/30',
      bg: darkMode ? 'bg-amber-500/5' : 'bg-amber-50/50',
      icon: darkMode ? 'text-amber-400' : 'text-amber-600',
      badge: darkMode ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-700'
    },
    blue: {
      border: 'border-blue-500/30',
      bg: darkMode ? 'bg-blue-500/5' : 'bg-blue-50/50',
      icon: darkMode ? 'text-blue-400' : 'text-blue-600',
      badge: darkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'
    }
  };

  const colors = colorClasses[accentColor] || colorClasses.purple;

  return (
    <div
      id={id}
      className={`scroll-mt-20 rounded-2xl border-2 ${colors.border} ${colors.bg} p-6 ${
        darkMode ? 'backdrop-blur-sm' : ''
      } transition-all hover:shadow-lg`}
    >
      {/* Section Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          {Icon && (
            <div className={`p-2 rounded-xl ${colors.icon} ${
              darkMode ? 'bg-gray-800/50' : 'bg-white'
            }`}>
              <Icon size={24} strokeWidth={2.5} />
            </div>
          )}
          <div className="flex-1">
            <h2 className={`text-xl font-bold mb-1 ${
              darkMode ? 'text-gray-100' : 'text-gray-900'
            }`}>
              {title}
            </h2>
            {description && (
              <p className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {description}
              </p>
            )}
          </div>
        </div>

        {badge && (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.badge}`}>
            {badge}
          </span>
        )}
      </div>

      {/* Section Content */}
      <div className="mt-4">
        {children}
      </div>
    </div>
  );
};

export default SectionContainer;
