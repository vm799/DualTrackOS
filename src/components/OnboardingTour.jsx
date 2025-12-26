import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronRight, ChevronLeft, Check, Sparkles, Zap, Target, Mouse } from 'lucide-react';

/**
 * OnboardingTour Component - FIXED with useRef for stable handlers
 *
 * React Hooks #185 Fix Strategy:
 * - Use refs to store callback props (stable reference, latest value)
 * - NO useCallback with unstable dependencies
 * - NO useMemo with callback dependencies
 * - Inline event handlers (don't need to be stable)
 * - Early returns AFTER all hooks
 */

// Static step configuration
const TOUR_STEPS = [
  {
    id: 'welcome',
    icon: Sparkles,
    title: 'Welcome to Your Dashboard!',
    description: 'This is your command center for managing energy, productivity, and wellbeing. Let\'s explore the key features together.',
    color: 'purple'
  },
  {
    id: 'ndm',
    icon: Target,
    title: 'What Do You Want to Do First?',
    description: 'Click on any of the 4 non-negotiables to try them out. Each one helps you build a complete day.',
    color: 'emerald',
    menuOptions: [
      { id: 'nutrition', icon: '🥗', label: 'Nutrition', description: 'Track your meals' },
      { id: 'movement', icon: '🏃', label: 'Movement', description: 'Log your exercise' },
      { id: 'mindfulness', icon: '🧘', label: 'Mindfulness', description: 'Box breathing' },
      { id: 'braindump', icon: '🧠', label: 'Brain Dump', description: 'Clear your mind' }
    ]
  },
  {
    id: 'suggestions',
    icon: Zap,
    title: 'Smart Suggestions',
    description: 'We suggest what to do next based on time of day, your patterns, and streaks. These appear at the top of your dashboard.',
    color: 'amber'
  },
  {
    id: 'shortcuts',
    icon: Mouse,
    title: 'Power User Shortcuts',
    description: 'Save time with keyboard shortcuts:\n• Cmd/Ctrl + B = Brain Dump\n• Cmd/Ctrl + N = Nutrition\n• Cmd/Ctrl + M = Movement\n• Cmd/Ctrl + P = Pomodoro',
    color: 'blue'
  },
  {
    id: 'complete',
    icon: Check,
    title: 'You\'re All Set! 🎉',
    description: 'You now know the basics! Start by completing your Must-Dos, and let DualTrack OS help you manage your day.',
    color: 'purple'
  }
];

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

  // Store callbacks in refs - stable reference, always latest value
  const onCompleteRef = useRef(onComplete);
  const onOpenBrainDumpRef = useRef(onOpenBrainDump);
  const onOpenNutritionRef = useRef(onOpenNutrition);
  const onOpenMovementRef = useRef(onOpenMovement);
  const onOpenPomodoroRef = useRef(onOpenPomodoro);

  // Update refs when props change
  useEffect(() => {
    onCompleteRef.current = onComplete;
    onOpenBrainDumpRef.current = onOpenBrainDump;
    onOpenNutritionRef.current = onOpenNutrition;
    onOpenMovementRef.current = onOpenMovement;
    onOpenPomodoroRef.current = onOpenPomodoro;
  });

  // Initialize tour visibility - only hook with dependencies
  useEffect(() => {
    try {
      const hasCompletedTour = localStorage.getItem('dualtrack-dashboard-tour-completed');
      if (!hasCompletedTour) {
        const timer = setTimeout(() => setIsVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error('OnboardingTour localStorage error:', error);
    }
  }, []); // Empty deps - only run once

  // ALL event handlers are inline functions - don't need useCallback
  const completeTour = () => {
    try {
      localStorage.setItem('dualtrack-dashboard-tour-completed', 'true');
      setIsVisible(false);
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
    } catch (error) {
      console.error('Error completing tour:', error);
      setIsVisible(false);
    }
  };

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeTour();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    completeTour();
  };

  const handleMenuTileClick = (optionId) => {
    setClickedTiles(prev => [...prev, optionId]);

    // Execute action using refs (always latest, stable reference)
    switch (optionId) {
      case 'nutrition':
        if (onOpenNutritionRef.current) onOpenNutritionRef.current();
        break;
      case 'movement':
        if (onOpenMovementRef.current) onOpenMovementRef.current();
        break;
      case 'mindfulness':
        if (onOpenPomodoroRef.current) onOpenPomodoroRef.current();
        break;
      case 'braindump':
        if (onOpenBrainDumpRef.current) onOpenBrainDumpRef.current();
        break;
      default:
        break;
    }

    // Close tour after delay
    setTimeout(() => {
      completeTour();
    }, 500);
  };

  // Early return AFTER all hooks
  if (!isVisible) return null;

  const currentStepData = TOUR_STEPS[currentStep];
  if (!currentStepData) return null;

  const Icon = currentStepData.icon;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TOUR_STEPS.length - 1;

  const colorClasses = {
    purple: {
      bg: darkMode ? 'from-purple-900/40 to-pink-900/40' : 'from-purple-100 to-pink-100',
      border: darkMode ? 'border-purple-500/50' : 'border-purple-300',
      text: darkMode ? 'text-purple-400' : 'text-purple-600',
      button: darkMode ? 'bg-purple-600 hover:bg-purple-500' : 'bg-purple-600 hover:bg-purple-700',
      iconBg: darkMode ? 'bg-purple-500/20' : 'bg-purple-500/10'
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
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={handleSkip}
      />

      {/* Tour Modal */}
      <div className="fixed z-[70] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg mx-4">
        <div className={`
          rounded-2xl p-6 sm:p-8
          ${darkMode ? 'bg-slate-800 border-2' : 'bg-white border-2'}
          ${colors.border}
          bg-gradient-to-br ${colors.bg}
          shadow-2xl relative
        `}>
          {/* Close Button */}
          <button
            onClick={handleSkip}
            className={`absolute top-4 right-4 p-2 rounded-lg transition-all hover:scale-110 ${
              darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-200'
            }`}
            aria-label="Skip tour"
          >
            <X size={20} className={darkMode ? 'text-slate-400' : 'text-gray-600'} />
          </button>

          {/* Icon */}
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${colors.iconBg}`}>
            <Icon size={32} className={colors.text} />
          </div>

          {/* Step Counter */}
          <div className={`text-xs font-semibold mb-2 ${colors.text}`}>
            Step {currentStep + 1} of {TOUR_STEPS.length}
          </div>

          {/* Title */}
          <h2 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {currentStepData.title}
          </h2>

          {/* Description */}
          <p className={`text-base mb-6 whitespace-pre-line ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
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
                    onClick={() => handleMenuTileClick(option.id)}
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
                      active:scale-95 shadow-md hover:shadow-lg
                    `}
                  >
                    <div className="text-3xl mb-2">{option.icon}</div>
                    <div className={`text-sm font-semibold mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {option.label}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
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

          {/* Success Message */}
          {clickedTiles.length > 0 && currentStepData.menuOptions && (
            <div className={`mb-4 p-3 rounded-lg text-center animate-fade-in ${
              darkMode ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-200'
            }`}>
              <p className={`text-sm font-semibold ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                ✓ Great choice! Moving to next step...
              </p>
            </div>
          )}

          {/* Progress Dots */}
          <div className="flex gap-2 mb-6">
            {TOUR_STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`
                  h-2 rounded-full transition-all duration-300
                  ${index === currentStep ? 'w-8' : 'w-2'}
                  ${index <= currentStep ? colors.text : darkMode ? 'bg-slate-700' : 'bg-gray-300'}
                `}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            {!isFirstStep && (
              <button
                onClick={handlePrevious}
                className={`
                  flex-1 px-4 py-3 rounded-lg font-semibold
                  ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}
                  transition-all hover:scale-105 active:scale-95
                  flex items-center justify-center gap-2
                `}
              >
                <ChevronLeft size={20} />
                Back
              </button>
            )}

            {isFirstStep && (
              <button
                onClick={handleSkip}
                className={`
                  flex-1 px-4 py-3 rounded-lg font-semibold
                  ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}
                  transition-all hover:scale-105 active:scale-95
                `}
              >
                Skip Tour
              </button>
            )}

            <button
              onClick={handleNext}
              className={`
                flex-1 px-4 py-3 rounded-lg font-semibold text-white
                ${colors.button}
                transition-all hover:scale-105 active:scale-95 shadow-lg
                flex items-center justify-center gap-2
                ${clickedTiles.length > 0 && currentStepData.menuOptions ? 'animate-pulse' : ''}
              `}
            >
              {isLastStep ? (
                <>
                  Get Started <Check size={20} />
                </>
              ) : clickedTiles.length > 0 && currentStepData.menuOptions ? (
                <>
                  Continue <ChevronRight size={20} />
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
