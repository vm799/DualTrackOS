import React from 'react';
import { Check, X } from 'lucide-react';
import useHourlyTaskStore from '../store/useHourlyTaskStore';
import useStore from '../store/useStore';

const HourlyTaskDisplay = () => {
  const darkMode = useStore((state) => state.darkMode);
  const currentTime = useStore((state) => state.currentTime);
  const { hourlyTasks, addHourlyTask, toggleHourlyTask, deleteHourlyTask } = useHourlyTaskStore();

  const formatHour = (hour) => {
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    return `${displayHour}${suffix}`;
  };

  const currentHour = currentTime.getHours();

  return (
    <div className={`rounded-2xl p-6 shadow-2xl transition-all duration-300 ${
      darkMode
        ? 'bg-gradient-to-r from-cyan-900/50 via-blue-900/50 to-cyan-900/50 border-2 border-cyan-500/30 backdrop-blur-xl'
        : 'bg-gradient-to-r from-cyan-600 to-blue-600'
    }`}>
      <h2 className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-white'}`}>
        🎯 RIGHT NOW
      </h2>
      <p className={`text-sm mb-4 ${darkMode ? 'text-cyan-300' : 'text-white opacity-90'}`}>
        {formatHour(currentHour)} - {formatHour(currentHour + 1)}
      </p>

      {/* Current hour tasks */}
      <div className="space-y-2">
        {(hourlyTasks[currentHour] || []).map(task => (
          <div key={task.id} className={`flex items-center justify-between p-3 rounded-lg ${
            darkMode
              ? task.completed
                ? 'bg-emerald-500/20 border border-emerald-500/40'
                : 'bg-white/10 border border-white/20'
              : task.completed
                ? 'bg-green-100 border border-green-300'
                : 'bg-white/40 border border-white/60'
          }`}>
            <div className="flex items-center space-x-3 flex-1">
              <button
                onClick={() => toggleHourlyTask(currentHour, task.id)}
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  darkMode
                    ? task.completed
                      ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50'
                      : 'bg-white/20 hover:bg-white/30'
                    : task.completed
                      ? 'bg-green-500'
                      : 'bg-white/60 hover:bg-white/80'
                }`}
              >
                {task.completed && <Check className="text-white" size={14} />}
              </button>
              <span className={`text-sm font-medium ${
                darkMode
                  ? task.completed
                    ? 'text-emerald-300 line-through'
                    : 'text-white'
                  : task.completed
                    ? 'text-green-700 line-through'
                    : 'text-white'
              }`}>
                {task.text}
              </span>
            </div>
            <button
              onClick={() => deleteHourlyTask(currentHour, task.id)}
              className={`ml-2 ${darkMode ? 'text-white/40 hover:text-red-400' : 'text-white/60 hover:text-red-600'}`}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Add task for this hour */}
      <form onSubmit={(e) => {
        e.preventDefault();
        const input = e.target.elements.currentHourTask;
        addHourlyTask(currentHour, input.value);
        input.value = '';
      }} className="mt-3">
        <input
          name="currentHourTask"
          type="text"
          placeholder="+ Add task for this hour..."
          className={`w-full px-4 py-3 rounded-lg transition-all ${
            darkMode
              ? 'bg-white/10 border-2 border-white/20 text-white placeholder-white/60 focus:border-cyan-400/50'
              : 'bg-white/40 border-2 border-white/60 text-white placeholder-white/80 focus:border-white'
          }`}
        />
      </form>
    </div>
  );
};

export default HourlyTaskDisplay;
