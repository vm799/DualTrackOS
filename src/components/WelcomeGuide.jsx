import React, { useState, useEffect } from 'react';
import { Sunrise, CheckSquare, Target, ChevronRight, X, EyeOff } from 'lucide-react';

/**
 * WelcomeGuide — progressive onboarding for new users.
 *
 * Shows for the first 7 days of app use. After that, the user
 * knows the drill and it hides permanently.
 * User can also click "Don't show again" to skip early.
 * Dismissed per-day so it reappears each morning during the
 * learning window (first 7 active days).
 */
const WelcomeGuide = ({ darkMode, userName, onStepClick }) => {
  const [dismissed, setDismissed] = useState(false);
  const [hidden, setHidden] = useState(false);

  const todayKey = `welcome-dismissed-${new Date().toDateString()}`;
  const PERM_KEY = 'welcome-hidden-permanently';
  const DAYS_KEY = 'welcome-active-days';

  useEffect(() => {
    // Permanently hidden?
    if (localStorage.getItem(PERM_KEY)) {
      setHidden(true);
      return;
    }

    // Track active days (set of date strings)
    let days = [];
    try {
      days = JSON.parse(localStorage.getItem(DAYS_KEY) || '[]');
    } catch { days = []; }
    const today = new Date().toDateString();
    if (!days.includes(today)) {
      days.push(today);
      localStorage.setItem(DAYS_KEY, JSON.stringify(days));
    }

    // After 7 active days, auto-hide permanently
    if (days.length > 7) {
      localStorage.setItem(PERM_KEY, 'true');
      setHidden(true);
      return;
    }

    // Dismissed for today?
    if (localStorage.getItem(todayKey)) {
      setDismissed(true);
    }
  }, [todayKey]);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(todayKey, 'true');
  };

  const handleHidePermanently = () => {
    setHidden(true);
    localStorage.setItem(PERM_KEY, 'true');
  };

  const handleStepClick = (step) => {
    if (onStepClick) onStepClick(step);
  };

  if (hidden || dismissed) return null;

  const firstName = userName?.split(' ')[0] || 'there';

  // How many active days so far?
  let activeDays = 1;
  try {
    activeDays = JSON.parse(localStorage.getItem(DAYS_KEY) || '[]').length;
  } catch { activeDays = 1; }

  const steps = [
    {
      num: 1,
      icon: Sunrise,
      label: "Check today's protocol",
      detail: "3 quick items tailored to your day",
      target: 'protocols',
      color: 'purple',
    },
    {
      num: 2,
      icon: CheckSquare,
      label: 'Tick off your 4 must-dos',
      detail: "Nutrition, Movement, Mindfulness, Brain Dump",
      target: 'must-dos',
      color: 'emerald',
    },
    {
      num: 3,
      icon: Target,
      label: 'Set your first focus block',
      detail: "Pick one task and hit the timer",
      target: 'schedule',
      color: 'cyan',
    },
  ];

  return (
    <div
      className={`relative rounded-2xl border-2 p-5 sm:p-6 transition-all ${
        darkMode
          ? 'bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-purple-500/30'
          : 'bg-gradient-to-br from-white to-purple-50/50 border-purple-200'
      }`}
      style={{ animation: 'welcomeFadeIn 0.5s ease-out' }}
    >
      {/* Dismiss for today */}
      <button
        onClick={handleDismiss}
        className={`absolute top-3 right-3 p-1.5 rounded-lg transition-all ${
          darkMode ? 'hover:bg-white/10 text-gray-500 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
        }`}
        aria-label="Dismiss guide for today"
        title="Dismiss for today"
      >
        <X size={16} />
      </button>

      {/* Greeting */}
      <h2 className={`text-lg sm:text-xl font-bold mb-1 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
        Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {firstName}
      </h2>
      <p className={`text-sm mb-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        {activeDays <= 1
          ? "Just 3 things to start your day. Everything else can wait."
          : `Day ${activeDays} — you know the rhythm. Here's your quick start.`
        }
      </p>

      {/* Steps */}
      <div className="space-y-2.5">
        {steps.map((step) => {
          const Icon = step.icon;
          const colorMap = {
            purple: darkMode ? 'border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-500/5' : 'border-purple-200 hover:border-purple-300 hover:bg-purple-50',
            emerald: darkMode ? 'border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/5' : 'border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50',
            cyan: darkMode ? 'border-cyan-500/20 hover:border-cyan-500/40 hover:bg-cyan-500/5' : 'border-cyan-200 hover:border-cyan-300 hover:bg-cyan-50',
          };
          const iconColor = {
            purple: darkMode ? 'text-purple-400' : 'text-purple-600',
            emerald: darkMode ? 'text-emerald-400' : 'text-emerald-600',
            cyan: darkMode ? 'text-cyan-400' : 'text-cyan-600',
          };
          const numColor = {
            purple: darkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700',
            emerald: darkMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700',
            cyan: darkMode ? 'bg-cyan-500/20 text-cyan-300' : 'bg-cyan-100 text-cyan-700',
          };

          return (
            <button
              key={step.num}
              onClick={() => handleStepClick(step.target)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${colorMap[step.color]}`}
            >
              <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${numColor[step.color]}`}>
                {step.num}
              </span>
              <Icon size={18} className={`flex-shrink-0 ${iconColor[step.color]}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {step.label}
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {step.detail}
                </p>
              </div>
              <ChevronRight size={16} className={`flex-shrink-0 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
            </button>
          );
        })}
      </div>

      {/* Footer: reassurance + don't show again */}
      <div className="flex items-center justify-between mt-4">
        <p className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
          More tools are below when you're ready.
        </p>
        <button
          onClick={handleHidePermanently}
          className={`flex items-center gap-1 text-xs transition-all ${
            darkMode ? 'text-gray-600 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'
          }`}
          title="Hide this guide permanently"
        >
          <EyeOff size={12} />
          Don't show again
        </button>
      </div>

      <style>{`
        @keyframes welcomeFadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default WelcomeGuide;
