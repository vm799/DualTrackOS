import { create } from 'zustand';

// Speech recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let currentTranscript = '';

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
}

const useVoiceDiaryStore = create((set, get) => ({
  // State
  voiceDiary: [],
  isRecording: false,
  recordingStartTime: null,
  currentTranscript: '',

  // Actions
  setVoiceDiary: (diary) => set({ voiceDiary: diary }),
  setIsRecording: (recording) => set({ isRecording: recording }),
  setRecordingStartTime: (time) => set({ recordingStartTime: time }),
  setCurrentTranscript: (transcript) => set({ currentTranscript: transcript }),

  formatTime: (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`,

  handleVoiceCheckin: (currentTime) => {
    const { isRecording, recordingStartTime, setVoiceDiary, setIsRecording, setRecordingStartTime, setCurrentTranscript, formatTime } = get();

    if (!isRecording) {
      // Start recording
      setIsRecording(true);
      setRecordingStartTime(Date.now());
      currentTranscript = '';
      setCurrentTranscript('');

      if (!recognition) {
        // Fallback if speech recognition not supported
        alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
        setIsRecording(false);
        return;
      }

      // Set up recognition event handlers
      recognition.onresult = (event) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript + ' ';
          } else {
            interim += transcript;
          }
        }

        if (final) {
          currentTranscript += final;
        }

        // Update store with current transcript
        setCurrentTranscript(currentTranscript + interim);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          // No speech detected - ignore silently
        } else {
          setIsRecording(false);
          alert(`Voice recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        // Only restart if still recording (user hasn't manually stopped)
        if (get().isRecording) {
          try {
            recognition.start();
          } catch (e) {
            // Recognition already started
          }
        }
      };

      // Start recognition
      try {
        recognition.start();
      } catch (e) {
        console.error('Error starting recognition:', e);
      }

      // Auto-stop after 5 minutes
      setTimeout(() => {
        if (get().isRecording) {
          get().handleVoiceCheckin(currentTime); // This will stop the recording
        }
      }, 5 * 60 * 1000);

    } else {
      // Stop recording
      setIsRecording(false);

      if (recognition) {
        recognition.stop();
      }

      const duration = Math.floor((Date.now() - recordingStartTime) / 1000);
      const transcript = currentTranscript.trim() || "No speech detected";

      setVoiceDiary(prev => [...prev, {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        time: currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        transcript,
        duration: formatTime(duration)
      }]);

      setRecordingStartTime(null);
      currentTranscript = '';
      setCurrentTranscript('');
    }
  },
}));

export default useVoiceDiaryStore;
