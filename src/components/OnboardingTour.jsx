import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Check, Sparkles, Zap, Target, Brain, Heart, Mouse } from 'lucide-react';

/**
 * OnboardingTour Component
 *
 * Interactive product tour for first-time Dashboard users
 * - Highlights key features with actual interactions
 * - Skippable at any time
 * - Remembers completion in localStorage
 * - Scrolls to and highlights real elements
 *
 * Tour Steps:
 * 1. Welcome & Overview
 * 2. NDM Must-Dos (with action button)
 * 3. Smart Suggestions (with action button)
 * 4. Streak Tracking (scrolls to element)
 * 5. Keyboard Shortcuts (interactive)
 * 6. Complete
 */
const OnboardingTour = ({
  darkMode = false,
  onComplete,
  onOpenBrainDump,
  onOpenNutrition,
  onOpenMovement,
  onOpenPomodoro
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [clickedTiles, setClickedTiles] = useState([]);

  useEffect(() => {
    // Check if user has completed tour
    const hasCompletedTour = localStorage.getItem('dualtrack-dashboard-tour-completed');

    if (!hasCompletedTour) {
      // Show tour after a short delay (let Dashboard render first)
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const steps = [
    {
      id: 'welcome',
      icon: Sparkles,
      title: 'Welcome to Your Dashboard!',
      description: 'This is your command center for managing energy, productivity, and wellbeing. Let\'s explore the key features together.',
      action: null,
      actionLabel: null,
      scrollTo: null,
      position: 'center',
      color: 'purple'
    },
    {
      id: 'ndm',
      icon: Target,
      title: 'What Do You Want to Do First?',
      description: 'Click on any of the 4 non-negotiables to try them out. Each one helps you build a complete day.',
      menuOptions: [
        {
          id: 'nutrition',
          icon: '🥗',
          label: 'Nutrition',
          description: 'Track your meals',
          action: onOpenNutrition
        },
        {
          id: 'movement',
          icon: '🏃',
          label: 'Movement',
          description: 'Log your exercise',
          action: onOpenMovement
        },
        {
          id: 'mindfulness',
          icon: '🧘',
          label: 'Mindfulness',
          description: 'Box breathing',
          action: () => {
            // In Dashboard this would open mindful moment
            // In preview this is just visual feedback
            if (onOpenPomodoro) onOpenPomodoro(); // Placeholder
          }
        },
        {
          id: 'braindump',
          icon: '🧠',
          label: 'Brain Dump',
          description: 'Clear your mind',
          action: onOpenBrainDump
        }
      ],
      scrollTo: 'must-dos',
      position: 'center',
      color: 'emerald'
    },
    {
      id: 'suggestions',
      icon: Zap,
      title: 'Smart Suggestions',
      description: 'We suggest what to do next based on time of day, your patterns, and streaks. These appear at the top of your dashboard.',
      action: null,
      actionLabel: null,
      scrollTo: null,
      position: 'center',
      color: 'amber'
    },
    {
      id: 'streaks',
      icon: Heart,
      title: 'Track Your Streaks',
      description: 'Build momentum with streak tracking! See your progress and get predictions on maintaining your habits.',
      action: null,
      actionLabel: null,
      scrollTo: null,
      position: 'center',
      color: 'pink'
    },
    {
      id: 'shortcuts',
      icon: Mouse,
      title: 'Power User Shortcuts',
      description: 'Save time with keyboard shortcuts:\n• Cmd/Ctrl + B = Brain Dump\n• Cmd/Ctrl + N = Nutrition\n• Cmd/Ctrl + M = Movement\n• Cmd/Ctrl + P = Pomodoro',
      action: null,
      actionLabel: null,
      scrollTo: null,
      position: 'center',
      color: 'blue'
    },
    {
      id: 'complete',
      icon: Check,
      title: 'You\'re All Set! 🎉',
      description: 'You now know the basics! Start by completing your Must-Dos, and let DualTrack OS help you manage your day.',
      action: null,
      actionLabel: null,
      scrollTo: null,
      position: 'center',
      color: 'purple'
    }
  ];

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    // Scroll to element if specified
    if (currentStepData.scrollTo) {
      const element = document.getElementById(currentStepData.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    completeTour();
  };

  const handleAction = () => {
    if (currentStepData.action) {
      currentStepData.action();
    }
  };

  const handleMenuTileClick = (option) => {
    // Mark as clicked for visual feedback
    setClickedTiles(prev => [...prev, option.id]);

    // Execute the action
    if (option.action) {
      option.action();
    }

    // Auto-advance after 1.5 seconds if at least one tile was clicked
    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        setClickedTiles([]); // Reset for next step
      }
    }, 1500);
  };

  const completeTour = () => {
    localStorage.setItem('dualtrack-dashboard-tour-completed', 'true');
    setIsVisible(false);
    if (onComplete) onComplete();
  };

  // Scroll to element when step changes
  useEffect(() => {
    if (isVisible && currentStepData.scrollTo) {
      const timer = setTimeout(() => {
        const element = document.getElementById(currentStepData.scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentStep, isVisible, currentStepData.scrollTo]);

  if (!isVisible) return null;

  const Icon = currentStepData.icon;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const colorClasses = {
    purple: {
      bg: darkMode ? 'from-purple-900/40 to-pink-900/40' : 'from-purple-100 to-pink-100',
      border: darkMode ? 'border-purple-500/50' : 'border-purple-300',
      text: darkMode ? 'text-purple-400' : 'text-purple-600',
      button: darkMode ? 'bg-purple-600 hover:bg-purple-500' : 'bg-purple-600 hover:bg-purple-700',
      iconBg: darkMode ? 'bg-purple-500/20' : 'bg-purple-500/10'
    },
    pink: {
      bg: darkMode ? 'from-pink-900/40 to-rose-900/40' : 'from-pink-100 to-rose-100',
      border: darkMode ? 'border-pink-500/50' : 'border-pink-300',
      text: darkMode ? 'text-pink-400' : 'text-pink-600',
      button: darkMode ? 'bg-pink-600 hover:bg-pink-500' : 'bg-pink-600 hover:bg-pink-700',
      iconBg: darkMode ? 'bg-pink-500/20' : 'bg-pink-500/10'
    },
    emerald: {
      bg: darkMode ? 'from-emerald-900/40 to-teal-900/40' : 'from-emerald-100 to-teal-100',
      border: darkMode ? 'border-emerald-500/50' : 'border-emerald-300',
      text: darkMode ? 'text-emerald-400' : 'text-emerald-600',
      button: darkMode ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-emerald-600 hover:bg-emerald-700',
      iconBg: darkMode ? 'bg-emerald-500/20' : 'bg-emerald-500/10'
    },
    amber: {
      bg: darkMode ? 'from-amber-900/40 to-orange-900/40' : 'from-amber-100 to-orange-100',
      border: darkMode ? 'border-amber-500/50' : 'border-amber-300',
      text: darkMode ? 'text-amber-400' : 'text-amber-600',
      button: darkMode ? 'bg-amber-600 hover:bg-amber-500' : 'bg-amber-600 hover:bg-amber-700',
      iconBg: darkMode ? 'bg-amber-500/20' : 'bg-amber-500/10'
    },
    blue: {
      bg: darkMode ? 'from-blue-900/40 to-cyan-900/40' : 'from-blue-100 to-cyan-100',
      border: darkMode ? 'border-blue-500/50' : 'border-blue-300',
      text: darkMode ? 'text-blue-400' : 'text-blue-600',
      button: darkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-600 hover:bg-blue-700',
      iconBg: darkMode ? 'bg-blue-500/20' : 'bg-blue-500/10'
    }
  };

  const colors = colorClasses[currentStepData.color];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={handleSkip}
      />

      {/* Tour Modal */}
      <div className={`
        fixed z-50
        top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-full max-w-lg mx-4
        scale-in
      `}>
        <div className={`
          rounded-2xl p-6 sm:p-8
          ${darkMode ? 'bg-slate-800 border-2' : 'bg-white border-2'}
          ${colors.border}
          bg-gradient-to-br ${colors.bg}
          backdrop-blur-sm
          shadow-2xl
          relative
        `}>
          {/* Close Button */}
          <button
            onClick={handleSkip}
            className={`
              absolute top-4 right-4 p-2 rounded-lg
              transition-all hover:scale-110
              ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-200'}
            `}
            aria-label="Skip tour"
          >
            <X size={20} className={darkMode ? 'text-slate-400' : 'text-gray-600'} />
          </button>

          {/* Icon */}
          <div className={`
            w-16 h-16 rounded-2xl flex items-center justify-center mb-4
            ${colors.iconBg}
          `}>
            <Icon size={32} className={colors.text} />
          </div>

          {/* Step Counter */}
          <div className={`text-xs font-semibold mb-2 ${colors.text}`}>
            Step {currentStep + 1} of {steps.length}
          </div>

          {/* Title */}
          <h2 className={`
            text-2xl font-bold mb-3
            ${darkMode ? 'text-white' : 'text-slate-900'}
          `}>
            {currentStepData.title}
          </h2>

          {/* Description */}
          <p className={`
            text-base mb-6 whitespace-pre-line
            ${darkMode ? 'text-slate-300' : 'text-slate-700'}
          `}>
            {currentStepData.description}
          </p>

          {/* Menu Tiles (if available) */}
          {currentStepData.menuOptions && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              {currentStepData.menuOptions.map((option) => {
                const isClicked = clickedTiles.includes(option.id);
                return (
                  <button
                    key={option.id}
                    onClick={() => handleMenuTileClick(option)}
                    className={`
                      p-4 rounded-xl text-center transition-all
                      ${isClicked
                        ? darkMode
                          ? 'bg-emerald-500/30 border-2 border-emerald-500/70 scale-95'
                          : 'bg-emerald-100 border-2 border-emerald-500 scale-95'
                        : darkMode
                        ? 'bg-slate-700/50 border-2 border-slate-600 hover:border-emerald-500/50 hover:scale-105'
                        : 'bg-white/50 border-2 border-gray-300 hover:border-emerald-400 hover:scale-105'
                      }
                      active:scale-95
                      shadow-md hover:shadow-lg
                    `}
                  >
                    <div className="text-3xl mb-2">{option.icon}</div>
                    <div className={`text-sm font-semibold mb-1 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {option.label}
                    </div>
                    <div className={`text-xs ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {option.description}
                    </div>
                    {isClicked && (
                      <div className="mt-2">
                        <Check size={16} className="text-emerald-500 mx-auto" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Action Button (if available) */}
          {currentStepData.action && (
            <button
              onClick={handleAction}
              className={`
                w-full mb-4 py-3 px-6 rounded-lg font-semibold text-white
                ${colors.button}
                transition-all hover:scale-105 active:scale-95
                shadow-lg
                flex items-center justify-center gap-2
              `}
            >
              {currentStepData.actionLabel}
            </button>
          )}

          {/* Progress Dots */}
          <div className="flex gap-2 mb-6">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`
                  h-2 rounded-full transition-all duration-300
                  ${index === currentStep ? 'w-8' : 'w-2'}
                  ${index <= currentStep
                    ? colors.text
                    : darkMode ? 'bg-slate-700' : 'bg-gray-300'
                  }
                `}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            {/* Previous Button */}
            {!isFirstStep && (
              <button
                onClick={handlePrevious}
                className={`
                  flex-1 px-4 py-3 rounded-lg font-semibold
                  ${darkMode
                    ? 'bg-slate-700 hover:bg-slate-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }
                  transition-all hover:scale-105 active:scale-95
                  flex items-center justify-center gap-2
                `}
              >
                <ChevronLeft size={20} />
                Back
              </button>
            )}

            {/* Skip Button (only on first step) */}
            {isFirstStep && (
              <button
                onClick={handleSkip}
                className={`
                  flex-1 px-4 py-3 rounded-lg font-semibold
                  ${darkMode
                    ? 'bg-slate-700 hover:bg-slate-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }
                  transition-all hover:scale-105 active:scale-95
                `}
              >
                Skip Tour
              </button>
            )}

            {/* Next/Complete Button */}
            <button
              onClick={handleNext}
              className={`
                ${isFirstStep ? 'flex-1' : 'flex-1'}
                px-4 py-3 rounded-lg font-semibold text-white
                ${colors.button}
                transition-all hover:scale-105 active:scale-95
                shadow-lg
                flex items-center justify-center gap-2
              `}
            >
              {isLastStep ? (
                <>
                  Get Started <Check size={20} />
                </>
              ) : (
                <>
                  Next <ChevronRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OnboardingTour;
