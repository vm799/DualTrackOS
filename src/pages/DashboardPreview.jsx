/**
 * Dashboard Preview - Demo mode for showing app value before signup
 *
 * Shows the dashboard with:
 * - Fake demo data
 * - OnboardingTour walkthrough
 * - Signup prompt after tour completion
 *
 * Flow: Landing → Preview → Tour → Signup → Real Dashboard
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Clock, Battery, ArrowRight, Zap, CheckCircle } from 'lucide-react';
import OnboardingTour from '../components/OnboardingTour';
import Logo from '../components/Logo';
import useStore from '../store/useStore';

const DashboardPreview = () => {
  const navigate = useNavigate();
  const darkMode = useStore((state) => state.darkMode);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [tourCompleted, setTourCompleted] = useState(false);
  const [previewModal, setPreviewModal] = useState(null);

  // Demo data for preview
  const demoNDM = {
    nutrition: { completed: false },
    movement: { completed: true },
    mindfulness: { completed: true },
    brainDump: { completed: false }
  };

  // Clear any previous tour completion for preview mode
  useEffect(() => {
    localStorage.removeItem('dualtrack-dashboard-tour-completed');
  }, []);

  const handleTourComplete = () => {
    setTourCompleted(true);
    // Show signup prompt after 1 second
    setTimeout(() => {
      setShowSignupPrompt(true);
    }, 1000);
  };

  const handleSignup = () => {
    navigate('/onboarding');
  };

  const handleSkipSignup = () => {
    // Let them explore the preview more
    setShowSignupPrompt(false);
  };

  // Feature information for preview tooltips
  const featureInfo = {
    'Nutrition': {
      title: 'Nutrition Tracking',
      description: 'Track your meals, macros, and eating patterns. Get insights on how nutrition affects your energy and productivity.',
      icon: '🥗'
    },
    'Movement': {
      title: 'Movement Logging',
      description: 'Log workouts, track exercise streaks, and see how physical activity impacts your mood and focus.',
      icon: '🏃'
    },
    'Mindfulness': {
      title: 'Mindfulness Practice',
      description: 'Guided box breathing exercises, meditation timers, and stress management tools to stay centered.',
      icon: '🧘'
    },
    'Brain Dump': {
      title: 'Brain Dump',
      description: 'Quick capture for thoughts, tasks, and ideas. Clear mental clutter to improve focus and reduce overwhelm.',
      icon: '🧠'
    }
  };

  const handleOpenFeature = (featureName) => {
    setPreviewModal(featureName);
  };

  return (
    <div className={`min-h-screen relative ${darkMode ? 'bg-[#191919]' : 'bg-gray-50'}`}>
      {/* HEADER */}
      <div className={`sticky top-0 z-20 backdrop-blur-xl transition-all ${
        darkMode
          ? 'bg-gray-900/95 border-b border-gray-800/50 shadow-2xl shadow-purple-500/10'
          : 'bg-white/95 border-b border-gray-200/50 shadow-lg'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Logo size="medium" navigateTo="/" />

            {/* Preview Badge */}
            <div className={`px-4 py-2 rounded-full font-semibold text-sm ${
              darkMode
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'bg-purple-100 text-purple-600 border border-purple-300'
            }`}>
              ✨ Preview Mode
            </div>

            {/* Sign Up Button */}
            <button
              onClick={handleSignup}
              className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                darkMode
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
              }`}
            >
              Sign Up Free
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT - Simplified Preview */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8 pb-32">
          {/* Welcome Message */}
          <div className="text-center space-y-4">
            <h1 className={`text-4xl font-bold ${
              darkMode
                ? 'bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent'
                : 'text-gray-900'
            }`}>
              Welcome to DualTrack OS
            </h1>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Your personalized system for tracking health, hormones, and productivity
            </p>
          </div>

          {/* Must-Dos Demo Section */}
          <div
            id="must-dos"
            className={`p-6 rounded-2xl border-2 ${
              darkMode
                ? 'bg-gray-800/50 border-emerald-500/30'
                : 'bg-white border-emerald-200'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="text-emerald-500" size={24} />
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Your Must-Dos for Today
              </h2>
            </div>
            <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Complete these 4 core habits - the foundation of your day
            </p>

            {/* NDM Status Demo */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: 'Nutrition', completed: false, icon: '🥗', description: 'Track your meals and nutrition intake' },
                { name: 'Movement', completed: true, icon: '🏃', description: 'Log your exercise and physical activity' },
                { name: 'Mindfulness', completed: true, icon: '🧘', description: 'Practice box breathing and meditation' },
                { name: 'Brain Dump', completed: false, icon: '🧠', description: 'Clear your mind with quick notes' }
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleOpenFeature(item.name)}
                  className={`p-4 rounded-xl text-center transition-all cursor-pointer ${
                    item.completed
                      ? darkMode
                        ? 'bg-emerald-500/20 border-2 border-emerald-500/50 hover:bg-emerald-500/30 hover:scale-105'
                        : 'bg-emerald-50 border-2 border-emerald-500 hover:bg-emerald-100 hover:scale-105'
                      : darkMode
                      ? 'bg-gray-700/50 border-2 border-gray-600 hover:border-purple-500/50 hover:bg-gray-700 hover:scale-105'
                      : 'bg-gray-50 border-2 border-gray-300 hover:border-purple-400 hover:bg-gray-100 hover:scale-105'
                  } active:scale-95 hover:shadow-lg`}
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className={`text-xs font-semibold ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {item.name}
                  </div>
                  {item.completed && (
                    <CheckCircle className="mx-auto mt-2 text-emerald-500" size={16} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Schedule Demo Section */}
          <div
            id="schedule"
            className={`p-6 rounded-2xl border-2 ${
              darkMode
                ? 'bg-gray-800/50 border-cyan-500/30'
                : 'bg-white border-cyan-200'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <Clock className="text-cyan-500" size={24} />
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Your Hour-by-Hour Game Plan
              </h2>
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Pick what you're attacking now, then crush it with focus mode
            </p>
          </div>

          {/* Energy Demo Section */}
          <div
            id="energy"
            className={`p-6 rounded-2xl border-2 ${
              darkMode
                ? 'bg-gray-800/50 border-purple-500/30'
                : 'bg-white border-purple-200'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <Battery className="text-purple-500" size={24} />
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                How Are You Feeling?
              </h2>
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Quick check-in helps us suggest the right tasks for your energy
            </p>
          </div>

          {/* Features Preview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Zap, title: 'Smart Suggestions', desc: 'AI-powered task recommendations' },
              { icon: CheckCircle, title: 'Streak Tracking', desc: 'Build lasting habits' },
              { icon: ArrowRight, title: 'Keyboard Shortcuts', desc: 'Power user features' }
            ].map((feature) => (
              <div
                key={feature.title}
                className={`p-4 rounded-xl ${
                  darkMode
                    ? 'bg-gray-800/50 border border-gray-700'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <feature.icon className={`mb-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} size={24} />
                <h3 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ONBOARDING TOUR - DISABLED UNTIL HOOKS ISSUE FULLY RESOLVED */}
      {false && <OnboardingTour
        darkMode={darkMode}
        onComplete={handleTourComplete}
        onOpenBrainDump={() => handleOpenFeature('Brain Dump')}
        onOpenNutrition={() => handleOpenFeature('Nutrition')}
        onOpenMovement={() => handleOpenFeature('Movement')}
        onOpenPomodoro={() => handleOpenFeature('Mindfulness')}
      />}

      {/* PREVIEW MODAL - Shows when clicking features */}
      {previewModal && featureInfo[previewModal] && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setPreviewModal(null)}
        >
          <div
            className={`max-w-md mx-4 p-8 rounded-2xl shadow-2xl ${
              darkMode ? 'bg-gray-800 border-2 border-purple-500/30' : 'bg-white border-2 border-purple-200'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-5">
              {/* Icon and Title */}
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className={`p-4 rounded-full text-5xl ${
                    darkMode ? 'bg-purple-500/20' : 'bg-purple-100'
                  }`}>
                    {featureInfo[previewModal].icon}
                  </div>
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {featureInfo[previewModal].title}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {featureInfo[previewModal].description}
                </p>
              </div>

              {/* Call to Action */}
              <div className={`p-4 rounded-xl ${
                darkMode ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'
              }`}>
                <p className={`text-xs text-center ${darkMode ? 'text-purple-200' : 'text-purple-800'}`}>
                  Sign up to unlock this feature and track your progress!
                </p>
              </div>

              {/* Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleSignup}
                  className="w-full px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all shadow-lg hover:scale-105 active:scale-95"
                >
                  Sign Up to Try This
                </button>
                <button
                  onClick={() => setPreviewModal(null)}
                  className={`w-full px-6 py-2 rounded-xl font-medium transition-all ${
                    darkMode
                      ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                      : 'text-gray-600 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIGNUP PROMPT MODAL */}
      {showSignupPrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div
            className={`max-w-md w-full mx-4 p-8 rounded-2xl shadow-2xl ${
              darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
            }`}
          >
            <div className="text-center space-y-6">
              {/* Icon */}
              <div className="flex justify-center">
                <div className={`p-4 rounded-full ${
                  darkMode ? 'bg-purple-500/20' : 'bg-purple-100'
                }`}>
                  <Sparkles className={`${
                    darkMode ? 'text-purple-400' : 'text-purple-600'
                  }`} size={32} />
                </div>
              </div>

              {/* Title */}
              <div>
                <h2 className={`text-2xl font-bold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Ready to Get Started?
                </h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Sign up now to unlock your personalized dashboard with age and cycle-specific insights
                </p>
              </div>

              {/* Benefits */}
              <div className={`text-left space-y-3 p-4 rounded-xl ${
                darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}>
                {[
                  'Track hormonal phases and energy patterns',
                  'Get AI-powered task recommendations',
                  'Build streaks and celebrate progress',
                  'Access all features completely free'
                ].map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3">
                    <CheckCircle className="text-emerald-500 flex-shrink-0 mt-0.5" size={18} />
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleSignup}
                  className="w-full px-6 py-3 rounded-xl font-semibold transition-all bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
                >
                  Sign Up Free - Start Tracking
                </button>
                <button
                  onClick={handleSkipSignup}
                  className={`w-full px-6 py-3 rounded-xl font-medium transition-all ${
                    darkMode
                      ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                      : 'text-gray-600 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Explore Preview More
                </button>
              </div>

              {/* Trust indicator */}
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                No credit card required • Free forever • Your data is private
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPreview;
