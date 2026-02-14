import React, { useState } from 'react';
import { Check, X, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import useHourlyTaskStore from '../store/useHourlyTaskStore';
import useStore from '../store/useStore';

const HourlyTaskDisplay = () => {
  const darkMode = useStore((state) => state.darkMode);
  const currentTime = useStore((state) => state.currentTime);
  const { hourlyTasks, addHourlyTask, toggleHourlyTask, deleteHourlyTask } = useHourlyTaskStore();
  const [taskInput, setTaskInput] = useState('');
  const [showFullDay, setShowFullDay] = useState(false);

  const formatHour = (hour) => {
    const normalizedHour = ((hour % 24) + 24) % 24;
    const suffix = normalizedHour >= 12 ? 'PM' : 'AM';
    const displayHour = normalizedHour > 12 ? normalizedHour - 12 : (normalizedHour === 0 ? 12 : normalizedHour);
    return `${displayHour}${suffix}`;
  };

  const currentHour = currentTime.getHours();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskInput.trim()) return;
    addHourlyTask(currentHour, taskInput.trim());
    setTaskInput('');
  };

  // Get all hours that have tasks for the full day view
  const allHoursWithTasks = Object.keys(hourlyTasks)
    .map(Number)
    .sort((a, b) => a - b);

  // Generate display hours (6AM to 11PM)
  const dayHours = [];
  for (let h = 6; h <= 23; h++) {
    dayHours.push(h);
  }

  const totalTasksToday = Object.values(hourlyTasks).reduce((sum, tasks) => sum + (tasks?.length || 0), 0);
  const completedTasksToday = Object.values(hourlyTasks).reduce(
    (sum, tasks) => sum + (tasks?.filter((t) => t.completed).length || 0), 0
  );

  return (
    <div className={`rounded-2xl p-6 shadow-2xl transition-all duration-300 ${
      darkMode
        ? 'bg-gradient-to-r from-cyan-900/50 via-blue-900/50 to-cyan-900/50 border-2 border-cyan-500/30 backdrop-blur-xl'
        : 'bg-gradient-to-r from-cyan-600 to-blue-600'
    }`}>
      <div className="flex items-center justify-between mb-1">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-white'}`}>
          RIGHT NOW
        </h2>
        {totalTasksToday > 0 && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
            darkMode ? 'bg-white/10 text-cyan-300' : 'bg-white/30 text-white'
          }`}>
            {completedTasksToday}/{totalTasksToday} done
          </span>
        )}
      </div>
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

      {/* Add task form with visible submit button */}
      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="+ Add task for this hour..."
          className={`flex-1 px-4 py-3 rounded-lg transition-all ${
            darkMode
              ? 'bg-white/10 border-2 border-white/20 text-white placeholder-white/60 focus:border-cyan-400/50'
              : 'bg-white/40 border-2 border-white/60 text-white placeholder-white/80 focus:border-white'
          }`}
        />
        <button
          type="submit"
          disabled={!taskInput.trim()}
          className={`px-4 py-3 rounded-lg font-semibold transition-all flex items-center gap-1 ${
            taskInput.trim()
              ? darkMode
                ? 'bg-cyan-500/30 border-2 border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/40'
                : 'bg-white/40 border-2 border-white/60 text-white hover:bg-white/50'
              : darkMode
                ? 'bg-gray-700/30 border-2 border-gray-600/30 text-gray-500 cursor-not-allowed'
                : 'bg-white/20 border-2 border-white/30 text-white/50 cursor-not-allowed'
          }`}
        >
          <Plus size={18} />
          <span className="hidden sm:inline text-sm">Add</span>
        </button>
      </form>

      {/* Full Day View Toggle */}
      <button
        onClick={() => setShowFullDay(!showFullDay)}
        className={`mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-lg transition-all text-sm font-medium ${
          darkMode
            ? 'bg-white/5 hover:bg-white/10 text-cyan-300 border border-white/10'
            : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
        }`}
      >
        {showFullDay ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        {showFullDay ? 'Hide Full Day' : 'View Full Day Plan'}
        {totalTasksToday > 0 && !showFullDay && (
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            darkMode ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/30'
          }`}>
            {totalTasksToday} tasks
          </span>
        )}
      </button>

      {/* Full Day Timeline */}
      {showFullDay && (
        <div className={`mt-3 rounded-xl p-4 space-y-1 max-h-80 overflow-y-auto ${
          darkMode ? 'bg-black/20 border border-white/10' : 'bg-white/10 border border-white/20'
        }`}>
          {dayHours.map((hour) => {
            const tasks = hourlyTasks[hour] || [];
            const isCurrent = hour === currentHour;
            const isPast = hour < currentHour;
            return (
              <div
                key={hour}
                className={`flex gap-3 py-2 px-2 rounded-lg transition-all ${
                  isCurrent
                    ? darkMode
                      ? 'bg-cyan-500/20 border border-cyan-500/30'
                      : 'bg-white/20 border border-white/40'
                    : ''
                }`}
              >
                <div className={`text-xs font-mono w-12 flex-shrink-0 pt-0.5 ${
                  isCurrent
                    ? 'text-cyan-300 font-bold'
                    : isPast
                      ? darkMode ? 'text-gray-600' : 'text-white/40'
                      : darkMode ? 'text-gray-400' : 'text-white/70'
                }`}>
                  {formatHour(hour)}
                </div>
                <div className="flex-1 min-w-0">
                  {tasks.length > 0 ? (
                    <div className="space-y-1">
                      {tasks.map((task) => (
                        <div key={task.id} className="flex items-center gap-2">
                          <button
                            onClick={() => toggleHourlyTask(hour, task.id)}
                            className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center ${
                              task.completed
                                ? 'bg-emerald-500'
                                : darkMode ? 'border border-gray-500' : 'border border-white/50'
                            }`}
                          >
                            {task.completed && <Check size={10} className="text-white" />}
                          </button>
                          <span className={`text-xs ${
                            task.completed
                              ? 'line-through text-emerald-400/70'
                              : isPast
                                ? darkMode ? 'text-gray-500' : 'text-white/50'
                                : darkMode ? 'text-gray-300' : 'text-white/90'
                          }`}>
                            {task.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className={`text-xs ${
                      isPast
                        ? darkMode ? 'text-gray-700' : 'text-white/20'
                        : darkMode ? 'text-gray-600' : 'text-white/30'
                    }`}>
                      —
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HourlyTaskDisplay;
