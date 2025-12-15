import React, { useState, useEffect } from 'react';
import { Zap, Brain, Heart, Check, Mic, Play, Pause, RotateCcw, Utensils, BarChart3, Apple, Plus, Award, Activity, Download, Trash2, Settings, Calendar, Clock, Sparkles, Lightbulb, Camera, BookOpen, Youtube, X, Bell, BellOff, LogIn, LogOut } from 'lucide-react';
import { supabase, isSupabaseConfigured, signInWithGoogle, signOut as supabaseSignOut, saveUserData, loadUserData } from './supabaseClient';
import LandingPage from './LandingPage';
import StoryPage from './StoryPage';
import Onboarding from './Onboarding';
import NDMStatusBar from './components/NDMStatusBar';
// SmartSuggestions moved to modals only - no longer on main dashboard
import EnergyModal from './components/EnergyModal';
import MoodModal from './components/MoodModal';

const DualTrackOS = () => {
  // View states
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [showStoryPage, setShowStoryPage] = useState(false);

  // Auth state
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [dailyScore, setDailyScore] = useState(0);
  const [streak] = useState(0); // No mock data
  const [isRecording, setIsRecording] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // User Profile (for personalization)
  const [userProfile, setUserProfile] = useState({
    name: '',
    preferredName: '',
    initials: '',
    age: null,
    weight: null, // in lbs, for protein calculation
    avatar: '🥚', // Everyone starts with an egg that grows into a Kitsune
    hasCompletedOnboarding: false,
    disclaimerAccepted: false
  });

  // Energy tracking (3x per day)
  const [energyTracking, setEnergyTracking] = useState({
    morning: null,    // 1-5
    afternoon: null,  // 1-5
    evening: null     // 1-5
  });

  // Mood tracking
  const [currentMood, setCurrentMood] = useState(null); // 'energized', 'focused', 'calm', 'tired', 'anxious', 'overwhelmed'

  // Detail view (which tile is expanded)
  const [expandedTile, setExpandedTile] = useState(null);

  // Modals for actionable NDMs
  const [showBrainDumpModal, setShowBrainDumpModal] = useState(false);
  const [showMindfulMomentModal, setShowMindfulMomentModal] = useState(false);
  const [brainDumpText, setBrainDumpText] = useState('');
  const [mindfulTimer, setMindfulTimer] = useState(300); // 5 minutes
  const [mindfulRunning, setMindfulRunning] = useState(false);

  // Energy & Mood Modals
  const [showEnergyModal, setShowEnergyModal] = useState(false);
  const [showMoodModal, setShowMoodModal] = useState(false);

  // Track selected actions from modals
  const [selectedEnergyActions, setSelectedEnergyActions] = useState([]);
  const [selectedMoodActions, setSelectedMoodActions] = useState([]);

  // Spirit Animal State (心の成長 - Growth of the Heart)
  const [spiritAnimalScore, setSpiritAnimalScore] = useState(0); // 0-100 balance score
  const [balanceHistory, setBalanceHistory] = useState([]); // Track balance decisions

  // Non-Negotiables Side Tab State
  const [showNonNegotiablesModal, setShowNonNegotiablesModal] = useState(false);

  // Pomodoro Full-Screen State
  const [showPomodoroFullScreen, setShowPomodoroFullScreen] = useState(false);

  // Hourly Wellness Snack System
  const [lastWellnessHour, setLastWellnessHour] = useState(null);
  const [showWellnessSnackModal, setShowWellnessSnackModal] = useState(false);
  const [wellnessSnacksDismissed, setWellnessSnacksDismissed] = useState([]);
  const [wellnessSnackChoice, setWellnessSnackChoice] = useState(null); // 'exercise', 'breathing', 'hydration'
  const [exerciseChoice, setExerciseChoice] = useState(null); // 'squats', 'calves', etc.
  const [boxBreathingActive, setBoxBreathingActive] = useState(false);
  const [boxBreathingPhase, setBoxBreathingPhase] = useState('inhale');
  const [boxBreathingCycles, setBoxBreathingCycles] = useState(0);
  const [wellnessCompletions, setWellnessCompletions] = useState([]);

  // Daily Command Center Metrics
  const [dailyMetrics, setDailyMetrics] = useState({
    hydration: { current: 0, target: 8, log: [] },
    movement: { current: 0, target: 4, completions: [] },
    focus: { current: 0, target: 4, sessions: [] },
    ndms: { current: 0, target: 4 },
    tasks: { done: 0, total: 0, pipeline: [] },
    wins: []
  });
  const [showCommandCenterModal, setShowCommandCenterModal] = useState(false);
  const [quickWinInput, setQuickWinInput] = useState('');

  // Real-time clock state
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPomodoroMode, setIsPomodoroMode] = useState(false);
  const [pomodoroSeconds, setPomodoroSeconds] = useState(20 * 60); // 20 minutes
  const [pomodoroRunning, setPomodoroRunning] = useState(false);

  // Kanban Board for Career & Business Tasks
  const [kanbanTasks, setKanbanTasks] = useState({
    backlog: [],
    inProgress: [],
    done: []
  });
  const [newTaskInput, setNewTaskInput] = useState('');
  const [expandedColumn, setExpandedColumn] = useState(null);

  const [ndm, setNdm] = useState({ nutrition: false, movement: false, mindfulness: false, brainDump: false });
  const [careers, setCareers] = useState({ corporate: { wins: 0 }, consultancy: { wins: 0 } });
  const [vitals] = useState({
    sleep: { hours: 0, trend: 'stable' },
    hrv: { value: 0, trend: 'stable' },
    rhr: { value: 0, trend: 'stable' },
    steps: { value: 0 },
    activeCalories: { value: 0 }
  });
  const [meals, setMeals] = useState([]);
  const [proteinToday, setProteinToday] = useState(0);
  const [workouts, setWorkouts] = useState([]);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isWorkoutRunning, setIsWorkoutRunning] = useState(false);
  const [weeklyData] = useState({ ndmStreak: 0, avgEnergy: 0, avgSleep: 0, workoutCount: 0, corporateWins: 0, consultancyWins: 0 });

  // Daily Planning State
  const [gratitude, setGratitude] = useState(['', '', '']);
  const [mantras, setMantras] = useState(['', '', '']);
  const [hourlyTasks, setHourlyTasks] = useState(() => {
    const tasks = {};
    for (let hour = 5; hour <= 22; hour++) {
      tasks[hour] = [];
    }
    return tasks;
  });
  const [foodDiary, setFoodDiary] = useState([]);
  const [learningLibrary, setLearningLibrary] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Voice diary state
  const [voiceDiary, setVoiceDiary] = useState([]);
  const [recordingStartTime, setRecordingStartTime] = useState(null);

  // Initialize auth and load data
  useEffect(() => {
    // Check auth status
    const initAuth = async () => {
      if (isSupabaseConfigured() && supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        // If user is logged in, load from Supabase
        if (session?.user) {
          const { data: userData } = await loadUserData(session.user.id);
          if (userData) {
            // Hydrate state from cloud
            if (userData.ndm) setNdm(userData.ndm);
            if (userData.careers) setCareers(userData.careers);
            if (userData.meals) setMeals(userData.meals);
            if (userData.workouts) setWorkouts(userData.workouts);
            if (userData.proteinToday) setProteinToday(userData.proteinToday);
            if (userData.darkMode !== undefined) setDarkMode(userData.darkMode);
            if (userData.gratitude) setGratitude(userData.gratitude);
            if (userData.mantras) setMantras(userData.mantras);
            if (userData.hourlyTasks) setHourlyTasks(userData.hourlyTasks);
            if (userData.foodDiary) setFoodDiary(userData.foodDiary);
            if (userData.learningLibrary) setLearningLibrary(userData.learningLibrary);
            if (userData.notificationsEnabled !== undefined) setNotificationsEnabled(userData.notificationsEnabled);
            if (userData.kanbanTasks) setKanbanTasks(userData.kanbanTasks);
            if (userData.voiceDiary) setVoiceDiary(userData.voiceDiary);
            if (userData.userProfile) setUserProfile(userData.userProfile);
            if (userData.energyTracking) setEnergyTracking(userData.energyTracking);
            if (userData.currentMood) setCurrentMood(userData.currentMood);
          }
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
            if (data.meals) setMeals(data.meals);
            if (data.workouts) setWorkouts(data.workouts);
            if (data.proteinToday) setProteinToday(data.proteinToday);
            if (data.darkMode !== undefined) setDarkMode(data.darkMode);
            if (data.gratitude) setGratitude(data.gratitude);
            if (data.mantras) setMantras(data.mantras);
            if (data.hourlyTasks) setHourlyTasks(data.hourlyTasks);
            if (data.foodDiary) setFoodDiary(data.foodDiary);
            if (data.learningLibrary) setLearningLibrary(data.learningLibrary);
            if (data.notificationsEnabled !== undefined) setNotificationsEnabled(data.notificationsEnabled);
            if (data.kanbanTasks) setKanbanTasks(data.kanbanTasks);
            if (data.voiceDiary) setVoiceDiary(data.voiceDiary);
            if (data.userProfile) setUserProfile(data.userProfile);
            if (data.energyTracking) setEnergyTracking(data.energyTracking);
            if (data.currentMood) setCurrentMood(data.currentMood);
            if (data.spiritAnimalScore !== undefined) setSpiritAnimalScore(data.spiritAnimalScore);
            if (data.balanceHistory) setBalanceHistory(data.balanceHistory);
          } catch (e) { console.error(e); }
        }
      }
    };

    initAuth();
  }, []);

  // Save data to localStorage and Supabase
  useEffect(() => {
    const dataToSave = {
      ndm, careers, meals, workouts, proteinToday, darkMode,
      gratitude, mantras, hourlyTasks, foodDiary, learningLibrary, notificationsEnabled,
      kanbanTasks, voiceDiary, userProfile, energyTracking, currentMood,
      spiritAnimalScore, balanceHistory
    };

    // Always save to localStorage as backup
    localStorage.setItem('dualtrack-data', JSON.stringify(dataToSave));

    // If user is logged in, also save to Supabase
    if (user && isSupabaseConfigured()) {
      saveUserData(user.id, dataToSave);
    }
  }, [ndm, careers, meals, workouts, proteinToday, darkMode, gratitude, mantras, hourlyTasks, foodDiary, learningLibrary, notificationsEnabled, kanbanTasks, voiceDiary, userProfile, energyTracking, currentMood, spiritAnimalScore, balanceHistory, user]);

  // Real-time clock update every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Hourly wellness snack trigger
    const currentHour = new Date().getHours();
    const isActiveHours = currentHour >= 9 && currentHour <= 21;

    if (isActiveHours && currentHour !== lastWellnessHour) {
      const hourKey = `${new Date().toDateString()}-${currentHour}`;
      if (!wellnessSnacksDismissed.includes(hourKey) && !pomodoroRunning) {
        setShowWellnessSnackModal(true);
        setLastWellnessHour(currentHour);
      }
    }

    return () => clearInterval(timer);
  }, [lastWellnessHour, wellnessSnacksDismissed, pomodoroRunning]);

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
  }, [pomodoroRunning, pomodoroSeconds, notificationsEnabled]);

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
  }, [mindfulRunning, mindfulTimer, notificationsEnabled]);

  useEffect(() => {
    let score = 0;
    if (ndm.nutrition) score += 10;
    if (ndm.movement) score += 10;
    if (ndm.mindfulness) score += 10;
    if (ndm.brainDump) score += 10;
    score += Math.min(careers.corporate.wins * 10, 30);
    score += Math.min(careers.consultancy.wins * 10, 30);
    setDailyScore(Math.min(score, 100));
  }, [ndm, careers]);

  // Update spirit animal balance score (心の成長)
  useEffect(() => {
    const newScore = calculateBalanceScore();
    setSpiritAnimalScore(newScore);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [energyTracking, currentMood, ndm, proteinToday, meals.length, voiceDiary.length, userProfile.weight]);

  // Sync NDM completions to Daily Metrics
  useEffect(() => {
    const ndmCount = [ndm.nutrition, ndm.movement, ndm.mindfulness, ndm.brainDump].filter(Boolean).length;
    setDailyMetrics(prev => ({
      ...prev,
      ndms: { ...prev.ndms, current: ndmCount }
    }));
  }, [ndm]);

  // Sync Kanban tasks to Daily Metrics
  useEffect(() => {
    const totalTasks = kanbanTasks.backlog.length + kanbanTasks.inProgress.length + kanbanTasks.done.length;
    const doneTasks = kanbanTasks.done.length;
    setDailyMetrics(prev => ({
      ...prev,
      tasks: { ...prev.tasks, done: doneTasks, total: totalTasks, pipeline: kanbanTasks.inProgress }
    }));
  }, [kanbanTasks]);

  useEffect(() => {
    let interval;
    if (isWorkoutRunning) interval = setInterval(() => setWorkoutTimer(p => p + 1), 1000);
    return () => clearInterval(interval);
  }, [isWorkoutRunning]);

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
    setMindfulTimer(300); // Reset to 5 minutes
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
    setMindfulTimer(300);
    setMindfulRunning(false);
  };

  const addMeal = (name, protein) => {
    setMeals(p => [...p, { id: Date.now(), name, protein, time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) }]);
    setProteinToday(p => p + protein);
  };

  // Add food from Energy/Mood modals (simplified - adds to meals without protein tracking)
  const addFoodFromModal = (foodName) => {
    setMeals(p => [...p, { id: Date.now(), name: foodName, protein: 0, time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) }]);
    // Optional: Mark nutrition NDM as complete
    setNdm(prev => ({ ...prev, nutrition: true }));
  };

  // Handle action selection from modals
  const handleEnergyActionSelect = (action) => {
    if (!selectedEnergyActions.includes(action)) {
      setSelectedEnergyActions(prev => [...prev, action]);
    }
  };

  const handleMoodActionSelect = (action) => {
    if (!selectedMoodActions.includes(action)) {
      setSelectedMoodActions(prev => [...prev, action]);
    }
  };

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

  // Pomodoro timer functions
  const togglePomodoroMode = () => {
    setIsPomodoroMode(!isPomodoroMode);
    if (!isPomodoroMode) {
      setPomodoroSeconds(20 * 60); // Reset to 20 minutes when entering Pomodoro mode
      setPomodoroRunning(false);
    }
  };

  const startPomodoro = () => {
    setPomodoroRunning(true);
    setShowPomodoroFullScreen(true); // Enter full-screen focus mode
  };

  const pausePomodoro = () => {
    setPomodoroRunning(false);
    setShowPomodoroFullScreen(false); // Exit full-screen mode
  };

  const resetPomodoro = () => {
    setPomodoroSeconds(20 * 60);
    setPomodoroRunning(false);
    setShowPomodoroFullScreen(false); // Exit full-screen mode
  };

  // Wellness Snack functions
  const dismissWellnessSnack = () => {
    const hourKey = `${currentTime.toDateString()}-${currentTime.getHours()}`;
    setWellnessSnacksDismissed([...wellnessSnacksDismissed, hourKey]);
    setShowWellnessSnackModal(false);
    setWellnessSnackChoice(null);
    setExerciseChoice(null);
  };

  const snoozeWellnessSnack = () => {
    setShowWellnessSnackModal(false);
    setTimeout(() => {
      setShowWellnessSnackModal(true);
    }, 15 * 60 * 1000);
  };

  const completeWellnessSnack = (type) => {
    const completion = {
      type,
      timestamp: new Date(),
      hour: currentTime.getHours()
    };
    setWellnessCompletions([...wellnessCompletions, completion]);
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
          completions: [...prev.movement.completions, { type: exerciseChoice, timestamp: new Date() }]
        }
      }));
    }

    dismissWellnessSnack();
  };

  // Quick Win Capture
  const addQuickWin = () => {
    if (quickWinInput.trim()) {
      setDailyMetrics(prev => ({
        ...prev,
        wins: [...prev.wins, { text: quickWinInput.trim(), timestamp: new Date() }]
      }));
      setQuickWinInput('');
    }
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

  // Kanban Board Functions
  const addKanbanTask = () => {
    if (newTaskInput.trim()) {
      const newTask = {
        id: Date.now(),
        title: newTaskInput,
        category: 'work', // Can be 'work' or 'business'
        notes: '',
        createdAt: new Date().toISOString()
      };
      setKanbanTasks(prev => ({
        ...prev,
        backlog: [...prev.backlog, newTask]
      }));
      setNewTaskInput('');
    }
  };

  const moveTask = (taskId, fromColumn, toColumn) => {
    const task = kanbanTasks[fromColumn].find(t => t.id === taskId);
    if (task) {
      setKanbanTasks(prev => ({
        ...prev,
        [fromColumn]: prev[fromColumn].filter(t => t.id !== taskId),
        [toColumn]: [...prev[toColumn], task]
      }));
    }
  };

  const deleteTask = (taskId, column) => {
    setKanbanTasks(prev => ({
      ...prev,
      [column]: prev[column].filter(t => t.id !== taskId)
    }));
  };

  const exportData = () => {
    const data = { ndm, careers, meals, workouts, proteinToday, vitals, streak, dailyScore, userProfile, energyTracking, currentMood, exportDate: new Date().toISOString() };
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
      setMeals([]);
      setWorkouts([]);
      setProteinToday(0);
      alert('✅ All data cleared!');
    }
  };

  // Handle onboarding completion
  const handleOnboardingComplete = (profile) => {
    setUserProfile(profile);
  };

  // Calculate current energy level (average of tracked times)
  const getCurrentEnergy = () => {
    const values = Object.values(energyTracking).filter(v => v !== null);
    if (values.length === 0) return 0;
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  };

  // Get protein target based on user weight (0.8-1g per lb)
  const getProteinTarget = () => {
    if (!userProfile.weight) return 120; // Default if no weight set
    return Math.round(userProfile.weight * 0.9); // 0.9g per lb as middle ground
  };

  // Set energy for current time of day
  const setCurrentEnergy = (level) => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) {
      setEnergyTracking(prev => ({ ...prev, morning: level }));
    } else if (hour >= 12 && hour < 18) {
      setEnergyTracking(prev => ({ ...prev, afternoon: level }));
    } else {
      setEnergyTracking(prev => ({ ...prev, evening: level }));
    }
  };

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
    return energyTracking[period];
  };

  /**
   * Get Energy-Based Suggestions (Research-Backed)
   * Based on circadian rhythm research, cognitive load theory, and energy management studies
   */
  const getEnergyBasedSuggestions = (energyLevel) => {
    const energySuggestions = {
      1: {
        // Very Low Energy (Depletion State)
        title: "Critical Rest Needed",
        message: "Your body is signaling depletion. Honor it with rest.",
        tasks: [
          "Take a 20-min power nap (proven to restore alertness)",
          "Go for a gentle 10-min walk (boosts endorphins without strain)",
          "Do 5 minutes of deep breathing (activates parasympathetic nervous system)",
          "Listen to calming music while resting",
        ],
        snacks: [
          "Greek yogurt with berries (protein + quick energy)",
          "Apple with almond butter (slow-release energy)",
          "Hard-boiled eggs (sustained protein)",
          "Banana with handful of nuts (potassium + healthy fats)"
        ],
        warning: "⚠️ Working through this exhaustion damages your health. Rest is not optional.",
        color: "rose"
      },
      2: {
        // Low Energy (Recovery Mode)
        title: "Gentle Mode Active",
        message: "Low energy requires light tasks and self-nourishment.",
        tasks: [
          "Clear inbox (low cognitive load, feels productive)",
          "Organize one drawer or desktop folder",
          "Watch an educational video (passive learning)",
          "Journal for 10 minutes (therapeutic, no pressure)",
        ],
        snacks: [
          "Hummus with veggies (sustained energy)",
          "Trail mix with dark chocolate (magnesium boost)",
          "Cheese and whole grain crackers (protein + complex carbs)",
          "Smoothie with protein powder (easy to digest)"
        ],
        proteinPrompt: true,
        color: "purple"
      },
      3: {
        // Medium Energy (Steady State)
        title: "Steady Progress Mode",
        message: "Perfect energy for consistent, sustainable work.",
        tasks: [
          "Routine meetings and check-ins",
          "Email responses and communication",
          "Project planning and organization",
          "Administrative tasks and documentation"
        ],
        snacks: [
          "Cottage cheese with pineapple (protein + energy)",
          "Turkey roll-ups with avocado (lean protein + healthy fat)",
          "Oatmeal with nuts (sustained release)",
          "Protein bar with <5g sugar"
        ],
        color: "cyan"
      },
      4: {
        // High Energy (Peak Performance)
        title: "Peak Performance Window",
        message: "Your cognitive peak! Tackle your hardest challenges now.",
        tasks: [
          "Complex problem-solving (prefrontal cortex at peak)",
          "Important negotiations or difficult conversations",
          "Creative work requiring deep thinking",
          "Strategic planning for major decisions"
        ],
        snacks: [
          "Salmon with leafy greens (omega-3 for brain function)",
          "Blueberries with almonds (antioxidants + focus)",
          "Green tea + dark chocolate (L-theanine + polyphenols)",
          "Chicken breast with quinoa (complete protein + energy)"
        ],
        color: "orange"
      },
      5: {
        // Very High Energy (Flow State Potential)
        title: "Flow State Activated",
        message: "You're in the zone! This is your superpower hour.",
        tasks: [
          "Your ONE most important task (deep work, 90-min block)",
          "High-stakes presentations or pitches",
          "Breakthrough creative work",
          "Learning new complex skills"
        ],
        snacks: [
          "Smoked salmon on whole grain (brain-boosting omega-3)",
          "Matcha latte with MCT oil (sustained focus)",
          "Beet juice + walnuts (nitric oxide + DHA)",
          "Steak with sweet potato (iron + stable glucose)"
        ],
        warning: "⚡ Protect this energy! Minimize distractions, close unnecessary tabs.",
        color: "yellow"
      }
    };

    return energySuggestions[energyLevel] || energySuggestions[3];
  };

  /**
   * Get Mood-Based Wellness Recommendations (Evidence-Based Psychology)
   * Based on CBT, mindfulness research, and nutritional psychiatry
   */
  const getMoodBasedWellness = (moodState) => {
    const moodWellness = {
      energized: {
        title: "Channel Your Energy Wisely",
        message: "Great mood! Direct this energy into meaningful action.",
        activities: [
          "Tackle a challenge you've been avoiding",
          "Connect with colleagues or friends (social energy peak)",
          "Start a new project or initiative",
          "Exercise (capitalize on natural motivation)"
        ],
        snacks: [
          "Protein smoothie (maintain the momentum)",
          "Mixed berries with Greek yogurt (antioxidants)",
          "Energy balls (dates, nuts, cacao)",
          "Green juice with ginger (sustained vitality)"
        ],
        color: "orange"
      },
      focused: {
        title: "Deep Work Opportunity",
        message: "Your attention is sharp. Protect this focused state.",
        activities: [
          "90-minute deep work block (no interruptions)",
          "Complex analytical work requiring concentration",
          "Learning or skill development",
          "Writing or detailed planning"
        ],
        snacks: [
          "Blueberries (improve cognitive function)",
          "Dark chocolate 70%+ (flavonoids for focus)",
          "Walnuts (omega-3 for sustained attention)",
          "Green tea with honey (L-theanine + stable energy)"
        ],
        color: "blue"
      },
      calm: {
        title: "Reflective State",
        message: "Beautiful calm. Perfect for thoughtful, intentional work.",
        activities: [
          "Strategic thinking and big-picture planning",
          "Journaling or reflective writing",
          "Gentle yoga or stretching",
          "Meaningful conversations (listening mode)"
        ],
        snacks: [
          "Chamomile tea with honey (maintain calm)",
          "Avocado toast (healthy fats for sustained calm)",
          "Warm oatmeal with cinnamon (grounding)",
          "Sliced pear with cheese (balanced satisfaction)"
        ],
        color: "cyan"
      },
      tired: {
        title: "Rest & Recovery Mode",
        message: "Your body needs restoration. Self-care is your priority.",
        activities: [
          "20-minute power nap (research-proven restoration)",
          "Gentle walk in nature (cortisol reduction)",
          "Passive learning (podcast, audiobook)",
          "Light stretching or restorative yoga"
        ],
        snacks: [
          "Tart cherry juice (melatonin, aids rest)",
          "Banana with almond butter (tryptophan + magnesium)",
          "Whole grain toast with turkey (sleep-promoting)",
          "Warm milk with honey (traditional rest aid)"
        ],
        warning: "💤 Pushing through exhaustion backfires. Rest is productive.",
        color: "purple"
      },
      anxious: {
        title: "Grounding & Soothing",
        message: "Anxiety needs grounding. These activities calm your nervous system.",
        activities: [
          "Box breathing (4-4-4-4 proven to reduce cortisol)",
          "5-minute meditation or body scan",
          "Write down worries (externalization reduces rumination)",
          "Call a trusted friend (social support regulates nervous system)"
        ],
        snacks: [
          "Complex carbs (whole grain) - serotonin boost",
          "Chamomile or lavender tea (calming compounds)",
          "Dark leafy greens (magnesium for relaxation)",
          "Pumpkin seeds (zinc for anxiety reduction)"
        ],
        supplement: "Consider: Magnesium glycinate, L-theanine, or ashwagandha (consult provider)",
        color: "blue"
      },
      overwhelmed: {
        title: "🌸 GENTLE MODE ACTIVATED",
        message: "You're doing too much. Simplify everything. Your only job: survive with grace.",
        activities: [
          "ONE tiny task only (build back confidence)",
          "10-minute walk outside (perspective shift)",
          "Brain dump all worries to paper (cognitive offload)",
          "Ask for help (vulnerability is strength)"
        ],
        snacks: [
          "Comfort food that nourishes: soup, oatmeal",
          "Herbal tea (lemon balm, passionflower)",
          "Dark chocolate (proven mood elevator)",
          "Whatever you can manage - no judgment"
        ],
        warning: "🌸 PERMISSION TO PAUSE: Rest is not quitting. It's regrouping.",
        color: "rose"
      }
    };

    return moodWellness[moodState] || null;
  };

  // Get combined smart suggestions
  const getSmartSuggestions = () => {
    const energyLevel = getCurrentPeriodEnergy() || getCurrentEnergy() || 3;
    const mood = currentMood;

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
        const productiveActions = Object.values(hourlyTasks).flat().filter(t => t.completed).length;
        if (productiveActions >= 3) {
          score += 20; // EXCELLENT: Capitalized on high energy
        } else if (productiveActions >= 1) {
          score += 10; // GOOD: Some productivity
        }
      } else {
        // Medium energy: Steady progress
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
      const proteinTarget = getProteinTarget();
      const proteinPercent = (proteinToday / proteinTarget) * 100;
      if (proteinPercent >= 80) {
        score += 20; // EXCELLENT: Met protein goal
      } else if (proteinPercent >= 50) {
        score += 15; // GOOD: Halfway there
      } else if (proteinPercent >= 25) {
        score += 10; // FAIR: Some progress
      } else if (meals.length > 0) {
        score += 5; // At least tracking
      }
    } else {
      // If no weight set, just reward tracking
      score += meals.length >= 3 ? 20 : meals.length * 5;
    }

    // Factor 5: Wisdom - Avoiding Burnout (0-20 points)
    maxPossible += 20;
    if (currentPeriodEnergy !== null) {
      if (currentPeriodEnergy <= 2) {
        // Low energy: Wisdom is NOT pushing through
        const tasksCompletedWhileTired = Object.values(hourlyTasks).flat()
          .filter(t => t.completed).length;
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

  const addHourlyTask = (hour, taskText) => {
    if (!taskText.trim()) return;
    const newTasks = { ...hourlyTasks };
    newTasks[hour] = [...(newTasks[hour] || []), { id: Date.now(), text: taskText, completed: false, type: 'task' }];
    setHourlyTasks(newTasks);
  };

  const toggleHourlyTask = (hour, taskId) => {
    const newTasks = { ...hourlyTasks };
    newTasks[hour] = newTasks[hour].map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setHourlyTasks(newTasks);
  };

  const deleteHourlyTask = (hour, taskId) => {
    const newTasks = { ...hourlyTasks };
    newTasks[hour] = newTasks[hour].filter(task => task.id !== taskId);
    setHourlyTasks(newTasks);
  };

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

  // Box Breathing Component
  const BoxBreathingComponent = ({ darkMode, onComplete, boxBreathingPhase, setBoxBreathingPhase, boxBreathingCycles, setBoxBreathingCycles }) => {
    const [count, setCount] = React.useState(4);

    React.useEffect(() => {
      if (boxBreathingCycles >= 8) {
        onComplete();
        return;
      }

      const timer = setInterval(() => {
        setCount(prev => {
          if (prev === 1) {
            const phases = ['inhale', 'hold1', 'exhale', 'hold2'];
            const currentIndex = phases.indexOf(boxBreathingPhase);
            const nextPhase = phases[(currentIndex + 1) % 4];
            setBoxBreathingPhase(nextPhase);

            if (nextPhase === 'inhale') {
              setBoxBreathingCycles(prev => prev + 1);
            }
            return 4;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }, [boxBreathingPhase, boxBreathingCycles]);

    const instructions = {
      inhale: "Breathe IN through nose",
      hold1: "HOLD your breath",
      exhale: "Breathe OUT through mouth",
      hold2: "HOLD, lungs empty"
    };

    return (
      <div className={`max-w-2xl w-full rounded-3xl p-8 ${darkMode ? 'bg-gray-900 border-2 border-purple-500/30' : 'bg-white border-2 border-purple-200'}`}>
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="relative w-64 h-64">
            <svg className="w-full h-full">
              <rect x="32" y="32" width="200" height="200"
                    fill="none"
                    stroke={darkMode ? '#a855f7' : '#9333ea'}
                    strokeWidth="3" />
              <circle
                cx={boxBreathingPhase === 'inhale' || boxBreathingPhase === 'hold1' ? 232 : 32}
                cy={boxBreathingPhase === 'inhale' || boxBreathingPhase === 'exhale' ? 32 : 232}
                r="12"
                fill="#ec4899"
                className="transition-all duration-1000" />
            </svg>
          </div>

          <div className="text-center">
            <div className={`text-6xl font-mono font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              {count}
            </div>
            <div className={`text-2xl font-semibold mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {instructions[boxBreathingPhase]}
            </div>
            <div className={`text-sm mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
              Cycle {boxBreathingCycles + 1} of 8
            </div>
          </div>
        </div>
      </div>
    );
  };

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
          onClick={() => setShowCommandCenterModal(true)}
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
            <div className="text-2xl">📊</div>
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
        darkMode
          ? 'bg-gray-900/95 border-b border-gray-800/50 shadow-2xl shadow-purple-500/10'
          : 'bg-white/95 border-b border-gray-200/50 shadow-lg'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">

            {/* LEFT: LOGO */}
            <div className="flex items-center gap-2">
              <img
                src="/lioness-logo.png"
                alt="DualTrack OS"
                className="w-36 h-36 md:w-44 md:h-44 opacity-100 drop-shadow-2xl"
              />
            </div>

            {/* CENTER: TIME + POMODORO HINT - Primary Action */}
            <button
              onClick={() => setIsPomodoroMode(!isPomodoroMode)}
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
              } opacity-80`}>
                Tap clock to start Pomodoro
              </div>
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
                  <button onClick={togglePomodoroMode} className={`px-4 py-2 rounded-lg font-medium transition-all ${
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
            <NDMStatusBar
              ndm={ndm}
              darkMode={darkMode}
              setCurrentView={setCurrentView}
              openMindfulMoment={openMindfulMoment}
              openBrainDump={openBrainDump}
            />

            {/* CURRENT HOUR FOCUS */}
            <div className={`rounded-2xl p-6 shadow-2xl transition-all duration-300 ${
              darkMode
                ? 'bg-gradient-to-r from-cyan-900/50 via-blue-900/50 to-cyan-900/50 border-2 border-cyan-500/30 backdrop-blur-xl'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600'
            }`}>
              <h2 className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-white'}`}>
                🎯 RIGHT NOW
              </h2>
              <p className={`text-sm mb-4 ${darkMode ? 'text-cyan-300' : 'text-white opacity-90'}`}>
                {formatHour(currentTime.getHours())} - {formatHour(currentTime.getHours() + 1)}
              </p>

              {/* Current hour tasks */}
              <div className="space-y-2">
                {(hourlyTasks[currentTime.getHours()] || []).map(task => (
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
                        onClick={() => toggleHourlyTask(currentTime.getHours(), task.id)}
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
                      onClick={() => deleteHourlyTask(currentTime.getHours(), task.id)}
                      className={`ml-2 ${darkMode ? 'text-white/40 hover:text-red-400' : 'text-white/60 hover:text-red-600'}`}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add task for this hour */}
              <form onSubmit={(e) => {
                e.preventDefault();
                const input = e.target.elements.currentHourTask;
                addHourlyTask(currentTime.getHours(), input.value);
                input.value = '';
              }} className="mt-3">
                <input
                  name="currentHourTask"
                  type="text"
                  placeholder="+ Add task for this hour..."
                  className={`w-full px-4 py-3 rounded-lg transition-all ${
                    darkMode
                      ? 'bg-white/10 border-2 border-white/20 text-white placeholder-white/60 focus:border-cyan-400/50'
                      : 'bg-white/40 border-2 border-white/60 text-white placeholder-white/80 focus:border-white'
                  }`}
                />
              </form>
            </div>

            {/* ENERGY & MOOD TRACKING */}
            <div className="grid grid-cols-2 gap-4">
              {/* Energy Selector - Click to open modal (always visible but shows completion state) */}
              {(() => {
                const energySuggestions = getSmartSuggestions();
                const totalEnergyActions = energySuggestions.tasks ? energySuggestions.tasks.length : 0;
                const completedEnergyActions = selectedEnergyActions.length;
                const allEnergyActionsComplete = getCurrentPeriodEnergy() && totalEnergyActions > 0 && completedEnergyActions >= totalEnergyActions;

                return (
                  <div className={`rounded-xl p-4 transition-all duration-300 ${
                    allEnergyActionsComplete
                      ? darkMode
                        ? 'bg-emerald-900/30 border-2 border-emerald-500/50 shadow-lg backdrop-blur-sm'
                        : 'bg-emerald-50 border-2 border-emerald-400 shadow-md'
                      : darkMode
                        ? 'bg-gray-800/50 border-2 border-gray-700/50 hover:border-yellow-500/50 shadow-lg backdrop-blur-sm'
                        : 'bg-white border-2 border-gray-100 hover:border-yellow-400 shadow-md'
                  }`}>
                    {allEnergyActionsComplete && (
                      <div className={`text-xs text-center mb-2 font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        ✓ COMPLETE
                      </div>
                    )}
                <div className="flex items-center justify-center mb-2">
                  <Zap className={darkMode ? 'text-yellow-400' : 'text-yellow-500'} size={24} />
                </div>
                <div className={`text-sm font-bold uppercase text-center mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  ENERGY
                </div>
                <div className={`text-center mb-3`}>
                  <span className={`text-2xl font-bold ${darkMode ? 'bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent' : 'text-gray-900'}`}>
                    {getCurrentPeriodEnergy() || '?'}/5
                  </span>
                </div>
                <div className={`text-xs text-center mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  {getTimeOfDay()}
                  {getCurrentPeriodEnergy() && (
                    <button
                      onClick={() => setShowEnergyModal(true)}
                      className="text-xs mt-1 underline hover:text-yellow-500 cursor-pointer"
                    >
                      Click for tips
                    </button>
                  )}
                </div>
                {/* Energy level selector - clicking opens modal with tips */}
                <div className="flex justify-between mt-2">
                  {[1, 2, 3, 4, 5].map(level => (
                    <button
                      key={level}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentEnergy(level);
                        // Open modal immediately after setting energy
                        setTimeout(() => setShowEnergyModal(true), 100);
                      }}
                      className={`w-8 h-8 rounded-full transition-all ${
                        getCurrentPeriodEnergy() === level
                          ? darkMode
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/50'
                            : 'bg-yellow-500'
                          : darkMode
                            ? 'bg-gray-700 hover:bg-gray-600'
                            : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      <span className={`text-xs font-bold ${
                        getCurrentPeriodEnergy() === level ? 'text-white' : darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {level}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
                );
              })()}

              {/* Mood Selector - Click to open modal (always visible but shows completion state) */}
              {(() => {
                const moodSuggestions = getSmartSuggestions();
                const totalMoodActions = moodSuggestions.moodWellness?.activities ? moodSuggestions.moodWellness.activities.length : 0;
                const completedMoodActions = selectedMoodActions.length;
                const allMoodActionsComplete = currentMood && totalMoodActions > 0 && completedMoodActions >= totalMoodActions;

                return (
                  <div className={`rounded-xl p-4 transition-all duration-300 ${
                    allMoodActionsComplete
                      ? darkMode
                        ? 'bg-emerald-900/30 border-2 border-emerald-500/50 shadow-lg backdrop-blur-sm'
                        : 'bg-emerald-50 border-2 border-emerald-400 shadow-md'
                      : darkMode
                        ? 'bg-gray-800/50 border-2 border-gray-700/50 hover:border-purple-500/50 shadow-lg backdrop-blur-sm'
                        : 'bg-white border-2 border-gray-100 hover:border-purple-400 shadow-md'
                  }`}>
                    {allMoodActionsComplete && (
                      <div className={`text-xs text-center mb-2 font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        ✓ COMPLETE
                      </div>
                    )}
                <div className="flex items-center justify-center mb-2">
                  <Heart className={darkMode ? 'text-pink-400' : 'text-pink-500'} size={24} />
                </div>
                <div className={`text-sm font-bold uppercase text-center mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  MOOD
                </div>
                {currentMood && (
                  <div className={`text-xs text-center mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                    Current: {currentMood}
                    <button
                      onClick={() => setShowMoodModal(true)}
                      className="block text-xs mt-1 underline hover:text-pink-500 cursor-pointer mx-auto"
                    >
                      Click for wellness tips
                    </button>
                  </div>
                )}
                {/* Mood selector grid - clicking opens modal with tips */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { mood: 'energized', emoji: '😊' },
                    { mood: 'focused', emoji: '🎯' },
                    { mood: 'calm', emoji: '😌' },
                    { mood: 'tired', emoji: '😴' },
                    { mood: 'anxious', emoji: '😰' },
                    { mood: 'overwhelmed', emoji: '😫' }
                  ].map(({ mood, emoji }) => (
                    <button
                      key={mood}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentMood(mood);
                        // Open modal immediately after setting mood
                        setTimeout(() => setShowMoodModal(true), 100);
                      }}
                      className={`p-2 rounded-lg text-xl transition-all ${
                        currentMood === mood
                          ? darkMode
                            ? 'bg-purple-500/30 border-2 border-purple-500/50 scale-110'
                            : 'bg-purple-100 border-2 border-purple-400 scale-110'
                          : darkMode
                            ? 'bg-gray-700/30 hover:bg-gray-700/50 border-2 border-transparent'
                            : 'bg-gray-100 hover:bg-gray-200 border-2 border-transparent'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
                );
              })()}
            </div>

            {/* PROTEIN TRACKER */}
            <div onClick={() => setExpandedTile(expandedTile === 'protein' ? null : 'protein')} className={`rounded-xl p-6 cursor-pointer transition-all duration-300 ${
              darkMode
                ? 'bg-gradient-to-br from-emerald-900/50 via-green-900/50 to-emerald-900/50 border-2 border-emerald-500/40 hover:border-emerald-500/60 shadow-lg backdrop-blur-sm'
                : 'bg-gradient-to-br from-emerald-100 to-green-100 border-2 border-emerald-300 hover:border-emerald-400 shadow-md'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Activity className={darkMode ? 'text-emerald-400 mr-2' : 'text-emerald-600 mr-2'} size={24} />
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Daily Protein
                  </h3>
                </div>
                <div className={`text-2xl font-bold ${
                  proteinToday >= getProteinTarget()
                    ? darkMode ? 'text-emerald-400' : 'text-emerald-600'
                    : darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {proteinToday}g
                </div>
              </div>

              {/* Protein Progress Bar */}
              <div className="mb-3">
                <div className={`h-3 rounded-full overflow-hidden ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'}`}>
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-500"
                    style={{ width: `${Math.min((proteinToday / getProteinTarget()) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                    0g
                  </span>
                  <span className={`text-xs font-semibold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    Target: {getProteinTarget()}g
                  </span>
                </div>
              </div>

              {expandedTile === 'protein' && (
                <div className="space-y-2 mt-4">
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Based on your weight ({userProfile.weight || '?'} lbs), aim for {getProteinTarget()}g daily
                  </p>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-emerald-500/10' : 'bg-white/60'}`}>
                    <p className={`text-xs font-semibold mb-2 ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                      💡 Quick Protein Sources:
                    </p>
                    <ul className={`text-xs space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                      <li>• Chicken breast (3oz) = 26g</li>
                      <li>• Greek yogurt (1 cup) = 20g</li>
                      <li>• Eggs (2 large) = 12g</li>
                      <li>• Protein shake = 20-30g</li>
                    </ul>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentView('food');
                    }}
                    className={`w-full mt-2 py-2 rounded-lg font-semibold transition-all ${
                      darkMode
                        ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    Log Food →
                  </button>
                </div>
              )}
            </div>

            {/* KANBAN BOARD - Career & Business Tasks */}
            <div className={`rounded-xl p-6 transition-all duration-300 ${
              darkMode
                ? 'bg-gray-800/50 border-2 border-gray-700/50 shadow-lg backdrop-blur-sm'
                : 'bg-white border-2 border-gray-100 shadow-md'
            }`}>
              <h3 className={`text-lg font-bold mb-4 flex items-center ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                <Sparkles className={`mr-2 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} size={20} />
                Life's Pipeline
              </h3>

              {/* Add Task Input */}
              <div className="flex space-x-2 mb-6">
                <input
                  type="text"
                  value={newTaskInput}
                  onChange={(e) => setNewTaskInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addKanbanTask()}
                  placeholder="Add new task..."
                  className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                    darkMode
                      ? 'bg-gray-900/50 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-blue-500/50'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                  }`}
                />
                <button
                  onClick={addKanbanTask}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    darkMode
                      ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-2 border-blue-500/40'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* Kanban Columns */}
              <div className="grid grid-cols-3 gap-3">
                {/* BACKLOG */}
                <div
                  onClick={() => setExpandedColumn(expandedColumn === 'backlog' ? null : 'backlog')}
                  className={`rounded-lg p-3 cursor-pointer transition-all ${
                    darkMode
                      ? 'bg-gray-900/50 border-2 border-gray-700 hover:border-gray-600'
                      : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`text-xs font-bold uppercase ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Backlog
                    </h4>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {kanbanTasks.backlog.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {kanbanTasks.backlog.slice(0, expandedColumn === 'backlog' ? undefined : 3).map(task => (
                      <div
                        key={task.id}
                        onClick={(e) => e.stopPropagation()}
                        className={`p-2 rounded text-xs ${
                          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                        }`}
                      >
                        <p className={`font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                          {task.title}
                        </p>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => moveTask(task.id, 'backlog', 'inProgress')}
                            className={`flex-1 py-1 rounded text-xs ${
                              darkMode
                                ? 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-400'
                                : 'bg-orange-100 hover:bg-orange-200 text-orange-700'
                            }`}
                          >
                            Start →
                          </button>
                          <button
                            onClick={() => deleteTask(task.id, 'backlog')}
                            className={`px-2 py-1 rounded ${
                              darkMode ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-100 text-red-600'
                            }`}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {expandedColumn !== 'backlog' && kanbanTasks.backlog.length > 3 && (
                      <div className={`text-xs text-center ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        +{kanbanTasks.backlog.length - 3} more
                      </div>
                    )}
                  </div>
                </div>

                {/* IN PROGRESS */}
                <div
                  onClick={() => setExpandedColumn(expandedColumn === 'inProgress' ? null : 'inProgress')}
                  className={`rounded-lg p-3 cursor-pointer transition-all ${
                    darkMode
                      ? 'bg-orange-900/20 border-2 border-orange-700/30 hover:border-orange-600/50'
                      : 'bg-orange-50 border-2 border-orange-200 hover:border-orange-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`text-xs font-bold uppercase ${darkMode ? 'text-orange-400' : 'text-orange-700'}`}>
                      In Progress
                    </h4>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      darkMode ? 'bg-orange-700/30 text-orange-300' : 'bg-orange-200 text-orange-800'
                    }`}>
                      {kanbanTasks.inProgress.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {kanbanTasks.inProgress.slice(0, expandedColumn === 'inProgress' ? undefined : 3).map(task => (
                      <div
                        key={task.id}
                        onClick={(e) => e.stopPropagation()}
                        className={`p-2 rounded text-xs ${
                          darkMode ? 'bg-gray-800 border border-orange-700/30' : 'bg-white border border-orange-300'
                        }`}
                      >
                        <p className={`font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                          {task.title}
                        </p>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => moveTask(task.id, 'inProgress', 'backlog')}
                            className={`px-2 py-1 rounded text-xs ${
                              darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
                            }`}
                          >
                            ← Back
                          </button>
                          <button
                            onClick={() => moveTask(task.id, 'inProgress', 'done')}
                            className={`flex-1 py-1 rounded text-xs ${
                              darkMode
                                ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400'
                                : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'
                            }`}
                          >
                            Done →
                          </button>
                        </div>
                      </div>
                    ))}
                    {expandedColumn !== 'inProgress' && kanbanTasks.inProgress.length > 3 && (
                      <div className={`text-xs text-center ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        +{kanbanTasks.inProgress.length - 3} more
                      </div>
                    )}
                  </div>
                </div>

                {/* DONE */}
                <div
                  onClick={() => setExpandedColumn(expandedColumn === 'done' ? null : 'done')}
                  className={`rounded-lg p-3 cursor-pointer transition-all ${
                    darkMode
                      ? 'bg-emerald-900/20 border-2 border-emerald-700/30 hover:border-emerald-600/50'
                      : 'bg-emerald-50 border-2 border-emerald-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`text-xs font-bold uppercase ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                      Done
                    </h4>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      darkMode ? 'bg-emerald-700/30 text-emerald-300' : 'bg-emerald-200 text-emerald-800'
                    }`}>
                      {kanbanTasks.done.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {kanbanTasks.done.slice(0, expandedColumn === 'done' ? undefined : 3).map(task => (
                      <div
                        key={task.id}
                        onClick={(e) => e.stopPropagation()}
                        className={`p-2 rounded text-xs ${
                          darkMode ? 'bg-gray-800 border border-emerald-700/30' : 'bg-white border border-emerald-300'
                        }`}
                      >
                        <p className={`font-medium mb-1 line-through ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {task.title}
                        </p>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => moveTask(task.id, 'done', 'inProgress')}
                            className={`flex-1 py-1 rounded text-xs ${
                              darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
                            }`}
                          >
                            ← Redo
                          </button>
                          <button
                            onClick={() => deleteTask(task.id, 'done')}
                            className={`px-2 py-1 rounded ${
                              darkMode ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-100 text-red-600'
                            }`}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {expandedColumn !== 'done' && kanbanTasks.done.length > 3 && (
                      <div className={`text-xs text-center ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        +{kanbanTasks.done.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={`mt-4 text-xs text-center ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Click on any column to expand and see all tasks
              </div>
            </div>

            <div className={`rounded-xl p-6 transition-all duration-300 ${
              darkMode
                ? 'bg-gradient-to-r from-gray-900/80 to-gray-800/80 border-2 border-gray-700/50 backdrop-blur-sm shadow-xl'
                : 'bg-gradient-to-r from-gray-900 to-gray-700'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Apple size={24} className="text-white opacity-50" />
                  <div>
                    <div className="font-bold text-white opacity-75">Apple Health</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-white opacity-50'}`}>To Be Connected</div>
                  </div>
                </div>
                <Clock size={24} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm text-white">
                <div>
                  <div className="opacity-75">Steps Today</div>
                  <div className="font-bold text-lg">{vitals.steps.value.toLocaleString()}</div>
                </div>
                <div>
                  <div className="opacity-75">Active Cal</div>
                  <div className="font-bold text-lg">{vitals.activeCalories.value}</div>
                </div>
              </div>
            </div>

            <div className={`rounded-xl p-6 transition-all duration-300 ${
              darkMode
                ? 'bg-gray-800/50 border-2 border-gray-700/50 shadow-lg backdrop-blur-sm'
                : 'bg-white border-2 border-gray-100 shadow-md'
            }`}>
              <h3 className={`text-lg font-bold mb-4 flex items-center ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                <Activity className={`mr-2 ${darkMode ? 'text-emerald-400' : 'text-green-500'}`} size={20} />
                Health Vitals
              </h3>
              <div className="space-y-3">
                <VitalRow label="Sleep" value={`${vitals.sleep.hours} hrs`} trend={vitals.sleep.trend} />
                <VitalRow label="HRV" value={`${vitals.hrv.value} ms`} trend={vitals.hrv.trend} />
                <VitalRow label="Resting HR" value={`${vitals.rhr.value} bpm`} trend={vitals.rhr.trend} />
              </div>
            </div>

            <button onClick={handleVoiceCheckin} className={`w-full py-6 rounded-2xl font-bold text-lg shadow-2xl flex items-center justify-center space-x-3 transition-all duration-300 ${
              isRecording
                ? darkMode
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white animate-pulse border-2 border-red-500/50'
                  : 'bg-red-500 text-white animate-pulse'
                : darkMode
                  ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 text-white border-2 border-purple-500/30 hover:border-purple-500/50 hover:shadow-purple-500/20'
                  : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
            }`}>
              <Mic size={28} />
              <span>{isRecording ? `RECORDING... (${recordingStartTime ? formatTime(Math.floor((Date.now() - recordingStartTime) / 1000)) : '0:00'})` : '5-MIN VOICE DIARY'}</span>
            </button>

            {/* Voice Diary Entries */}
            {voiceDiary.length > 0 && (
              <div className={`rounded-xl p-6 transition-all duration-300 ${
                darkMode
                  ? 'bg-gray-800/50 border-2 border-gray-700/50 shadow-lg backdrop-blur-sm'
                  : 'bg-white border-2 border-gray-100 shadow-md'
              }`}>
                <h3 className={`text-lg font-bold mb-4 flex items-center ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  <Mic className={`mr-2 ${darkMode ? 'text-pink-400' : 'text-pink-500'}`} size={20} />
                  Voice Diary
                </h3>
                <div className="space-y-3">
                  {voiceDiary.slice(-5).reverse().map(entry => (
                    <div key={entry.id} className={`rounded-lg p-4 ${
                      darkMode ? 'bg-gray-900/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {entry.date}
                        </div>
                        <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          {entry.time} • {entry.duration}
                        </div>
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} italic`}>
                        "{entry.transcript}"
                      </p>
                      <div className={`mt-2 text-xs ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                        Tap to add transcription (coming soon)
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {currentView === 'exercise' && (
          <div className="space-y-4 pb-32 relative z-10">
            <div className={`rounded-2xl p-6 shadow-2xl transition-all duration-300 ${
              darkMode
                ? 'bg-gradient-to-r from-orange-900/50 via-red-900/50 to-orange-900/50 border-2 border-orange-500/30 backdrop-blur-xl'
                : 'bg-gradient-to-r from-orange-500 to-red-500'
            }`}>
              <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-white'}`}>Exercise Library</h2>
              <p className={`text-sm ${darkMode ? 'text-orange-300' : 'text-white opacity-90'}`}>HIIT bursts optimized for you</p>
            </div>
            {workouts.length > 0 && (
              <div className={`rounded-xl p-6 transition-all duration-300 ${
                darkMode
                  ? 'bg-gray-800/50 border-2 border-emerald-500/30 shadow-lg shadow-emerald-500/10 backdrop-blur-sm'
                  : 'bg-white border-2 border-green-100 shadow-md'
              }`}>
                <h3 className={`font-bold mb-3 ${darkMode ? 'bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent' : 'text-green-700'}`}>
                  Completed Today ({workouts.length})
                </h3>
                {workouts.slice(-3).map(w => (
                  <div key={w.id} className={`flex justify-between py-2 border-b last:border-0 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>{w.name}</span>
                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{formatTime(w.duration)}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="space-y-3">
              <WorkoutCard emoji="🏃‍♀️" name="Jump Rope HIIT" duration="10 min" intensity="High" description="30 sec ON / 30 sec OFF × 10" onClick={() => startWorkout({ name: 'Jump Rope HIIT', type: 'hiit' })} />
              <WorkoutCard emoji="🚴‍♀️" name="Cycling Sprints" duration="15 min" intensity="High" description="1 min hard / 1 min easy × 8" onClick={() => startWorkout({ name: 'Cycling Sprints', type: 'hiit' })} />
              <WorkoutCard emoji="💪" name="Strength Circuit" duration="20 min" intensity="Medium" description="Full body compound moves" onClick={() => startWorkout({ name: 'Strength Circuit', type: 'strength' })} />
              <WorkoutCard emoji="🧘‍♀️" name="Recovery Yoga" duration="15 min" intensity="Low" description="Gentle stretching" onClick={() => startWorkout({ name: 'Recovery Yoga', type: 'recovery' })} />
            </div>
          </div>
        )}
        
        {currentView === 'workout-active' && (
          <div className="space-y-6 pb-32 relative z-10">
            <div className={`rounded-2xl p-8 shadow-2xl text-center transition-all duration-300 ${
              darkMode
                ? 'bg-gradient-to-r from-red-900/50 via-orange-900/50 to-red-900/50 border-2 border-red-500/30 backdrop-blur-xl'
                : 'bg-gradient-to-r from-red-600 to-orange-600'
            }`}>
              <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'bg-gradient-to-r from-red-300 to-orange-400 bg-clip-text text-transparent' : 'text-white'}`}>
                {activeWorkout?.name}
              </h2>
              <div className={`text-6xl font-bold my-6 ${darkMode ? 'text-white' : 'text-white'}`}>{formatTime(workoutTimer)}</div>
              <div className="flex justify-center space-x-4">
                {isWorkoutRunning ? (
                  <button onClick={() => setIsWorkoutRunning(false)} className={`px-8 py-3 rounded-full font-bold flex items-center space-x-2 transition-all ${
                    darkMode
                      ? 'bg-gray-800 text-red-400 border-2 border-red-500/50 hover:bg-gray-700'
                      : 'bg-white text-red-600'
                  }`}>
                    <Pause size={20} /><span>PAUSE</span>
                  </button>
                ) : (
                  <button onClick={() => setIsWorkoutRunning(true)} className={`px-8 py-3 rounded-full font-bold flex items-center space-x-2 transition-all ${
                    darkMode
                      ? 'bg-gray-800 text-emerald-400 border-2 border-emerald-500/50 hover:bg-gray-700'
                      : 'bg-white text-red-600'
                  }`}>
                    <Play size={20} /><span>RESUME</span>
                  </button>
                )}
                <button onClick={() => setWorkoutTimer(0)} className={`px-6 py-3 rounded-full font-bold transition-all ${
                  darkMode
                    ? 'bg-gray-800/50 text-white border-2 border-gray-700/50 hover:bg-gray-700/50'
                    : 'bg-white/20 text-white'
                }`}>
                  <RotateCcw size={20} />
                </button>
              </div>
            </div>
            <button onClick={completeWorkout} className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
              darkMode
                ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/20'
                : 'bg-green-500 text-white'
            }`}>
              ✓ COMPLETE WORKOUT
            </button>
            <button onClick={() => { setActiveWorkout(null); setIsWorkoutRunning(false); setWorkoutTimer(0); setCurrentView('exercise'); }} className={`w-full py-3 rounded-xl font-medium transition-all ${
              darkMode
                ? 'bg-gray-800/50 text-gray-400 border-2 border-gray-700/50 hover:bg-gray-700/50'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}>
              Cancel
            </button>
          </div>
        )}
        
        {currentView === 'food' && (
          <div className="space-y-4 pb-32 relative z-10">
            <div className={`rounded-2xl p-6 shadow-2xl transition-all duration-300 ${
              darkMode
                ? 'bg-gradient-to-r from-emerald-900/50 via-green-900/50 to-emerald-900/50 border-2 border-emerald-500/30 backdrop-blur-xl'
                : 'bg-gradient-to-r from-green-500 to-emerald-600'
            }`}>
              <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-white'}`}>Nutrition Tracking</h2>
              <div className="flex justify-between items-end">
                <div>
                  <div className={`text-sm ${darkMode ? 'text-emerald-300' : 'text-white opacity-90'}`}>Protein Today</div>
                  <div className={`text-4xl font-bold ${darkMode ? 'bg-gradient-to-r from-emerald-300 to-green-400 bg-clip-text text-transparent' : 'text-white'}`}>{proteinToday}g</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm ${darkMode ? 'text-emerald-300' : 'text-white opacity-90'}`}>Target: 120g</div>
                  <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-white'}`}>{Math.round((proteinToday / 120) * 100)}%</div>
                </div>
              </div>
            </div>
            <div className={`rounded-xl p-6 transition-all duration-300 ${
              darkMode
                ? 'bg-gray-800/50 border-2 border-gray-700/50 shadow-lg backdrop-blur-sm'
                : 'bg-white border-2 border-gray-100 shadow-md'
            }`}>
              <h3 className={`font-bold mb-4 flex items-center ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                <Plus className={`mr-2 ${darkMode ? 'text-emerald-400' : 'text-green-500'}`} size={20} />
                Quick Add Meals
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <QuickMealButton emoji="🍳" name="Eggs + Avocado" protein={25} onClick={addMeal} />
                <QuickMealButton emoji="🥗" name="Chicken Salad" protein={35} onClick={addMeal} />
                <QuickMealButton emoji="🥤" name="Protein Shake" protein={30} onClick={addMeal} />
                <QuickMealButton emoji="🐟" name="Salmon + Veggies" protein={40} onClick={addMeal} />
              </div>
            </div>

            {/* Food Diary with Images */}
            <div className={`rounded-xl p-6 transition-all duration-300 ${
              darkMode
                ? 'bg-gray-800/50 border-2 border-gray-700/50 shadow-lg backdrop-blur-sm'
                : 'bg-white border-2 border-gray-100 shadow-md'
            }`}>
              <h3 className={`font-bold mb-4 flex items-center ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                <Camera className={`mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} size={20} />
                Food Diary (with Photos)
              </h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const file = form.image.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    addFoodDiaryEntry(
                      reader.result,
                      form.description.value,
                      parseInt(form.calories.value) || 0
                    );
                    form.reset();
                  };
                  reader.readAsDataURL(file);
                } else {
                  addFoodDiaryEntry(
                    null,
                    form.description.value,
                    parseInt(form.calories.value) || 0
                  );
                  form.reset();
                }
              }} className="space-y-3">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Camera className="inline mr-2" size={16} />
                    Upload Photos (Optional)
                  </label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    capture="environment"
                    className={`w-full px-4 py-3 rounded-lg transition-all ${
                      darkMode
                        ? 'bg-gray-900/50 border-2 border-gray-700 text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500/20 file:text-blue-400 file:cursor-pointer file:font-medium hover:file:bg-blue-500/30'
                        : 'bg-gray-50 border-2 border-gray-200 text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white file:cursor-pointer hover:file:bg-blue-600'
                    }`}
                  />
                </div>
                <input
                  name="description"
                  type="text"
                  placeholder="What did you eat?"
                  required
                  className={`w-full px-4 py-3 rounded-lg transition-all ${
                    darkMode
                      ? 'bg-gray-900/50 border-2 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-emerald-500/50'
                      : 'bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-500'
                  }`}
                />
                <input
                  name="calories"
                  type="number"
                  placeholder="Calories (approx)"
                  className={`w-full px-4 py-3 rounded-lg transition-all ${
                    darkMode
                      ? 'bg-gray-900/50 border-2 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-emerald-500/50'
                      : 'bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-500'
                  }`}
                />
                <button
                  type="submit"
                  className={`w-full py-3 rounded-lg font-medium transition-all ${
                    darkMode
                      ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/30'
                      : 'bg-green-50 hover:bg-green-100 text-green-700 border-2 border-green-200'
                  }`}
                >
                  Add to Diary
                </button>
              </form>

              {/* Food Diary Entries */}
              {foodDiary.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h4 className={`font-semibold text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Today's Diary</h4>
                  {foodDiary.slice(-5).reverse().map(entry => (
                    <div key={entry.id} className={`rounded-lg p-3 ${
                      darkMode ? 'bg-gray-900/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'
                    }`}>
                      {entry.image && (
                        <img src={entry.image} alt={entry.description} className="w-full h-32 object-cover rounded-lg mb-2" />
                      )}
                      <div className="flex justify-between items-start">
                        <div>
                          <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{entry.description}</p>
                          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{entry.time}</p>
                        </div>
                        {entry.calories > 0 && (
                          <span className={`text-sm font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                            {entry.calories} cal
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {meals.length > 0 && (
              <div className={`rounded-xl p-6 transition-all duration-300 ${
                darkMode
                  ? 'bg-gray-800/50 border-2 border-gray-700/50 shadow-lg backdrop-blur-sm'
                  : 'bg-white border-2 border-gray-100 shadow-md'
              }`}>
                <h3 className={`font-bold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Today's Meals</h3>
                {meals.map(m => (
                  <div key={m.id} className={`flex justify-between py-2 border-b last:border-0 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div>
                      <div className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>{m.name}</div>
                      <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{m.time}</div>
                    </div>
                    <div className={`font-bold ${darkMode ? 'bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent' : 'text-green-600'}`}>
                      {m.protein}g
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {currentView === 'insights' && (
          <div className="space-y-4 pb-32 relative z-10">
            <div className={`rounded-2xl p-6 shadow-2xl transition-all duration-300 ${
              darkMode
                ? 'bg-gradient-to-r from-indigo-900/50 via-purple-900/50 to-indigo-900/50 border-2 border-purple-500/30 backdrop-blur-xl'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600'
            }`}>
              <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-white'}`}>Weekly Intelligence</h2>
              <p className={`text-sm ${darkMode ? 'text-purple-300' : 'text-white opacity-90'}`}>Your patterns & progress</p>
            </div>
            <div className={`rounded-xl p-6 transition-all duration-300 ${
              darkMode
                ? 'bg-gray-800/50 border-2 border-gray-700/50 shadow-lg backdrop-blur-sm'
                : 'bg-white border-2 border-gray-100 shadow-md'
            }`}>
              <h3 className={`font-bold mb-4 flex items-center ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                <Award className={`mr-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} size={20} />
                This Week's Wins
              </h3>
              <div className="space-y-4">
                <StatRow label="NDM Completion" value={`${weeklyData.ndmStreak}/7 days`} color={darkMode ? 'bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent' : 'text-green-600'} />
                <StatRow label="Avg Energy" value={`${weeklyData.avgEnergy}/10`} color={darkMode ? 'bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent' : 'text-blue-600'} />
                <StatRow label="Avg Sleep" value={`${weeklyData.avgSleep} hrs`} color={darkMode ? 'bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent' : 'text-purple-600'} />
                <StatRow label="Workouts" value={`${weeklyData.workoutCount} sessions`} color={darkMode ? 'bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent' : 'text-orange-600'} />
                <StatRow label="Corporate Wins" value={weeklyData.corporateWins} color={darkMode ? 'bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent' : 'text-blue-600'} />
                <StatRow label="Consultancy Wins" value={weeklyData.consultancyWins} color={darkMode ? 'bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent' : 'text-purple-600'} />
              </div>
            </div>

            <div className={`rounded-xl p-6 transition-all duration-300 ${
              darkMode
                ? 'bg-gray-800/50 border-2 border-gray-700/50 shadow-lg backdrop-blur-sm'
                : 'bg-white border-2 border-gray-100 shadow-md'
            }`}>
              <h3 className={`font-bold mb-4 flex items-center ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                <Settings className={`mr-2 ${darkMode ? 'text-purple-400' : 'text-gray-600'}`} size={20} />
                Settings & Data
              </h3>
              <div className="space-y-3">
                {/* Upgrade to Starter Plan - Enhanced Marketing */}
                <div className={`rounded-xl p-6 border-2 ${
                  darkMode
                    ? 'bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-purple-900/30 border-purple-500/30'
                    : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
                }`}>
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-3">🚀</div>
                    <h4 className={`text-2xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent`}>
                      DualTrack Starter Plan
                    </h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      The fully integrated experience for badass women who refuse to burn out
                    </p>
                  </div>

                  {/* Core Features */}
                  <div className={`mb-4 p-4 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'}`}>
                    <h5 className={`font-bold mb-3 text-sm ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                      💪 WELLNESS & MOVEMENT
                    </h5>
                    <div className={`space-y-2 mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <div className="flex items-start space-x-2">
                        <span className="text-emerald-500 text-xs">✓</span>
                        <span className="text-xs">Advanced HIIT workouts optimized for your cycle</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-emerald-500 text-xs">✓</span>
                        <span className="text-xs">Guided meditations for ADHD, stress & hormonal anxiety</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-emerald-500 text-xs">✓</span>
                        <span className="text-xs">Apple Health & Google Fit integration (sleep, HRV, steps)</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-emerald-500 text-xs">✓</span>
                        <span className="text-xs">Oura Ring & Whoop integration (recovery scores)</span>
                      </div>
                    </div>

                    <h5 className={`font-bold mb-3 text-sm ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                      🍽️ NUTRITION & ENERGY
                    </h5>
                    <div className={`space-y-2 mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <div className="flex items-start space-x-2">
                        <span className="text-emerald-500 text-xs">✓</span>
                        <span className="text-xs">Personalized meal prep plans & quick recipes</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-emerald-500 text-xs">✓</span>
                        <span className="text-xs">MyFitnessPal integration (automatic macro tracking)</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-emerald-500 text-xs">✓</span>
                        <span className="text-xs">Energy-based meal suggestions (low energy? Here's what to eat)</span>
                      </div>
                    </div>

                    <h5 className={`font-bold mb-3 text-sm ${darkMode ? 'text-pink-300' : 'text-pink-700'}`}>
                      📅 PRODUCTIVITY & CALENDAR
                    </h5>
                    <div className={`space-y-2 mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <div className="flex items-start space-x-2">
                        <span className="text-emerald-500 text-xs">✓</span>
                        <span className="text-xs">Google Calendar & Outlook sync (schedule optimization)</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-emerald-500 text-xs">✓</span>
                        <span className="text-xs">Notion & Todoist integration (unified task management)</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-emerald-500 text-xs">✓</span>
                        <span className="text-xs">Auto-schedule deep work during high-energy windows</span>
                      </div>
                    </div>

                    <h5 className={`font-bold mb-3 text-sm ${darkMode ? 'text-orange-300' : 'text-orange-700'}`}>
                      🎯 HORMONAL INTELLIGENCE
                    </h5>
                    <div className={`space-y-2 mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <div className="flex items-start space-x-2">
                        <span className="text-emerald-500 text-xs">✓</span>
                        <span className="text-xs">Flo & Clue integration (predict low-energy days)</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-emerald-500 text-xs">✓</span>
                        <span className="text-xs">Cycle-synced workout & nutrition recommendations</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-emerald-500 text-xs">✓</span>
                        <span className="text-xs">AI predictions: "Rest mode recommended tomorrow"</span>
                      </div>
                    </div>

                    <h5 className={`font-bold mb-3 text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                      💼 BUSINESS & FINANCE
                    </h5>
                    <div className={`space-y-2 mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <div className="flex items-start space-x-2">
                        <span className="text-emerald-500 text-xs">✓</span>
                        <span className="text-xs">QuickBooks & FreshBooks integration (track consultancy revenue)</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-emerald-500 text-xs">✓</span>
                        <span className="text-xs">Stripe analytics dashboard (side hustle income tracking)</span>
                      </div>
                    </div>

                    <h5 className={`font-bold mb-3 text-sm ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                      ✨ AI & AUTOMATION
                    </h5>
                    <div className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <div className="flex items-start space-x-2">
                        <span className="text-emerald-500 text-xs">✓</span>
                        <span className="text-xs">Weekly AI coaching insights & pattern detection</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-emerald-500 text-xs">✓</span>
                        <span className="text-xs">Smart energy forecasting (predict tomorrow's capacity)</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-emerald-500 text-xs">✓</span>
                        <span className="text-xs">Automated task rescheduling based on energy drops</span>
                      </div>
                    </div>
                  </div>

                  {/* Waitlist Form */}
                  <div className={`p-4 rounded-lg mb-4 ${darkMode ? 'bg-gray-800/50 border border-purple-500/30' : 'bg-white border border-purple-200'}`}>
                    <p className={`text-sm font-bold mb-3 text-center ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                      🎉 Join the Waitlist - Be First to Access All Integrations
                    </p>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const email = e.target.waitlistEmail.value;
                      alert(`Thank you! We'll email ${email} when the full experience launches! 🚀`);
                      e.target.reset();
                    }} className="space-y-2">
                      <input
                        type="email"
                        name="waitlistEmail"
                        required
                        placeholder="your.email@example.com"
                        className={`w-full px-4 py-2 rounded-lg text-sm ${
                          darkMode
                            ? 'bg-gray-900 border-2 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-purple-500'
                            : 'bg-white border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500'
                        }`}
                      />
                      <button
                        type="submit"
                        className={`w-full py-3 rounded-lg font-bold text-sm transition-all shadow-lg ${
                          darkMode
                            ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 text-white border-2 border-purple-500/50'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                        }`}
                      >
                        🚀 Join Waitlist - Get Early Access
                      </button>
                    </form>
                    <p className={`text-xs text-center mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                      First 100 members get lifetime 50% discount ($9.50/month)
                    </p>
                  </div>

                  {/* CTA Button */}
                  {process.env.REACT_APP_STRIPE_STARTER_PAYMENT_LINK && (
                    <a
                      href={process.env.REACT_APP_STRIPE_STARTER_PAYMENT_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-4 rounded-lg font-bold text-center block transition-all shadow-lg ${
                        darkMode
                          ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:via-teal-500 hover:to-emerald-500 text-white border-2 border-emerald-500/50'
                          : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white'
                      }`}
                    >
                      💳 Get Started Now - $19/month
                    </a>
                  )}
                </div>

                {/* Auth Section */}
                {isSupabaseConfigured() && (
                  <>
                    {!user ? (
                      <button
                        onClick={signInWithGoogle}
                        className={`w-full py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all ${
                          darkMode
                            ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/30'
                            : 'bg-green-50 hover:bg-green-100 text-green-700 border-2 border-green-200'
                        }`}
                      >
                        <LogIn size={20} />
                        <span>Sign In with Google (Cloud Sync)</span>
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-green-50 border border-green-200'}`}>
                          <div className={`text-sm font-medium ${darkMode ? 'text-emerald-400' : 'text-green-700'}`}>
                            ✓ Signed in as {user.email}
                          </div>
                          <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                            Data syncing to cloud
                          </div>
                        </div>
                        <button
                          onClick={supabaseSignOut}
                          className={`w-full py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all ${
                            darkMode
                              ? 'bg-gray-700/50 hover:bg-gray-700 text-gray-400 border border-gray-700'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                          }`}
                        >
                          <LogOut size={18} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </>
                )}

                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-full py-3 rounded-lg font-medium flex items-center justify-between px-4 transition-all duration-300 ${
                    darkMode
                      ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border-2 border-purple-500/30'
                      : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-2 border-purple-200'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span>{darkMode ? '🌙' : '☀️'}</span>
                    <span>{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
                  </span>
                  <div className={`relative w-14 h-7 rounded-full transition-all ${
                    darkMode ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-300'
                  }`}>
                    <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
                      darkMode ? 'transform translate-x-7' : ''
                    }`} />
                  </div>
                </button>
                <button onClick={exportData} className={`w-full py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all ${
                  darkMode
                    ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-2 border-blue-500/30'
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-700'
                }`}>
                  <Download size={20} />
                  <span>Export All Data</span>
                </button>
                <button onClick={resetData} className={`w-full py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all ${
                  darkMode
                    ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-2 border-red-500/30'
                    : 'bg-red-50 hover:bg-red-100 text-red-700'
                }`}>
                  <Trash2 size={20} />
                  <span>Reset All Data</span>
                </button>
                <div className={`pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <p className={`text-xs text-center ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Version 1.0.0 • Made with 💜 for busy professionals
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'plan' && (
          <div className="space-y-4 pb-32 relative z-10">
            {/* Morning Ritual */}
            <div className={`rounded-2xl p-6 shadow-2xl transition-all duration-300 ${
              darkMode
                ? 'bg-gradient-to-r from-amber-900/50 via-orange-900/50 to-amber-900/50 border-2 border-amber-500/30 backdrop-blur-xl'
                : 'bg-gradient-to-r from-amber-500 to-orange-500'
            }`}>
              <h2 className={`text-2xl font-bold mb-2 flex items-center ${darkMode ? 'text-white' : 'text-white'}`}>
                <Sparkles className="mr-2" size={24} />
                Morning Ritual
              </h2>
              <p className={`text-sm ${darkMode ? 'text-amber-300' : 'text-white opacity-90'}`}>Start your day with intention</p>
            </div>

            {/* 3 Gratitudes */}
            <div className={`rounded-xl p-6 transition-all duration-300 ${
              darkMode
                ? 'bg-gray-800/50 border-2 border-gray-700/50 shadow-lg backdrop-blur-sm'
                : 'bg-white border-2 border-gray-100 shadow-md'
            }`}>
              <h3 className={`font-bold mb-4 flex items-center ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                <Sparkles className={`mr-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} size={20} />
                3 Gratitudes Today
              </h3>
              <div className="space-y-3">
                {gratitude.map((item, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={item}
                    onChange={(e) => updateGratitude(idx, e.target.value)}
                    placeholder={`Gratitude #${idx + 1}...`}
                    className={`w-full px-4 py-3 rounded-lg transition-all ${
                      darkMode
                        ? 'bg-gray-900/50 border-2 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-yellow-500/50'
                        : 'bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-yellow-500'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* 3 Mantras/Reminders */}
            <div className={`rounded-xl p-6 transition-all duration-300 ${
              darkMode
                ? 'bg-gray-800/50 border-2 border-gray-700/50 shadow-lg backdrop-blur-sm'
                : 'bg-white border-2 border-gray-100 shadow-md'
            }`}>
              <h3 className={`font-bold mb-4 flex items-center ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                <Lightbulb className={`mr-2 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} size={20} />
                3 Reminders (When I Fall)
              </h3>
              <div className="space-y-3">
                {mantras.map((item, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={item}
                    onChange={(e) => updateMantra(idx, e.target.value)}
                    placeholder={`Reminder #${idx + 1}...`}
                    className={`w-full px-4 py-3 rounded-lg transition-all ${
                      darkMode
                        ? 'bg-gray-900/50 border-2 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-purple-500/50'
                        : 'bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Hourly Planner */}
            <div className={`rounded-2xl p-6 shadow-2xl transition-all duration-300 ${
              darkMode
                ? 'bg-gradient-to-r from-blue-900/50 via-cyan-900/50 to-blue-900/50 border-2 border-blue-500/30 backdrop-blur-xl'
                : 'bg-gradient-to-r from-blue-500 to-cyan-500'
            }`}>
              <h2 className={`text-2xl font-bold mb-2 flex items-center ${darkMode ? 'text-white' : 'text-white'}`}>
                <Calendar className="mr-2" size={24} />
                Today's Schedule
              </h2>
              <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-white opacity-90'}`}>5AM - 10PM Hourly Planner</p>
            </div>

            {/* Hourly Time Blocks */}
            <div className="space-y-3">
              {Object.keys(hourlyTasks).sort((a, b) => Number(a) - Number(b)).map(hour => {
                const hourNum = Number(hour);
                const currentHour = new Date().getHours();
                const isCurrentHour = hourNum === currentHour;
                const tasks = hourlyTasks[hour] || [];

                return (
                  <div key={hour} className={`rounded-xl p-4 transition-all duration-300 ${
                    darkMode
                      ? isCurrentHour
                        ? 'bg-blue-500/20 border-2 border-blue-500/50 shadow-lg shadow-blue-500/20'
                        : 'bg-gray-800/50 border-2 border-gray-700/50 backdrop-blur-sm'
                      : isCurrentHour
                        ? 'bg-blue-50 border-2 border-blue-500'
                        : 'bg-white border-2 border-gray-100 shadow-md'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Clock className={darkMode ? (isCurrentHour ? 'text-blue-400' : 'text-gray-400') : (isCurrentHour ? 'text-blue-600' : 'text-gray-600')} size={20} />
                        <span className={`font-bold ${darkMode ? (isCurrentHour ? 'text-blue-300' : 'text-gray-300') : (isCurrentHour ? 'text-blue-700' : 'text-gray-700')}`}>
                          {formatHour(hourNum)}
                        </span>
                        {isCurrentHour && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            darkMode ? 'bg-blue-500/30 text-blue-300' : 'bg-blue-200 text-blue-700'
                          }`}>
                            NOW
                          </span>
                        )}
                      </div>
                      <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {tasks.length} task{tasks.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Tasks for this hour */}
                    <div className="space-y-2 mb-3">
                      {tasks.map(task => (
                        <div key={task.id} className={`flex items-center justify-between p-2 rounded-lg ${
                          darkMode
                            ? task.completed
                              ? 'bg-emerald-500/10 border border-emerald-500/30'
                              : 'bg-gray-900/30 border border-gray-700'
                            : task.completed
                              ? 'bg-green-50 border border-green-200'
                              : 'bg-gray-50 border border-gray-200'
                        }`}>
                          <div className="flex items-center space-x-2 flex-1">
                            <button
                              onClick={() => toggleHourlyTask(hour, task.id)}
                              className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                                darkMode
                                  ? task.completed
                                    ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50'
                                    : 'bg-gray-700 hover:bg-gray-600'
                                  : task.completed
                                    ? 'bg-green-500'
                                    : 'bg-gray-300 hover:bg-gray-400'
                              }`}
                            >
                              {task.completed && <Check className="text-white" size={12} />}
                            </button>
                            <span className={`text-sm ${
                              darkMode
                                ? task.completed
                                  ? 'text-emerald-300 line-through'
                                  : 'text-gray-300'
                                : task.completed
                                  ? 'text-green-700 line-through'
                                  : 'text-gray-900'
                            }`}>
                              {task.text}
                            </span>
                          </div>
                          <button
                            onClick={() => deleteHourlyTask(hour, task.id)}
                            className={`ml-2 ${darkMode ? 'text-gray-600 hover:text-red-400' : 'text-gray-400 hover:text-red-600'}`}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add task input */}
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const input = e.target.elements.taskInput;
                      addHourlyTask(hour, input.value);
                      input.value = '';
                    }}>
                      <input
                        name="taskInput"
                        type="text"
                        placeholder="+ Add task..."
                        className={`w-full px-3 py-2 text-sm rounded-lg transition-all ${
                          darkMode
                            ? 'bg-gray-900/50 border border-gray-700 text-gray-200 placeholder-gray-500 focus:border-blue-500/50'
                            : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                        }`}
                      />
                    </form>
                  </div>
                );
              })}
            </div>

            {/* Notifications Toggle */}
            <div className={`rounded-xl p-6 transition-all duration-300 ${
              darkMode
                ? 'bg-gray-800/50 border-2 border-gray-700/50 shadow-lg backdrop-blur-sm'
                : 'bg-white border-2 border-gray-100 shadow-md'
            }`}>
              <button
                onClick={requestNotificationPermission}
                className={`w-full py-3 rounded-lg font-medium flex items-center justify-between px-4 transition-all ${
                  darkMode
                    ? notificationsEnabled
                      ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/30'
                      : 'bg-gray-700/50 hover:bg-gray-700 text-gray-400 border-2 border-gray-700'
                    : notificationsEnabled
                      ? 'bg-green-50 hover:bg-green-100 text-green-700 border-2 border-green-200'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-2 border-gray-300'
                }`}
              >
                <span className="flex items-center space-x-2">
                  {notificationsEnabled ? <Bell size={20} /> : <BellOff size={20} />}
                  <span>{notificationsEnabled ? 'Reminders Enabled' : 'Enable Task Reminders'}</span>
                </span>
              </button>
            </div>
          </div>
        )}

        {currentView === 'library' && (
          <div className="space-y-4 pb-32 relative z-10">
            <div className={`rounded-2xl p-6 shadow-2xl transition-all duration-300 ${
              darkMode
                ? 'bg-gradient-to-r from-violet-900/50 via-purple-900/50 to-violet-900/50 border-2 border-violet-500/30 backdrop-blur-xl'
                : 'bg-gradient-to-r from-violet-600 to-purple-600'
            }`}>
              <h2 className={`text-2xl font-bold mb-2 flex items-center ${darkMode ? 'text-white' : 'text-white'}`}>
                <BookOpen className="mr-2" size={24} />
                Learning Library
              </h2>
              <p className={`text-sm ${darkMode ? 'text-violet-300' : 'text-white opacity-90'}`}>Track what you consume, extract what matters</p>
            </div>

            {/* Add New Content */}
            <div className={`rounded-xl p-6 transition-all duration-300 ${
              darkMode
                ? 'bg-gray-800/50 border-2 border-gray-700/50 shadow-lg backdrop-blur-sm'
                : 'bg-white border-2 border-gray-100 shadow-md'
            }`}>
              <h3 className={`font-bold mb-4 flex items-center ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                <Plus className={`mr-2 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} size={20} />
                Add Content
              </h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                addLearningItem(
                  form.url.value,
                  form.title.value,
                  form.type.value,
                  form.notes.value
                );
                form.reset();
              }} className="space-y-3">
                <input
                  name="url"
                  type="url"
                  placeholder="URL (YouTube, Instagram, article, etc.)"
                  required
                  className={`w-full px-4 py-3 rounded-lg transition-all ${
                    darkMode
                      ? 'bg-gray-900/50 border-2 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-purple-500/50'
                      : 'bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500'
                  }`}
                />
                <input
                  name="title"
                  type="text"
                  placeholder="Title"
                  required
                  className={`w-full px-4 py-3 rounded-lg transition-all ${
                    darkMode
                      ? 'bg-gray-900/50 border-2 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-purple-500/50'
                      : 'bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500'
                  }`}
                />
                <select
                  name="type"
                  className={`w-full px-4 py-3 rounded-lg transition-all ${
                    darkMode
                      ? 'bg-gray-900/50 border-2 border-gray-700 text-gray-200 focus:border-purple-500/50'
                      : 'bg-gray-50 border-2 border-gray-200 text-gray-900 focus:border-purple-500'
                  }`}
                >
                  <option value="article">Article</option>
                  <option value="youtube">YouTube</option>
                  <option value="instagram">Instagram</option>
                  <option value="book">Book</option>
                </select>
                <textarea
                  name="notes"
                  placeholder="Notes/Summary..."
                  rows="3"
                  className={`w-full px-4 py-3 rounded-lg transition-all ${
                    darkMode
                      ? 'bg-gray-900/50 border-2 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-purple-500/50'
                      : 'bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500'
                  }`}
                />
                <button
                  type="submit"
                  className={`w-full py-3 rounded-lg font-medium transition-all ${
                    darkMode
                      ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border-2 border-purple-500/30'
                      : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-2 border-purple-200'
                  }`}
                >
                  Save to Library
                </button>
              </form>
            </div>

            {/* Library Items */}
            <div className="space-y-3">
              {learningLibrary.map(item => (
                <div key={item.id} className={`rounded-xl p-4 transition-all duration-300 ${
                  darkMode
                    ? 'bg-gray-800/50 border-2 border-gray-700/50 backdrop-blur-sm'
                    : 'bg-white border-2 border-gray-100 shadow-md'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3 flex-1">
                      {item.type === 'youtube' && <Youtube className={darkMode ? 'text-red-400' : 'text-red-600'} size={20} />}
                      {item.type === 'book' && <BookOpen className={darkMode ? 'text-blue-400' : 'text-blue-600'} size={20} />}
                      {item.type === 'article' && <BookOpen className={darkMode ? 'text-green-400' : 'text-green-600'} size={20} />}
                      {item.type === 'instagram' && <Camera className={darkMode ? 'text-pink-400' : 'text-pink-600'} size={20} />}
                      <div className="flex-1">
                        <h4 className={`font-bold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{item.title}</h4>
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className={`text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}>
                          {item.url}
                        </a>
                        {item.notes && (
                          <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.notes}</p>
                        )}
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-600' : 'text-gray-500'}`}>Added: {item.dateAdded}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Items */}
                  {item.actionItems.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {item.actionItems.map(action => (
                        <div key={action.id} className={`text-sm flex items-center space-x-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <span className={darkMode ? 'text-purple-400' : 'text-purple-600'}>→</span>
                          <span>{action.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Action Item */}
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const input = e.target.elements.actionInput;
                    if (input.value.trim()) {
                      addActionItemToLearning(item.id, input.value);
                      input.value = '';
                    }
                  }} className="mt-3">
                    <input
                      name="actionInput"
                      type="text"
                      placeholder="+ Add action item..."
                      className={`w-full px-3 py-2 text-sm rounded-lg transition-all ${
                        darkMode
                          ? 'bg-gray-900/50 border border-gray-700 text-gray-200 placeholder-gray-500 focus:border-purple-500/50'
                          : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500'
                      }`}
                    />
                  </form>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={`fixed bottom-0 left-0 right-0 z-20 backdrop-blur-xl transition-all duration-300 ${
        darkMode
          ? 'bg-gradient-to-t from-gray-900/95 to-gray-900/90 border-t-2 border-purple-500/30 shadow-2xl'
          : 'bg-gradient-to-t from-white/95 to-white/90 border-t-2 border-purple-300/50 shadow-2xl'
      }`}
      style={{
        boxShadow: darkMode
          ? '0 -4px 30px rgba(168, 85, 247, 0.2), 0 -2px 10px rgba(168, 85, 247, 0.1)'
          : '0 -4px 20px rgba(168, 85, 247, 0.15), 0 -2px 10px rgba(168, 85, 247, 0.08)'
      }}>
        <div className="max-w-2xl mx-auto px-3 py-3">
          <div className="grid grid-cols-6 gap-2">
            <NavButton icon={<Brain size={18} />} label="Home" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} />
            <NavButton icon={<Calendar size={18} />} label="Plan" active={currentView === 'plan'} onClick={() => setCurrentView('plan')} />
            <NavButton icon={<Zap size={18} />} label="Exercise" active={currentView === 'exercise'} onClick={() => setCurrentView('exercise')} />
            <NavButton icon={<Utensils size={18} />} label="Food" active={currentView === 'food'} onClick={() => setCurrentView('food')} />
            <NavButton icon={<BookOpen size={18} />} label="Library" active={currentView === 'library'} onClick={() => setCurrentView('library')} />
            <NavButton icon={<BarChart3 size={18} />} label="Insights" active={currentView === 'insights'} onClick={() => setCurrentView('insights')} />
          </div>
        </div>
      </div>

      {/* ENERGY MODAL */}
      <EnergyModal
        isOpen={showEnergyModal}
        onClose={() => setShowEnergyModal(false)}
        energyLevel={getCurrentPeriodEnergy() || getCurrentEnergy()}
        suggestions={getSmartSuggestions()}
        darkMode={darkMode}
        onAddTask={addHourlyTask}
        onAddToFoodDiary={addFoodFromModal}
        currentHour={currentTime.getHours()}
        selectedActions={selectedEnergyActions}
        onActionSelect={handleEnergyActionSelect}
      />

      {/* MOOD MODAL */}
      <MoodModal
        isOpen={showMoodModal}
        onClose={() => setShowMoodModal(false)}
        currentMood={currentMood}
        moodWellness={getSmartSuggestions().moodWellness}
        darkMode={darkMode}
        onAddTask={addHourlyTask}
        onAddToFoodDiary={addFoodFromModal}
        currentHour={currentTime.getHours()}
        selectedActions={selectedMoodActions}
        onActionSelect={handleMoodActionSelect}
      />

      {/* FULL-SCREEN POMODORO FOCUS MODE */}
      {showPomodoroFullScreen && pomodoroRunning && (
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${
          darkMode
            ? 'bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900'
            : 'bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50'
        }`}>
          <button
            onClick={() => setShowPomodoroFullScreen(false)}
            className={`absolute top-8 right-8 p-3 rounded-full transition-all ${
              darkMode
                ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
            }`}
            title="Minimize (continue in background)"
          >
            <X size={32} />
          </button>

          <div className="text-center space-y-8">
            <div className={`font-mono text-8xl md:text-9xl font-bold ${
              darkMode
                ? 'bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent'
                : 'text-orange-600'
            }`} style={{
              textShadow: darkMode ? '0 0 40px rgba(249, 115, 22, 0.3)' : '0 0 20px rgba(249, 115, 22, 0.2)'
            }}>
              {formatTime(pomodoroSeconds)}
            </div>

            <div className={`text-2xl md:text-3xl font-semibold max-w-2xl mx-auto px-8 ${
              darkMode ? 'text-purple-300' : 'text-purple-700'
            }`}>
              You got this - {Math.floor(pomodoroSeconds / 60)} mins knock it out of the park
            </div>

            <div className="relative w-64 h-64 mx-auto">
              <svg className="transform -rotate-90 w-64 h-64">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke={darkMode ? '#1f2937' : '#e5e7eb'}
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 120}`}
                  strokeDashoffset={`${2 * Math.PI * 120 * (1 - pomodoroSeconds / (20 * 60))}`}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="50%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="flex items-center justify-center space-x-4 pt-8">
              <button onClick={pausePomodoro} className={`px-8 py-4 rounded-full font-bold text-lg flex items-center space-x-3 transition-all ${
                darkMode
                  ? 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border-2 border-orange-500/40'
                  : 'bg-orange-100 hover:bg-orange-200 text-orange-700 border-2 border-orange-300'
              }`}>
                <Pause size={24} />
                <span>Pause</span>
              </button>
              <button onClick={resetPomodoro} className={`p-4 rounded-full transition-all ${
                darkMode
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-400 border-2 border-gray-700'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-600 border-2 border-gray-300'
              }`}>
                <RotateCcw size={24} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HOURLY WELLNESS SNACK MODAL */}
      {showWellnessSnackModal && !wellnessSnackChoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className={`max-w-3xl w-full rounded-3xl shadow-2xl overflow-hidden animate-scale-in ${
            darkMode
              ? 'bg-gradient-to-br from-gray-900 via-orange-900/20 to-gray-900 border-2 border-orange-500/30'
              : 'bg-gradient-to-br from-white via-orange-50 to-white border-2 border-orange-200'
          }`}>
            <div className={`relative p-8 pb-6 ${
              darkMode
                ? 'bg-gradient-to-r from-orange-900/40 to-pink-900/40'
                : 'bg-gradient-to-r from-orange-100 to-pink-100'
            }`}>
              <button onClick={dismissWellnessSnack} className={`absolute top-4 right-4 p-2 rounded-lg transition-all ${
                darkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-white/50 text-gray-600 hover:text-gray-900'
              }`}>
                <X size={24} />
              </button>

              <div className="text-center">
                <div className="text-6xl mb-4">⚡💪🧘</div>
                <h2 className={`text-3xl font-bold mb-2 ${
                  darkMode ? 'bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent' : 'text-gray-900'
                }`}>
                  Choose Your Wellness Weapon
                </h2>
                <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {formatHour(currentTime.getHours())} check-in • 2-minute power-up
                </p>
              </div>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <button onClick={() => setWellnessSnackChoice('exercise')} className={`p-6 rounded-xl border-2 transition-all hover:scale-105 ${
                darkMode ? 'bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20' : 'bg-orange-50 border-orange-200 hover:bg-orange-100'
              }`}>
                <div className="text-5xl mb-3">🦵</div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>Exercise Snack</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Quick burst of movement
                </p>
              </button>

              <button onClick={() => { setWellnessSnackChoice('breathing'); setBoxBreathingActive(true); }} className={`p-6 rounded-xl border-2 transition-all hover:scale-105 ${
                darkMode ? 'bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20' : 'bg-purple-50 border-purple-200 hover:bg-purple-100'
              }`}>
                <div className="text-5xl mb-3">🧘</div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>Box Breathing</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  2 min calm reset
                </p>
              </button>

              <button onClick={() => completeWellnessSnack('hydration')} className={`p-6 rounded-xl border-2 transition-all hover:scale-105 ${
                darkMode ? 'bg-cyan-500/10 border-cyan-500/30 hover:bg-cyan-500/20' : 'bg-cyan-50 border-cyan-200 hover:bg-cyan-100'
              }`}>
                <div className="text-5xl mb-3">💧</div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>Hydration Break</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Water or herbal tea
                </p>
              </button>
            </div>

            <div className="px-8 pb-8 text-center">
              <button onClick={snoozeWellnessSnack} className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'} hover:underline`}>
                Remind me in 15 minutes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXERCISE SNACK CHOICE MODAL */}
      {showWellnessSnackModal && wellnessSnackChoice === 'exercise' && !exerciseChoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className={`max-w-3xl w-full rounded-3xl shadow-2xl overflow-hidden ${
            darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-orange-500/30' : 'bg-white border-2 border-orange-200'
          }`}>
            <div className={`p-8 ${darkMode ? 'bg-orange-900/20' : 'bg-orange-50'}`}>
              <button onClick={() => setWellnessSnackChoice(null)} className={`mb-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                ← Back
              </button>
              <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Choose Your Exercise Snack
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'squats', name: '25 Air Squats', icon: '🦵', time: '2 mins' },
                  { id: 'calves', name: 'Calf Raises', icon: '👟', time: '2 mins' },
                  { id: 'stairs', name: 'Stair Sprint', icon: '🪜', time: '2 mins' },
                  { id: 'deadhang', name: 'Dead Hang', icon: '💪', time: '30-60 sec' },
                  { id: 'gorilla', name: 'Gorilla Rows', icon: '🦍', time: '2 mins' }
                ].map(exercise => (
                  <button
                    key={exercise.id}
                    onClick={() => { setExerciseChoice(exercise.id); completeWellnessSnack('exercise'); }}
                    className={`p-4 rounded-xl border-2 transition-all hover:scale-105 text-left ${
                      darkMode ? 'bg-gray-800 border-orange-500/30 hover:bg-gray-700' : 'bg-white border-orange-200 hover:bg-orange-50'
                    }`}
                  >
                    <div className="text-4xl mb-2">{exercise.icon}</div>
                    <h3 className={`font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{exercise.name}</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{exercise.time}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOX BREATHING MODAL */}
      {showWellnessSnackModal && wellnessSnackChoice === 'breathing' && boxBreathingActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <BoxBreathingComponent
            darkMode={darkMode}
            onComplete={() => completeWellnessSnack('breathing')}
            boxBreathingPhase={boxBreathingPhase}
            setBoxBreathingPhase={setBoxBreathingPhase}
            boxBreathingCycles={boxBreathingCycles}
            setBoxBreathingCycles={setBoxBreathingCycles}
          />
        </div>
      )}

      {/* BRAIN DUMP MODAL */}
      {showBrainDumpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`max-w-2xl w-full rounded-2xl p-6 shadow-2xl ${
            darkMode
              ? 'bg-gray-900 border-2 border-purple-500/30'
              : 'bg-white border-2 border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-2xl font-bold flex items-center ${
                darkMode
                  ? 'bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent'
                  : 'text-gray-900'
              }`}>
                <Brain className={`mr-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} size={28} />
                Brain Dump
              </h2>
              <button
                onClick={() => setShowBrainDumpModal(false)}
                className={`p-2 rounded-lg transition-all ${
                  darkMode
                    ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                <X size={24} />
              </button>
            </div>

            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Get everything out of your head and onto paper. No filter, no judgment.
            </p>

            <textarea
              value={brainDumpText}
              onChange={(e) => setBrainDumpText(e.target.value)}
              placeholder="What's on your mind? Type or paste anything here..."
              className={`w-full h-64 px-4 py-3 rounded-lg transition-all resize-none ${
                darkMode
                  ? 'bg-gray-800/50 border-2 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-purple-500/50'
                  : 'bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500'
              }`}
              autoFocus
            />

            <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
              <p className={`text-xs ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                💡 Tip: This is your safe space. Write worries, ideas, random thoughts - anything taking up mental space.
              </p>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowBrainDumpModal(false)}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                  darkMode
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={saveBrainDump}
                disabled={!brainDumpText.trim()}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                  !brainDumpText.trim()
                    ? darkMode
                      ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : darkMode
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                }`}
              >
                Save Brain Dump ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MINDFUL MOMENT MODAL */}
      {showMindfulMomentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`max-w-lg w-full rounded-2xl p-8 shadow-2xl ${
            darkMode
              ? 'bg-gray-900 border-2 border-cyan-500/30'
              : 'bg-white border-2 border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold flex items-center ${
                darkMode
                  ? 'bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent'
                  : 'text-gray-900'
              }`}>
                🧘 Mindful Moment
              </h2>
              <button
                onClick={() => {
                  setShowMindfulMomentModal(false);
                  setMindfulRunning(false);
                  setMindfulTimer(300);
                }}
                className={`p-2 rounded-lg transition-all ${
                  darkMode
                    ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                <X size={24} />
              </button>
            </div>

            <div className="text-center mb-8">
              <div className={`font-mono text-6xl font-bold mb-4 ${
                darkMode
                  ? mindfulRunning
                    ? 'bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent'
                    : 'text-gray-600'
                  : mindfulRunning ? 'text-cyan-600' : 'text-gray-400'
              }`}>
                {formatTime(mindfulTimer)}
              </div>

              <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {mindfulRunning
                  ? 'Breathe deeply. You are here, now.'
                  : 'Take 5 minutes to reset your mind'}
              </p>

              <div className="flex items-center justify-center space-x-3 mb-6">
                {!mindfulRunning ? (
                  <button
                    onClick={startMindfulSession}
                    className={`px-8 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all ${
                      darkMode
                        ? 'bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border-2 border-cyan-500/30'
                        : 'bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white'
                    }`}
                  >
                    <Play size={20} />
                    <span>Start</span>
                  </button>
                ) : (
                  <button
                    onClick={pauseMindfulSession}
                    className={`px-8 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all ${
                      darkMode
                        ? 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border-2 border-orange-500/30'
                        : 'bg-orange-100 hover:bg-orange-200 text-orange-700 border-2 border-orange-300'
                    }`}
                  >
                    <Pause size={20} />
                    <span>Pause</span>
                  </button>
                )}
              </div>

              <div className={`p-4 rounded-lg ${darkMode ? 'bg-cyan-500/10' : 'bg-cyan-50'}`}>
                <p className={`text-xs font-semibold mb-2 ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                  💡 Guided Meditation Tips:
                </p>
                <ul className={`text-xs space-y-1 text-left ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                  <li>• Focus on your breath - in through nose, out through mouth</li>
                  <li>• If your mind wanders, gently bring it back</li>
                  <li>• Notice sensations in your body without judgment</li>
                  <li>• You can close your eyes or gaze softly downward</li>
                </ul>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowMindfulMomentModal(false);
                  setMindfulRunning(false);
                  setMindfulTimer(300);
                }}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                  darkMode
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Close
              </button>
              {mindfulTimer < 300 && (
                <button
                  onClick={completeMindfulSession}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                    darkMode
                      ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white'
                      : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white'
                  }`}
                >
                  Mark Complete ✓
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DAILY COMMAND CENTER MODAL */}
      {showCommandCenterModal && (() => {
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className={`max-w-4xl w-full rounded-3xl shadow-2xl overflow-hidden ${
              darkMode
                ? 'bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 border-2 border-purple-500/30'
                : 'bg-gradient-to-br from-white via-purple-50 to-white border-2 border-purple-200'
            }`}>
              {/* Header */}
              <div className={`relative p-6 pb-4 ${
                darkMode
                  ? 'bg-gradient-to-r from-purple-900/40 to-cyan-900/40'
                  : 'bg-gradient-to-r from-purple-100 to-cyan-100'
              }`}>
                <button
                  onClick={() => setShowCommandCenterModal(false)}
                  className={`absolute top-4 right-4 p-2 rounded-lg transition-all ${
                    darkMode
                      ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                      : 'hover:bg-white/50 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <X size={24} />
                </button>

                <div className="text-center">
                  <h2 className={`text-3xl font-bold mb-2 ${
                    darkMode
                      ? 'bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent'
                      : 'text-gray-900'
                  }`}>
                    📊 Daily Command Center
                  </h2>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Metrics Dashboard Content */}
              <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">

                {/* Grid Layout: Top Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* HYDRATION TRACKER */}
                  <div className={`p-6 rounded-2xl ${
                    darkMode
                      ? 'bg-cyan-500/10 border-2 border-cyan-500/30'
                      : 'bg-cyan-50 border-2 border-cyan-200'
                  }`}>
                    <h3 className={`font-bold mb-4 flex items-center justify-between ${
                      darkMode ? 'text-cyan-300' : 'text-cyan-700'
                    }`}>
                      <span>💧 Hydration</span>
                      <span className="text-sm">{dailyMetrics.hydration.current}/{dailyMetrics.hydration.target}</span>
                    </h3>
                    <div className="flex items-center justify-center gap-2">
                      {Array.from({ length: dailyMetrics.hydration.target }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-8 h-10 rounded-lg border-2 transition-all ${
                            i < dailyMetrics.hydration.current
                              ? 'bg-gradient-to-b from-cyan-400 to-blue-500 border-cyan-400'
                              : darkMode
                                ? 'bg-gray-800/30 border-gray-700'
                                : 'bg-gray-100 border-gray-300'
                          }`}
                          style={{
                            boxShadow: i < dailyMetrics.hydration.current ? '0 0 15px #06b6d4' : 'none'
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* EXERCISE SNACKS TRACKER */}
                  <div className={`p-6 rounded-2xl ${
                    darkMode
                      ? 'bg-orange-500/10 border-2 border-orange-500/30'
                      : 'bg-orange-50 border-2 border-orange-200'
                  }`}>
                    <h3 className={`font-bold mb-4 flex items-center justify-between ${
                      darkMode ? 'text-orange-300' : 'text-orange-700'
                    }`}>
                      <span>🦵 Movement Snacks</span>
                      <span className="text-sm">{dailyMetrics.movement.current}/{dailyMetrics.movement.target}</span>
                    </h3>
                    <div className="flex items-center justify-center gap-3">
                      {Array.from({ length: dailyMetrics.movement.target }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2 transition-all ${
                            i < dailyMetrics.movement.current
                              ? 'bg-gradient-to-br from-orange-400 to-pink-500 border-orange-400'
                              : darkMode
                                ? 'bg-gray-800/30 border-gray-700'
                                : 'bg-gray-100 border-gray-300'
                          }`}
                          style={{
                            boxShadow: i < dailyMetrics.movement.current ? '0 0 20px #fb923c' : 'none'
                          }}
                        >
                          {i < dailyMetrics.movement.current ? '✓' : ''}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* FOCUS SESSIONS TRACKER */}
                  <div className={`p-6 rounded-2xl ${
                    darkMode
                      ? 'bg-purple-500/10 border-2 border-purple-500/30'
                      : 'bg-purple-50 border-2 border-purple-200'
                  }`}>
                    <h3 className={`font-bold mb-4 flex items-center justify-between ${
                      darkMode ? 'text-purple-300' : 'text-purple-700'
                    }`}>
                      <span>🎯 Focus Sessions</span>
                      <span className="text-sm">{dailyMetrics.focus.current}/{dailyMetrics.focus.target}</span>
                    </h3>
                    <div className="flex items-center justify-center gap-3">
                      {Array.from({ length: dailyMetrics.focus.target }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold border-2 transition-all ${
                            i < dailyMetrics.focus.current
                              ? 'bg-gradient-to-br from-purple-400 to-pink-500 border-purple-400 text-white'
                              : darkMode
                                ? 'bg-gray-800/30 border-gray-700 text-gray-600'
                                : 'bg-gray-100 border-gray-300 text-gray-400'
                          }`}
                          style={{
                            boxShadow: i < dailyMetrics.focus.current ? '0 0 20px #a855f7' : 'none'
                          }}
                        >
                          20
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* NDM COMPLETION TRACKER */}
                  <div className={`p-6 rounded-2xl ${
                    darkMode
                      ? 'bg-rose-500/10 border-2 border-rose-500/30'
                      : 'bg-rose-50 border-2 border-rose-200'
                  }`}>
                    <h3 className={`font-bold mb-4 flex items-center justify-between ${
                      darkMode ? 'text-rose-300' : 'text-rose-700'
                    }`}>
                      <span>❤️ Non-Negotiables</span>
                      <span className="text-sm">{dailyMetrics.ndms.current}/{dailyMetrics.ndms.target}</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className={`p-3 rounded-lg text-center ${
                        ndm.nutrition
                          ? 'bg-gradient-to-br from-rose-400 to-pink-500'
                          : darkMode ? 'bg-gray-800/30' : 'bg-gray-100'
                      }`} style={{ boxShadow: ndm.nutrition ? '0 0 15px #fb7185' : 'none' }}>
                        <div className="text-2xl mb-1">🥗</div>
                        <div className={`text-xs font-medium ${ndm.nutrition ? 'text-white' : darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                          Nutrition
                        </div>
                      </div>
                      <div className={`p-3 rounded-lg text-center ${
                        ndm.movement
                          ? 'bg-gradient-to-br from-rose-400 to-pink-500'
                          : darkMode ? 'bg-gray-800/30' : 'bg-gray-100'
                      }`} style={{ boxShadow: ndm.movement ? '0 0 15px #fb7185' : 'none' }}>
                        <div className="text-2xl mb-1">⚡</div>
                        <div className={`text-xs font-medium ${ndm.movement ? 'text-white' : darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                          Movement
                        </div>
                      </div>
                      <div className={`p-3 rounded-lg text-center ${
                        ndm.mindfulness
                          ? 'bg-gradient-to-br from-rose-400 to-pink-500'
                          : darkMode ? 'bg-gray-800/30' : 'bg-gray-100'
                      }`} style={{ boxShadow: ndm.mindfulness ? '0 0 15px #fb7185' : 'none' }}>
                        <div className="text-2xl mb-1">🧘</div>
                        <div className={`text-xs font-medium ${ndm.mindfulness ? 'text-white' : darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                          Mindful
                        </div>
                      </div>
                      <div className={`p-3 rounded-lg text-center ${
                        ndm.brainDump
                          ? 'bg-gradient-to-br from-rose-400 to-pink-500'
                          : darkMode ? 'bg-gray-800/30' : 'bg-gray-100'
                      }`} style={{ boxShadow: ndm.brainDump ? '0 0 15px #fb7185' : 'none' }}>
                        <div className="text-2xl mb-1">🧠</div>
                        <div className={`text-xs font-medium ${ndm.brainDump ? 'text-white' : darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                          Brain Dump
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* LIFE'S PIPELINE SUMMARY */}
                <div className={`p-6 rounded-2xl ${
                  darkMode
                    ? 'bg-pink-500/10 border-2 border-pink-500/30'
                    : 'bg-pink-50 border-2 border-pink-200'
                }`}>
                  <h3 className={`font-bold mb-4 flex items-center justify-between ${
                    darkMode ? 'text-pink-300' : 'text-pink-700'
                  }`}>
                    <span>✨ Life's Pipeline</span>
                    <span className="text-sm">{dailyMetrics.tasks.done}/{dailyMetrics.tasks.total} tasks</span>
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className={`h-4 rounded-full overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                        <div
                          className="h-full bg-gradient-to-r from-pink-400 to-purple-500 transition-all duration-500"
                          style={{
                            width: `${dailyMetrics.tasks.total > 0 ? (dailyMetrics.tasks.done / dailyMetrics.tasks.total) * 100 : 0}%`,
                            boxShadow: '0 0 10px #ec4899'
                          }}
                        />
                      </div>
                    </div>
                    <div className={`text-2xl font-bold ${darkMode ? 'text-pink-300' : 'text-pink-600'}`}>
                      {dailyMetrics.tasks.total > 0 ? Math.round((dailyMetrics.tasks.done / dailyMetrics.tasks.total) * 100) : 0}%
                    </div>
                  </div>
                  {dailyMetrics.tasks.pipeline.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className={`text-xs font-semibold uppercase ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        In Progress
                      </div>
                      {dailyMetrics.tasks.pipeline.slice(0, 3).map((task, i) => (
                        <div key={i} className={`text-sm p-2 rounded ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'}`}>
                          {task}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* QUICK WINS LOGGER */}
                <div className={`p-6 rounded-2xl ${
                  darkMode
                    ? 'bg-amber-500/10 border-2 border-amber-500/30'
                    : 'bg-amber-50 border-2 border-amber-200'
                }`}>
                  <h3 className={`font-bold mb-4 flex items-center ${
                    darkMode ? 'text-amber-300' : 'text-amber-700'
                  }`}>
                    <span>🏆 Quick Wins ({dailyMetrics.wins.length})</span>
                  </h3>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={quickWinInput}
                      onChange={(e) => setQuickWinInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addQuickWin()}
                      placeholder="Add a win..."
                      className={`flex-1 px-4 py-2 rounded-lg border-2 ${
                        darkMode
                          ? 'bg-gray-800 border-amber-500/30 text-gray-100 placeholder-gray-500'
                          : 'bg-white border-amber-300 text-gray-900 placeholder-gray-400'
                      }`}
                    />
                    <button
                      onClick={addQuickWin}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        darkMode
                          ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300'
                          : 'bg-amber-200 hover:bg-amber-300 text-amber-800'
                      }`}
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {dailyMetrics.wins.slice().reverse().map((win, i) => (
                      <div key={i} className={`p-3 rounded-lg ${darkMode ? 'bg-amber-900/20' : 'bg-amber-100/50'}`}>
                        <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>{win.text}</div>
                        <div className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          {new Date(win.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        );
      })()}

      {/* NON-NEGOTIABLES MODAL */}
      {showNonNegotiablesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className={`max-w-2xl w-full rounded-3xl shadow-2xl overflow-hidden ${
            darkMode
              ? 'bg-gradient-to-br from-gray-900 via-rose-900/20 to-gray-900 border-2 border-rose-500/30'
              : 'bg-gradient-to-br from-white via-rose-50 to-white border-2 border-rose-200'
          }`}>
            {/* Header with X button */}
            <div className={`relative p-8 pb-6 ${
              darkMode
                ? 'bg-gradient-to-r from-rose-900/40 to-pink-900/40'
                : 'bg-gradient-to-r from-rose-100 to-pink-100'
            }`}>
              <button
                onClick={() => setShowNonNegotiablesModal(false)}
                className={`absolute top-4 right-4 p-2 rounded-lg transition-all ${
                  darkMode
                    ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                    : 'hover:bg-white/50 text-gray-600 hover:text-gray-900'
                }`}
              >
                <X size={24} />
              </button>

              <h2 className={`text-3xl font-bold mb-4 flex items-center ${
                darkMode
                  ? 'bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent'
                  : 'text-gray-900'
              }`}>
                <Heart className={`mr-3 ${darkMode ? 'text-rose-400' : 'text-red-500'}`} size={28} />
                Daily Non-Negotiables
              </h2>

              {userProfile.initials && (
                <p className={`text-lg font-medium ${
                  darkMode
                    ? 'bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent'
                    : 'text-purple-700'
                }`}>
                  Welcome {userProfile.initials}
                </p>
              )}
            </div>

            <div className="p-8">
              <div className="space-y-3">
                <NDMItem icon="🥗" label="Protein Breakfast" completed={ndm.nutrition} onClick={() => { setCurrentView('food'); setShowNonNegotiablesModal(false); }} />
                <NDMItem icon="⚡" label="HIIT Burst" completed={ndm.movement} onClick={() => { setCurrentView('exercise'); setShowNonNegotiablesModal(false); }} />
                <NDMItem icon="🧘" label="Mindful Moment" completed={ndm.mindfulness} onClick={() => { openMindfulMoment(); setShowNonNegotiablesModal(false); }} />
                <NDMItem icon="🧠" label="Brain Dump" completed={ndm.brainDump} onClick={() => { openBrainDump(); setShowNonNegotiablesModal(false); }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DualTrackOS;