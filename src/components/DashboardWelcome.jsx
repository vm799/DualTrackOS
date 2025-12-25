/**
 * DashboardWelcome Component
 *
 * Shows a welcome message for first-time Dashboard visitors
 * Explains what the app does and how to get started
 */

import React from 'react';
import { Sparkles, Target, Zap, TrendingUp, X } from 'lucide-react';

const DashboardWelcome = ({ darkMode, onClose, onGetStarted }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className={`relative max-w-2xl w-full mx-4 p-8 rounded-2xl shadow-2xl ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-lg transition-all ${
            darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          <X size={20} />
        </button>

        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className={`p-4 rounded-full ${
              darkMode ? 'bg-purple-500/20' : 'bg-purple-100'
            }`}>
              <Sparkles className={`${
                darkMode ? 'text-purple-400' : 'text-purple-600'
              }`} size={48} />
            </div>
          </div>

          {/* Title */}
          <div>
            <h2 className={`text-3xl font-bold mb-3 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Welcome to DualTrack OS! 🎉
            </h2>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Your personalized system for managing energy, hormones, and productivity
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className={`p-4 rounded-xl ${
              darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <Target className={`mb-2 ${
                darkMode ? 'text-emerald-400' : 'text-emerald-600'
              }`} size={28} />
              <h3 className={`font-semibold mb-1 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Daily Must-Dos
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Track 4 non-negotiables: Nutrition, Movement, Mindfulness, Brain Dump
              </p>
            </div>

            <div className={`p-4 rounded-xl ${
              darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <Zap className={`mb-2 ${
                darkMode ? 'text-amber-400' : 'text-amber-600'
              }`} size={28} />
              <h3 className={`font-semibold mb-1 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Smart Suggestions
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                AI-powered recommendations based on your energy and patterns
              </p>
            </div>

            <div className={`p-4 rounded-xl ${
              darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <TrendingUp className={`mb-2 ${
                darkMode ? 'text-pink-400' : 'text-pink-600'
              }`} size={28} />
              <h3 className={`font-semibold mb-1 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Track Progress
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Build streaks, see insights, and celebrate your wins
              </p>
            </div>
          </div>

          {/* What to Expect */}
          <div className={`text-left p-4 rounded-xl ${
            darkMode ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'
          }`}>
            <h3 className={`font-semibold mb-2 ${
              darkMode ? 'text-purple-300' : 'text-purple-900'
            }`}>
              What to expect:
            </h3>
            <ul className={`space-y-1 text-sm ${
              darkMode ? 'text-purple-200' : 'text-purple-800'
            }`}>
              <li>✓ Daily check-ins to track your progress</li>
              <li>✓ Age and cycle-specific recommendations</li>
              <li>✓ Energy-aware task scheduling</li>
              <li>✓ Habit building with streak tracking</li>
            </ul>
          </div>

          {/* Action Button */}
          <button
            onClick={onGetStarted}
            className="w-full px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:scale-105 active:scale-95"
          >
            Let's Get Started! →
          </button>

          {/* Helper Text */}
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            A quick tour will show you around
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardWelcome;
