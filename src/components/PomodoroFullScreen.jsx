import React from 'react';
import { Pause, RotateCcw, X } from 'lucide-react';
import usePomodoroStore from '../store/usePomodoroStore';

/**
 * PomodoroFullScreen - Immersive Focus Mode Overlay
 *
 * Displays a fullscreen timer overlay when Pomodoro is running
 * Blocks distractions with dark background and large countdown
 * Minimal controls: Pause, Reset, Exit
 */
const PomodoroFullScreen = ({ _darkMode }) => {
  const {
    pomodoroSeconds,
    pomodoroRunning,
    showFullScreen
  } = usePomodoroStore();

  const pausePomodoro = usePomodoroStore((state) => state.pausePomodoro);
  const resetPomodoro = usePomodoroStore((state) => state.resetPomodoro);
  const setShowFullScreen = usePomodoroStore((state) => state.setShowFullScreen);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (!showFullScreen || !pomodoroRunning) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl">
      {/* Ambient background animation */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* Timer */}
        <div className="font-mono text-9xl font-bold mb-12 bg-gradient-to-r from-orange-400 via-pink-500 to-orange-400 bg-clip-text text-transparent animate-pulse">
          {formatTime(pomodoroSeconds)}
        </div>

        {/* Status */}
        <div className="text-2xl text-gray-300 mb-6">
          🎯 Deep Focus Mode Active
        </div>

        {/* Why this works */}
        <div className="max-w-lg mx-auto mb-12">
          <p className="text-sm text-gray-500 leading-relaxed">
            Research shows it takes 23 minutes to regain focus after a distraction. A single focused block protects your flow state — when prefrontal cortex activity peaks and creative output increases 500%. Every interruption you block right now is an investment in your best work.
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-6">
          <button
            onClick={pausePomodoro}
            className="px-8 py-4 rounded-xl font-semibold flex items-center space-x-3 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border-2 border-orange-500/50 transition-all shadow-lg hover:shadow-orange-500/30"
          >
            <Pause size={24} />
            <span>Pause</span>
          </button>

          <button
            onClick={resetPomodoro}
            className="p-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 transition-all shadow-lg"
            title="Reset Timer"
          >
            <RotateCcw size={24} />
          </button>

          <button
            onClick={() => setShowFullScreen(false)}
            className="p-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 transition-all shadow-lg"
            title="Exit Fullscreen"
          >
            <X size={24} />
          </button>
        </div>

        {/* Keyboard hint */}
        <div className="mt-12 text-sm text-gray-500">
          Press ESC to exit fullscreen
        </div>
      </div>
    </div>
  );
};

export default PomodoroFullScreen;
