import React, { useState } from 'react';
import { User, Sparkles, CheckCircle, Heart, Flower2, ArrowRight, Zap, Battery } from 'lucide-react';
import Logo from './components/Logo';

const Onboarding = ({ onComplete, darkMode }) => {
  const [step, setStep] = useState(0); // 0: Quick Win, 1: Profile, 2: Life Stage (optional)
  const [weightUnit, setWeightUnit] = useState('lbs');

  // Quick Win State (Step 0)
  const [energyLevel, setEnergyLevel] = useState(null);
  const [mood, setMood] = useState(null);

  // Profile State (Step 1)
  const [profile, setProfile] = useState({
    name: '',
    preferredName: '',
    initials: '',
    age: '',
    weight: '',
    weightUnit: 'lbs',
    lifeStage: '',
    avatar: '🦁'
  });

  const handleComplete = () => {
    onComplete({
      ...profile,
      age: parseInt(profile.age) || null,
      weight: parseInt(profile.weight) || null,
      weightUnit: weightUnit,
      hasCompletedOnboarding: true,
      disclaimerAccepted: true,
      initialEnergy: energyLevel,
      initialMood: mood
    });
  };

  // Mood options for Quick Win
  const moodOptions = [
    { id: 'energized', label: 'Energized', emoji: '⚡', color: 'cyan' },
    { id: 'focused', label: 'Focused', emoji: '🎯', color: 'purple' },
    { id: 'calm', label: 'Calm', emoji: '😌', color: 'green' },
    { id: 'tired', label: 'Tired', emoji: '😴', color: 'blue' },
    { id: 'stressed', label: 'Stressed', emoji: '😰', color: 'orange' },
    { id: 'overwhelmed', label: 'Overwhelmed', emoji: '😓', color: 'red' },
  ];

  // ========================================
  // STEP 0: QUICK WIN - Energy Check-In
  // ========================================
  if (step === 0) {
    // Generate smart suggestion based on energy + mood
    const getSmartSuggestion = () => {
      if (!energyLevel) return null;

      if (energyLevel >= 4) {
        return {
          title: "You're powered up!",
          suggestions: [
            "Tackle your most challenging task first",
            "Schedule important meetings or decisions",
            "Perfect time for focused deep work"
          ],
          color: 'emerald'
        };
      } else if (energyLevel === 3) {
        return {
          title: "Moderate capacity today",
          suggestions: [
            "Focus on routine tasks and follow-ups",
            "Good for collaboration and meetings",
            "Balance work with regular breaks"
          ],
          color: 'cyan'
        };
      } else {
        return {
          title: "Gentle Mode Recommended",
          suggestions: [
            "Prioritize only what's truly essential",
            "This is a day for self-care, not overdelivering",
            "Rest is productive—honor what your body needs"
          ],
          color: 'rose'
        };
      }
    };

    const suggestion = getSmartSuggestion();

    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${
        darkMode ? 'bg-[#191919]' : 'bg-gradient-to-br from-purple-50 to-pink-50'
      }`}>
        <div className="fixed top-4 left-4 z-50">
          <Logo size="large" />
        </div>

        <div className={`max-w-2xl w-full rounded-2xl p-8 shadow-2xl ${
          darkMode
            ? 'bg-gray-800/50 border-2 border-gray-700/50 backdrop-blur-xl'
            : 'bg-white border-2 border-gray-100'
        }`}>
          <div className="text-center mb-8">
            <Zap className={`mx-auto mb-4 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`} size={48} />
            <h1 className={`text-3xl font-bold mb-2 ${
              darkMode
                ? 'bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent'
                : 'text-gray-900'
            }`}>
              Let's Start With a 3-Second Check-In
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Experience the power of DualTrack OS before we ask for anything else
            </p>
          </div>

          {/* Energy Level Selector */}
          <div className="mb-6">
            <label className={`block text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              <Battery className="inline mr-2" size={20} />
              How's your energy right now?
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => setEnergyLevel(level)}
                  className={`py-4 rounded-xl text-2xl font-bold transition-all ${
                    energyLevel === level
                      ? darkMode
                        ? 'bg-cyan-500/30 border-2 border-cyan-400 ring-2 ring-cyan-400/50 scale-105'
                        : 'bg-cyan-200 border-2 border-cyan-500 ring-2 ring-cyan-400/50 scale-105'
                      : darkMode
                        ? 'bg-gray-800/50 border-2 border-gray-700 hover:border-gray-600 hover:scale-105'
                        : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300 hover:scale-105'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <p className={`text-xs mt-2 text-center ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              1 = Exhausted • 5 = Energized
            </p>
          </div>

          {/* Mood Selector */}
          {energyLevel && (
            <div className="mb-6">
              <label className={`block text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                How are you feeling?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {moodOptions.map((moodOption) => (
                  <button
                    key={moodOption.id}
                    onClick={() => setMood(moodOption.id)}
                    className={`p-4 rounded-xl text-left transition-all ${
                      mood === moodOption.id
                        ? darkMode
                          ? 'bg-purple-500/30 border-2 border-purple-400 ring-2 ring-purple-400/50'
                          : 'bg-purple-200 border-2 border-purple-500 ring-2 ring-purple-400/50'
                        : darkMode
                          ? 'bg-gray-800/50 border-2 border-gray-700 hover:border-gray-600'
                          : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{moodOption.emoji}</div>
                    <div className={`text-sm font-medium ${
                      mood === moodOption.id
                        ? darkMode ? 'text-white' : 'text-gray-900'
                        : darkMode ? 'text-gray-400' : 'text-gray-700'
                    }`}>
                      {moodOption.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Smart Suggestions (shown after both selections) */}
          {suggestion && mood && (
            <div className={`mb-6 p-6 rounded-xl ${
              darkMode
                ? `bg-${suggestion.color}-500/10 border-2 border-${suggestion.color}-500/30`
                : `bg-${suggestion.color}-50 border-2 border-${suggestion.color}-200`
            }`}>
              <h3 className={`text-xl font-bold mb-3 ${
                darkMode ? `text-${suggestion.color}-300` : `text-${suggestion.color}-800`
              }`}>
                ✨ {suggestion.title}
              </h3>
              <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Based on your energy ({energyLevel}/5) and mood ({moodOptions.find(m => m.id === mood)?.label.toLowerCase()}), here's what to prioritize today:
              </p>
              <ul className="space-y-2">
                {suggestion.suggestions.map((item, idx) => (
                  <li key={idx} className={`flex items-start gap-2 text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <span className={`text-${suggestion.color}-500 mt-0.5`}>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Continue Button */}
          <button
            onClick={() => setStep(1)}
            disabled={!energyLevel || !mood}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              !energyLevel || !mood
                ? darkMode
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : darkMode
                  ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 text-white border-2 border-purple-500/50 shadow-lg shadow-purple-500/20'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
            }`}
          >
            {!energyLevel || !mood ? (
              'Select Your Energy & Mood'
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>Continue</span>
                <ArrowRight size={20} />
              </span>
            )}
          </button>

          <p className={`text-xs text-center mt-4 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            💡 This is how DualTrack works—we adapt to YOUR capacity, every single day
          </p>
        </div>
      </div>
    );
  }

  // ========================================
  // STEP 2: LIFE STAGE (Optional)
  // ========================================
  if (step === 2) {
    const age = parseInt(profile.age);
    const suggestedStage = age && age < 45 ? 'reproductive' : age < 56 ? 'perimenopause' : age < 61 ? 'menopause' : 'postmenopause';

    const lifeStages = [
      {
        id: 'reproductive',
        name: 'Peak Performance Years',
        ageRange: '25-45',
        emoji: '🌸',
        description: 'Energy pattern tracking, hormone awareness, and peak productivity optimization',
        features: ['Energy cycle tracking', 'Pattern-based recommendations', 'Productivity + wellness integration'],
        color: 'pink',
      },
      {
        id: 'perimenopause',
        name: 'Power Transition Years',
        ageRange: '45-55',
        emoji: '💪',
        description: 'Navigate transitions with strength-first mindset and adaptive systems',
        features: ['Energy pattern tracking', 'Adaptive workload management', 'Mental load visibility'],
        color: 'orange',
      },
      {
        id: 'menopause',
        name: 'Strength & Wisdom Years',
        ageRange: '55-65',
        emoji: '🌟',
        description: 'Optimize energy, maintain strength, and thrive through transformation',
        features: ['Energy management', 'Wellness tracking', 'Sustainable productivity'],
        color: 'purple',
      },
      {
        id: 'postmenopause',
        name: 'Longevity Years',
        ageRange: '65+',
        emoji: '✨',
        description: 'Vitality, strength, and purpose in your most powerful years',
        features: ['Longevity focus', 'Energy optimization', 'Holistic wellness'],
        color: 'blue',
      },
    ];

    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${
        darkMode ? 'bg-[#191919]' : 'bg-gradient-to-br from-purple-50 to-pink-50'
      }`}>
        <div className="fixed top-4 left-4 z-50">
          <Logo size="large" />
        </div>

        <div className={`max-w-4xl w-full rounded-2xl p-8 shadow-2xl ${
          darkMode
            ? 'bg-gray-800/50 border-2 border-gray-700/50 backdrop-blur-xl'
            : 'bg-white border-2 border-gray-100'
        }`}>
          <div className="text-center mb-8">
            <Heart className={`mx-auto mb-4 ${darkMode ? 'text-pink-400' : 'text-pink-600'}`} size={48} />
            <h1 className={`text-3xl font-bold mb-2 ${
              darkMode
                ? 'bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent'
                : 'text-gray-900'
            }`}>
              Personalize Your Experience (Optional)
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Select your life stage for tailored recommendations—or skip to use all features
            </p>
          </div>

          {/* Suggested stage banner */}
          {age && (
            <div className={`mb-6 p-4 rounded-lg ${
              darkMode ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'
            }`}>
              <p className={`text-sm text-center ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                💡 Based on your age ({age}), we suggest <strong>{lifeStages.find(s => s.id === suggestedStage)?.name}</strong>
                <br />
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  But you know yourself best—choose what feels right or skip this step!
                </span>
              </p>
            </div>
          )}

          {/* Life stage cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {lifeStages.map((stage) => {
              const isSelected = profile.lifeStage === stage.id;
              const isSuggested = stage.id === suggestedStage;

              return (
                <button
                  key={stage.id}
                  onClick={() => setProfile({ ...profile, lifeStage: stage.id })}
                  className={`p-6 rounded-xl text-left transition-all ${
                    isSelected
                      ? darkMode
                        ? `bg-${stage.color}-500/20 border-2 border-${stage.color}-500/50 ring-2 ring-${stage.color}-500/50`
                        : `bg-${stage.color}-100 border-2 border-${stage.color}-400 ring-2 ring-${stage.color}-400/50`
                      : isSuggested
                        ? darkMode
                          ? 'bg-gray-800/50 border-2 border-purple-500/30 hover:border-purple-500/50'
                          : 'bg-gray-50 border-2 border-purple-300 hover:border-purple-400'
                        : darkMode
                          ? 'bg-gray-800/30 border-2 border-gray-700 hover:border-gray-600'
                          : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {isSuggested && !isSelected && (
                    <div className={`mb-2 text-xs font-semibold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                      ⭐ Recommended for you
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-4xl">{stage.emoji}</span>
                    <div className="flex-1">
                      <h3 className={`text-lg font-bold ${
                        isSelected
                          ? darkMode ? 'text-white' : 'text-gray-900'
                          : darkMode ? 'text-gray-200' : 'text-gray-900'
                      }`}>
                        {stage.name}
                      </h3>
                      <p className={`text-xs ${
                        isSelected
                          ? darkMode ? `text-${stage.color}-400` : `text-${stage.color}-700`
                          : darkMode ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        Ages {stage.ageRange}
                      </p>
                    </div>
                    {isSelected && (
                      <CheckCircle className={`text-${stage.color}-500`} size={24} />
                    )}
                  </div>

                  <p className={`text-sm mb-3 ${
                    isSelected
                      ? darkMode ? 'text-gray-300' : 'text-gray-700'
                      : darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {stage.description}
                  </p>

                  <div className="space-y-1">
                    {stage.features.map((feature, idx) => (
                      <div key={idx} className={`text-xs flex items-start gap-2 ${
                        isSelected
                          ? darkMode ? 'text-gray-400' : 'text-gray-600'
                          : darkMode ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        <span className={isSelected ? `text-${stage.color}-500` : 'text-gray-500'}>✓</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => setStep(1)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              ← Back
            </button>

            {/* Skip Button */}
            <button
              onClick={handleComplete}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Skip (Use All Features)
            </button>

            {/* Continue with Selection */}
            <button
              onClick={handleComplete}
              disabled={!profile.lifeStage}
              className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
                !profile.lifeStage
                  ? darkMode
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : darkMode
                    ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 text-white border-2 border-purple-500/50 shadow-lg shadow-purple-500/20'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
              }`}
            >
              {profile.lifeStage ? (
                <span className="flex items-center justify-center space-x-2">
                  <CheckCircle size={20} />
                  <span>Let's Go!</span>
                </span>
              ) : (
                'Select a Life Stage'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // STEP 1: MINIMAL PROFILE (Default)
  // ========================================
  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      darkMode ? 'bg-[#191919]' : 'bg-gradient-to-br from-purple-50 to-pink-50'
    }`}>
      <div className="fixed top-4 left-4 z-50">
        <Logo size="large" />
      </div>

      <div className={`max-w-lg w-full rounded-2xl p-8 shadow-2xl ${
        darkMode
          ? 'bg-gray-800/50 border-2 border-gray-700/50 backdrop-blur-xl'
          : 'bg-white border-2 border-gray-100'
      }`}>
        <div className="text-center mb-8">
          <Sparkles className={`mx-auto mb-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} size={48} />
          <h1 className={`text-3xl font-bold mb-2 ${
            darkMode
              ? 'bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent'
              : 'text-gray-900'
          }`}>
            Welcome to DualTrack OS
          </h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Just a few quick details to personalize your experience
          </p>
        </div>

        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <User size={16} className="inline mr-2" />
              What should we call you?
            </label>
            <input
              type="text"
              value={profile.preferredName}
              onChange={(e) => setProfile({ ...profile, preferredName: e.target.value, name: e.target.value })}
              placeholder="e.g., Sarah or Boss Lady"
              className={`w-full px-4 py-3 rounded-lg transition-all ${
                darkMode
                  ? 'bg-gray-900/50 border-2 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-purple-500/50'
                  : 'bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500'
              }`}
            />
            <p className={`mt-1 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              This is how we'll address you throughout the app
            </p>
          </div>

          {/* Initials */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Your Initials (for avatar)
            </label>
            <input
              type="text"
              value={profile.initials}
              onChange={(e) => setProfile({ ...profile, initials: e.target.value.toUpperCase().slice(0, 3) })}
              placeholder="e.g., SJ or ABC"
              maxLength="3"
              className={`w-full px-4 py-3 rounded-lg transition-all text-center text-2xl font-bold tracking-wider ${
                darkMode
                  ? 'bg-gray-900/50 border-2 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-purple-500/50'
                  : 'bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500'
              }`}
            />
            <p className={`mt-1 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Will be displayed with a gradient in the header (2-3 letters)
            </p>
          </div>

          {/* Optional: Age (for life stage suggestion) */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Your Age <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>(optional, helps with recommendations)</span>
            </label>
            <input
              type="number"
              value={profile.age}
              onChange={(e) => setProfile({ ...profile, age: e.target.value })}
              placeholder="e.g., 42"
              min="18"
              max="100"
              className={`w-full px-4 py-3 rounded-lg transition-all ${
                darkMode
                  ? 'bg-gray-900/50 border-2 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-purple-500/50'
                  : 'bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500'
              }`}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-3">
          <button
            onClick={() => profile.age ? setStep(2) : handleComplete()}
            disabled={!profile.preferredName || !profile.initials}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              !profile.preferredName || !profile.initials
                ? darkMode
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : darkMode
                  ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 text-white border-2 border-purple-500/50 shadow-lg shadow-purple-500/20'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
            }`}
          >
            {!profile.preferredName || !profile.initials ? (
              'Please Enter Name & Initials'
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>{profile.age ? 'Continue' : 'Get Started'}</span>
                <ArrowRight size={20} />
              </span>
            )}
          </button>

          <p className={`text-xs text-center ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            {profile.age
              ? '💡 Next: Personalize based on your life stage (or skip to use all features)'
              : '✨ You can add more details later in Settings'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
