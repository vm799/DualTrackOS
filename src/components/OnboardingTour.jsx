import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Check, Sparkles, Zap, Target, Brain, Heart } from 'lucide-react';

/**
 * OnboardingTour Component
 *
 * Interactive product tour for first-time users
 * - Highlights key features
 * - Skippable at any time
 * - Remembers completion in localStorage
 * - Responsive and accessible
 *
 * Tour Steps:
 * 1. Welcome & Overview
 * 2. Daily Check-In
 * 3. NDM (Must-Dos)
 * 4. Smart Features (keyboard shortcuts, suggestions)
 * 5. Pomodoro & Focus
 * 6. Complete
 */
const OnboardingTour = ({ darkMode = false, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has completed tour
    const hasCompletedTour = localStorage.getItem('dualtrack-tour-completed');

    if (!hasCompletedTour) {
      // Show tour after a short delay
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const steps = [
    {
      id: 'welcome',
      icon: Sparkles,
      title: 'Welcome to DualTrack OS',
      description: 'Your operating system for managing energy, hormones, and productivity. Let\'s take a quick tour!',
      highlight: null,
      position: 'center',
      color: 'purple'
    },
    {
      id: 'checkin',
      icon: Heart,
      title: 'Start with Check-In',
      description: 'Begin each day by checking in with your energy and mood. This helps us personalize your experience.',
      highlight: 'header', // Could highlight specific elements
      position: 'top',
      color: 'pink'
    },
    {
      id: 'ndm',
      icon: Target,
      title: 'Your Must-Dos (NDM)',
      description: 'Nutrition, Movement, Mindfulness, and Brain Dump - the 4 non-negotiables for your wellbeing. Complete these daily!',
      highlight: 'ndm-section',
      position: 'left',
      color: 'emerald'
    },
    {
      id: 'smart-features',
      icon: Zap,
      title: 'Smart Features',
      description: 'We track your streaks, save drafts automatically, and suggest next actions based on patterns. Try keyboard shortcuts (Cmd+B for Brain Dump)!',
      highlight: 'smart-banner',
      position: 'top',
      color: 'amber'
    },
    {
      id: 'pomodoro',
      icon: Brain,
      title: 'Focus with Pomodoro',
      description: 'When you\'re ready to focus, use the Pomodoro timer for deep work sessions. It adapts to your energy levels.',
      highlight: 'pomodoro',
      position: 'right',
      color: 'blue'
    },
    {
      id: 'complete',
      icon: Check,
      title: 'You\'re All Set!',
      description: 'You can always access help from the command center (Cmd+C). Ready to start your journey?',
      highlight: null,
      position: 'center',
      color: 'purple'
    }
  ];

  const currentStepData = steps[currentStep];

  const handleNext = () => {
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

  const completeTour = () => {
    localStorage.setItem('dualtrack-tour-completed', 'true');
    setIsVisible(false);
    if (onComplete) onComplete();
  };

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
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in" />

      {/* Tour Modal */}
      <div className={`
        fixed z-50
        ${currentStepData.position === 'center'
          ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
          : currentStepData.position === 'top'
          ? 'top-24 left-1/2 -translate-x-1/2'
          : currentStepData.position === 'left'
          ? 'top-1/2 left-8 -translate-y-1/2'
          : currentStepData.position === 'right'
          ? 'top-1/2 right-8 -translate-y-1/2'
          : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
        }
        w-full max-w-md mx-4
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
              absolute top-4 right-4 p-1 rounded-lg
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
            text-base mb-6
            ${darkMode ? 'text-slate-300' : 'text-slate-700'}
          `}>
            {currentStepData.description}
          </p>

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
                Previous
              </button>
            )}

            {/* Skip Button (only show if not last step) */}
            {!isLastStep && isFirstStep && (
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
