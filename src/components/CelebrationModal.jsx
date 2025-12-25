import React, { useEffect, useState } from 'react';
import { PartyPopper, Trophy, Flame, Star, Sparkles, X } from 'lucide-react';

/**
 * Celebration Modal Component
 *
 * Shows celebratory animations and messages for:
 * - NDM completion (all 4 core habits)
 * - Streak milestones (3, 7, 14, 30 days)
 * - First-time achievements
 */
const CelebrationModal = ({ show, onClose, type, data, darkMode }) => {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    if (show) {
      // Generate confetti particles
      const particles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 1,
        color: ['#06b6d4', '#a855f7', '#ec4899', '#f59e0b', '#10b981'][Math.floor(Math.random() * 5)]
      }));
      setConfetti(particles);

      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const getCelebrationContent = () => {
    switch (type) {
      case 'ndm-complete':
        return {
          icon: Trophy,
          title: '🎉 All Core Habits Complete!',
          message: "You've checked off all 4 must-dos for today. You're crushing it!",
          subMessage: 'Want to tackle something bigger now?',
          color: 'emerald',
          cta: 'Start Focus Session'
        };

      case 'streak-3':
        return {
          icon: Flame,
          title: '🔥 3-Day Streak!',
          message: "You're building momentum. Keep it up!",
          subMessage: `${data?.streakCount || 3} days in a row`,
          color: 'orange',
          cta: 'Keep Going'
        };

      case 'streak-7':
        return {
          icon: Flame,
          title: '🔥 Week Streak!',
          message: "7 days straight! You're officially in a groove.",
          subMessage: 'Consistency is the key to transformation',
          color: 'orange',
          cta: 'Celebrate'
        };

      case 'streak-30':
        return {
          icon: Star,
          title: '⭐ 30-Day Champion!',
          message: "A full month! This is now a habit.",
          subMessage: 'You\'ve proven you can show up every day',
          color: 'purple',
          cta: 'Amazing!'
        };

      case 'first-pomodoro':
        return {
          icon: Sparkles,
          title: '✨ First Focus Session Complete!',
          message: "You just completed your first 25-minute deep work session.",
          subMessage: 'This is how you build focus muscle',
          color: 'cyan',
          cta: 'Nice Work'
        };

      case 'first-braindump':
        return {
          icon: Sparkles,
          title: '✨ Brain Successfully Dumped!',
          message: "Feel that relief? That's mental clarity.",
          subMessage: 'Come back whenever your mind feels full',
          color: 'purple',
          cta: 'Got It'
        };

      default:
        return {
          icon: PartyPopper,
          title: '🎉 Great Job!',
          message: 'You\'re making progress!',
          subMessage: 'Keep going strong',
          color: 'purple',
          cta: 'Thanks!'
        };
    }
  };

  const content = getCelebrationContent();
  const Icon = content.icon;

  const colorClasses = {
    emerald: {
      bg: darkMode ? 'bg-emerald-500/20' : 'bg-emerald-100',
      border: 'border-emerald-500',
      text: darkMode ? 'text-emerald-300' : 'text-emerald-700',
      button: darkMode
        ? 'bg-emerald-500/30 hover:bg-emerald-500/40 text-emerald-300 border-emerald-500/50'
        : 'bg-emerald-500 hover:bg-emerald-600 text-white'
    },
    orange: {
      bg: darkMode ? 'bg-orange-500/20' : 'bg-orange-100',
      border: 'border-orange-500',
      text: darkMode ? 'text-orange-300' : 'text-orange-700',
      button: darkMode
        ? 'bg-orange-500/30 hover:bg-orange-500/40 text-orange-300 border-orange-500/50'
        : 'bg-orange-500 hover:bg-orange-600 text-white'
    },
    purple: {
      bg: darkMode ? 'bg-purple-500/20' : 'bg-purple-100',
      border: 'border-purple-500',
      text: darkMode ? 'text-purple-300' : 'text-purple-700',
      button: darkMode
        ? 'bg-purple-500/30 hover:bg-purple-500/40 text-purple-300 border-purple-500/50'
        : 'bg-purple-500 hover:bg-purple-600 text-white'
    },
    cyan: {
      bg: darkMode ? 'bg-cyan-500/20' : 'bg-cyan-100',
      border: 'border-cyan-500',
      text: darkMode ? 'text-cyan-300' : 'text-cyan-700',
      button: darkMode
        ? 'bg-cyan-500/30 hover:bg-cyan-500/40 text-cyan-300 border-cyan-500/50'
        : 'bg-cyan-500 hover:bg-cyan-600 text-white'
    }
  };

  const colors = colorClasses[content.color] || colorClasses.purple;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      {/* Confetti */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {confetti.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full animate-confetti"
            style={{
              left: `${particle.left}%`,
              backgroundColor: particle.color,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          />
        ))}
      </div>

      {/* Modal */}
      <div
        className={`relative max-w-md w-full rounded-2xl p-8 shadow-2xl border-2 ${
          darkMode
            ? 'bg-gray-800/95 border-gray-700'
            : 'bg-white border-gray-200'
        } animate-scale-in`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-lg transition-all ${
            darkMode
              ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300'
              : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
          }`}
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className={`mx-auto w-20 h-20 rounded-full ${colors.bg} border-2 ${colors.border} flex items-center justify-center mb-6 animate-bounce-in`}>
          <Icon size={40} className={colors.text} />
        </div>

        {/* Title */}
        <h2 className={`text-2xl font-bold text-center mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {content.title}
        </h2>

        {/* Message */}
        <p className={`text-center mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {content.message}
        </p>

        {/* Sub-message */}
        {content.subMessage && (
          <p className={`text-center text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {content.subMessage}
          </p>
        )}

        {/* CTA Button */}
        <button
          onClick={onClose}
          className={`w-full py-3 px-6 rounded-xl font-semibold transition-all transform hover:scale-105 ${colors.button} border-2`}
        >
          {content.cta}
        </button>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bounce-in {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes confetti {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .animate-confetti {
          animation: confetti forwards;
        }
      `}</style>
    </div>
  );
};

export default CelebrationModal;
