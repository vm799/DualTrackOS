import React, { useState } from 'react';
import { User, Weight, Cake, Sparkles, AlertTriangle, CheckCircle } from 'lucide-react';

const Onboarding = ({ onComplete, darkMode }) => {
  const [step, setStep] = useState(0); // 0: disclaimer, 1: profile
  const [profile, setProfile] = useState({
    name: '',
    preferredName: '',
    age: '',
    weight: '',
    avatar: '🥚' // Everyone starts with an egg that hatches as they practice balance
  });

  // Note: Avatar will evolve automatically based on your balance score
  // No need to choose - your spirit animal will grow with you!
  const avatarOptions = ['🥚']; // Starting point for everyone

  const handleComplete = () => {
    onComplete({
      ...profile,
      age: parseInt(profile.age) || null,
      weight: parseInt(profile.weight) || null,
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

  // Profile Setup Screen
  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      darkMode ? 'bg-[#191919]' : 'bg-gradient-to-br from-purple-50 to-pink-50'
    }`}>
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
          {/* Spirit Animal Introduction */}
          <div className={`p-6 rounded-2xl ${
            darkMode
              ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-2 border-purple-500/30'
              : 'bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200'
          }`}>
            <div className="text-center mb-4">
              <div className="text-6xl mb-3">🥚✨</div>
              <h3 className={`font-bold text-lg mb-2 ${
                darkMode
                  ? 'bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent'
                  : 'text-purple-700'
              }`}>
                Your Spirit Animal Awaits
              </h3>
            </div>
            <p className={`text-sm text-center leading-relaxed ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Everyone begins with an <span className="font-semibold">egg</span> that will hatch and grow into a
              mystical <span className="font-semibold">Kitsune (fox spirit)</span> as you practice balance and self-care.
              Your spirit animal evolves based on how well you honor your energy, emotions, and body.
            </p>
            <p className={`text-xs text-center mt-3 italic ${
              darkMode ? 'text-gray-500' : 'text-gray-600'
            }`}>
              🥚 → 🐣 → 🦊 → ✨🦊 → 🌟🦊✨
            </p>
          </div>

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
              Your Weight (lbs)
            </label>
            <input
              type="number"
              value={profile.weight}
              onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
              placeholder="e.g., 150"
              min="50"
              max="500"
              className={`w-full px-4 py-3 rounded-lg transition-all ${
                darkMode
                  ? 'bg-gray-900/50 border-2 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-purple-500/50'
                  : 'bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500'
              }`}
            />
            <p className={`mt-1 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Used to calculate your daily protein needs (0.8-1g per lb of body weight)
            </p>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleComplete}
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
                <CheckCircle size={20} />
                <span>Let's Go!</span>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
