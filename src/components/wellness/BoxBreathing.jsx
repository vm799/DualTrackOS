import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X } from 'lucide-react';
import {
  BOX_BREATHING_TOTAL_MS,
  BOX_BREATHING_PHASE_DURATION_MS,
  BOX_BREATHING_CYCLE_DURATION_MS,
  BREATHING_INSTRUCTIONS,
  BREATHING_BOX_PATHS,
  WELLNESS_PHASES,
  BOX_BREATHING_CYCLES,
  BOX_BREATHING_UPDATE_INTERVAL_MS,
} from '../../constants';

const DEBUG = process.env.NODE_ENV === 'development';

/**
 * Box Breathing Component - 4-4-4-4 breathing exercise
 *
 * Architecture:
 * - Uses stable timer with useRef pattern to prevent recreation on parent re-renders
 * - StrictMode-safe: mounted flag prevents timer from running after unmount
 * - Single source of truth: all derived values calculated from totalElapsedMs
 * - 50ms update interval = 20 FPS smooth animation
 *
 * Timeline:
 *   0-4s: Inhale (bottom-left → bottom-right)
 *   4-8s: Hold (bottom-right → top-right)
 *   8-12s: Exhale (top-right → top-left)
 *   12-16s: Hold (top-left → bottom-left)
 *   Repeat 8 cycles = 128 seconds total
 */
const BoxBreathing = ({ darkMode, onComplete, onCancel }) => {
  const [totalElapsedMs, setTotalElapsedMs] = useState(0);
  const onCompleteRef = useRef(onComplete);
  const mountedRef = useRef(true);

  // Keep onComplete ref updated
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Timer - created once, runs until unmount or completion
  useEffect(() => {
    if (DEBUG) {
      console.log('[BoxBreathing] Component mounted, starting timer');
    }

    mountedRef.current = true;

    const timer = setInterval(() => {
      // StrictMode safety: only update if still mounted
      if (mountedRef.current) {
        setTotalElapsedMs(prev => {
          const next = prev + BOX_BREATHING_UPDATE_INTERVAL_MS;

          if (DEBUG && next % 1000 === 0) {
            console.log(`[BoxBreathing] ${next}ms elapsed`);
          }

          // Check completion
          if (next >= BOX_BREATHING_TOTAL_MS) {
            if (DEBUG) {
              console.log('[BoxBreathing] Exercise complete!');
            }
            onCompleteRef.current();
            return BOX_BREATHING_TOTAL_MS;
          }

          return next;
        });
      }
    }, BOX_BREATHING_UPDATE_INTERVAL_MS);

    // Cleanup: mark unmounted and clear timer
    return () => {
      if (DEBUG) {
        console.log('[BoxBreathing] Component unmounting, clearing timer');
      }
      mountedRef.current = false;
      clearInterval(timer);
    };
  }, []); // Empty deps - timer NEVER recreated!

  // Derive all values from single source of truth
  const phaseIndex = Math.floor((totalElapsedMs % BOX_BREATHING_CYCLE_DURATION_MS) / BOX_BREATHING_PHASE_DURATION_MS);
  const currentPhase = WELLNESS_PHASES[phaseIndex];
  const millisInCurrentPhase = totalElapsedMs % BOX_BREATHING_PHASE_DURATION_MS;
  const progress = millisInCurrentPhase / BOX_BREATHING_PHASE_DURATION_MS;

  // Fix: countdown should never show 0 (shows 1-4)
  const countdown = Math.max(1, Math.ceil((BOX_BREATHING_PHASE_DURATION_MS - millisInCurrentPhase) / 1000));

  const cycleNumber = Math.floor(totalElapsedMs / BOX_BREATHING_CYCLE_DURATION_MS);

  // Memoize circle position calculation (only recalc when phase or progress changes)
  const circlePos = useMemo(() => {
    const path = BREATHING_BOX_PATHS[phaseIndex];
    const pos = {
      cx: path.fromX + (path.toX - path.fromX) * progress,
      cy: path.fromY + (path.toY - path.fromY) * progress
    };

    if (DEBUG && totalElapsedMs % 500 === 0) {
      console.log('[BoxBreathing] Position:', {
        phase: currentPhase,
        phaseIndex,
        progress: progress.toFixed(3),
        countdown,
        cycle: cycleNumber + 1,
        position: `(${pos.cx.toFixed(1)}, ${pos.cy.toFixed(1)})`
      });
    }

    return pos;
  }, [phaseIndex, progress, currentPhase, countdown, cycleNumber, totalElapsedMs]);

  return (
    <div className={`max-w-2xl w-full rounded-3xl p-8 relative ${darkMode ? 'bg-gray-900 border-2 border-purple-500/30' : 'bg-white border-2 border-purple-200'}`}>
      <button
        onClick={onCancel}
        className={`absolute top-4 right-4 p-2 rounded-lg transition-all ${
          darkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
        }`}
        title="Cancel"
        aria-label="Cancel breathing exercise"
      >
        <X size={24} />
      </button>

      <div className="flex flex-col items-center justify-center space-y-8 pt-4">
        {/* Breathing Box Animation */}
        <div className="relative w-64 h-64" role="img" aria-label="Breathing animation">
          <svg className="w-full h-full" viewBox="0 0 264 264">
            {/* Box outline */}
            <rect
              x="32"
              y="32"
              width="200"
              height="200"
              fill="none"
              stroke={darkMode ? '#a855f7' : '#9333ea'}
              strokeWidth="3"
            />

            {/* Animated dot */}
            <circle
              cx={circlePos.cx}
              cy={circlePos.cy}
              r="12"
              fill="#ec4899"
              style={{
                filter: 'drop-shadow(0 0 8px #ec4899)',
                // Remove CSS transitions - we're updating position every 50ms
                transition: 'none'
              }}
            />
          </svg>
        </div>

        {/* Instructions and Progress */}
        <div className="text-center">
          {/* Countdown */}
          <div
            className={`text-6xl font-mono font-bold tabular-nums ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}
            aria-live="polite"
            aria-atomic="true"
          >
            {countdown}
          </div>

          {/* Instruction */}
          <div
            className={`text-2xl font-semibold mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
            aria-live="polite"
          >
            {BREATHING_INSTRUCTIONS[currentPhase]}
          </div>

          {/* Cycle counter */}
          <div className={`text-sm mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
            Cycle {cycleNumber + 1} of {BOX_BREATHING_CYCLES}
          </div>

          {/* Overall progress bar */}
          <div
            className={`mt-4 h-2 w-64 rounded-full overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}
            role="progressbar"
            aria-valuenow={Math.round((totalElapsedMs / BOX_BREATHING_TOTAL_MS) * 100)}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-100"
              style={{ width: `${(totalElapsedMs / BOX_BREATHING_TOTAL_MS) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Debug overlay (dev only) */}
      {DEBUG && (
        <div className="absolute bottom-4 left-4 text-xs font-mono bg-black/80 text-green-400 p-2 rounded">
          <div>Elapsed: {totalElapsedMs}ms</div>
          <div>Phase: {currentPhase} ({phaseIndex})</div>
          <div>Progress: {(progress * 100).toFixed(1)}%</div>
          <div>Pos: ({circlePos.cx.toFixed(0)}, {circlePos.cy.toFixed(0)})</div>
        </div>
      )}
    </div>
  );
};

export default BoxBreathing;
