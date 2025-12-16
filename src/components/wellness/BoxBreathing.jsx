import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import {
  BOX_BREATHING_TOTAL_MS,
  BOX_BREATHING_PHASE_DURATION_MS,
  BOX_BREATHING_CYCLE_DURATION_MS,
  BREATHING_INSTRUCTIONS,
  BREATHING_BOX_PATHS,
  WELLNESS_PHASES,
  BOX_BREATHING_CYCLES,
} from '../../constants';

/**
 * Box Breathing Component - 4-4-4-4 breathing exercise
 * Uses stable timer with useRef pattern to prevent recreation on parent re-renders
 */
const BoxBreathing = ({ darkMode, onComplete, onCancel }) => {
  const [totalElapsedMs, setTotalElapsedMs] = useState(0);
  const onCompleteRef = useRef(onComplete);

  // Always keep ref updated with latest onComplete
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Create timer ONCE - never destroyed until component unmounts
    const timer = setInterval(() => {
      setTotalElapsedMs(prev => {
        const next = prev + 50;
        // Check completion inside state updater
        if (next >= BOX_BREATHING_TOTAL_MS) {
          onCompleteRef.current(); // Use ref, not prop
          return BOX_BREATHING_TOTAL_MS; // Cap at completion time
        }
        return next;
      });
    }, 50);

    // Only cleanup when component unmounts
    return () => clearInterval(timer);
  }, []); // Empty deps - timer NEVER recreated!

  // Derive everything from single source of truth
  const phaseIndex = Math.floor((totalElapsedMs % BOX_BREATHING_CYCLE_DURATION_MS) / BOX_BREATHING_PHASE_DURATION_MS);
  const currentPhase = WELLNESS_PHASES[phaseIndex];
  const millisInCurrentPhase = totalElapsedMs % BOX_BREATHING_PHASE_DURATION_MS;
  const progress = millisInCurrentPhase / BOX_BREATHING_PHASE_DURATION_MS;
  const countdown = Math.ceil((BOX_BREATHING_PHASE_DURATION_MS - millisInCurrentPhase) / 1000);
  const cycleNumber = Math.floor(totalElapsedMs / BOX_BREATHING_CYCLE_DURATION_MS);

  // Calculate dot position - smooth flow around the box
  const getCirclePosition = () => {
    const path = BREATHING_BOX_PATHS[phaseIndex];
    return {
      cx: path.fromX + (path.toX - path.fromX) * progress,
      cy: path.fromY + (path.toY - path.fromY) * progress
    };
  };

  const circlePos = getCirclePosition();

  return (
    <div className={`max-w-2xl w-full rounded-3xl p-8 relative ${darkMode ? 'bg-gray-900 border-2 border-purple-500/30' : 'bg-white border-2 border-purple-200'}`}>
      <button onClick={onCancel} className={`absolute top-4 right-4 p-2 rounded-lg transition-all ${
        darkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
      }`} title="Cancel">
        <X size={24} />
      </button>

      <div className="flex flex-col items-center justify-center space-y-8 pt-4">
        <div className="relative w-64 h-64">
          <svg className="w-full h-full">
            <rect x="32" y="32" width="200" height="200"
                  fill="none"
                  stroke={darkMode ? '#a855f7' : '#9333ea'}
                  strokeWidth="3" />
            <circle
              cx={circlePos.cx}
              cy={circlePos.cy}
              r="12"
              fill="#ec4899"
              style={{
                filter: 'drop-shadow(0 0 8px #ec4899)'
              }} />
          </svg>
        </div>

        <div className="text-center">
          <div className={`text-6xl font-mono font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
            {countdown}
          </div>
          <div className={`text-2xl font-semibold mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {BREATHING_INSTRUCTIONS[currentPhase]}
          </div>
          <div className={`text-sm mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
            Cycle {cycleNumber + 1} of {BOX_BREATHING_CYCLES}
          </div>
          <div className={`mt-4 h-2 w-64 rounded-full overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
              style={{ width: `${(totalElapsedMs / BOX_BREATHING_TOTAL_MS) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxBreathing;
