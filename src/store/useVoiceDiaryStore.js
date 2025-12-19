import { create } from 'zustand';

const useVoiceDiaryStore = create((set, get) => ({
  // State
  voiceDiary: [],
  isRecording: false,
  recordingStartTime: null,

  // Actions
  setVoiceDiary: (diary) => set({ voiceDiary: diary }),
  setIsRecording: (recording) => set({ isRecording: recording }),
  setRecordingStartTime: (time) => set({ recordingStartTime: time }),

  formatTime: (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`,

  handleVoiceCheckin: (currentTime) => {
    const { isRecording, recordingStartTime, setVoiceDiary, setIsRecording, setRecordingStartTime, formatTime } = get();
    if (!isRecording) {
      setIsRecording(true);
      setRecordingStartTime(Date.now());
      // Simulate 5-minute max recording
      setTimeout(() => {
        if (get().isRecording) { // Check current state in case manual stop occurred
          setIsRecording(false);
          const transcript = "Voice diary entry recorded"; // In production, use actual speech-to-text
          setVoiceDiary(prev => [...prev, {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            time: currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            transcript,
            duration: '5:00'
          }]);
          setRecordingStartTime(null);
        }
      }, 5 * 60 * 1000); // 5 minutes
    } else {
      // Manual stop
      setIsRecording(false);
      const duration = Math.floor((Date.now() - recordingStartTime) / 1000);
      const transcript = "Voice diary entry recorded"; // In production, use actual speech-to-text
      setVoiceDiary(prev => [...prev, {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        time: currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        transcript,
        duration: formatTime(duration)
      }]);
      setRecordingStartTime(null);
    }
  },
}));

export default useVoiceDiaryStore;
