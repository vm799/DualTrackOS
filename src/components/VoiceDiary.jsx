import React from 'react';
import { Mic, Square } from 'lucide-react'; // Square for stop icon
import useVoiceDiaryStore from '../store/useVoiceDiaryStore';
import useStore from '../store/useStore';

const VoiceDiary = () => {
  const darkMode = useStore((state) => state.darkMode);
  const currentTime = useStore((state) => state.currentTime);
  const { voiceDiary, isRecording, recordingStartTime, currentTranscript, handleVoiceCheckin, formatTime } = useVoiceDiaryStore();

  const handleToggleRecording = () => {
    handleVoiceCheckin(currentTime); // Pass currentTime to the store action
  };

  const getRecordingTime = () => {
    if (isRecording && recordingStartTime) {
      const elapsed = Date.now() - recordingStartTime;
      return formatTime(Math.floor(elapsed / 1000));
    }
    return '0:00';
  };

  return (
    <div className={`rounded-xl p-6 transition-all duration-300 ${
      darkMode
        ? 'bg-gray-800/50 border-2 border-gray-700/50 shadow-lg backdrop-blur-sm'
        : 'bg-white border-2 border-gray-100 shadow-md'
    }`}>
      <h3 className={`text-lg font-bold mb-4 flex items-center ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
        <Mic className={`mr-2 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} size={20} />
        Voice Diary
      </h3>

      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={handleToggleRecording}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
            isRecording
              ? darkMode
                ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30'
                : 'bg-red-100 hover:bg-red-200 text-red-700 border border-red-300'
              : darkMode
                ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/40'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isRecording ? <Square size={18} className="mr-2" /> : <Mic size={18} className="mr-2" />}
          <span>{isRecording ? 'Stop Recording' : 'Start Check-in'}</span>
        </button>
        {isRecording && (
          <span className={`text-sm font-mono ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
            {getRecordingTime()}
          </span>
        )}
      </div>

      {/* Live Transcript Display */}
      {isRecording && currentTranscript && (
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
