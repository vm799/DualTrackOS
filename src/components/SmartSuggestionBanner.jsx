import React from 'react';
import { ArrowRight, X, Zap } from 'lucide-react';
import useSessionStore from '../store/useSessionStore';

/**
 * Smart Suggestion Banner Component
 *
 * Displays contextual suggestions based on:
 * - Time of day
 * - User behavior patterns
 * - Incomplete tasks
 * - Streaks
 *
 * Shows at the top of the dashboard as a dismissible banner
 */
const SmartSuggestionBanner = ({ darkMode, onAction, onDismiss }) => {
  const getSuggestion = useSessionStore((state) => state.getSuggestion);
  const suggestion = getSuggestion();

  if (!suggestion) return null;

  const priorityStyles = {
    high: {
      bg: darkMode ? 'bg-gradient-to-r from-purple-900/40 to-pink-900/40' : 'bg-gradient-to-r from-purple-100 to-pink-100',
      border: darkMode ? 'border-purple-500/50' : 'border-purple-300',
      text: darkMode ? 'text-purple-300' : 'text-purple-700',
      button: darkMode
        ? 'bg-purple-500/30 hover:bg-purple-500/40 text-purple-300 border-purple-500/50'
        : 'bg-purple-500 hover:bg-purple-600 text-white'
    },
    medium: {
      bg: darkMode ? 'bg-gradient-to-r from-cyan-900/40 to-blue-900/40' : 'bg-gradient-to-r from-cyan-100 to-blue-100',
      border: darkMode ? 'border-cyan-500/50' : 'border-cyan-300',
      text: darkMode ? 'text-cyan-300' : 'text-cyan-700',
      button: darkMode
        ? 'bg-cyan-500/30 hover:bg-cyan-500/40 text-cyan-300 border-cyan-500/50'
        : 'bg-cyan-500 hover:bg-cyan-600 text-white'
    },
    low: {
      bg: darkMode ? 'bg-gray-800/40' : 'bg-gray-100',
      border: darkMode ? 'border-gray-700' : 'border-gray-300',
      text: darkMode ? 'text-gray-300' : 'text-gray-700',
      button: darkMode
        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
        : 'bg-gray-500 hover:bg-gray-600 text-white'
    }
  };

  const styles = priorityStyles[suggestion.priority] || priorityStyles.medium;

  const handleAction = () => {
    if (onAction) {
      onAction(suggestion.action);
    }
  };

  return (
    <div
      className={`relative rounded-2xl p-4 sm:p-5 border-2 ${styles.bg} ${styles.border} backdrop-blur-sm shadow-lg mb-6 animate-slide-down`}
    >
      {/* Dismiss button */}
      <button
        onClick={onDismiss}
        className={`absolute top-3 right-3 p-1.5 rounded-lg transition-all ${
          darkMode
            ? 'hover:bg-white/10 text-gray-400 hover:text-gray-300'
            : 'hover:bg-black/10 text-gray-500 hover:text-gray-700'
        }`}
        aria-label="Dismiss suggestion"
      >
        <X size={16} />
      </button>

      <div className="flex items-start gap-4 pr-8">
        {/* Icon */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-full ${styles.bg} border-2 ${styles.border} flex items-center justify-center text-2xl`}>
          {suggestion.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={16} className={styles.text} />
            <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {suggestion.title}
            </h3>
          </div>

          <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {suggestion.message}
          </p>

          {/* Action button */}
          <button
            onClick={handleAction}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:scale-105 ${styles.button} border-2`}
          >
            Let's Go
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-down {
          animation: slide-down 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SmartSuggestionBanner;
