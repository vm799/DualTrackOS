import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Zap, Brain, Target, TrendingUp, Check } from 'lucide-react';
import { predictOptimalTaskTime } from '../utils/recommendationEngine';
import useSessionStore from '../store/useSessionStore';

/**
 * SmartScheduler Component
 *
 * Intelligent task scheduling based on:
 * - User's energy patterns
 * - Historical productivity data
 * - Task type and complexity
 * - Available time slots
 *
 * Features:
 * - Suggests optimal time slots
 * - Considers energy requirements
 * - Adapts to user's patterns
 * - Provides scheduling confidence
 */
const SmartScheduler = ({ darkMode = false, onSchedule }) => {
  const [taskName, setTaskName] = useState('');
  const [taskType, setTaskType] = useState('focus');
  const [estimatedDuration, setEstimatedDuration] = useState(60);
  const [suggestedSlots, setSuggestedSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const behaviorPatterns = useSessionStore((state) => state.behaviorPatterns || {});

  const taskTypes = [
    {
      id: 'focus',
      label: 'Deep Work / Focus',
      icon: Brain,
      color: 'purple',
      energyRequired: 8,
      description: 'Requires high concentration and minimal distractions'
    },
    {
      id: 'creative',
      label: 'Creative Work',
      icon: Target,
      color: 'pink',
      energyRequired: 6,
      description: 'Brainstorming, design, writing, ideation'
    },
    {
      id: 'admin',
      label: 'Administrative',
      icon: Check,
      color: 'blue',
      energyRequired: 4,
      description: 'Email, scheduling, light tasks'
    },
    {
      id: 'planning',
      label: 'Planning / Strategy',
      icon: TrendingUp,
      color: 'emerald',
      energyRequired: 5,
      description: 'Setting goals, reviewing progress, strategizing'
    }
  ];

  useEffect(() => {
    if (taskType) {
      generateSuggestedSlots(taskType, estimatedDuration);
    }
  }, [taskType, estimatedDuration]);

  const generateSuggestedSlots = (type, duration) => {
    const optimal = predictOptimalTaskTime(type, behaviorPatterns);
    const now = new Date();
    const currentHour = now.getHours();
    const slots = [];

    // Generate time slots for today and tomorrow
    for (let day = 0; day <= 1; day++) {
      const date = new Date(now);
      date.setDate(date.getDate() + day);

      for (const hour of optimal.optimalHours || [9, 10, 14, 15]) {
        if (day === 0 && hour <= currentHour) continue; // Skip past times today

        const slotStart = new Date(date);
        slotStart.setHours(hour, 0, 0, 0);

        const slotEnd = new Date(slotStart);
        slotEnd.setMinutes(slotEnd.getMinutes() + duration);

        const isOptimal = hour >= 9 && hour <= 11; // Peak morning hours
        const energyFit = getEnergyFitScore(hour, optimal.minEnergyRequired);

        slots.push({
          id: `slot-${day}-${hour}`,
          date: slotStart,
          startTime: slotStart,
          endTime: slotEnd,
          hour,
          day,
          isOptimal,
          energyFit,
          confidence: calculateConfidence(isOptimal, energyFit, hour),
          reasoning: getSlotReasoning(hour, isOptimal, energyFit)
        });
      }
    }

    // Sort by confidence
    slots.sort((a, b) => b.confidence - a.confidence);

    setSuggestedSlots(slots.slice(0, 6)); // Top 6 slots
  };

  const getEnergyFitScore = (hour, minEnergyRequired) => {
    // Typical energy curve throughout the day
    const energyCurve = {
      6: 5, 7: 6, 8: 7, 9: 8, 10: 9, 11: 8,
      12: 7, 13: 6, 14: 5, 15: 6, 16: 7,
      17: 6, 18: 5, 19: 4, 20: 3, 21: 3, 22: 2
    };

    const expectedEnergy = energyCurve[hour] || 5;
    const fit = (expectedEnergy / minEnergyRequired) * 100;

    return Math.min(100, Math.max(0, fit));
  };

  const calculateConfidence = (isOptimal, energyFit, hour) => {
    let confidence = 50; // Base confidence

    if (isOptimal) confidence += 30;
    confidence += (energyFit / 100) * 20;

    // Peak hours bonus
    if (hour >= 9 && hour <= 11) confidence += 10;
    if (hour >= 14 && hour <= 16) confidence += 5;

    // Avoid early morning and late night
    if (hour < 8 || hour > 20) confidence -= 20;

    return Math.min(95, Math.max(10, confidence));
  };

  const getSlotReasoning = (hour, isOptimal, energyFit) => {
    if (isOptimal && energyFit >= 80) {
      return 'Perfect time based on your patterns and energy levels';
    } else if (energyFit >= 70) {
      return 'Good energy fit for this type of work';
    } else if (hour >= 9 && hour <= 11) {
      return 'Peak morning hours for focused work';
    } else if (hour >= 14 && hour <= 16) {
      return 'Afternoon slot - moderate energy expected';
    } else {
      return 'Available slot';
    }
  };

  const handleSchedule = () => {
    if (!taskName || !selectedSlot) return;

    const scheduledTask = {
      id: Date.now(),
      name: taskName,
      type: taskType,
      duration: estimatedDuration,
      scheduledTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      confidence: selectedSlot.confidence,
      createdAt: new Date()
    };

    if (onSchedule) {
      onSchedule(scheduledTask);
    }

    // Reset form
    setTaskName('');
    setSelectedSlot(null);
  };

  const selectedTaskType = taskTypes.find(t => t.id === taskType);
  const TaskIcon = selectedTaskType?.icon || Brain;

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return darkMode ? 'text-emerald-400' : 'text-emerald-600';
    if (confidence >= 60) return darkMode ? 'text-blue-400' : 'text-blue-600';
    if (confidence >= 40) return darkMode ? 'text-amber-400' : 'text-amber-600';
    return darkMode ? 'text-red-400' : 'text-red-600';
  };

  const getConfidenceBg = (confidence) => {
    if (confidence >= 80) return darkMode ? 'bg-emerald-500/20 border-emerald-500/50' : 'bg-emerald-100 border-emerald-300';
    if (confidence >= 60) return darkMode ? 'bg-blue-500/20 border-blue-500/50' : 'bg-blue-100 border-blue-300';
    if (confidence >= 40) return darkMode ? 'bg-amber-500/20 border-amber-500/50' : 'bg-amber-100 border-amber-300';
    return darkMode ? 'bg-red-500/20 border-red-500/50' : 'bg-red-100 border-red-300';
  };

  return (
    <div className={`
      rounded-2xl p-6 border-2
      ${darkMode
        ? 'bg-slate-800/50 border-slate-700/50'
        : 'bg-white border-purple-200/50'
      }
    `}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center
          ${darkMode ? 'bg-purple-500/20' : 'bg-purple-500/10'}
        `}>
          <Calendar size={24} className={darkMode ? 'text-purple-400' : 'text-purple-600'} />
        </div>
        <div>
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Smart Scheduler
          </h3>
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            AI-powered optimal task timing
          </p>
        </div>
      </div>

      {/* Task Name */}
      <div className="mb-4">
        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
          Task Name
        </label>
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="e.g., Write quarterly report"
          className={`
            w-full px-4 py-3 rounded-lg border-2 transition-all
            ${darkMode
              ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500'
              : 'bg-white border-gray-300 text-slate-900 placeholder-slate-400 focus:border-purple-500'
            }
          `}
        />
      </div>

      {/* Task Type */}
      <div className="mb-4">
        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
          Task Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {taskTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = taskType === type.id;

            return (
              <button
                key={type.id}
                onClick={() => setTaskType(type.id)}
                className={`
                  p-3 rounded-lg border-2 transition-all text-left
                  ${isSelected
                    ? darkMode
                      ? 'bg-purple-500/20 border-purple-500'
                      : 'bg-purple-100 border-purple-500'
                    : darkMode
                    ? 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
                    : 'bg-gray-50 border-gray-300 hover:border-gray-400'
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={16} className={isSelected
                    ? darkMode ? 'text-purple-400' : 'text-purple-600'
                    : darkMode ? 'text-slate-400' : 'text-slate-600'
                  } />
                  <span className={`text-sm font-medium ${
                    isSelected
                      ? darkMode ? 'text-purple-400' : 'text-purple-700'
                      : darkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    {type.label}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap size={12} className={darkMode ? 'text-amber-400' : 'text-amber-500'} />
                  <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Energy: {type.energyRequired}/10
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration */}
      <div className="mb-6">
        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
          Estimated Duration
        </label>
        <div className="flex gap-2">
          {[25, 45, 60, 90, 120].map((minutes) => (
            <button
              key={minutes}
              onClick={() => setEstimatedDuration(minutes)}
              className={`
                flex-1 py-2 px-3 rounded-lg border-2 transition-all text-sm font-medium
                ${estimatedDuration === minutes
                  ? darkMode
                    ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                    : 'bg-purple-100 border-purple-500 text-purple-700'
                  : darkMode
                  ? 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500'
                  : 'bg-gray-50 border-gray-300 text-slate-700 hover:border-gray-400'
                }
              `}
            >
              {minutes}m
            </button>
          ))}
        </div>
      </div>

      {/* Suggested Slots */}
      {suggestedSlots.length > 0 && (
        <div className="mb-6">
          <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Suggested Time Slots
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {suggestedSlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => setSelectedSlot(slot)}
                className={`
                  p-4 rounded-lg border-2 transition-all text-left
                  ${selectedSlot?.id === slot.id
                    ? getConfidenceBg(slot.confidence)
                    : darkMode
                    ? 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
                    : 'bg-gray-50 border-gray-300 hover:border-gray-400'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className={darkMode ? 'text-slate-400' : 'text-slate-600'} />
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {slot.startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                    </span>
                  </div>
                  <span className={`text-xs font-semibold ${getConfidenceColor(slot.confidence)}`}>
                    {Math.round(slot.confidence)}% match
                  </span>
                </div>
                <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {slot.reasoning}
                </p>
                {slot.day === 1 && (
                  <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${
                    darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
                  }`}>
                    Tomorrow
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Schedule Button */}
      <button
        onClick={handleSchedule}
        disabled={!taskName || !selectedSlot}
        className={`
          w-full py-3 px-6 rounded-lg font-semibold transition-all
          ${!taskName || !selectedSlot
            ? darkMode
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : darkMode
            ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg hover:shadow-purple-500/50'
            : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-purple-500/30'
          }
          flex items-center justify-center gap-2
        `}
      >
        <Calendar size={20} />
        Schedule Task
      </button>
    </div>
  );
};

export default SmartScheduler;
