import React from 'react';
import { Check, Dumbbell, FootprintsIcon, UtensilsCrossed, Ban, Moon } from 'lucide-react';
import useStore from '../store/useStore';
import useStrong50Store from '../store/useStrong50Store';

/**
 * Binary Daily Check-in Component
 * For Strong50 (perimenopause) users
 *
 * Philosophy:
 * - Binary completion only (Yes/No)
 * - No metrics, no shame
 * - Low cognitive load
 * - ONE screen, no scrolling
 */
const BinaryDailyCheckin = () => {
  const darkMode = useStore((state) => state.darkMode);
  const { getTodayCheckin, setDailyCheckin, getTodayCompletionCount, getTodayActivity } = useStrong50Store();

  const checkin = getTodayCheckin();
  const completionCount = getTodayCompletionCount();
  const todayActivity = getTodayActivity();

  const checks = [
    {
      id: 'strength',
      label: 'Strength / Cardio',
      sublabel: `Today: ${todayActivity?.replace('-', ' ') || 'Not set'}`,
      icon: Dumbbell,
      checked: checkin.strength,
    },
    {
      id: 'movement',
      label: 'Daily Movement',
      sublabel: 'Walk / Steps completed',
      icon: FootprintsIcon,
      checked: checkin.movement,
    },
    {
      id: 'protein',
      label: 'Protein at 3 Meals',
      sublabel: 'Breakfast, lunch, dinner',
      icon: UtensilsCrossed,
      checked: checkin.protein,
    },
    {
      id: 'noGrazing',
      label: 'No Grazing',
      sublabel: 'Avoided snacking between meals',
      icon: Ban,
      checked: checkin.noGrazing,
    },
    {
      id: 'sleep',
      label: 'Sleep Wind-down',
      sublabel: 'Evening routine completed',
      icon: Moon,
      checked: checkin.sleep,
    },
  ];

  const handleToggle = (id) => {
    setDailyCheckin(null, id, !checkin[id]);
  };

  // Get completion color
  const getCompletionColor = () => {
    if (completionCount === 5) return 'emerald';
    if (completionCount >= 3) return 'blue';
    if (completionCount >= 1) return 'yellow';
    return 'gray';
  };

  const color = getCompletionColor();

  return (
    <div className={`rounded-xl p-6 ${
      darkMode ? 'bg-gray-800/50 border-2 border-gray-700' : 'bg-white border-2 border-gray-200'
    }`}>
      {/* Header with progress */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Strong50 Daily Check-in
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Tick boxes. Close the day.
          </p>
        </div>
        <div className="text-center">
          <div className={`text-3xl font-bold ${
            color === 'emerald' ? 'text-emerald-500' :
            color === 'blue' ? 'text-blue-500' :
            color === 'yellow' ? 'text-yellow-500' :
            darkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            {completionCount}/5
          </div>
          <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
            Today
          </div>
        </div>
      </div>

      {/* Binary checkboxes - all on one screen */}
      <div className="space-y-3">
        {checks.map((check) => {
          const Icon = check.icon;
          const isChecked = check.checked;

          return (
            <button
              key={check.id}
              onClick={() => handleToggle(check.id)}
              className={`w-full p-4 rounded-xl transition-all flex items-center gap-4 ${
                isChecked
                  ? darkMode
                    ? 'bg-emerald-500/20 border-2 border-emerald-500/50'
                    : 'bg-emerald-100 border-2 border-emerald-400'
                  : darkMode
                    ? 'bg-gray-800/30 border-2 border-gray-700 hover:border-gray-600'
                    : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Checkbox */}
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isChecked
                  ? 'bg-emerald-500'
                  : darkMode ? 'bg-gray-700 border-2 border-gray-600' : 'bg-white border-2 border-gray-300'
              }`}>
                {isChecked && <Check size={16} className="text-white" strokeWidth={3} />}
              </div>

              {/* Icon */}
              <Icon
                size={24}
                className={isChecked ? 'text-emerald-500' : darkMode ? 'text-gray-400' : 'text-gray-500'}
              />

              {/* Label */}
              <div className="flex-1 text-left">
                <div className={`font-semibold ${
                  isChecked
                    ? darkMode ? 'text-emerald-400' : 'text-emerald-700'
                    : darkMode ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  {check.label}
                </div>
                <div className={`text-xs ${
                  isChecked
                    ? darkMode ? 'text-emerald-400/70' : 'text-emerald-600/70'
                    : darkMode ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  {check.sublabel}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Motivational message */}
      {completionCount === 5 && (
        <div className={`mt-6 p-4 rounded-lg text-center ${
          darkMode ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-200'
        }`}>
          <p className={`font-semibold ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
            💪 Perfect day! Consistency is strength.
          </p>
        </div>
      )}

      {completionCount === 0 && (
        <div className={`mt-6 p-4 rounded-lg text-center ${
          darkMode ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'
        }`}>
          <p className={`text-sm ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
            "Strong women train before life steals the day."
          </p>
        </div>
      )}
    </div>
  );
};

export default BinaryDailyCheckin;
