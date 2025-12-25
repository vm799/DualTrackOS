import React from 'react';
import {
  Inbox,
  Brain,
  Utensils,
  Dumbbell,
  Calendar,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  MessageSquare,
  Target,
  Lightbulb,
  Coffee
} from 'lucide-react';

/**
 * EmptyState Component
 *
 * Displays contextual empty states with illustrations and CTAs
 * Supports multiple types for different features
 *
 * @param {string} type - Type of empty state (braindump, nutrition, movement, etc.)
 * @param {string} title - Main heading text
 * @param {string} description - Supporting description
 * @param {string} actionText - CTA button text
 * @param {function} onAction - CTA button handler
 * @param {string} secondaryActionText - Optional secondary CTA text
 * @param {function} onSecondaryAction - Optional secondary CTA handler
 * @param {boolean} darkMode - Dark mode state
 */
const EmptyState = ({
  type = 'generic',
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  darkMode = false
}) => {
  const getIllustration = () => {
    const iconProps = {
      size: 80,
      strokeWidth: 1.5,
      className: darkMode ? 'text-purple-400' : 'text-purple-500'
    };

    const illustrations = {
      braindump: (
        <div className="relative">
          <Brain {...iconProps} />
          <Sparkles
            size={32}
            className={`absolute -top-2 -right-2 ${darkMode ? 'text-amber-400' : 'text-amber-500'} animate-pulse`}
          />
        </div>
      ),
      nutrition: (
        <div className="relative">
          <Utensils {...iconProps} />
          <CheckCircle2
            size={32}
            className={`absolute -bottom-2 -right-2 ${darkMode ? 'text-emerald-400' : 'text-emerald-500'}`}
          />
        </div>
      ),
      movement: (
        <div className="relative">
          <Dumbbell {...iconProps} />
          <TrendingUp
            size={32}
            className={`absolute -top-2 -right-2 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`}
          />
        </div>
      ),
      schedule: (
        <div className="relative">
          <Calendar {...iconProps} />
          <Target
            size={32}
            className={`absolute -bottom-2 -right-2 ${darkMode ? 'text-pink-400' : 'text-pink-500'}`}
          />
        </div>
      ),
      ideas: (
        <div className="relative">
          <Lightbulb {...iconProps} />
          <Sparkles
            size={32}
            className={`absolute -top-2 -right-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'} animate-pulse`}
          />
        </div>
      ),
      conversations: (
        <div className="relative">
          <MessageSquare {...iconProps} />
          <Coffee
            size={32}
            className={`absolute -bottom-2 -right-2 ${darkMode ? 'text-amber-400' : 'text-amber-500'}`}
          />
        </div>
      ),
      generic: (
        <Inbox {...iconProps} />
      )
    };

    return illustrations[type] || illustrations.generic;
  };

  const getDefaultContent = () => {
    const defaults = {
      braindump: {
        title: 'Your Mind is Clear',
        description: 'No thoughts dumped yet today. When something comes up, capture it here to free up mental space.',
        actionText: 'Start Brain Dump',
        gradient: 'from-amber-500/10 to-purple-500/10'
      },
      nutrition: {
        title: 'No Meals Logged',
        description: "Track what you're eating to ensure you're getting enough protein and nutrients throughout the day.",
        actionText: 'Log First Meal',
        gradient: 'from-emerald-500/10 to-teal-500/10'
      },
      movement: {
        title: 'Ready to Move?',
        description: "Haven't logged any movement today. Even a 5-minute walk counts!",
        actionText: 'Log Movement',
        gradient: 'from-blue-500/10 to-cyan-500/10'
      },
      schedule: {
        title: 'Your Schedule is Empty',
        description: 'No tasks scheduled yet. Plan your day to make the most of your energy.',
        actionText: 'Add First Task',
        gradient: 'from-pink-500/10 to-purple-500/10'
      },
      ideas: {
        title: 'Capture Your Ideas',
        description: 'Great ideas can strike at any moment. Keep them here so they don\'t slip away.',
        actionText: 'Add Idea',
        gradient: 'from-yellow-500/10 to-orange-500/10'
      },
      conversations: {
        title: 'No Conversations Yet',
        description: 'Chat with the AI assistant for personalized guidance and support.',
        actionText: 'Start Conversation',
        gradient: 'from-purple-500/10 to-pink-500/10'
      },
      generic: {
        title: 'Nothing Here Yet',
        description: 'Get started by adding your first item.',
        actionText: 'Get Started',
        gradient: 'from-purple-500/10 to-blue-500/10'
      }
    };

    return defaults[type] || defaults.generic;
  };

  const content = getDefaultContent();
  const finalTitle = title || content.title;
  const finalDescription = description || content.description;
  const finalActionText = actionText || content.actionText;

  return (
    <div className={`
      flex flex-col items-center justify-center
      py-12 px-6 sm:py-16 sm:px-8
      rounded-2xl
      ${darkMode
        ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-2 border-slate-700/50'
        : `bg-gradient-to-br ${content.gradient} border-2 border-purple-200/50`
      }
      backdrop-blur-sm
      fade-in-up
    `}>
      {/* Illustration */}
      <div className="mb-6 scale-in">
        {getIllustration()}
      </div>

      {/* Title */}
      <h3 className={`
        text-xl sm:text-2xl font-bold mb-3 text-center
        ${darkMode ? 'text-white' : 'text-slate-900'}
      `}>
        {finalTitle}
      </h3>

      {/* Description */}
      <p className={`
        text-sm sm:text-base text-center max-w-md mb-6
        ${darkMode ? 'text-slate-300' : 'text-slate-600'}
      `}>
        {finalDescription}
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        {/* Primary Action */}
        {onAction && (
          <button
            onClick={onAction}
            className={`
              px-6 py-3 rounded-lg font-semibold text-sm sm:text-base
              transition-all duration-200
              hover:scale-105 active:scale-95
              ${darkMode
                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg hover:shadow-purple-500/50'
                : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-purple-500/30'
              }
              flex items-center justify-center gap-2
            `}
          >
            {finalActionText}
            <Sparkles size={18} />
          </button>
        )}

        {/* Secondary Action */}
        {onSecondaryAction && secondaryActionText && (
          <button
            onClick={onSecondaryAction}
            className={`
              px-6 py-3 rounded-lg font-semibold text-sm sm:text-base
              transition-all duration-200
              hover:scale-105 active:scale-95
              ${darkMode
                ? 'bg-slate-700 hover:bg-slate-600 text-white border-2 border-slate-600'
                : 'bg-white hover:bg-gray-50 text-purple-600 border-2 border-purple-300'
              }
            `}
          >
            {secondaryActionText}
          </button>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        {/* Top-right glow */}
        <div className={`
          absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20
          ${darkMode ? 'bg-purple-500' : 'bg-purple-400'}
        `} />
        {/* Bottom-left glow */}
        <div className={`
          absolute -bottom-20 -left-20 w-40 h-40 rounded-full blur-3xl opacity-20
          ${darkMode ? 'bg-pink-500' : 'bg-pink-400'}
        `} />
      </div>
    </div>
  );
};

export default EmptyState;
