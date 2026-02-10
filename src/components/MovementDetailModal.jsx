import React, { useState } from 'react';
import { X, Check, Dumbbell, Activity } from 'lucide-react';
import useStore from '../store/useStore';
import useNDMStore from '../store/useNDMStore';

/**
 * Movement Detail Modal
 * Granular workout tracking for the Movement NDM
 */
const MovementDetailModal = ({ show, onClose }) => {
  const darkMode = useStore((state) => state.darkMode);
  const { ndm, setMovement } = useNDMStore();
  const [completedExercises, setCompletedExercises] = useState([]);

  if (!show) return null;

  const workouts = [
    {
      id: 'pullup',
      name: 'Pull-Up Pathway (Goal: 10)',
      exercises: [
        { id: 'negative-pullups', name: 'Negative Pull-ups', reps: '3 sets x 5 reps (Slow!)' },
        { id: 'scapular-shrugs', name: 'Scapular Shrugs', reps: '3 sets x 10 reps' },
        { id: 'deadhang', name: 'Dead Hang', reps: 'Max hold (Aim 60s)' },
        { id: 'inverted-rows', name: 'Inverted Rows', reps: '3 sets x 8 reps' },
      ],
      emoji: '🧗‍♀️'
    },
    {
      id: 'hiit',
      name: 'HIIT Session (20 min)',
      exercises: [
        { id: 'burpees', name: 'Burpees', reps: '20 reps' },
        { id: 'jump-squats', name: 'Jump Squats', reps: '25 reps' },
        { id: 'mountain-climbers', name: 'Mountain Climbers', reps: '30 sec' },
        { id: 'high-knees', name: 'High Knees', reps: '30 sec' },
      ],
      emoji: '🔥'
    },
    {
      id: 'strength',
      name: 'Strength Training',
      exercises: [
        { id: 'squats', name: 'Squats', reps: '25 reps' },
        { id: 'pushups', name: 'Push-ups', reps: '15 reps' },
        { id: 'lunges', name: 'Lunges', reps: '20 reps' },
        { id: 'plank', name: 'Plank', reps: '60 sec' },
      ],
      emoji: '💪'
    },
    {
      id: 'cardio',
      name: 'Cardio Blast',
      exercises: [
        { id: 'stairs', name: 'Stair Climbs', reps: '3 floors' },
        { id: 'jumping-jacks', name: 'Jumping Jacks', reps: '50 reps' },
        { id: 'run', name: 'Jog/Run', reps: '15 min' },
        { id: 'bike', name: 'Bike/Spin', reps: '20 min' },
      ],
      emoji: '🏃'
    },
    {
      id: 'yoga',
      name: 'Yoga & Flexibility',
      exercises: [
        { id: 'sun-salutations', name: 'Sun Salutations', reps: '5 rounds' },
        { id: 'warrior-poses', name: 'Warrior Poses', reps: '10 breaths each' },
        { id: 'forward-fold', name: 'Forward Fold', reps: '2 min hold' },
        { id: 'child-pose', name: "Child's Pose", reps: '2 min hold' },
      ],
      emoji: '🧘'
    }
  ];

  const toggleExercise = (exerciseId) => {
    setCompletedExercises(prev =>
      prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const markComplete = () => {
    setMovement(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4 py-12">
        <div className={`max-w-4xl w-full rounded-3xl ${darkMode ? 'bg-gray-900 border-2 border-orange-500/30' : 'bg-white border-2 border-orange-200'
          }`}>
          {/* Close button */}
          <div className="flex justify-end p-4">
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="px-8 pb-8">
            <div className="flex items-center gap-3 mb-2">
              <Activity className={darkMode ? 'text-orange-400' : 'text-orange-600'} size={32} />
              <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Movement Non-Negotiable
              </h3>
            </div>

            <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Choose a workout and track your exercises. Complete to mark your daily Movement NDM!
            </p>

            {ndm.movement && (
              <div className={`p-4 rounded-xl mb-6 ${darkMode ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-300'
                }`}>
                <p className={`text-sm font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                  ✅ Movement complete for today! Amazing work.
                </p>
              </div>
            )}

            {/* Workout Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workouts.map(workout => (
                <div
                  key={workout.id}
                  className={`rounded-xl p-5 ${darkMode
                    ? 'bg-gray-800/50 border-2 border-gray-700 hover:border-orange-500/50'
                    : 'bg-gray-50 border-2 border-gray-200 hover:border-orange-300'
                    } transition-all`}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">{workout.emoji}</span>
                    <h4 className={`font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      {workout.name}
                    </h4>
                  </div>

                  <div className="space-y-2">
                    {workout.exercises.map(exercise => {
                      const isCompleted = completedExercises.includes(exercise.id);
                      return (
                        <button
                          key={exercise.id}
                          onClick={() => toggleExercise(exercise.id)}
                          className={`w-full text-left p-3 rounded-lg transition-all flex items-center gap-3 ${isCompleted
                            ? darkMode
                              ? 'bg-emerald-500/20 border-2 border-emerald-500/40'
                              : 'bg-emerald-100 border-2 border-emerald-300'
                            : darkMode
                              ? 'bg-gray-900/50 border-2 border-gray-700/50 hover:border-orange-500/50'
                              : 'bg-white border-2 border-gray-200 hover:border-orange-300'
                            }`}
                        >
                          <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${isCompleted
                            ? darkMode ? 'bg-emerald-500' : 'bg-emerald-500'
                            : darkMode ? 'bg-gray-700' : 'bg-gray-300'
                            }`}>
                            {isCompleted && <Check size={14} className="text-white" />}
                          </div>
                          <div className="flex-1">
                            <div className={`text-sm font-semibold ${isCompleted
                              ? darkMode ? 'text-emerald-400' : 'text-emerald-700'
                              : darkMode ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                              {exercise.name}
                            </div>
                            <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                              {exercise.reps}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={onClose}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${darkMode
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-400'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                  }`}
              >
                Close
              </button>
              <button
                onClick={markComplete}
                disabled={ndm.movement}
                className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${ndm.movement
                  ? darkMode
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : darkMode
                    ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  }`}
              >
                <Dumbbell size={18} />
                {ndm.movement ? 'Already Complete' : 'Mark Complete'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovementDetailModal;
