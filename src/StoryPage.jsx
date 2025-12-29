import React from 'react';
import { Target, Zap, Heart, ArrowRight } from 'lucide-react';

const StoryPage = ({ onEnter, darkMode }) => {
  return (
    <div className={`min-h-screen overflow-x-hidden ${
      darkMode ? 'bg-[#191919]' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50'
    }`} style={{ position: 'fixed', width: '100%', height: '100%', overflowY: 'auto' }}>

      {/* Content - Added top padding to account for StickyLogoBanner */}
      <div className="max-w-3xl mx-auto px-6 pt-20 pb-12 space-y-10">
        {/* Hero */}
        <div className="text-center space-y-4">
          <h1 className={`text-4xl md:text-5xl font-bold ${
            darkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Your Energy Has{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
              Patterns
            </span>
          </h1>
          <p className={`text-xl leading-relaxed ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Your productivity system shouldn't ignore them.
          </p>
        </div>

        {/* Problem */}
        <div className={`rounded-2xl p-8 ${
          darkMode
            ? 'bg-gradient-to-br from-rose-900/30 via-pink-900/20 to-rose-900/30 border-2 border-rose-500/30'
            : 'bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-200'
        }`}>
          <h2 className={`text-2xl font-bold mb-4 flex items-center ${
            darkMode ? 'text-rose-300' : 'text-rose-800'
          }`}>
            <Heart className="mr-3" size={28} />
            The Problem
          </h2>
          <div className={`space-y-3 text-lg ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <p className="font-medium">
              Your energy isn't linear. Whether you're managing multiple high-stakes roles, navigating hormonal transitions, balancing work and life, or simply honoring your body's natural rhythms—your capacity fluctuates.
            </p>
            <p>
              Some days you're a 5/5—crushing goals, feeling unstoppable, ready to tackle everything.
            </p>
            <p>
              Other days you're a 2/5—your body asks for gentleness, rest, and strategic prioritization.
            </p>
            <p className="font-bold mt-4">
              Yet most productivity apps treat everyone like they have linear, unchanging energy.
            </p>
          </div>
        </div>

        {/* What We Do */}
        <div className={`rounded-2xl p-8 ${
          darkMode
            ? 'bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-purple-900/30 border-2 border-purple-500/30'
            : 'bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200'
        }`}>
          <h2 className={`text-2xl font-bold mb-4 flex items-center ${
            darkMode ? 'text-purple-300' : 'text-purple-800'
          }`}>
            <Target className="mr-3" size={28} />
            What DualTrack OS Does
          </h2>
          <div className={`space-y-4 text-lg ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <p><strong>Tracks your energy, mood, and patterns</strong> — so you know what your body needs today</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <p><strong>Adapts recommendations to YOUR capacity</strong> — high-impact work on high-energy days, gentle mode when you need it</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <p><strong>Makes your mental load visible</strong> — see tasks across all your roles, track self-care alongside work</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <p><strong>Keeps you consistent</strong> — even on 2/5 days, you show up (just differently)</p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className={`rounded-2xl p-8 ${
          darkMode
            ? 'bg-gradient-to-br from-cyan-900/30 via-blue-900/20 to-cyan-900/30 border-2 border-cyan-500/30'
            : 'bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200'
        }`}>
          <h2 className={`text-2xl font-bold mb-4 flex items-center ${
            darkMode ? 'text-cyan-300' : 'text-cyan-800'
          }`}>
            <Zap className="mr-3" size={28} />
            Your Daily Command Center
          </h2>
          <div className={`space-y-3 text-lg ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <p><strong className="text-purple-400">Morning:</strong> 3-second energy check-in (1–5) + mood tracking</p>
            <p><strong className="text-purple-400">Throughout Day:</strong> Get smart suggestions based on YOUR capacity today</p>
            <p><strong className="text-purple-400">Mental Load:</strong> See tasks across all roles, track wins (work, self-care, boundaries, rest)</p>
            <p><strong className="text-purple-400">Evening:</strong> Complete Non-Negotiables (nutrition, movement, mindfulness, brain dump)</p>
          </div>
        </div>

        {/* Results */}
        <div className={`rounded-2xl p-8 ${
          darkMode
            ? 'bg-gradient-to-br from-orange-900/30 via-amber-900/20 to-orange-900/30 border-2 border-orange-500/30'
            : 'bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200'
        }`}>
          <h2 className={`text-2xl font-bold mb-4 ${
            darkMode ? 'text-orange-300' : 'text-orange-800'
          }`}>
            The Goal
          </h2>
          <div className={`space-y-3 text-lg ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <p>🎯 <strong>Be productive without burning out</strong> — work with your energy, not against it</p>
            <p>🧠 <strong>See your invisible labor</strong> — mental load visualization across all roles</p>
            <p>⚡ <strong>Make better decisions</strong> — energy-based recommendations for when to push, when to rest</p>
            <p>💪 <strong>Honor your whole life</strong> — track work, wellness, self-care, and boundaries equally</p>
            <p>🌸 <strong>Stay consistent</strong> — no shame, no streaks to break, just show up as you are</p>
          </div>
        </div>

        {/* Cultural Heritage */}
        <div className={`rounded-2xl p-8 ${
          darkMode
            ? 'bg-gradient-to-br from-amber-900/30 via-yellow-900/20 to-amber-900/30 border-2 border-amber-500/30'
            : 'bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200'
        }`}>
          <div className={`space-y-4 text-lg ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <p className="font-bold text-xl">
              🦁 Inspired by Shakti — Divine Feminine Power
            </p>
            <p>
              In Indian tradition, <strong>Shakti</strong> represents the divine feminine energy—creative, fierce, nurturing, and unstoppable. <strong>Goddess Durga</strong>, riding the lioness, embodies strength in all its forms.
            </p>
            <p className="italic">
              The lioness doesn't fight her nature. She rests when tired. She hunts when energized. She adapts, survives, and thrives through every season.
            </p>
            <p className="font-medium">
              DualTrack honors this wisdom: your strength comes from working <em>with</em> your cycles, not against them.
            </p>
          </div>
        </div>

        {/* Closing */}
        <div className="text-center space-y-6 py-6">
          <p className={`text-2xl font-bold ${
            darkMode ? 'text-purple-400' : 'text-purple-700'
          }`}>
            True productivity starts with honoring how your body works today.
          </p>
          <p className={`text-lg italic ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Not fighting it. Working with it.
          </p>

          {/* Enter Button */}
          {onEnter && (
            <div className="mt-8">
              <button
                onClick={onEnter}
                className={`group relative px-7 py-3 text-lg font-bold transition-all duration-300 hover:scale-105 ${
                  darkMode ? 'bg-gray-900' : 'bg-white'
                }`}
                style={{
                  border: '3px solid transparent',
                  borderImage:
                    'linear-gradient(135deg, #06b6d4 0%, #a855f7 33%, #ec4899 66%, #fb923c 100%) 1',
                  boxShadow:
                    '0 0 20px rgba(168, 85, 247, 0.45), 0 0 40px rgba(6, 182, 212, 0.25)',
                }}
              >
                <span className="flex items-center gap-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
                  Let's Go
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1 text-purple-500"
                  />
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryPage;
