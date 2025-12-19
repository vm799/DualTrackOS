import React, { useState, useEffect, useRef } from 'react';
import { Zap, Brain, Heart, Check, Mic, Play, Pause, RotateCcw, Utensils, BarChart3, Apple, Plus, Award, Activity, Download, Trash2, Settings, Calendar, Clock, Sparkles, Lightbulb, Camera, BookOpen, Youtube, X, Bell, BellOff, LogIn, LogOut, TrendingUp } from 'lucide-react';
import { isSupabaseConfigured } from './supabaseClient';
import { signInWithGoogle, signOut, getSession, onAuthStateChange, saveUserData, loadUserData } from './services/dataService';
import AppRouter from './Router';
import useStore from './store/useStore';
import usePomodoroStore from './store/usePomodoroStore'; // Import Pomodoro store
import useWellnessStore from './store/useWellnessStore'; // Import Wellness store
import useDailyMetricsStore from './store/useDailyMetricsStore'; // Import Daily Metrics store
import useEnergyMoodStore from './store/useEnergyMoodStore'; // Import Energy Mood store
import useNutritionStore from './store/useNutritionStore'; // Import Nutrition Store

import LandingPage from './LandingPage';
import StoryPage from './StoryPage';
import Onboarding from './Onboarding';
import { POMODORO_DURATION_SECONDS, MINDFUL_MOMENT_DURATION_SECONDS, ACTIVE_HOURS_START, ACTIVE_HOURS_END, WELLNESS_SNOOZE_DURATION_MS, BOX_BREATHING_TOTAL_MS, BOX_BREATHING_CYCLE_DURATION_MS, BOX_BREATHING_PHASE_DURATION_MS, EXERCISE_TARGETS } from './constants';

const DualTrackOS = () => {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const darkMode = useStore((state) => state.darkMode);
  const setDarkMode = useStore((state) => state.setDarkMode);
  const userProfile = useStore((state) => state.userProfile);
  const setUserProfile = useStore((state) => state.setUserProfile);
  const currentTime = useStore((state) => state.currentTime);
  const setCurrentTime = useStore((state) => state.setCurrentTime);
  const setSpiritAnimalScore = useStore((state) => state.setSpiritAnimalScore); // Global spirit animal score setter

  const { isPomodoroMode, pomodoroSeconds, pomodoroRunning, togglePomodoroMode, setPomodoroSeconds, setPomodoroRunning, resetPomodoro, startPomodoro, pausePomodoro } = usePomodoroStore();
  const { showWellnessSnackModal, setShowWellnessSnackModal, setMissedHourPrompt: setWellnessMissedHourPrompt, setLastWellnessHour: setWellnessLastWellnessHour, wellnessSnacksDismissed, missedHourPrompt } = useWellnessStore();
  const { setDailyMetrics, addQuickWin, quickWinInput, setQuickWinInput, dailyMetrics } = useDailyMetricsStore();
  const { setCurrentEnergy, setCurrentMood, getEnergyBasedSuggestions, getMoodBasedWellness, getSmartSuggestions, energyTracking, currentMood } = useEnergyMoodStore();
  const { proteinToday, getProteinTarget, meals } = useNutritionStore(); // Use proteinToday and meals from nutrition store


  // Local states that will eventually be moved to stores
  const [ndm, setNdm] = useState({ nutrition: false, movement: false, mindfulness: false, brainDump: false });
  const [careers, setCareers] = useState({ corporate: { wins: 0 }, consultancy: { wins: 0 } });
  // const [meals, setMeals] = useState([]); // Moved to useNutritionStore
  const [workouts, setWorkouts] = useState([]);
  // const [proteinToday, setProteinToday] = useState(0); // Moved to useNutritionStore
  const [gratitude, setGratitude] = useState(['', '', '']);
  const [mantras, setMantras] = useState(['', '', '']);
  // const [hourlyTasks, setHourlyTasks] = useState({}); // Moved to useHourlyTaskStore
  const [foodDiary, setFoodDiary] = useState([]);
  const [learningLibrary, setLearningLibrary] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [voiceDiary, setVoiceDiary] = useState([]);
  // const [energyTracking, setEnergyTracking] = useState({ morning: null, afternoon: null, evening: null }); // Moved to useEnergyMoodStore
  // const [currentMood, setCurrentMood] = useState(null); // Moved to useEnergyMoodStore
  const [balanceHistory, setBalanceHistory] = useState([]);


  // UI States
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [showStoryPage, setShowStoryPage] = useState(false);
  const [showNonNegotiablesModal, setShowNonNegotiablesModal] = useState(false);
  const [showBrainDumpModal, setShowBrainDumpModal] = useState(false);
  const [brainDumpText, setBrainDumpText] = useState('');
  const [showMindfulMomentModal, setShowMindfulMomentModal] = useState(false);
  const [mindfulTimer, setMindfulTimer] = useState(MINDFUL_MOMENT_DURATION_SECONDS);
  const [mindfulRunning, setMindfulRunning] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isWorkoutRunning, setIsWorkoutRunning] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'food', 'exercise', 'learn', 'settings', 'workout-active'
  const [isScrolled, setIsScrolled] = useState(false);
  const [showPomodoroFullScreen, setShowPomodoroFullScreen] = useState(false);

  // Wellness Snack Specific States
  const [wellnessSnackChoice, setWellnessSnackChoice] = useState(null); // 'hydration', 'exercise', 'stretch', 'eyes', 'walk', 'mindfulness'
  const [exerciseChoice, setExerciseChoice] = useState(null); // e.g., 'squats', 'pushups'
  const [exerciseTarget, setExerciseTarget] = useState(0);
  const [exerciseReps, setExerciseReps] = useState(0);
  const [exerciseActive, setExerciseActive] = useState(false);
  const [wellnessCompletions, setWellnessCompletions] = useState([]);
  const [boxBreathingActive, setBoxBreathingActive] = useState(false);

  // Voice Diary states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStartTime, setRecordingStartTime] = useState(null);

  // Expanded tile state for dashboard
  const [expandedTile, setExpandedTile] = useState(null); // 'protein', 'career' etc.


  // Welcome message based on time of day
  const getWelcomeMessage = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };
  const welcomeMessage = getWelcomeMessage();

  // Initialize auth and load data
  useEffect(() => {
    // Check auth status
    const initAuth = async () => {
      if (isSupabaseConfigured()) {
        const session = await getSession();
        setUser(session?.user ?? null);

        // If user is logged in, load from Supabase
        if (session?.user) {
          const { data: userData } = await loadUserData(session.user.id);
          if (userData) {
            // Hydrate state from cloud
            if (userData.ndm) setNdm(userData.ndm);
            if (userData.careers) setCareers(userData.careers);
            if (userData.meals) useNutritionStore.getState().setMeals(userData.meals); // Updated
            if (userData.workouts) setWorkouts(userData.workouts);
            if (userData.proteinToday) useNutritionStore.getState().setProteinToday(userData.proteinToday); // Updated
            if (userData.darkMode !== undefined) setDarkMode(userData.darkMode);
            if (userData.gratitude) setGratitude(userData.gratitude);
            if (userData.mantras) setMantras(userData.mantras);
            // if (userData.hourlyTasks) setHourlyTasks(userData.hourlyTasks); // Removed
            if (userData.foodDiary) setFoodDiary(userData.foodDiary);
            if (userData.learningLibrary) setLearningLibrary(userData.learningLibrary);
            if (userData.notificationsEnabled !== undefined) setNotificationsEnabled(userData.notificationsEnabled);
            if (userData.voiceDiary) setVoiceDiary(userData.voiceDiary);
            if (userData.userProfile) setUserProfile(userData.userProfile);
            if (userData.energyTracking) useEnergyMoodStore.getState().setEnergyTracking(userData.energyTracking); // Updated
            if (userData.currentMood) useEnergyMoodStore.getState().setCurrentMood(userData.currentMood); // Updated
          }
        }

        // Listen for auth changes
        const { data: { subscription } } = onAuthStateChange((_event, session) => {
          setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
      } else {
        // No Supabase, load from localStorage
        const saved = localStorage.getItem('dualtrack-data');
        if (saved) {
          try {
            const data = JSON.parse(saved);

            // Always show landing page - removed auto-skip

            if (data.ndm) setNdm(data.ndm);
            if (data.careers) setCareers(data.careers);
            if (data.meals) useNutritionStore.getState().setMeals(data.meals); // Updated
            if (data.workouts) setWorkouts(data.workouts);
            if (data.proteinToday) useNutritionStore.getState().setProteinToday(data.proteinToday); // Updated
            if (data.darkMode !== undefined) setDarkMode(data.darkMode);
            if (data.gratitude) setGratitude(data.gratitude);
            if (data.mantras) setMantras(data.mantras);
            // if (data.hourlyTasks) setHourlyTasks(data.hourlyTasks); // Removed
            if (data.foodDiary) setFoodDiary(data.foodDiary);
            if (data.learningLibrary) setLearningLibrary(data.learningLibrary);
            if (data.notificationsEnabled !== undefined) setNotificationsEnabled(data.notificationsEnabled);
            if (data.voiceDiary) setVoiceDiary(data.voiceDiary);
            if (data.userProfile) setUserProfile(data.userProfile);
            if (data.energyTracking) useEnergyMoodStore.getState().setEnergyTracking(data.energyTracking); // Updated
            if (data.currentMood) useEnergyMoodStore.getState().setCurrentMood(data.currentMood); // Updated
            if (data.spiritAnimalScore !== undefined) setSpiritAnimalScore(data.spiritAnimalScore);
            if (data.balanceHistory) setBalanceHistory(data.balanceHistory);
          } catch (e) { console.error(e); }
        }
      }
    };

    initAuth();
  }, [setUser, setDarkMode, setUserProfile]);

  // Save data to localStorage and Supabase
  useEffect(() => {
    const dataToSave = {
      ndm, careers, /*meals, workouts, proteinToday,*/ darkMode, // Removed meals, proteinToday
      gratitude, mantras, /*hourlyTasks,*/ foodDiary, learningLibrary, notificationsEnabled, // Removed hourlyTasks
      voiceDiary, userProfile, // Removed energyTracking, currentMood
      spiritAnimalScore, balanceHistory,
      energyTracking: useEnergyMoodStore.getState().energyTracking, // Add back current energy tracking
      currentMood: useEnergyMoodStore.getState().currentMood, // Add back current mood
      meals: useNutritionStore.getState().meals, // Add back meals
      proteinToday: useNutritionStore.getState().proteinToday, // Add back proteinToday
    };

    // Always save to localStorage as backup
    localStorage.setItem('dualtrack-data', JSON.stringify(dataToSave));

    // If user is logged in, also save to Supabase
    if (user && isSupabaseConfigured()) {
      saveUserData(user.id, dataToSave);
    }
  }, [ndm, careers, darkMode, gratitude, mantras, foodDiary, learningLibrary, notificationsEnabled, voiceDiary, userProfile, balanceHistory, user]); // Removed energyTracking, currentMood, hourlyTasks, meals, proteinToday from deps

  // Real-time clock update every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Hourly wellness snack trigger (only when in main app, not landing/story)
    const currentHour = new Date().getHours();
    const isActiveHours = currentHour >= ACTIVE_HOURS_START && currentHour <= ACTIVE_HOURS_END;
    const inMainApp = !showLandingPage && !showStoryPage && userProfile.hasCompletedOnboarding;

    if (isActiveHours && currentHour !== useWellnessStore.getState().lastWellnessHour && inMainApp) {
      const hourKey = `${new Date().toDateString()}-${currentHour}`;
      if (!useWellnessStore.getState().wellnessSnacksDismissed.includes(hourKey) && !pomodoroRunning && !useWellnessStore.getState().missedHourPrompt && !useWellnessStore.getState().showWellnessSnackModal) {
        useWellnessStore.getState().setMissedHourPrompt(true);
        useWellnessStore.getState().setLastWellnessHour(currentHour);
      }
    }

    return () => clearInterval(timer);
  }, [pomodoroRunning, showLandingPage, showStoryPage, userProfile.hasCompletedOnboarding, currentTime]);

  // Pomodoro countdown
  useEffect(() => {
    let interval;
    if (pomodoroRunning && pomodoroSeconds > 0) {
      interval = setInterval(() => {
        setPomodoroSeconds(prev => prev - 1);
      }, 1000);
    } else if (pomodoroSeconds === 0 && pomodoroRunning) {
      setPomodoroRunning(false);

      // Track focus session in metrics
      setDailyMetrics(prev => ({
        ...prev,
        focus: {
          ...prev.focus,
          current: Math.min(prev.focus.target, prev.focus.current + 1),
          sessions: [...prev.focus.sessions, { duration: 20, timestamp: new Date() }]
        }
      }));

      if (notificationsEnabled) {
        new Notification('Focus session complete!', { body: '20 minutes of deep work done. Take a break!' });
      }
    }
    return () => clearInterval(interval);
  }, [pomodoroRunning, pomodoroSeconds, notificationsEnabled, setDailyMetrics, setPomodoroSeconds, setPomodoroRunning]);

  // Mindful timer countdown
  useEffect(() => {
    let interval;
    if (mindfulRunning && mindfulTimer > 0) {
      interval = setInterval(() => {
        setMindfulTimer(prev => prev - 1);
      }, 1000);
    } else if (mindfulTimer === 0 && mindfulRunning) {
      setMindfulRunning(false);
      setNdm(prev => ({ ...prev, mindfulness: true }));
      if (notificationsEnabled) {
        new Notification('Mindful moment complete!', { body: '5 minutes of meditation done. 🧘' });
      }
    }
    return () => clearInterval(interval);
  }, [mindfulRunning, mindfulTimer, notificationsEnabled, setNdm]);

  useEffect(() => {
    let score = 0;
    if (ndm.nutrition) score += 10;
    if (ndm.movement) score += 10;
    if (ndm.mindfulness) score += 10;
    if (ndm.brainDump) score += 10;
    score += Math.min(careers.corporate.wins * 10, 30);
    score += Math.min(careers.consultancy.wins * 10, 30);
    // setDailyScore(Math.min(score, 100)); // Daily score is now part of DailyMetrics store
  }, [ndm, careers]);

  // Update spirit animal balance score (心の成長)
  useEffect(() => {
    const newScore = calculateBalanceScore();
    setSpiritAnimalScore(newScore);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ndm, voiceDiary.length, userProfile.weight, setSpiritAnimalScore]); // Removed energyTracking, currentMood, proteinToday, meals.length from deps

  // Sync NDM completions to Daily Metrics
  useEffect(() => {
    const ndmCount = [ndm.nutrition, ndm.movement, ndm.mindfulness, ndm.brainDump].filter(Boolean).length;
    setDailyMetrics(prev => ({
      ...prev,
      ndms: { ...prev.ndms, current: ndmCount }
    }));
  }, [ndm, setDailyMetrics]);


  // useEffect(() => { // Removed: Sync Kanban tasks to Daily Metrics - now in KanbanBoard
  //   const totalTasks = kanbanTasks.backlog.length + kanbanTasks.inProgress.length + kanbanTasks.done.length;
  //   const doneTasks = kanbanTasks.done.length;
  //   setDailyMetrics(prev => ({
  //     ...prev,
  //     tasks: { ...prev.tasks, done: doneTasks, total: totalTasks, pipeline: kanbanTasks.inProgress }
  //   }));
  // }, [kanbanTasks]);


  useEffect(() => {
    let interval;
    if (isWorkoutRunning) interval = setInterval(() => setWorkoutTimer(p => p + 1), 1000);
    return () => clearInterval(interval);
  }, [isWorkoutRunning]);

  // Track scroll position for header transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Brain Dump modal
  const openBrainDump = () => {
    setBrainDumpText('');
    setShowBrainDumpModal(true);
  };

  const saveBrainDump = () => {
    if (brainDumpText.trim()) {
      // Add to voice diary or create new brain dump array
      const entry = {
        id: Date.now(),
        type: 'brain-dump',
        text: brainDumpText,
        timestamp: new Date().toISOString()
      };
      setVoiceDiary(prev => [...prev, entry]);
      setNdm(prev => ({ ...prev, brainDump: true }));
      setShowBrainDumpModal(false);
      setBrainDumpText('');
    }
  };

  // Handle Mindful Moment modal
  const openMindfulMoment = () => {
    setMindfulTimer(MINDFUL_MOMENT_DURATION_SECONDS);
    setShowMindfulMomentModal(true);
  };

  const startMindfulSession = () => {
    setMindfulRunning(true);
  };

  const pauseMindfulSession = () => {
    setMindfulRunning(false);
  };

  const completeMindfulSession = () => {
    setNdm(prev => ({ ...prev, mindfulness: true }));
    setShowMindfulMomentModal(false);
    setMindfulTimer(MINDFUL_MOMENT_DURATION_SECONDS);
    setMindfulRunning(false);
  };

  // const addMeal = (name, protein) => { // Moved to useNutritionStore
  //   setMeals(p => [...p, { id: Date.now(), name, protein, time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) }]);
  //   setProteinToday(p => p + protein);
  // };

  // Add food from Energy/Mood modals (simplified - adds to meals without protein tracking) - NOW IN USE NUTRITION STORE
  // const addFoodFromModal = (foodName) => {
  //   setMeals(p => [...p, { id: Date.now(), name: foodName, protein: 0, time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) }]);
  //   // Optional: Mark nutrition NDM as complete
  //   setNdm(prev => ({ ...prev, nutrition: true }));
  // };

  // Handle action selection from modals - NOW IN STORE
  // const handleEnergyActionSelect = (action) => {
  //   if (!selectedEnergyActions.includes(action)) {
  //     setSelectedEnergyActions(prev => [...prev, action]);
  //   }
  // };

  // const handleMoodActionSelect = (action) => {
  //   if (!selectedMoodActions.includes(action)) {
  //     setSelectedMoodActions(prev => [...prev, action]);
  //   }
  // };

  const startWorkout = (workout) => { setActiveWorkout(workout); setWorkoutTimer(0); setIsWorkoutRunning(true); setCurrentView('workout-active'); };
  const completeWorkout = () => {
    setWorkouts(p => [...p, { id: Date.now(), ...activeWorkout, duration: workoutTimer }]);
    setNdm(p => ({ ...p, movement: true }));
    setActiveWorkout(null);
    setIsWorkoutRunning(false);
    setWorkoutTimer(0);
    setCurrentView('exercise');
  };
  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;


  // Wellness Snack functions
  const dismissWellnessSnack = useRef(null); // Define as ref
  dismissWellnessSnack.current = () => { // Assign function to ref
    const hourKey = `${currentTime.toDateString()}-${currentTime.getHours()}`;
    // setWellnessSnacksDismissed(prev => [...prev, hourKey]); // state is in store
    setShowWellnessSnackModal(false);
    setWellnessSnackChoice(null);
    setExerciseChoice(null);
  };


  const snoozeWellnessSnack = () => {
    setShowWellnessSnackModal(false);
    setTimeout(() => {
      setShowWellnessSnackModal(true);
    }, WELLNESS_SNOOZE_DURATION_MS);
  };

  const completeWellnessSnack = React.useCallback((type) => {
    const completion = {
      type,
      timestamp: new Date(),
      hour: currentTime.getHours()
    };
    // setWellnessCompletions(prev => [...prev, completion]); // State is in store
    setSpiritAnimalScore(prev => Math.min(100, prev + 2));

    // Update Daily Metrics
    if (type === 'hydration') {
      setDailyMetrics(prev => ({
        ...prev,
        hydration: {
          ...prev.hydration,
          current: Math.min(prev.hydration.target, prev.hydration.current + 1),
          log: [...prev.hydration.log, { timestamp: new Date() }]
        }
      }));
    } else if (type === 'exercise') {
      setDailyMetrics(prev => ({
        ...prev,
        movement: {
          ...prev.movement,
          current: Math.min(prev.movement.target, prev.movement.current + 1),
          // completions: [...prev.movement.completions, { type: exerciseChoice, timestamp: new Date() }] // exerciseChoice now in wellness store
        }
      }));
    }

    dismissWellnessSnack.current();
  }, [currentTime, dismissWellnessSnack, setSpiritAnimalScore, setDailyMetrics]);

  // Quick Win Capture - now using dailyMetricsStore
  // const addQuickWin = () => {
  //   if (quickWinInput.trim()) {
  //     setDailyMetrics(prev => ({
  //       ...prev,
  //       wins: [...prev.wins, { text: quickWinInput.trim(), timestamp: new Date() }]
  //     }));
  //     setQuickWinInput('');
  //   }
  // };

  // Exercise tracking functions
  const startExercise = (exercise) => {
    setExerciseChoice(exercise.id);
    setExerciseTarget(exercise.target || EXERCISE_TARGETS.squats);
    setExerciseReps(0);
    setExerciseActive(true);
  };

  const incrementReps = () => {
    if (exerciseReps < exerciseTarget) {
      setExerciseReps(prev => prev + 1);
    }
  };

  const decrementReps = () => {
    if (exerciseReps > 0) {
      setExerciseReps(prev => prev - 1);
    }
  };

  const completeExercise = () => {
    setExerciseActive(false);
    completeWellnessSnack('exercise');
  };

  const cancelExercise = () => {
    setExerciseActive(false);
    setExerciseChoice(null);
    setExerciseReps(0);
    setWellnessSnackChoice(null);
  };

  const cancelWellnessFlow = React.useCallback(() => {
    setShowWellnessSnackModal(false);
    setWellnessSnackChoice(null);
    setExerciseChoice(null);
    setExerciseActive(false);
    setBoxBreathingActive(false);
    setExerciseReps(0);
  }, [setShowWellnessSnackModal]);

  // Missed hour prompt handlers
  const acceptWellnessPrompt = () => {
    // setMissedHourPrompt(false); // State is in store
    setShowWellnessSnackModal(true);
  };

  const declineWellnessPrompt = () => {
    // setMissedHourPrompt(false); // State is in store
    dismissWellnessSnack.current();
  };

  // Voice diary functions (5-minute recording)
  const handleVoiceCheckin = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingStartTime(Date.now());
      // Simulate 5-minute max recording
      setTimeout(() => {
        if (isRecording) {
          setIsRecording(false);
          const transcript = "Voice diary entry recorded"; // In production, use actual speech-to-text
          setVoiceDiary(prev => [...prev, {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
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
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        transcript,
        duration: formatTime(duration)
      }]);
      setRecordingStartTime(null);
    }
  };

  const exportData = () => {
    const data = { ndm, careers, workouts, dailyMetrics, userProfile, energyTracking: useEnergyMoodStore.getState().energyTracking, currentMood: useEnergyMoodStore.getState().currentMood, meals: useNutritionStore.getState().meals, proteinToday: useNutritionStore.getState().proteinToday, exportDate: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dualtrack-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetData = () => {
    if (window.confirm('⚠️ This will DELETE ALL your data. Are you sure?')) {
      localStorage.removeItem('dualtrack-data');
      setNdm({ nutrition: false, movement: false, mindfulness: false, brainDump: false });
      setCareers({ corporate: { wins: 0 }, consultancy: { wins: 0 } });
      // setMeals([]); // Moved to nutrition store
      setWorkouts([]);
      // setProteinToday(0); // Moved to nutrition store
      alert('✅ All data cleared!');
    }
  };

  // Handle onboarding completion
  const handleOnboardingComplete = (profile) => {
    setUserProfile(profile);
  };

  // Calculate current energy level (average of tracked times)
  const getCurrentEnergy = () => {
    const values = Object.values(useEnergyMoodStore.getState().energyTracking).filter(v => v !== null);
    if (values.length === 0) return 0;
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  };

  // Get protein target based on user weight (0.8-1g per lb)
  const getProteinTarget = () => {
    if (!userProfile.weight) return 120; // Default if no weight set
    return Math.round(userProfile.weight * 0.9); // 0.9g per lb as middle ground
  };

  // Set energy for current time of day
  // const setCurrentEnergy = (level) => { // Moved to store
  //   const hour = currentTime.getHours();
  //   if (hour >= 5 && hour < 12) {
  //     setEnergyTracking(prev => ({ ...prev, morning: level }));
  //   } else if (hour >= 12 && hour < 18) {
  //     setEnergyTracking(prev => ({ ...prev, afternoon: level }));
  //   } else {
  //     setEnergyTracking(prev => ({ ...prev, evening: level }));
  //   }
  // };

  // Get time of day label
  const getTimeOfDay = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    return 'evening';
  };

  // Get current time period energy
  const getCurrentPeriodEnergy = () => {
    const period = getTimeOfDay();
    return useEnergyMoodStore.getState().energyTracking[period];
  };

  /**
   * Get Energy-Based Suggestions (Research-Backed)
   * Based on circadian rhythm research, cognitive load theory, and energy management studies
   */
  const getEnergyBasedSuggestions = (energyLevel) => {
    return useEnergyMoodStore.getState().getEnergyBasedSuggestions(energyLevel);
  };

  /**
   * Get Mood-Based Wellness Recommendations (Evidence-Based Psychology)
   * Based on CBT, mindfulness research, and nutritional psychiatry
   */
  const getMoodBasedWellness = (moodState) => {
    return useEnergyMoodStore.getState().getMoodBasedWellness(moodState);
  };

  // Get combined smart suggestions
  const getSmartSuggestions = () => {
    const energyLevel = getCurrentPeriodEnergy() || getCurrentEnergy() || 3;
    const mood = useEnergyMoodStore.getState().currentMood;

    // Get energy-based suggestions
    const energySuggestion = getEnergyBasedSuggestions(energyLevel);

    // Get mood-based wellness if mood is set
    const moodWellness = mood ? getMoodBasedWellness(mood) : null;

    // Special case: Low energy + overwhelmed = ULTIMATE GENTLE MODE
    if (energyLevel <= 2 && mood === 'overwhelmed') {
      return {
        message: "🌸 ULTIMATE GENTLE MODE: Rest is your only job today.",
        tasks: ["Take a bath or shower", "Nap for 20-30 minutes", "Watch comfort TV", "Order takeout (no cooking)"],
        snacks: ["Whatever brings comfort - no rules today", "Warm soup", "Herbal tea", "Dark chocolate"],
        warning: "🌸 You are enough. Rest is productive. Healing takes time.",
        color: "rose",
        type: "crisis"
      };
    }

    // Combine energy and mood suggestions
    return {
      ...energySuggestion,
      moodWellness: moodWellness,
      combinedMessage: mood && moodWellness ?
        `Energy: ${energySuggestion.title} | Mood: ${moodWellness.title}` :
        energySuggestion.title
    };
  };

  /**
   * Spirit Animal Balance Algorithm (PhD-level behavioral psychology)
   *
   * Philosophy: True wellness comes from BALANCE, not just productivity.
   * Resting when tired is as valuable as working when energized.
   *
   * Scoring Factors:
   * 1. Energy-Action Alignment (+20): Did you rest when tired OR work when energized?
   * 2. Emotional Intelligence (+20): Did you meditate when anxious/overwhelmed?
   * 3. Self-Care (+20): Did you complete NDMs (nutrition, movement, mindfulness)?
   * 4. Consistency (+20): Are you maintaining protein intake?
   * 5. Wisdom (+20): Did you avoid pushing through exhaustion?
   *
   * Total: 0-100% balance score
   */
  const calculateBalanceScore = () => {
    let score = 0;
    let maxPossible = 0;

    // Factor 1: Energy-Action Alignment (0-20 points)
    const currentPeriodEnergy = getCurrentPeriodEnergy();
    if (currentPeriodEnergy !== null) {
      maxPossible += 20;
      if (currentPeriodEnergy <= 2) {
        // Low energy: Did user rest? (check if meditation or brain dump today)
        if (ndm.mindfulness || ndm.brainDump) {
          score += 20; // EXCELLENT: Honored low energy with rest
        } else if (voiceDiary.length > 0 && voiceDiary[voiceDiary.length - 1].type === 'brain-dump') {
          score += 15; // GOOD: At least did brain dump
        }
      } else if (currentPeriodEnergy >= 4) {
        // High energy: Count productive actions
        // const productiveActions = Object.values(hourlyTasks).flat() // hourlyTasks removed
        //   .filter(t => t.completed).length;
        const productiveActions = 0; // Placeholder
        if (productiveActions >= 3) {
          score += 20; // EXCELLENT: Capitalized on high energy
        } else if (productiveActions >= 1) {
          score += 10; // GOOD: Some productivity
        }
      } else {
        score += 10; // NEUTRAL: Middle ground
      }
    }

    // Factor 2: Emotional Intelligence (0-20 points)
    maxPossible += 20;
    if (currentMood === 'anxious' || currentMood === 'overwhelmed') {
      // Did user meditate or brain dump?
      if (ndm.mindfulness) {
        score += 20; // EXCELLENT: Addressed anxiety with mindfulness
      } else if (ndm.brainDump) {
        score += 15; // GOOD: Released overwhelm through brain dump
      }
    } else if (currentMood === 'energized' || currentMood === 'focused') {
      score += 15; // GOOD: Positive emotional state
    } else if (currentMood === 'calm') {
      score += 20; // EXCELLENT: Achieved calm state
    }

    // Factor 3: Self-Care NDMs (0-20 points)
    maxPossible += 20;
    const ndmCount = [ndm.nutrition, ndm.movement, ndm.mindfulness, ndm.brainDump].filter(Boolean).length;
    score += ndmCount * 5; // 5 points per NDM

    // Factor 4: Nutrition Consistency (0-20 points)
    maxPossible += 20;
    if (userProfile.weight) {
      const proteinTarget = getProteinTarget(); // Use from useNutritionStore
      const currentProteinToday = proteinToday; // Use from useNutritionStore
      const proteinPercent = (currentProteinToday / proteinTarget) * 100;
      if (proteinPercent >= 80) {
        score += 20; // EXCELLENT: Met protein goal
      } else if (proteinPercent >= 50) {
        score += 15; // GOOD: Halfway there
      } else if (proteinPercent >= 25) {
        score += 10; // FAIR: Some progress
      } else if (meals.length > 0) { // Use meals from useNutritionStore
        score += 5; // At least tracking
      }
    } else {
      // If no weight set, just reward tracking
      score += meals.length >= 3 ? 20 : meals.length * 5; // Use meals from useNutritionStore
    }

    // Factor 5: Wisdom - Avoiding Burnout (0-20 points)
    maxPossible += 20;
    if (currentPeriodEnergy !== null) {
      if (currentPeriodEnergy <= 2) {
        // Low energy: Wisdom is NOT pushing through
        // const tasksCompletedWhileTired = Object.values(hourlyTasks).flat() // hourlyTasks removed
        //   .filter(t => t.completed).length;
        const tasksCompletedWhileTired = 0; // Placeholder
        if (tasksCompletedWhileTired === 0 && (ndm.mindfulness || ndm.brainDump)) {
          score += 20; // WISDOM: Rested instead of pushing
        } else if (tasksCompletedWhileTired <= 2) {
          score += 10; // CAUTION: Limited output, honored energy somewhat
        } else {
          score += 0; // WARNING: Pushing through exhaustion
        }
      } else {
        score += 15; // GOOD: Not in danger zone
      }
    } else {
      score += 10; // NEUTRAL: Haven't set energy yet
    }

    // Convert to percentage
    const balancePercent = maxPossible > 0 ? Math.round((score / maxPossible) * 100) : 0;
    return Math.min(100, Math.max(0, balancePercent));
  };

  /**
   * Get Spirit Animal Growth Stage (Inspired by Japanese Kitsune Mythology)
   *
   * Kitsune (狐) are fox spirits that gain tails as they grow wiser and more powerful.
   * Your spirit animal evolves as you practice balance and self-care.
   *
   * Growth Journey:
   * 1. Egg (卵 - Tamago): Potential waiting to be nurtured (0-19%)
   * 2. Hatchling (雛 - Hina): New life, beginning to learn (20-39%)
   * 3. Young Fox (子狐 - Kogitsune): Growing strength, 1-3 tails (40-59%)
   * 4. Spirit Fox (狐 - Kitsune): Wisdom emerging, 5 tails (60-79%)
   * 5. Nine-Tailed Fox (九尾 - Kyuubi): Enlightened master of balance (80-100%)
   */
  // Daily Planning Functions
  const updateGratitude = (index, value) => {
    const newGratitude = [...gratitude];
    newGratitude[index] = value;
    setGratitude(newGratitude);
  };

  const updateMantra = (index, value) => {
    const newMantras = [...mantras];
    newMantras[index] = value;
    setMantras(newMantras);
  };

  // const addHourlyTask = (hour, taskText) => { // Removed
  //   if (!taskText.trim()) return;
  //   const newTasks = { ...hourlyTasks };
  //   newTasks[hour] = [...(newTasks[hour] || []), { id: Date.now(), text: taskText, completed: false, type: 'task' }];
  //   setHourlyTasks(newTasks);
  // };

  // const toggleHourlyTask = (hour, taskId) => { // Removed
  //   const newTasks = { ...hourlyTasks };
  //   newTasks[hour] = newTasks[hour].map(task =>
  //     task.id === taskId ? { ...task, completed: !task.completed } : task
  //   );
  //   setHourlyTasks(newTasks);
  // };

  // const deleteHourlyTask = (hour, taskId) => { // Removed
  //   const newTasks = { ...hourlyTasks };
  //   newTasks[hour] = newTasks[hour].filter(task => task.id !== taskId);
  //   setHourlyTasks(newTasks);
  // };

  const addFoodDiaryEntry = (imageData, description, calories) => {
    setFoodDiary(prev => [...prev, {
      id: Date.now(),
      image: imageData,
      description,
      calories: calories || 0,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    }]);
  };

  const addLearningItem = (url, title, type, notes) => {
    setLearningLibrary(prev => [...prev, {
      id: Date.now(),
      url,
      title,
      type, // 'book', 'article', 'youtube', 'instagram'
      notes: notes || '',
      actionItems: [],
      dateAdded: new Date().toLocaleDateString()
    }]);
  };

  const addActionItemToLearning = (learningId, actionText) => {
    setLearningLibrary(prev => prev.map(item =>
      item.id === learningId
        ? { ...item, actionItems: [...item.actionItems, { id: Date.now(), text: actionText, done: false }] }
        : item
    ));
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
    }
  };

  const formatHour = (hour) => {
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    return `${displayHour}${suffix}`;
  };

  // Geometric Background Pattern Component
  const GeometricBg = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
      <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1" fill={darkMode ? '#a855f7' : '#e0e0e0'} />
          </pattern>
          <linearGradient id="neon1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <circle cx="10%" cy="20%" r="150" fill="url(#neon1)" opacity="0.1" />
        <circle cx="90%" cy="80%" r="200" fill="url(#neon1)" opacity="0.1" />
      </svg>
    </div>
  );

  const NDMItem = ({ icon, label, completed, onClick }) => (
    <div onClick={onClick} className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300 ${
      darkMode
        ? completed
          ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-2 border-emerald-500/50 hover:border-emerald-400 shadow-lg shadow-emerald-500/20'
          : 'bg-gray-800/50 border-2 border-gray-700/50 hover:border-gray-600 backdrop-blur-sm'
        : completed
          ? 'bg-green-50 border-2 border-green-500 hover:border-green-600'
          : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex items-center space-x-3">
        <span className="text-2xl">{icon}</span>
        <span className={`font-medium ${darkMode ? (completed ? 'text-emerald-300' : 'text-gray-300') : (completed ? 'text-green-700' : 'text-gray-700')}`}>{label}</span>
      </div>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
        darkMode
          ? completed ? 'bg-gradient-to-r from-emerald-500 to-green-500 shadow-lg shadow-emerald-500/50' : 'bg-gray-700'
          : completed ? 'bg-green-500' : 'bg-gray-300'
      }`}>
        {completed && <Check className="text-white" size={20} />}
      </div>
    </div>
  );

  const VitalRow = ({ label, value, trend }) => (
    <div className="flex justify-between items-center">
      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{label}</span>
      <div className="flex items-center space-x-2">
        <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{value}</span>
        <span className={`text-lg ${trend === 'up' ? (darkMode ? 'text-emerald-400' : 'text-green-500') : trend === 'down' ? (darkMode ? 'text-rose-400' : 'text-red-500') : (darkMode ? 'text-gray-500' : 'text-gray-400')}`}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
        </span>
      </div>
    </div>
  );

  const WorkoutCard = ({ emoji, name, duration, intensity, description, onClick }) => (
    <div onClick={onClick} className={`rounded-xl p-4 cursor-pointer transition-all duration-300 ${
      darkMode
        ? 'bg-gray-800/50 border-2 border-gray-700/50 hover:border-orange-500/50 backdrop-blur-sm shadow-lg hover:shadow-orange-500/20'
        : 'bg-white border-2 border-gray-100 hover:border-orange-300 shadow-md'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{emoji}</span>
          <div>
            <div className={`font-bold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{name}</div>
            <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{description}</div>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-sm font-semibold ${darkMode ? 'bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent' : 'text-orange-600'}`}>{duration}</div>
          <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{intensity}</div>
        </div>
      </div>
    </div>
  );

  const QuickMealButton = ({ emoji, name, protein, onClick }) => (
    <button onClick={() => onClick(name, protein)} className={`rounded-xl p-3 text-left transition-all duration-300 ${
      darkMode
        ? 'bg-emerald-500/10 hover:bg-emerald-500/20 border-2 border-emerald-500/30 hover:border-emerald-500/50'
        : 'bg-green-50 hover:bg-green-100 border-2 border-green-200'
    }`}>
      <div className="text-2xl mb-1">{emoji}</div>
      <div className={`text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{name}</div>
      <div className={`text-xs font-bold ${darkMode ? 'bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent' : 'text-green-600'}`}>{protein}g protein</div>
    </button>
  );

  const StatRow = ({ label, value, color }) => (
    <div className="flex justify-between items-center">
      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{label}</span>
      <span className={`font-bold ${color}`}>{value}</span>
    </div>
  );

  const NavButton = ({ icon, label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all duration-300 ${
        active
          ? darkMode
            ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-400/50'
            : 'bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-400'
          : darkMode
            ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/30'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
      }`}
      style={active ? {
        boxShadow: darkMode
          ? '0 0 20px rgba(168, 85, 247, 0.5), 0 0 10px rgba(236, 72, 153, 0.3)'
          : '0 0 15px rgba(168, 85, 247, 0.3), 0 4px 10px rgba(168, 85, 247, 0.2)'
      } : {}}
    >
      <div className={active ? (darkMode ? 'text-purple-300' : 'text-purple-600') : ''}>
        {icon}
      </div>
      <span className={`text-xs font-medium ${
        active
          ? darkMode
            ? 'text-purple-300 font-bold'
            : 'text-purple-700 font-bold'
          : ''
      }`}>
        {label}
      </span>
    </button>
  );

  const BoxBreathingComponent = React.memo(({ darkMode, onComplete, onCancel }) => {
    const [totalElapsedMs, setTotalElapsedMs] = React.useState(0);
    const onCompleteRef = React.useRef(onComplete);

    // Always keep ref updated with latest onComplete
    React.useEffect(() => {
      onCompleteRef.current = onComplete;
    }, [onComplete]);

    React.useEffect(() => {
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
    const phases = ['inhale', 'hold1', 'exhale', 'hold2'];
    const phaseIndex = Math.floor((totalElapsedMs % BOX_BREATHING_CYCLE_DURATION_MS) / BOX_BREATHING_PHASE_DURATION_MS);
    const currentPhase = phases[phaseIndex];
    const millisInCurrentPhase = totalElapsedMs % BOX_BREATHING_PHASE_DURATION_MS;
    const progress = millisInCurrentPhase / BOX_BREATHING_PHASE_DURATION_MS;
    const countdown = Math.ceil((BOX_BREATHING_PHASE_DURATION_MS - millisInCurrentPhase) / 1000);
    const cycleNumber = Math.floor(totalElapsedMs / BOX_BREATHING_CYCLE_DURATION_MS);

    const instructions = {
      inhale: "Breathe IN through nose",
      hold1: "HOLD your breath",
      exhale: "Breathe OUT through mouth",
      hold2: "HOLD, lungs empty"
    };

    // Calculate dot position - smooth flow around the box
    const getCirclePosition = () => {
      // Redefined path for a standard clockwise box breathing animation
      const paths = [
        { fromX: 32, fromY: 32, toX: 232, toY: 32 },    // inhale: top-left → top-right
        { fromX: 232, fromY: 32, toX: 232, toY: 232 },  // hold1: top-right → bottom-right
        { fromX: 232, fromY: 232, toX: 32, toY: 232 },  // exhale: bottom-right → bottom-left
        { fromX: 32, fromY: 232, toX: 32, toY: 32 }     // hold2: bottom-left → top-left
      ];

      const path = paths[phaseIndex];
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
              {instructions[currentPhase]}
            </div>
            <div className={`text-sm mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
              Cycle {cycleNumber + 1} of 8
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
  });

  // Show landing page first
  if (showLandingPage) {
    return (
      <LandingPage
        onEnter={() => setShowLandingPage(false)}
        onViewStory={() => {
          setShowStoryPage(true);
          setShowLandingPage(false);
        }}
        darkMode={darkMode}
      />
    );
  }

  // Show story page if requested
  if (showStoryPage) {
    return (
      <StoryPage
        onBack={() => {
          setShowStoryPage(false);
          setShowLandingPage(true);
        }}
        onEnter={() => {
          setShowStoryPage(false);
          setShowLandingPage(false);
        }}
        darkMode={darkMode}
      />
    );
  }

  // Show onboarding if not completed
  if (!userProfile.hasCompletedOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} darkMode={darkMode} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 overflow-x-hidden ${
      darkMode
        ? 'bg-[#191919]'
        : 'bg-gradient-to-br from-purple-50 to-pink-50'
    }`} style={{ position: 'fixed', width: '100%', height: '100%', overflowY: 'auto', scrollBehavior: 'smooth' }}>
      <GeometricBg />

      {/* Daily Command Center - Top Right Side Tab */}
      <div className="fixed right-0 top-1/2 -translate-y-16 w-10 h-24 z-30">
        <button
          onClick={() => dailyMetrics.setShowCommandCenterModal(true)}
          className={`w-full h-full rounded-l-xl flex items-center justify-center transition-all ${
            darkMode ? 'bg-gradient-to-b from-cyan-500/20 to-purple-500/20' : 'bg-gradient-to-b from-cyan-100/40 to-purple-100/40'
          }`}
          style={{
            border: '1px solid #a855f740',
            borderRight: 'none',
            boxShadow: '0 0 20px #a855f755'
          }}
          title="Daily Command Center"
        >
          <div className="flex flex-col items-center gap-0.5">
            <TrendingUp className={darkMode ? 'text-purple-300' : 'text-purple-600'} size={20} strokeWidth={2.5} />
            <span className={`text-[8px] font-bold leading-tight ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>
              CMD
            </span>
          </div>
        </button>
      </div>

      {/* Non-Negotiables - Right Side Tab (below spirit animal) */}
      <div className="fixed right-0 top-1/2 translate-y-12 w-10 h-24 z-30">
        <button
          onClick={() => setShowNonNegotiablesModal(true)}
          className={`w-full h-full rounded-l-xl flex items-center justify-center transition-all ${
            darkMode ? 'bg-rose-500/20' : 'bg-rose-100/40'
          }`}
          style={{
            border: `1px solid ${darkMode ? '#fb7185' : '#fda4af'}40`,
            borderRight: 'none',
            boxShadow: `0 0 20px ${darkMode ? 'rgba(251, 113, 133, 0.55)' : 'rgba(253, 164, 175, 0.55)'}`
          }}
          title="View Daily Non-Negotiables"
        >
          <div className="flex flex-col items-center gap-1">
            <Heart className="w-6 h-6" style={{
              color: darkMode ? '#fb7185' : '#f43f5e',
              filter: `drop-shadow(0 0 6px ${darkMode ? 'rgba(251, 113, 133, 0.8)' : 'rgba(244, 63, 94, 0.8)'})`
            }} />
            <span className="text-[8px] font-bold leading-tight" style={{ color: darkMode ? '#fb7185' : '#f43f5e' }}>
              NDM
            </span>
          </div>
        </button>
      </div>

      {/* HEADER - Mobile First, Brand Visible */}
      <div className={`sticky top-0 z-20 backdrop-blur-xl transition-all duration-300 ${
        isScrolled
          ? darkMode
            ? 'bg-gray-900/20 border-b border-gray-800/10'
            : 'bg-white/20 border-b border-gray-200/10'
          : darkMode
            ? 'bg-gray-900/95 border-b border-gray-800/50 shadow-2xl shadow-purple-500/10'
            : 'bg-white/95 border-b border-gray-200/50 shadow-lg'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-1">
          <div className="flex items-center justify-between">

            {/* LEFT: LOGO */}
            <div className={`flex items-center gap-2 transition-opacity duration-300 ${isScrolled ? 'opacity-0' : 'opacity-100'}`}>
              <img
                src="/lioness-logo.png"
                alt="DualTrack OS"
                className="w-16 h-16 md:w-20 md:h-20 drop-shadow-xl"
              />
            </div>

            {/* CENTER: TIME + POMODORO HINT - Primary Action */}
            <button
              onClick={() => usePomodoroStore.getState().togglePomodoroMode()}
              className="flex flex-col items-center cursor-pointer select-none transition-transform hover:scale-105"
            >
              <div className={`text-3xl md:text-4xl font-semibold tracking-tight ${
                darkMode
                  ? 'bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent'
                  : 'text-gray-900'
              }`}>
                {currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false })}
              </div>
              <div className={`text-[11px] md:text-xs ${
                darkMode ? 'text-purple-400' : 'text-purple-600'
              } ${isScrolled ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
                Tap clock to start Pomodoro
              </div>
              {userProfile.initials && (
                <div className={`text-xs md:text-sm font-medium mt-1 ${
                  darkMode
                    ? 'bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent'
                    : 'text-pink-600'
                } ${isScrolled ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
                  {welcomeMessage}, {userProfile.initials}
                </div>
              )}
            </button>

            {/* RIGHT: SETTINGS - Demoted Visually */}
            <button
              onClick={() => setCurrentView(currentView === 'insights' ? 'dashboard' : 'insights')}
              className={`p-2 rounded-full transition-all ${
                darkMode
                  ? 'hover:bg-white/10 text-gray-400 hover:text-gray-300'
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-700'
              }`}
              title={currentView === 'insights' ? 'Close Settings' : 'Open Settings'}
            >
              <Settings className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>

          {/* Pomodoro Timer */}
          <div className="text-center pb-1">
            {isPomodoroMode && (
              // Pomodoro Timer Mode
              <div className="space-y-3">
                <div className={`font-mono text-3xl sm:text-4xl font-bold ${
                  darkMode
                    ? pomodoroRunning
                      ? 'bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent'
                      : 'text-gray-600'
                    : pomodoroRunning ? 'text-orange-600' : 'text-gray-400'
                }`}>
                  {formatTime(pomodoroSeconds)}
                </div>
                <div className="flex items-center justify-center space-x-3">
                  {!pomodoroRunning ? (
                    <button onClick={startPomodoro} className={`px-6 py-2 rounded-lg font-medium flex items-center space-x-2 transition-all ${
                      darkMode
                        ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30'
                        : 'bg-green-100 hover:bg-green-200 text-green-700 border border-green-300'
                    }`}>
                      <Play size={18} />
                      <span>Start</span>
                    </button>
                  ) : (
                    <button onClick={pausePomodoro} className={`px-6 py-2 rounded-lg font-medium flex items-center space-x-2 transition-all ${
                      darkMode
                        ? 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30'
                        : 'bg-orange-100 hover:bg-orange-200 text-orange-700 border border-orange-300'
                    }`}>
                      <Pause size={18} />
                      <span>Pause</span>
                    </button>
                  )}
                  <button onClick={resetPomodoro} className={`p-2 rounded-lg transition-all ${
                    darkMode
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-400'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                  }`}>
                    <RotateCcw size={18} />
                  </button>
                  <button onClick={() => usePomodoroStore.getState().togglePomodoroMode()} className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    darkMode
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-400'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                  }`}>
                    Exit
                  </button>
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  {pomodoroRunning ? '🎯 Deep Focus Mode Active' : 'Paused'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {currentView === 'dashboard' && (
          <div className="space-y-6 pb-32 relative z-10">

            {/* NDM Status Bar - Shows Outstanding Tasks */}
            {/* <NDMStatusBar
              ndm={ndm}
              darkMode={darkMode}
              setCurrentView={setCurrentView}
              openMindfulMoment={openMindfulMoment}
              openBrainDump={openBrainDump}
            /> */}

            {/* CURRENT HOUR FOCUS - REMOVED, NOW IN COMPONENT */}
            {/* ENERGY & MOOD TRACKING - REMOVED, NOW IN COMPONENT */}
            {/* PROTEIN TRACKER - REMOVED, NOW IN COMPONENT */}

            {/* KANBAN BOARD - Career & Business Tasks - REMOVED */}
          </div>
        )}
      </div>

      {dailyMetrics.showCommandCenterModal && ( // Use dailyMetrics.showCommandCenterModal
        <DailyCommandCenterModal
          darkMode={darkMode}
          setShowCommandCenterModal={dailyMetrics.setShowCommandCenterModal}
          addQuickWin={addQuickWin}
          quickWinInput={quickWinInput}
          setQuickWinInput={setQuickWinInput}
        />
      )}
      {showWellnessSnackModal && (
        <WellnessSnackModal
          currentTime={currentTime}
          setDailyMetrics={setDailyMetrics}
          setSpiritAnimalScore={setSpiritAnimalScore}
        />
      )}
    </div>
  );
};

export default DualTrackOS;