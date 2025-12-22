import React from 'react';
import { Mic, Square, Lock } from 'lucide-react';
import useVoiceDiaryStore from '../store/useVoiceDiaryStore';
import useStore from '../store/useStore';

const VoiceDiary = ({ previewMode = false, previewLimits = {} }) => {
  const darkMode = useStore((state) => state.darkMode);
  const currentTime = useStore((state) => state.currentTime);
  const { voiceDiary, isRecording, recordingStartTime, currentTranscript, handleVoiceCheckin, formatTime } = useVoiceDiaryStore();

  // Preview mode limits
  const MAX_FREE_ENTRIES = previewLimits.maxEntries || 3;
  const MAX_FREE_DURATION = previewLimits.maxDuration || 30; // seconds
  const freeEntriesUsed = previewMode ? voiceDiary.length : 0;
  const canRecord = !previewMode || freeEntriesUsed < MAX_FREE_ENTRIES;

  const handleToggleRecording = () => {
    if (previewMode && !canRecord) {
      // Hit the limit - don't allow recording
      return;
    }
    handleVoiceCheckin(currentTime); // Pass currentTime to the store action
  };

  const getRecordingTime = () => {
    if (isRecording && recordingStartTime) {
      const elapsed = Date.now() - recordingStartTime;
      const seconds = Math.floor(elapsed / 1000);

      // Auto-stop at 30 seconds in preview mode
      if (previewMode && seconds >= MAX_FREE_DURATION) {
        // TODO: Auto-stop recording
      }

      return formatTime(seconds);
    }
    return '0:00';
  };

  return (
    <div className={`rounded-xl p-6 transition-all duration-300 ${
      darkMode
        ? 'bg-gray-800/50 border-2 border-gray-700/50 shadow-lg backdrop-blur-sm'
        : 'bg-white border-2 border-gray-100 shadow-md'
    }`}>
      {/* Header with preview mode indicator */}
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-bold flex items-center ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
          <Mic className={`mr-2 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} size={20} />
          Voice Diary
        </h3>
        {previewMode && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            canRecord
              ? darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
              : darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'
          }`}>
            {freeEntriesUsed}/{MAX_FREE_ENTRIES} used
          </span>
        )}
      </div>

      {/* Recording controls */}
      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={handleToggleRecording}
          disabled={previewMode && !canRecord}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
            previewMode && !canRecord
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isRecording
                ? darkMode
                  ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30'
                  : 'bg-red-100 hover:bg-red-200 text-red-700 border border-red-300'
                : darkMode
                  ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/40'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isRecording ? <Square size={18} className="mr-2" /> : <Mic size={18} className="mr-2" />}
          <span>
            {previewMode && !canRecord ? 'Limit Reached' : isRecording ? 'Stop Recording' : 'Start Check-in'}
            {previewMode && isRecording && ` (${MAX_FREE_DURATION}s max)`}
          </span>
        </button>
        {isRecording && (
          <span className={`text-sm font-mono ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
            {getRecordingTime()}
            {previewMode && ` / 0:${MAX_FREE_DURATION}`}
          </span>
        )}
      </div>

      {/* Live Transcript Display or Locked Message */}
      {previewMode ? (
        <div className={`mb-4 p-4 rounded-xl border-2 ${
          darkMode
            ? 'bg-purple-500/10 border-purple-500/30'
            : 'bg-purple-50 border-purple-200'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <Lock size={14} className={darkMode ? 'text-purple-400' : 'text-purple-600'} />
            <p className={`text-xs font-semibold ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>
              AI Transcription Locked
            </p>
          </div>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Upgrade to Starter to get automatic transcription of your voice notes!
          </p>
        </div>
      ) : (
        isRecording && currentTranscript && (
          <div className={`mb-4 p-4 rounded-xl border-2 ${
            darkMode
              ? 'bg-blue-500/10 border-blue-500/30'
              : 'bg-blue-50 border-blue-200'
          }`}>
            <p className={`text-xs font-semibold mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
              🎤 Live Transcript:
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
              {currentTranscript}
            </p>
          </div>
        )
      )}

      <h4 className={`text-md font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Recent Entries:</h4>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {voiceDiary.length === 0 ? (
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>No entries yet. Start a check-in!</p>
        ) : (
          voiceDiary.map((entry, index) => (
            <div key={entry.id || index} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
              <p className={`text-xs font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {entry.date} at {entry.time} ({entry.duration})
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                {entry.transcript}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VoiceDiary;
