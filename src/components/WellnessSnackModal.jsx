import React, { useState, useEffect, useCallback } from 'react';
import { X, Check, Activity, Apple, Heart } from 'lucide-react';
import useWellnessStore from '../store/useWellnessStore';
import useStore from '../store/useStore';
import BoxBreathingComponent from './BoxBreathingComponent';

import {
  WELLNESS_SNOOZE_DURATION_MS,
  EXERCISE_TARGETS,
} from '../constants';

const WellnessSnackModal = ({ currentTime, setDailyMetrics, setSpiritAnimalScore }) => {
  const {
    showWellnessSnackModal,
    wellnessSnackChoice,
    exerciseChoice,
    boxBreathingActive,
    missedHourPrompt,
    exerciseReps,
    exerciseTarget,
    exerciseActive,
    setShowWellnessSnackModal,
    setWellnessSnackChoice,
    setExerciseChoice,
    setBoxBreathingActive,
    setMissedHourPrompt,
    setExerciseReps,
    setExerciseTarget,
    setExerciseActive,
    dismissWellnessSnack,
    snoozeWellnessSnack,
    completeWellnessSnack,
    cancelExercise,
    cancelWellnessFlow,
    acceptWellnessPrompt,
    declineWellnessPrompt,
    incrementReps,
    decrementReps,
  } = useWellnessStore();
  const darkMode = useStore((state) => state.darkMode);

  // Helper function from App.jsx, eventually moved to a utility
  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const startExercise = useCallback((exercise) => {
    setExerciseChoice(exercise.id);
    setExerciseTarget(exercise.target || EXERCISE_TARGETS.squats);
    setExerciseReps(0);
    setExerciseActive(true);
  }, [setExerciseChoice, setExerciseTarget, setExerciseReps, setExerciseActive]);

  const completeExercise = useCallback(() => {
    setExerciseActive(false);
    completeWellnessSnack('exercise', currentTime, setDailyMetrics, setSpiritAnimalScore);
  }, [setExerciseActive, completeWellnessSnack, currentTime, setDailyMetrics, setSpiritAnimalScore]);

  const startBreathing = useCallback(() => {
    setWellnessSnackChoice('breathing');
    setBoxBreathingActive(true);
    setShowWellnessSnackModal(true);
  }, [setWellnessSnackChoice, setBoxBreathingActive, setShowWellnessSnackModal]);

  const startHydration = useCallback(() => {
    completeWellnessSnack('hydration', currentTime, setDailyMetrics, setSpiritAnimalScore);
  }, [completeWellnessSnack, currentTime, setDailyMetrics, setSpiritAnimalScore]);

  return showWellnessSnackModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg">
      {missedHourPrompt && (
        <div className={`max-w-md w-full rounded-3xl p-8 text-center ${darkMode ? 'bg-gray-900 border-2 border-rose-500/30 text-white' : 'bg-white border-2 border-rose-200 text-gray-900'}`}>
          <h3 className="text-2xl font-bold mb-4">Missed last hour's snack!</h3>
          <p className="text-gray-400 mb-6">Do you want to do a quick wellness snack now?</p>
          <div className="flex justify-around space-x-4">
            <button onClick={() => acceptWellnessPrompt()} className={`px-6 py-3 rounded-xl font-semibold transition-all ${darkMode ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30' : 'bg-rose-100 hover:bg-rose-200 text-rose-700 border border-rose-300'}`}>
              Yes, I'm ready!
            </button>
            <button onClick={() => declineWellnessPrompt(currentTime)} className={`px-6 py-3 rounded-xl font-semibold transition-all ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'}`}>
              No thanks
            </button>
          </div>
        </div>
      )}

      {!missedHourPrompt && wellnessSnackChoice === null && (
        <div className={`max-w-2xl w-full rounded-3xl p-8 text-center ${darkMode ? 'bg-gray-900 border-2 border-purple-500/30 text-white' : 'bg-white border-2 border-purple-200 text-gray-900'}`}>
          <h3 className="text-2xl font-bold mb-4">Time for a Wellness Snack!</h3>
          <p className="text-gray-400 mb-6">Choose a quick activity to re-center yourself:</p>
          <div className="grid grid-cols-3 gap-4">
            <button onClick={() => setWellnessSnackChoice('exercise')} className={`flex flex-col items-center p-4 rounded-xl transition-all ${darkMode ? 'bg-gray-800/50 border-2 border-gray-700/50 hover:border-orange-500/50' : 'bg-gray-50 border-2 border-gray-200 hover:border-orange-300'}`}>
              <Activity className="w-8 h-8 mb-2 text-orange-400" />
              <span className="font-semibold text-sm">Exercise</span>
            </button>
            <button onClick={startBreathing} className={`flex flex-col items-center p-4 rounded-xl transition-all ${darkMode ? 'bg-gray-800/50 border-2 border-gray-700/50 hover:border-purple-500/50' : 'bg-gray-50 border-2 border-gray-200 hover:border-purple-300'}`}>
              <Heart className="w-8 h-8 mb-2 text-purple-400" />
              <span className="font-semibold text-sm">Breathing</span>
            </button>
            <button onClick={startHydration} className={`flex flex-col items-center p-4 rounded-xl transition-all ${darkMode ? 'bg-gray-800/50 border-2 border-gray-700/50 hover:border-blue-500/50' : 'bg-gray-50 border-2 border-gray-200 hover:border-blue-300'}`}>
              <Apple className="w-8 h-8 mb-2 text-blue-400" />
              <span className="font-semibold text-sm">Hydration</span>
            </button>
          </div>
          <div className="mt-6 flex justify-around">
            <button onClick={() => snoozeWellnessSnack()} className={`px-6 py-3 rounded-xl font-semibold transition-all ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'}`}>
              Snooze (15 min)
            </button>
            <button onClick={() => dismissWellnessSnack(currentTime)} className={`px-6 py-3 rounded-xl font-semibold transition-all ${darkMode ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30' : 'bg-rose-100 hover:bg-rose-200 text-rose-700 border border-rose-300'}`}>
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Exercise Modal */}
      {!missedHourPrompt && wellnessSnackChoice === 'exercise' && !exerciseActive && (
        <div className={`max-w-2xl w-full rounded-3xl p-8 text-center ${darkMode ? 'bg-gray-900 border-2 border-orange-500/30 text-white' : 'bg-white border-2 border-orange-200 text-gray-900'}`}>
          <h3 className="text-2xl font-bold mb-4">Quick Exercise!</h3>
          <p className="text-gray-400 mb-6">Choose your exercise:</p>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(EXERCISE_TARGETS).map(([key, value]) => (
              <button key={key} onClick={() => startExercise({id: key, target: value})} className={`flex flex-col items-center p-4 rounded-xl transition-all ${darkMode ? 'bg-gray-800/50 border-2 border-gray-700/50 hover:border-orange-500/50' : 'bg-gray-50 border-2 border-gray-200 hover:border-orange-300'}`}>
                <Activity className="w-8 h-8 mb-2 text-orange-400" />
                <span className="font-semibold text-sm capitalize">{key}</span>
                <span className="text-xs text-gray-500">{value} reps</span>
              </button>
            ))}
          </div>
          <div className="mt-6">
            <button onClick={() => cancelWellnessFlow()} className={`px-6 py-3 rounded-xl font-semibold transition-all ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'}`}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Exercise in Progress */}
      {!missedHourPrompt && wellnessSnackChoice === 'exercise' && exerciseActive && (
        <div className={`max-w-2xl w-full rounded-3xl p-8 text-center ${darkMode ? 'bg-gray-900 border-2 border-orange-500/30 text-white' : 'bg-white border-2 border-orange-200 text-gray-900'}`}>
          <h3 className="text-2xl font-bold mb-4 capitalize">{exerciseChoice || 'Exercise'}</h3>
          <p className="text-gray-400 mb-6">Complete {exerciseTarget} reps. Current:</p>
          <div className="flex justify-center items-center space-x-6 mb-6">
            <button onClick={decrementReps} className={`p-4 rounded-full text-white ${darkMode ? 'bg-orange-600 hover:bg-orange-700' : 'bg-orange-500 hover:bg-orange-600'}`}>-</button>
            <span className="text-6xl font-bold text-orange-400">{exerciseReps}</span>
            <button onClick={incrementReps} className={`p-4 rounded-full text-white ${darkMode ? 'bg-orange-600 hover:bg-orange-700' : 'bg-orange-500 hover:bg-orange-600'}`}>+</button>
          </div>
          <div className="mt-6 flex justify-around space-x-4">
            <button onClick={completeExercise} className={`px-6 py-3 rounded-xl font-semibold transition-all ${darkMode ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border border-emerald-300'}`}>
              Complete
            </button>
            <button onClick={cancelExercise} className={`px-6 py-3 rounded-xl font-semibold transition-all ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'}`}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* BOX BREATHING MODAL */}
      {!missedHourPrompt && wellnessSnackChoice === 'breathing' && boxBreathingActive && (
        <BoxBreathingComponent
          darkMode={darkMode}
          onComplete={() => completeWellnessSnack('breathing', currentTime, setDailyMetrics, setSpiritAnimalScore)}
          onCancel={() => cancelWellnessFlow()}
        />
      )}
    </div>
  );
};

export default WellnessSnackModal;
