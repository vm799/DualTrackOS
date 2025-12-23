import React, { useState } from 'react';
import { Activity, Droplets, Footprints, Heart, X, Check, Sparkles } from 'lucide-react';
import useWellnessStore from '../store/useWellnessStore';
import useStore from '../store/useStore';
import BoxBreathingComponent from './BoxBreathingComponent';

const WellnessSnackModal = ({ currentTime, setDailyMetrics, setSpiritAnimalScore }) => {
  const {
    showWellnessSnackModal,
    setShowWellnessSnackModal,
    dismissWellnessSnack,
    snoozeWellnessSnack,
    completeWellnessSnack,
  } = useWellnessStore();
  const darkMode = useStore((state) => state.darkMode);

  const [selectedActivity, setSelectedActivity] = useState(null);
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [stepCount, setStepCount] = useState(0);
  const [stretchCount, setStretchCount] = useState(0);
  const [resistanceCount, setResistanceCount] = useState(0);
  const [breathingActive, setBreathingActive] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const activities = [
    {
      id: 'water',
      name: 'Hydrate',
      icon: Droplets,
      color: 'blue',
      emoji: '💧',
      target: 1,
      unit: 'glass',
      motivation: "Your body is 60% water. Let's refresh and rehydrate!",
      benefits: ['Boosts energy', 'Improves focus', 'Supports metabolism'],
      instructions: [
        'Fill a glass with 8oz of water',
        'Drink slowly over 1-2 minutes',
        'Notice how refreshing it feels',
      ],
    },
    {
      id: 'steps',
      name: 'Quick Steps',
      icon: Footprints,
      color: 'green',
      emoji: '👟',
      target: 100,
      unit: 'steps',
      motivation: "Just 100 steps! Get your blood flowing and energy up.",
      benefits: ['Increases circulation', 'Reduces stiffness', 'Boosts mood', 'Stabilizes blood sugar'],
      instructions: [
        'Stand up and find a clear space',
        'Walk at a comfortable pace',
        'Count to 100 or use the counter',
        'Around the room or up/down stairs works great!',
      ],
    },
    {
      id: 'stretch',
      name: 'Quick Stretch',
      icon: Activity,
      color: 'orange',
      emoji: '🙆‍♀️',
      target: 3,
      unit: 'stretches',
      motivation: "Release tension in 60 seconds. Your body will thank you!",
      benefits: ['Relieves tension', 'Improves posture', 'Increases flexibility'],
      instructions: [
        'Stand or sit comfortably',
        'Complete each stretch slowly',
        'Hold each for 10 seconds',
        'Breathe deeply throughout',
      ],
    },
    {
      id: 'resistance',
      name: 'Resistance Snack',
      icon: Activity,
      color: 'red',
      emoji: '💪',
      target: 4,
      unit: 'exercises',
      motivation: "Quick resistance moves to maintain muscle and regulate blood sugar!",
      benefits: ['Builds strength', 'Stabilizes blood sugar', 'Boosts metabolism', 'Increases insulin sensitivity'],
      instructions: [
        'No equipment needed - use your bodyweight',
        'Complete each exercise for 30-60 seconds',
        'Focus on controlled movements',
        'Rest 10 seconds between exercises',
        'Blood sugar tip: Muscle activity helps glucose uptake without insulin spikes',
      ],
    },
    {
      id: 'breathing',
      name: 'Box Breathing',
      icon: Heart,
      color: 'purple',
      emoji: '🫁',
      target: 4,
      unit: 'cycles',
      motivation: "4 breaths to calm your nervous system and reset.",
      benefits: ['Reduces stress', 'Increases focus', 'Calms mind', 'Lowers cortisol'],
      instructions: [
        'Find a comfortable seated position',
        'Close your eyes or soften your gaze',
        'Follow the visual guide for each phase:',
        '  • Breathe IN for 4 seconds',
        '  • HOLD for 4 seconds',
        '  • Breathe OUT for 4 seconds',
        '  • HOLD for 4 seconds',
        'Complete 4 full cycles',
        'Notice the calming effect on your nervous system',
      ],
    },
    {
      id: 'mindful',
      name: 'Mindful Moment',
      icon: Sparkles,
      color: 'pink',
      emoji: '✨',
      target: 1,
      unit: 'minute',
      motivation: "60 seconds of presence. Notice what's around you.",
      benefits: ['Reduces anxiety', 'Improves awareness', 'Boosts gratitude'],
      instructions: [
        'Pause what you\'re doing',
        'Take 5 deep breaths',
        'Notice your surroundings using all senses',
        'Let thoughts pass without judgment',
      ],
    },
  ];

  const getActivity = (id) => activities.find(a => a.id === id);

  const startActivity = (activityId) => {
    setSelectedActivity(activityId);
    setShowInstructions(true);
  };

  const startActivityFromInstructions = () => {
    setShowInstructions(false);
    if (selectedActivity === 'breathing') {
      setBreathingActive(true);
    }
  };

  const completeActivity = () => {
    completeWellnessSnack(selectedActivity, currentTime, setDailyMetrics, setSpiritAnimalScore);
    setSelectedActivity(null);
    setWaterGlasses(0);
    setStepCount(0);
    setStretchCount(0);
    setResistanceCount(0);
    setBreathingActive(false);
    setShowInstructions(false);
    setShowWellnessSnackModal(false);
  };

  const cancelActivity = () => {
    setSelectedActivity(null);
    setWaterGlasses(0);
    setStepCount(0);
    setStretchCount(0);
    setResistanceCount(0);
    setBreathingActive(false);
    setShowInstructions(false);
  };

  // Water tracking visual
  const renderWaterGlasses = () => {
    return (
      <div className="flex justify-center gap-2 my-6">
        {[1].map((glass) => (
          <button
            key={glass}
            onClick={() => setWaterGlasses(glass)}
            className="relative transition-all hover:scale-110"
          >
            <div className={`w-16 h-24 rounded-b-lg border-4 transition-all ${
              waterGlasses >= glass
                ? 'border-blue-500 bg-blue-400/30'
                : darkMode
                ? 'border-gray-700 bg-gray-800/30'
                : 'border-gray-300 bg-gray-100'
            }`}>
              {waterGlasses >= glass && (
                <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-blue-400 to-blue-300 rounded-b-lg animate-[fillUp_0.5s_ease-out]"
                     style={{
                       height: '90%',
                       opacity: 0.6
                     }}
                />
              )}
            </div>
            <div className="text-xs mt-1 text-center">
              {waterGlasses >= glass ? '✅' : '💧'}
            </div>
          </button>
        ))}
      </div>
    );
  };

  // Steps counter visual
  const renderStepsCounter = () => {
    const progress = Math.min((stepCount / 100) * 100, 100);
    return (
      <div className="my-6">
        <div className="flex justify-center items-center mb-4">
          <button
            onClick={() => setStepCount(Math.max(0, stepCount - 10))}
            className={`p-3 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            -10
          </button>
          <div className="mx-8 text-center">
            <div className="text-6xl font-bold text-green-400">{stepCount}</div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              / 100 steps
            </div>
          </div>
          <button
            onClick={() => setStepCount(Math.min(100, stepCount + 10))}
            className={`p-3 rounded-full ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white`}
          >
            +10
          </button>
        </div>
        <div className={`h-4 rounded-full overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs text-center mt-2">
          {stepCount >= 100 ? (
            <span className="text-green-400 font-bold">🎉 Goal reached! Amazing!</span>
          ) : (
            <span className={darkMode ? 'text-gray-500' : 'text-gray-600'}>
              Just {100 - stepCount} more steps to go!
            </span>
          )}
        </div>
      </div>
    );
  };

  // Stretch counter visual
  const renderStretchCounter = () => {
    const stretches = ['Neck Rolls', 'Shoulder Shrugs', 'Side Bend'];
    return (
      <div className="my-6 space-y-3">
        {stretches.map((stretch, idx) => (
          <button
            key={idx}
            onClick={() => setStretchCount(Math.max(stretchCount, idx + 1))}
            className={`w-full p-4 rounded-xl transition-all ${
              stretchCount > idx
                ? darkMode
                  ? 'bg-orange-500/20 border-2 border-orange-500/50'
                  : 'bg-orange-100 border-2 border-orange-300'
                : darkMode
                ? 'bg-gray-800/50 border-2 border-gray-700 hover:border-gray-600'
                : 'bg-gray-100 border-2 border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">{stretch}</span>
              {stretchCount > idx && (
                <Check className="text-orange-400" size={20} />
              )}
            </div>
          </button>
        ))}
      </div>
    );
  };

  // Resistance exercises visual
  const renderResistanceExercises = () => {
    const exercises = [
      { name: 'Gorilla Rows', tip: 'Hinge forward, pull elbows back alternating sides' },
      { name: 'Air Squats', tip: 'Feet shoulder-width, lower hips below knees' },
      { name: 'Calf Raises', tip: 'Rise onto toes, hold 2 seconds, lower slowly' },
      { name: 'Press Ups', tip: 'Modified on knees or full plank position' },
    ];
    return (
      <div className="my-6 space-y-3">
        {exercises.map((exercise, idx) => (
          <button
            key={idx}
            onClick={() => setResistanceCount(Math.max(resistanceCount, idx + 1))}
            className={`w-full p-4 rounded-xl transition-all ${
              resistanceCount > idx
                ? darkMode
                  ? 'bg-red-500/20 border-2 border-red-500/50'
                  : 'bg-red-100 border-2 border-red-300'
                : darkMode
                ? 'bg-gray-800/50 border-2 border-gray-700 hover:border-gray-600'
                : 'bg-gray-100 border-2 border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex flex-col items-start">
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-semibold">{exercise.name}</span>
                {resistanceCount > idx && (
                  <Check className="text-red-400" size={20} />
                )}
              </div>
              <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                {exercise.tip}
              </span>
            </div>
          </button>
        ))}
        <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-blue-900/20 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
          <p className={`text-xs ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
            💡 <strong>Blood Sugar Tip:</strong> Resistance exercise increases insulin sensitivity and helps muscles absorb glucose without causing insulin spikes. Perfect for hormonal balance!
          </p>
        </div>
      </div>
    );
  };

  // Mindful moment timer
  const renderMindfulTimer = () => {
    return (
      <div className="my-6 text-center">
        <div className="text-6xl mb-4">✨</div>
        <p className={`text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Take 5 deep breaths and notice:
        </p>
        <div className="space-y-3 text-left max-w-sm mx-auto">
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
            👀 Something you can <span className="font-bold">see</span>
          </div>
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
            👂 Something you can <span className="font-bold">hear</span>
          </div>
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
            🤲 Something you can <span className="font-bold">feel</span>
          </div>
        </div>
      </div>
    );
  };

  if (!showWellnessSnackModal) return null;

  // Instructions screen (shown before activity starts)
  if (showInstructions && selectedActivity) {
    const activity = getActivity(selectedActivity);
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-lg">
        <div className="min-h-screen flex items-center justify-center p-4 py-12">
          <div className={`max-w-2xl w-full rounded-3xl ${
            darkMode ? 'bg-gray-900 border-2 border-purple-500/30' : 'bg-white border-2 border-purple-200'
          }`}>
            {/* Close button */}
            <div className="flex justify-end p-4">
              <button
                onClick={cancelActivity}
                className={`p-2 rounded-lg transition-all ${
                  darkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="px-8 pb-8">
              <div className="text-center mb-6">
                <div className="text-6xl mb-3">{activity.emoji}</div>
                <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {activity.name}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {activity.motivation}
                </p>
              </div>

              {/* Instructions */}
              <div className={`p-6 rounded-xl mb-6 ${
                darkMode ? 'bg-gray-800/50 border-2 border-purple-500/30' : 'bg-purple-50 border-2 border-purple-200'
              }`}>
                <h4 className={`text-lg font-bold mb-3 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                  📋 Instructions
                </h4>
                <ul className="space-y-2">
                  {activity.instructions.map((instruction, idx) => (
                    <li key={idx} className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {instruction}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div className={`p-4 rounded-xl mb-6 ${
                darkMode ? 'bg-gray-800/50' : 'bg-gray-50'
              }`}>
                <h4 className={`text-sm font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Benefits:
                </h4>
                <ul className="space-y-1">
                  {activity.benefits.map((benefit, idx) => (
                    <li key={idx} className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      ✓ {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Start button */}
              <div className="flex gap-3">
                <button
                  onClick={cancelActivity}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                    darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={startActivityFromInstructions}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                    darkMode
                      ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border-2 border-purple-500/50'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  Start Activity →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Activity in progress view
  if (selectedActivity && !breathingActive && !showInstructions) {
    const activity = getActivity(selectedActivity);
    const isComplete =
      (selectedActivity === 'water' && waterGlasses >= 1) ||
      (selectedActivity === 'steps' && stepCount >= 100) ||
      (selectedActivity === 'stretch' && stretchCount >= 3) ||
      (selectedActivity === 'resistance' && resistanceCount >= 4) ||
      (selectedActivity === 'mindful');

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-lg">
        <div className="min-h-screen flex items-center justify-center p-4 py-12">
          <div className={`max-w-2xl w-full rounded-3xl ${
            darkMode ? 'bg-gray-900 border-2 border-purple-500/30' : 'bg-white border-2 border-purple-200'
          }`}>
            {/* Close button */}
            <div className="flex justify-end p-4">
              <button
                onClick={cancelActivity}
                className={`p-2 rounded-lg transition-all ${
                  darkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="px-8 pb-8">
              <div className="text-center mb-6">
                <div className="text-6xl mb-3">{activity.emoji}</div>
                <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {activity.name}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {activity.motivation}
                </p>
              </div>

              {/* Activity-specific visual */}
              {selectedActivity === 'water' && renderWaterGlasses()}
              {selectedActivity === 'steps' && renderStepsCounter()}
              {selectedActivity === 'stretch' && renderStretchCounter()}
              {selectedActivity === 'resistance' && renderResistanceExercises()}
              {selectedActivity === 'mindful' && renderMindfulTimer()}

              {/* Benefits */}
              <div className={`p-4 rounded-xl mb-6 ${
                darkMode ? 'bg-gray-800/50' : 'bg-gray-50'
              }`}>
                <h4 className={`text-sm font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Benefits:
                </h4>
                <ul className="space-y-1">
                  {activity.benefits.map((benefit, idx) => (
                    <li key={idx} className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      ✓ {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Complete button */}
              <div className="flex gap-3">
                <button
                  onClick={cancelActivity}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                    darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={completeActivity}
                  disabled={!isComplete}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                    isComplete
                      ? darkMode
                        ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border-2 border-emerald-500/50'
                        : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border-2 border-emerald-300'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isComplete ? '✅ Complete' : 'Complete the activity'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Box Breathing view
  if (breathingActive) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg">
        <BoxBreathingComponent
          darkMode={darkMode}
          onComplete={completeActivity}
          onCancel={cancelActivity}
        />
      </div>
    );
  }

  // Activity selection menu
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-lg">
      <div className="min-h-screen flex items-center justify-center p-4 py-12">
        <div className={`max-w-3xl w-full rounded-3xl ${
          darkMode ? 'bg-gray-900 border-2 border-purple-500/30' : 'bg-white border-2 border-purple-200'
        }`}>
          {/* Close button */}
          <div className="flex justify-end p-4">
            <button
              onClick={() => setShowWellnessSnackModal(false)}
              className={`p-2 rounded-lg transition-all ${
                darkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
            >
              <X size={24} />
            </button>
          </div>

          {/* Header */}
          <div className="px-8 pb-6 text-center">
            <h3 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              🌟 Time for a Wellness Snack!
            </h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Choose a quick 60-second activity to recharge and refocus
            </p>
          </div>

          {/* Activity grid */}
          <div className="px-8 pb-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {activities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <button
                    key={activity.id}
                    onClick={() => startActivity(activity.id)}
                    className={`p-6 rounded-xl transition-all border-2 ${
                      darkMode
                        ? `bg-gray-800/50 border-gray-700 hover:border-${activity.color}-500/50 hover:bg-${activity.color}-500/10`
                        : `bg-gray-50 border-gray-200 hover:border-${activity.color}-300 hover:bg-${activity.color}-50`
                    }`}
                  >
                    <div className="text-4xl mb-2">{activity.emoji}</div>
                    <Icon className={`text-${activity.color}-400 mx-auto mb-2`} size={24} />
                    <div className={`font-bold text-sm mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {activity.name}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                      {activity.target} {activity.unit}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => snoozeWellnessSnack()}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                  darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                }`}
              >
                ⏰ Snooze (15 min)
              </button>
              <button
                onClick={() => dismissWellnessSnack(currentTime)}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                  darkMode ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30' : 'bg-rose-100 hover:bg-rose-200 text-rose-700 border border-rose-300'
                }`}
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WellnessSnackModal;
