import React from 'react';
import { BookOpen, X, Clock, CheckCircle } from 'lucide-react';

/**
 * Story Reminder Component
 *
 * Shows a gentle reminder to document today's story
 * No React hooks violations - props only, presentational component
 */
const StoryReminder = ({ darkMode, onStartStory, onSnooze, onDismiss }) => {
  return (
    <div className={`fixed bottom-24 right-4 z-40 max-w-sm rounded-2xl p-5 shadow-2xl border-2 animate-slide-up ${
      darkMode
        ? 'bg-gradient-to-br from-purple-900/95 to-pink-900/95 border-purple-500/50'
        : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300'
    }`}>
      {/* Close Button */}
      <button
        onClick={onDismiss}
        className={`absolute top-3 right-3 p-1 rounded-lg transition-all ${
          darkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-black/10 text-gray-600'
        }`}
        title="Dismiss for today"
      >
        <X size={16} />
      </button>

      {/* Icon */}
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
        darkMode ? 'bg-purple-500/20' : 'bg-purple-500/10'
      }`}>
        <BookOpen className={darkMode ? 'text-purple-400' : 'text-purple-600'} size={24} />
      </div>

      {/* Content */}
      <h3 className={`text-lg font-bold mb-2 ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        Time to Build Your Story Bank! 📚
      </h3>

      <p className={`text-sm mb-4 ${
        darkMode ? 'text-gray-300' : 'text-gray-700'
      }`}>
        You haven't documented a story today. Just 5 minutes using the 5W1H framework!
      </p>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onStartStory}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all ${
            darkMode
              ? 'bg-purple-600 hover:bg-purple-500 text-white'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          <CheckCircle size={18} />
          Start Writing
        </button>

        <button
          onClick={onSnooze}
          className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
            darkMode
              ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
          title="Remind me in 2 hours"
        >
          <Clock size={18} />
          <span className="hidden sm:inline">Snooze 2h</span>
        </button>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default StoryReminder;
