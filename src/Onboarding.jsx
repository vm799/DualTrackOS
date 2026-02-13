import React, { useState, useRef } from 'react';
import { Sparkles, CheckCircle, Heart, ArrowRight, AlertTriangle, Weight, Cake } from 'lucide-react';
import Logo from './components/Logo';
import ParentalConsentModal from './components/ParentalConsentModal';
import useStore from './store/useStore';

const Onboarding = ({ onComplete, darkMode }) => {
  const userProfile = useStore((state) => state.userProfile);
  // Steps: 0=Disclaimer, 1=Profile, 2=OptionalData, 3=LifeStage
  const [step, setStep] = useState(0);

  // Auto-advance if profile already has disclaimer accepted
  React.useEffect(() => {
    if (userProfile.disclaimerAccepted && step === 0) {
      setStep(1);
    }
  }, [userProfile.disclaimerAccepted, step]);

  const [weightUnit, setWeightUnit] = useState('lbs');

  // Profile State
  const [profile, setProfile] = useState({
    name: '',
    initials: '',
    age: '',
    weight: '',
    weightUnit: 'lbs',
    lifeStage: '',
    avatar: '🦁'
  });

  // Validation errors
  const [ageError, setAgeError] = useState('');
  const [weightError, setWeightError] = useState('');
  const [showParentalConsent, setShowParentalConsent] = useState(false);

  // Input refs for auto-focus
  const initialsInputRef = useRef(null);
  const ageInputRef = useRef(null);
  const weightInputRef = useRef(null);

  // Validation functions
  const validateAge = (age) => {
    const ageNum = parseInt(age);
    if (!age || age === '') {
      setAgeError('');
      return true; // Optional field
    }
    if (isNaN(ageNum)) {
      setAgeError('Please enter a valid number');
      return false;
    }
    if (ageNum < 13) {
      setAgeError('Must be at least 13 years old');
      return false;
    }
    if (ageNum > 110) {
      setAgeError('Age must be 110 or less');
      return false;
    }
    if (ageNum < 18) {
      setShowParentalConsent(true);
    }
    setAgeError('');
    return true;
  };

  const validateWeight = (weight) => {
    const weightNum = parseInt(weight);
    if (!weight || weight === '') {
      setWeightError('');
      return true; // Optional field
    }
    if (isNaN(weightNum)) {
      setWeightError('Please enter a valid number');
      return false;
    }

    // Different limits for lbs vs kg
    if (weightUnit === 'lbs') {
      if (weightNum < 50) {
        setWeightError('Weight must be at least 50 lbs');
        return false;
      }
      if (weightNum > 500) {
        setWeightError('Weight must be 500 lbs or less');
        return false;
      }
    } else { // kg
      if (weightNum < 23) {
        setWeightError('Weight must be at least 23 kg');
        return false;
      }
      if (weightNum > 227) {
        setWeightError('Weight must be 227 kg or less');
        return false;
      }
    }
    setWeightError('');
    return true;
  };

  // Smooth scroll to top helper function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Navigate to next step with auto-scroll
  const goToStep = (nextStep) => {
    setStep(nextStep);
    // Small delay to ensure DOM updates before scrolling
    setTimeout(() => scrollToTop(), 100);
  };

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

  // ========================================
  // STEP 0: LEGAL DISCLAIMER
  // ========================================
  if (step === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-[#191919]' : 'bg-gradient-to-br from-purple-50 to-pink-50'
        }`}>
        <div className="fixed top-4 left-4 z-50">
          <Logo size="large" />
        </div>

        <div className={`max-w-2xl w-full rounded-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto ${darkMode
          ? 'bg-gray-800/50 border-2 border-gray-700/50 backdrop-blur-xl'
          : 'bg-white border-2 border-gray-100'
          }`}>
          <div className="text-center mb-6">
            <AlertTriangle className={`mx-auto mb-4 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} size={48} />
            <h1 className={`text-3xl font-bold mb-2 ${darkMode
              ? 'bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent'
              : 'text-gray-900'
              }`}>
              Important Legal Disclaimer
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Please read carefully before using DualTrack OS
            </p>
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
                <strong>Data Privacy:</strong> Your personal health data is sensitive. We take reasonable measures
                to protect your information, but no system is 100% secure. You are responsible for maintaining the
                security of your account credentials.
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
              onClick={() => goToStep(1)}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${darkMode
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

  // ========================================
  // STEP 1: ESSENTIAL PROFILE
  // ========================================
  if (step === 1) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-[#191919]' : 'bg-gradient-to-br from-purple-50 to-pink-50'
        }`}>
        <div className="fixed top-4 left-4 z-50">
          <Logo size="large" />
        </div>

        <div className={`max-w-lg w-full rounded-2xl p-8 shadow-2xl ${darkMode
          ? 'bg-gray-800/50 border-2 border-gray-700/50 backdrop-blur-xl'
          : 'bg-white border-2 border-gray-100'
          }`}>
          <div className="text-center mb-8">
            <Sparkles className={`mx-auto mb-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} size={48} />
            <h1 className={`text-3xl font-bold mb-2 ${darkMode
              ? 'bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent'
              : 'text-gray-900'
              }`}>
              Welcome to DualTrack OS
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Just a couple quick details to get started
            </p>
          </div>

          <div className="space-y-6">
            {/* Initials */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Your Initials (for avatar)
              </label>
              <input
                ref={initialsInputRef}
                type="text"
                value={profile.initials}
                onChange={(e) => {
                  // Remove any numbers, keep only letters
                  const sanitized = e.target.value.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 3);
                  setProfile({ ...profile, initials: sanitized });
                }}
                placeholder="e.g., SJ or ABC"
                maxLength="3"
                className={`w-full px-4 py-3 rounded-lg transition-all text-center text-2xl font-bold tracking-wider ${darkMode
                  ? 'bg-gray-900/50 border-2 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-purple-500/50'
                  : 'bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500'
                  }`}
              />
              <p className={`mt-1 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Will be displayed with a gradient in the header (2-3 letters)
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-3">
            <button
              onClick={() => goToStep(2)}
              disabled={!profile.initials}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${!profile.initials
                ? darkMode
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : darkMode
                  ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 text-white border-2 border-purple-500/50 shadow-lg shadow-purple-500/20'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                }`}
            >
              {!profile.initials ? (
                'Enter Your Initials'
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>Continue</span>
                  <ArrowRight size={20} />
                </span>
              )}
            </button>

            <p className={`text-xs text-center ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              ✨ Next: Optional features (age for life stage, weight for protein recommendations)
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // STEP 2: OPTIONAL DATA (Age + Weight)
  // ========================================
  if (step === 2) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-[#191919]' : 'bg-gradient-to-br from-purple-50 to-pink-50'
        }`}>
        <div className="fixed top-4 left-4 z-50">
          <Logo size="large" />
        </div>

        <div className={`max-w-lg w-full rounded-2xl p-8 shadow-2xl ${darkMode
          ? 'bg-gray-800/50 border-2 border-gray-700/50 backdrop-blur-xl'
          : 'bg-white border-2 border-gray-100'
          }`}>
          <div className="text-center mb-8">
            <Sparkles className={`mx-auto mb-4 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`} size={48} />
            <h1 className={`text-3xl font-bold mb-2 ${darkMode
              ? 'bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent'
              : 'text-gray-900'
              }`}>
              Unlock More Features (Optional)
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Provide these details to unlock personalized recommendations—or skip to use core features
            </p>
          </div>

          <div className="space-y-6">
            {/* Age */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Cake size={16} className="inline mr-2" />
                Your Age <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>(optional)</span>
              </label>
              <input
                ref={ageInputRef}
                type="number"
                value={profile.age}
                onChange={(e) => {
                  const value = e.target.value;
                  setProfile({ ...profile, age: value });
                  const isValid = validateAge(value);

                  // Auto-focus weight field when valid age is entered (2 digits)
                  if (isValid && value.length >= 2 && weightInputRef.current) {
                    setTimeout(() => weightInputRef.current?.focus(), 100);
                  }
                }}
                onBlur={(e) => validateAge(e.target.value)}
                placeholder="e.g., 42"
                min="13"
                max="110"
                className={`w-full px-4 py-3 rounded-lg transition-all ${ageError ? 'border-red-500 focus:border-red-500' : ''
                  } ${darkMode
                    ? 'bg-gray-900/50 border-2 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-purple-500/50'
                    : 'bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500'
                  }`}
              />
              {ageError && (
                <p className="mt-1 text-sm text-red-500 font-medium">⚠️ {ageError}</p>
              )}
              <p className={`mt-1 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                🎯 <strong>Unlocks:</strong> Life stage personalization (energy patterns, recommendations tailored to your hormonal phase)
              </p>
            </div>

            {/* Weight */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Weight size={16} className="inline mr-2" />
                Your Weight <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>(optional)</span>
              </label>

              {/* Unit Toggle */}
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => {
                    setWeightUnit('lbs');
                    setProfile({ ...profile, weightUnit: 'lbs' });
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${weightUnit === 'lbs'
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
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${weightUnit === 'kg'
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
                ref={weightInputRef}
                type="number"
                value={profile.weight}
                onChange={(e) => {
                  const value = e.target.value;
                  setProfile({ ...profile, weight: value });
                  validateWeight(value);
                }}
                onBlur={(e) => validateWeight(e.target.value)}
                placeholder={weightUnit === 'lbs' ? 'e.g., 150' : 'e.g., 68'}
                min={weightUnit === 'lbs' ? '50' : '23'}
                max={weightUnit === 'lbs' ? '500' : '227'}
                step="0.1"
                className={`w-full px-4 py-3 rounded-lg transition-all ${weightError ? 'border-red-500 focus:border-red-500' : ''
                  } ${darkMode
                    ? 'bg-gray-900/50 border-2 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-purple-500/50'
                    : 'bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500'
                  }`}
              />
              {weightError && (
                <p className="mt-1 text-sm text-red-500 font-medium">⚠️ {weightError}</p>
              )}
              <p className={`mt-1 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                🍗 <strong>Unlocks:</strong> Personalized protein recommendations
                {weightUnit === 'lbs' ? ' (0.8-1g per lb)' : ' (1.8-2.2g per kg)'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-3">
            {/* Skip to Dashboard */}
            <button
              onClick={handleComplete}
              className={`w-full py-3 rounded-xl font-semibold transition-all ${darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
            >
              Skip - Use Core Features Only
            </button>

            {/* Continue to Life Stage */}
            <button
              onClick={() => profile.age ? goToStep(3) : handleComplete()}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${darkMode
                ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 text-white border-2 border-purple-500/50 shadow-lg shadow-purple-500/20'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                }`}
            >
              <span className="flex items-center justify-center gap-2">
                <span>{profile.age ? 'Continue to Life Stage' : 'Save & Get Started'}</span>
                <ArrowRight size={20} />
              </span>
            </button>

            <p className={`text-xs text-center ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              💡 You can always add this information later in Settings
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // STEP 3: LIFE STAGE (Optional)
  // ========================================
  if (step === 3) {
    const age = parseInt(profile.age);
    const suggestedStage = age && age < 40 ? 'reproductive' : age < 55 ? 'perimenopause' : 'postmenopause';

    const lifeStages = [
      {
        id: 'reproductive',
        name: 'Menstruating Years',
        ageRange: '15-45',
        emoji: '🌸',
        description: 'Regular menstrual cycles with predictable hormonal patterns',
        features: ['Cycle tracking (follicular, ovulation, luteal, menstrual)', 'Energy pattern by cycle phase', 'Hormone-aware productivity'],
        medicalNote: 'Regular periods, ovulation, reproductive hormone cycling',
        color: 'pink',
      },
      {
        id: 'perimenopause',
        name: 'Perimenopause',
        ageRange: '40-55',
        emoji: '💪',
        description: 'Transition phase with fluctuating hormones and irregular cycles',
        features: ['Variable energy tracking', 'Adaptive workload management', 'Hormone fluctuation support'],
        medicalNote: 'Irregular periods, hormonal changes, can last 4-10 years before menopause',
        color: 'orange',
      },
      {
        id: 'postmenopause',
        name: 'Postmenopause',
        ageRange: '50+',
        emoji: '✨',
        description: 'Post-menopausal hormonal state, no more menstrual cycles',
        features: ['Stable energy optimization', 'Strength & bone health focus', 'Long-term wellness'],
        medicalNote: 'Begins 12 months after final period, new hormonal baseline',
        color: 'purple',
      },
    ];

    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-[#191919]' : 'bg-gradient-to-br from-purple-50 to-pink-50'
        }`}>
        <div className="fixed top-4 left-4 z-50">
          <Logo size="large" />
        </div>

        <div className={`max-w-4xl w-full rounded-2xl p-8 shadow-2xl ${darkMode
          ? 'bg-gray-800/50 border-2 border-gray-700/50 backdrop-blur-xl'
          : 'bg-white border-2 border-gray-100'
          }`}>
          <div className="text-center mb-8">
            <Heart className={`mx-auto mb-4 ${darkMode ? 'text-pink-400' : 'text-pink-600'}`} size={48} />
            <h1 className={`text-3xl font-bold mb-2 ${darkMode
              ? 'bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent'
              : 'text-gray-900'
              }`}>
              Choose Your Life Stage (Optional)
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Select your life stage for tailored energy pattern recommendations—or skip to use all features
            </p>
          </div>

          {/* Suggested stage banner */}
          {age && (
            <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'
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
                  className={`p-6 rounded-xl text-left transition-all ${isSelected
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
                      <h3 className={`text-lg font-bold ${isSelected
                        ? darkMode ? 'text-white' : 'text-gray-900'
                        : darkMode ? 'text-gray-200' : 'text-gray-900'
                        }`}>
                        {stage.name}
                      </h3>
                      <p className={`text-xs ${isSelected
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

                  <p className={`text-sm mb-2 ${isSelected
                    ? darkMode ? 'text-gray-300' : 'text-gray-700'
                    : darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                    {stage.description}
                  </p>

                  {stage.medicalNote && (
                    <p className={`text-xs mb-3 italic ${isSelected
                      ? darkMode ? 'text-gray-500' : 'text-gray-500'
                      : darkMode ? 'text-gray-600' : 'text-gray-500'
                      }`}>
                      🩺 {stage.medicalNote}
                    </p>
                  )}

                  <div className="space-y-1">
                    {stage.features.map((feature, idx) => (
                      <div key={idx} className={`text-xs flex items-start gap-2 ${isSelected
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
              onClick={() => goToStep(2)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
            >
              ← Back
            </button>

            {/* Skip Button */}
            <button
              onClick={handleComplete}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${darkMode
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
              className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${!profile.lifeStage
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

  // Render Parental Consent Modal if triggered
  return (
    <>
      {showParentalConsent && (
        <ParentalConsentModal
          darkMode={darkMode}
          onConsent={() => setShowParentalConsent(false)}
          onGoBack={() => {
            setProfile({ ...profile, age: '' });
            setAgeError('');
            setShowParentalConsent(false);
          }}
        />
      )}
    </>
  );
};

export default Onboarding;
