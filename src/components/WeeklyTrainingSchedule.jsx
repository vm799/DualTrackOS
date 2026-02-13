import React, { useState } from 'react';
import { Calendar, Dumbbell, Heart, Flower2, BedDouble } from 'lucide-react';
import useStore from '../store/useStore';
import useStrong50Store from '../store/useStrong50Store';

/**
 * Weekly Training Schedule
 * For Strong50 users - assign training types to days
 * Set once, repeats weekly
 */
const WeeklyTrainingSchedule = () => {
  const darkMode = useStore((state) => state.darkMode);
  const { weeklySchedule, setWeeklySchedule, getTodayActivity } = useStrong50Store();
  const [isEditing, setIsEditing] = useState(false);

  const activityTypes = [
    { id: 'gym-strength', name: 'Gym Strength', emoji: '🏋️', icon: Dumbbell, color: 'orange' },
    { id: 'home-strength', name: 'Home Strength', emoji: '💪', icon: Dumbbell, color: 'purple' },
    { id: 'cardio', name: 'Cardio', emoji: '🏃', icon: Heart, color: 'red' },
    { id: 'mobility', name: 'Mobility/Yoga', emoji: '🧘', icon: Flower2, color: 'green' },
    { id: 'rest', name: 'Rest Day', emoji: '😴', icon: BedDouble, color: 'blue' },
  ];

  const days = [
    { key: 'monday', name: 'Mon' },
    { key: 'tuesday', name: 'Tue' },
    { key: 'wednesday', name: 'Wed' },
    { key: 'thursday', name: 'Thu' },
    { key: 'friday', name: 'Fri' },
    { key: 'saturday', name: 'Sat' },
    { key: 'sunday', name: 'Sun' },
  ];

  const todayActivity = getTodayActivity();
  const todayIndex = new Date().getDay(); // 0 = Sunday
  const adjustedTodayIndex = todayIndex === 0 ? 6 : todayIndex - 1; // Convert to Monday=0

  return (
    <div className={`rounded-xl p-6 ${
      darkMode ? 'bg-gray-800/50 border-2 border-gray-700' : 'bg-white border-2 border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className={darkMode ? 'text-purple-400' : 'text-purple-600'} size={28} />
          <div>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Weekly Training Schedule
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Set it once, repeat weekly
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            isEditing
              ? darkMode
                ? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/50'
                : 'bg-emerald-100 text-emerald-700 border-2 border-emerald-400'
              : darkMode
                ? 'bg-purple-500/20 text-purple-400 border-2 border-purple-500/50'
                : 'bg-purple-100 text-purple-700 border-2 border-purple-400'
          }`}
        >
          {isEditing ? 'Done' : 'Edit'}
        </button>
      </div>

      {/* Week grid */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {days.map((day, index) => {
          const isToday = index === adjustedTodayIndex;
          const activityId = weeklySchedule[day.key];
          const activity = activityTypes.find((a) => a.id === activityId);
          const Icon = activity?.icon;

          return (
            <div key={day.key} className="text-center">
              <div className={`text-xs font-semibold mb-2 ${
                isToday
                  ? darkMode ? 'text-purple-400' : 'text-purple-600'
                  : darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {day.name}
              </div>
              <div className={`p-3 rounded-lg ${
                isToday
                  ? darkMode
                    ? 'bg-purple-500/20 border-2 border-purple-500/50 ring-2 ring-purple-500/50'
                    : 'bg-purple-100 border-2 border-purple-400 ring-2 ring-purple-400/50'
                  : darkMode
                    ? 'bg-gray-800/30 border-2 border-gray-700'
                    : 'bg-gray-50 border-2 border-gray-200'
              }`}>
                {Icon && <Icon size={20} className={`mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />}
                <div className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  {activity?.emoji}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit mode: Activity selector */}
      {isEditing && (
        <div className={`p-4 rounded-lg ${
          darkMode ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'
        }`}>
          <p className={`text-sm font-semibold mb-3 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
            Click a day below to assign an activity:
          </p>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {days.map((day) => (
              <button
                key={day.key}
                className={`p-2 rounded text-xs font-semibold transition-all ${
                  darkMode
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'
                }`}
              >
                {day.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {activityTypes.map((activity) => {
              return (
                <div key={activity.id} className="space-y-1">
                  {days.map((day) => {
                    const isSelected = weeklySchedule[day.key] === activity.id;
                    return (
                      <button
                        key={`${day.key}-${activity.id}`}
                        onClick={() => setWeeklySchedule(day.key, activity.id)}
                        className={`w-full p-2 rounded-lg text-left flex items-center gap-2 text-xs transition-all ${
                          isSelected
                            ? darkMode
                              ? `bg-${activity.color}-500/20 border-2 border-${activity.color}-500/50`
                              : `bg-${activity.color}-100 border-2 border-${activity.color}-400`
                            : darkMode
                              ? 'bg-gray-800 hover:bg-gray-700 border-2 border-gray-700'
                              : 'bg-white hover:bg-gray-100 border-2 border-gray-200'
                        }`}
                      >
                        <span>{activity.emoji}</span>
                        <span className="hidden sm:inline">{activity.name}</span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Today's focus */}
      {!isEditing && todayActivity && (
        <div className={`p-4 rounded-lg ${
          darkMode ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'
        }`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Today's Focus:
          </p>
          <p className={`text-lg font-bold ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
            {activityTypes.find((a) => a.id === todayActivity)?.name || 'Not set'}
          </p>
        </div>
      )}
    </div>
  );
};

export default WeeklyTrainingSchedule;
