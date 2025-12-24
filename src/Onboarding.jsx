import React, { useState } from 'react';
import { User, Weight, Cake, Sparkles, AlertTriangle, CheckCircle, Heart, Flower2 } from 'lucide-react';
import Logo from './components/Logo';

const Onboarding = ({ onComplete, darkMode }) => {
  const [step, setStep] = useState(0); // 0: disclaimer, 1: profile, 2: life stage
  const [weightUnit, setWeightUnit] = useState('lbs'); // 'lbs' or 'kg'
  const [profile, setProfile] = useState({
    name: '',
    preferredName: '',
    initials: '',
    age: '',
    weight: '',
    weightUnit: 'lbs',
    lifeStage: '',
    avatar: '🦁' // Lioness - symbol of strength and adaptability
  });

  const handleComplete = () => {
    onComplete({
      ...profile,
      age: parseInt(profile.age) || null,
      weight: parseInt(profile.weight) || null,
      weightUnit: weightUnit,
      hasCompletedOnboarding: true,
      disclaimerAccepted: true
    });
  };

  // Disclaimer Screen
  if (step === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${
        darkMode ? 'bg-[#191919]' : 'bg-gradient-to-br from-purple-50 to-pink-50'
      }`}>
        {/* Logo - Top Left */}
        <div className="fixed top-4 left-4 z-50">
          <Logo size="large" />
        </div>

        <div className={`max-w-2xl w-full rounded-2xl p-8 shadow-2xl ${
          darkMode
            ? 'bg-gray-800/50 border-2 border-gray-700/50 backdrop-blur-xl'
            : 'bg-white border-2 border-gray-100'
        }`}>
          <div className="text-center mb-6">
            <AlertTriangle className={`mx-auto mb-4 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} size={48} />
            <h1 className={`text-3xl font-bold mb-2 ${
              darkMode
                ? 'bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent'
                : 'text-gray-900'
            }`}>
              Important Medical Disclaimer
            </h1>
          </div>

          <div className={`space-y-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'}`}>
              <p className="font-bold mb-2">PLEASE READ CAREFULLY:</p>
              <p className="leading-relaxed">
                DualTrack OS is a wellness tracking and organizational tool designed to help you manage your daily life.
                It is <strong className={darkMode ? 'text-amber-400' : 'text-amber-700'}>NOT</strong> a medical device,
                medical service, or a substitute for professional medical advice, diagnosis, or treatment.
              </p>
            </div>

            <div className={`space-y-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <p>
                <strong>No Doctor-Patient Relationship:</strong> This app does not create a doctor-patient or
                healthcare provider-patient relationship. All content, including suggestions, tips, and recommendations,
                is for informational and educational purposes only.
              </p>

              <p>
                <strong>Always Consult Your Healthcare Provider:</strong> Before starting any new health regimen,
                exercise program, dietary changes, or making decisions about your health, you should always consult
                with qualified healthcare professionals. This is especially important if you:
              </p>

              <ul className="list-disc pl-6 space-y-1">
                <li>Are experiencing hormonal changes or health transitions</li>
                <li>Have any pre-existing medical conditions</li>
                <li>Are taking any medications or supplements</li>
                <li>Are pregnant or nursing</li>
                <li>Have concerns about your physical or mental health</li>
              </ul>

              <p>
                <strong>Not FDA Approved:</strong> This app has not been evaluated or approved by the U.S. Food
                and Drug Administration (FDA) or any other regulatory body. The features, metrics, and suggestions
                provided are based on general wellness principles and are not intended to diagnose, treat, cure,
                or prevent any disease or medical condition.
              </p>

              <p>
                <strong>Emergency Situations:</strong> If you are experiencing a medical emergency, call 911 (or
                your local emergency number) immediately. Do not rely on this app for emergency medical situations.
              </p>

              <p>
                <strong>Individual Results May Vary:</strong> Any health and wellness outcomes discussed are not
                guaranteed and individual results will vary. Your health depends on many factors unique to you.
              </p>

              <p>
                <strong>Accuracy of Information:</strong> While we strive to provide accurate information, we make
                no representations or warranties about the completeness, accuracy, or reliability of any information,
                metrics, or calculations provided by this app.
              </p>

              <p>
                <strong>Limitation of Liability:</strong> To the fullest extent permitted by law, DualTrack OS and
                its creators disclaim all liability for any injury, loss, or damage that may result from use of this app.
              </p>

              <p className="font-bold mt-4">
                By clicking "I Understand and Agree" below, you acknowledge that you have read, understood, and agree
                to this disclaimer. You confirm that you will seek professional medical advice before making any
                health-related decisions and that you will not rely solely on this app for medical guidance.
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <button
              onClick={() => setStep(1)}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                darkMode
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white'
              }`}
            >
              I Understand and Agree
            </button>

            <p className={`text-xs text-center ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              You must accept this disclaimer to use DualTrack OS
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Life Stage Selection Screen (Step 2)
  if (step === 2) {
    const age = parseInt(profile.age);

    // Auto-suggest life stage based on age
    const suggestedStage = age < 45 ? 'reproductive' : age < 56 ? 'perimenopause' : age < 61 ? 'menopause' : 'postmenopause';

    const lifeStages = [
      {
        id: 'reproductive',
        name: 'Reproductive Years',
        ageRange: '18-44',
        emoji: '🌸',
        description: 'Cycle tracking, energy optimization, and hormone awareness',
        features: ['Menstrual cycle tracking', 'Phase-specific workouts & nutrition', 'Energy & mood insights'],
        color: 'pink',
      },
      {
        id: 'perimenopause',
        name: 'Perimenopause',
        ageRange: '45-55',
        emoji: '💪',
        description: 'Strength-first approach with minimal friction and maximum consistency',
        features: ['Binary daily check-ins', 'Strength progression tracking', 'Pull-up mastery program'],
        color: 'orange',
      },
      {
        id: 'menopause',
        name: 'Menopause',
        ageRange: '55-60',
        emoji: '🌟',
        description: 'Adapt and thrive through transition with specialized support',
        features: ['Symptom tracking', 'Energy management', 'Bone health focus'],
        color: 'purple',
      },
      {
        id: 'postmenopause',
        name: 'Post-Menopause',
        ageRange: '60+',
        emoji: '✨',
        description: 'Vitality, strength, and wisdom in your prime years',
        features: ['Longevity focus', 'Balance & mobility', 'Cognitive wellness'],
        color: 'blue',
      },
    ];

    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${
        darkMode ? 'bg-[#191919]' : 'bg-gradient-to-br from-purple-50 to-pink-50'
      }`}>
        {/* Logo - Top Left */}
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
              Personalize Your Journey
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Every woman's journey is unique. Choose the experience that feels right for you.
            </p>
          </div>

          {/* Suggested stage banner */}
          <div className={`mb-6 p-4 rounded-lg ${
            darkMode ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'
          }`}>
            <p className={`text-sm text-center ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
              💡 Based on your age ({age}), we suggest <strong>{lifeStages.find(s => s.id === suggestedStage)?.name}</strong>
              <br />
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                But you know yourself best - choose what feels right!
              </span>
            </p>
          </div>

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

          {/* Complete button */}
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
              {!profile.lifeStage ? (
                'Please Select Your Life Stage'
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <CheckCircle size={20} />
                  <span>Let's Go!</span>
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Profile Setup Screen (Step 1 - Default)
  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      darkMode ? 'bg-[#191919]' : 'bg-gradient-to-br from-purple-50 to-pink-50'
    }`}>
      {/* Logo - Top Left */}
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
            Let's personalize your experience
          </p>
        </div>

        <div className="space-y-6">
          {/* Welcome Message */}
          {/* Name */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <User size={16} className="inline mr-2" />
              Your Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="e.g., Sarah Johnson"
              className={`w-full px-4 py-3 rounded-lg transition-all ${
                darkMode
                  ? 'bg-gray-900/50 border-2 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-purple-500/50'
                  : 'bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500'
              }`}
            />
          </div>

          {/* Preferred Name */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              What Should We Call You?
            </label>
            <input
              type="text"
              value={profile.preferredName}
              onChange={(e) => setProfile({ ...profile, preferredName: e.target.value })}
              placeholder="e.g., Sarah or Boss Lady 😊"
              className={`w-full px-4 py-3 rounded-lg transition-all ${
                darkMode
                  ? 'bg-gray-900/50 border-2 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-purple-500/50'
                  : 'bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500'
              }`}
            />
            <p className={`mt-1 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              This is how the app will address you in messages
            </p>
          </div>

          {/* Initials */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <User size={16} className="inline mr-2" />
              Your Initials
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
              Will be displayed in the header (2-3 letters max)
            </p>
          </div>

          {/* Age */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <Cake size={16} className="inline mr-2" />
              Your Age
            </label>
            <input
              type="number"
              value={profile.age}
              onChange={(e) => setProfile({ ...profile, age: e.target.value })}
              placeholder="e.g., 48"
              min="18"
              max="100"
              className={`w-full px-4 py-3 rounded-lg transition-all ${
                darkMode
                  ? 'bg-gray-900/50 border-2 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-purple-500/50'
                  : 'bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500'
              }`}
            />
            <p className={`mt-1 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Helps us provide age-appropriate health and wellness tips
            </p>
          </div>

          {/* Weight */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <Weight size={16} className="inline mr-2" />
              Your Weight
            </label>

            {/* Unit Toggle */}
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => {
                  setWeightUnit('lbs');
                  setProfile({ ...profile, weightUnit: 'lbs' });
                }}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                  weightUnit === 'lbs'
                    ? darkMode
                      ? 'bg-purple-600 text-white border-2 border-purple-500'
                      : 'bg-purple-600 text-white border-2 border-purple-500'
                    : darkMode
                      ? 'bg-gray-800 text-gray-400 border-2 border-gray-700 hover:border-gray-600'
                      : 'bg-gray-100 text-gray-600 border-2 border-gray-300 hover:border-gray-400'
                }`}
              >
                lbs
              </button>
              <button
                type="button"
                onClick={() => {
                  setWeightUnit('kg');
                  setProfile({ ...profile, weightUnit: 'kg' });
                }}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                  weightUnit === 'kg'
                    ? darkMode
                      ? 'bg-purple-600 text-white border-2 border-purple-500'
                      : 'bg-purple-600 text-white border-2 border-purple-500'
                    : darkMode
                      ? 'bg-gray-800 text-gray-400 border-2 border-gray-700 hover:border-gray-600'
                      : 'bg-gray-100 text-gray-600 border-2 border-gray-300 hover:border-gray-400'
                }`}
              >
                kg
              </button>
            </div>

            <input
              type="number"
              value={profile.weight}
              onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
              placeholder={weightUnit === 'lbs' ? 'e.g., 150' : 'e.g., 68'}
              min={weightUnit === 'lbs' ? '50' : '20'}
              max={weightUnit === 'lbs' ? '500' : '250'}
              step="0.1"
              className={`w-full px-4 py-3 rounded-lg transition-all ${
                darkMode
                  ? 'bg-gray-900/50 border-2 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-purple-500/50'
                  : 'bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500'
              }`}
            />
            <p className={`mt-1 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Used to calculate your daily protein needs
              {weightUnit === 'lbs' ? ' (0.8-1g per lb of body weight)' : ' (1.8-2.2g per kg of body weight)'}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={() => setStep(2)}
            disabled={!profile.name || !profile.age || !profile.weight}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              !profile.name || !profile.age || !profile.weight
                ? darkMode
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : darkMode
                  ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 text-white border-2 border-purple-500/50 shadow-lg shadow-purple-500/20'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
            }`}
          >
            {!profile.name || !profile.age || !profile.weight ? (
              'Please Complete All Fields'
            ) : (
              <span className="flex items-center justify-center space-x-2">
                <span>Continue</span>
                <span>→</span>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
