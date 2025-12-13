import React, { useState, useEffect } from 'react';
import { Zap, Brain, Heart, Briefcase, Check, Mic, Play, Pause, RotateCcw, Utensils, BarChart3, Apple, Plus, Award, Activity, AlertTriangle, Download, Trash2, Settings, Calendar, Clock, Sparkles, Lightbulb, Camera, BookOpen, Youtube, X, Bell, BellOff } from 'lucide-react';

const DualTrackOS = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [dailyScore, setDailyScore] = useState(0);
  const [streak] = useState(0); // No mock data
  const [energyLevel] = useState(0); // No mock data
  const [isRecording, setIsRecording] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // Real-time clock state
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPomodoroMode, setIsPomodoroMode] = useState(false);
  const [pomodoroSeconds, setPomodoroSeconds] = useState(20 * 60); // 20 minutes
  const [pomodoroRunning, setPomodoroRunning] = useState(false);

  // Customizable career sections
  const [careerSections, setCareerSections] = useState([
    { id: 1, label: 'Work', wins: 0 },
    { id: 2, label: 'Consultancy', wins: 0 }
  ]);

  const [ndm, setNdm] = useState({ nutrition: false, movement: false, mindfulness: false, brainDump: false });
  const [careers, setCareers] = useState({ corporate: { wins: 0 }, consultancy: { wins: 0 } });
  const [vitals] = useState({
    sleep: { hours: 0, trend: 'stable' },
    hrv: { value: 0, trend: 'stable' },
    rhr: { value: 0, trend: 'stable' },
    steps: { value: 0 },
    activeCalories: { value: 0 }
  });
  const [alertLevel] = useState('green');
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

  useEffect(() => {
    const saved = localStorage.getItem('dualtrack-data');
    if (saved) {
      try {
        const data = JSON.parse(saved);
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
        if (data.careerSections) setCareerSections(data.careerSections);
        if (data.voiceDiary) setVoiceDiary(data.voiceDiary);
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dualtrack-data', JSON.stringify({
      ndm, careers, meals, workouts, proteinToday, darkMode,
      gratitude, mantras, hourlyTasks, foodDiary, learningLibrary, notificationsEnabled,
      careerSections, voiceDiary
    }));
  }, [ndm, careers, meals, workouts, proteinToday, darkMode, gratitude, mantras, hourlyTasks, foodDiary, learningLibrary, notificationsEnabled, careerSections, voiceDiary]);

  // Real-time clock update every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Pomodoro countdown
  useEffect(() => {
    let interval;
    if (pomodoroRunning && pomodoroSeconds > 0) {
      interval = setInterval(() => {
        setPomodoroSeconds(prev => prev - 1);
      }, 1000);
    } else if (pomodoroSeconds === 0 && pomodoroRunning) {
      setPomodoroRunning(false);
      if (notificationsEnabled) {
        new Notification('Focus session complete!', { body: '20 minutes of deep work done. Take a break!' });
      }
    }
    return () => clearInterval(interval);
  }, [pomodoroRunning, pomodoroSeconds, notificationsEnabled]);

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

  useEffect(() => {
    let interval;
    if (isWorkoutRunning) interval = setInterval(() => setWorkoutTimer(p => p + 1), 1000);
    return () => clearInterval(interval);
  }, [isWorkoutRunning]);

  const toggleNDM = (key) => setNdm(p => ({ ...p, [key]: !p[key] }));
  const addMeal = (name, protein) => {
    setMeals(p => [...p, { id: Date.now(), name, protein, time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) }]);
    setProteinToday(p => p + protein);
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
  };

  const pausePomodoro = () => {
    setPomodoroRunning(false);
  };

  const resetPomodoro = () => {
    setPomodoroSeconds(20 * 60);
    setPomodoroRunning(false);
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

  // Career section customization functions
  const addCareerSection = () => {
    const newId = Math.max(...careerSections.map(s => s.id), 0) + 1;
    setCareerSections([...careerSections, { id: newId, label: 'New Section', wins: 0 }]);
  };

  const updateCareerSectionLabel = (id, newLabel) => {
    setCareerSections(careerSections.map(section =>
      section.id === id ? { ...section, label: newLabel } : section
    ));
  };

  const deleteCareerSection = (id) => {
    if (careerSections.length > 1) {
      setCareerSections(careerSections.filter(section => section.id !== id));
    }
  };

  const addCareerSectionWin = (id) => {
    setCareerSections(careerSections.map(section =>
      section.id === id ? { ...section, wins: section.wins + 1 } : section
    ));
  };

  const exportData = () => {
    const data = { ndm, careers, meals, workouts, proteinToday, vitals, energyLevel, streak, dailyScore, exportDate: new Date().toISOString() };
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
    <button onClick={onClick} className={`flex flex-col items-center space-y-1 transition-all duration-300 ${
      darkMode
        ? active ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500' : 'text-gray-500 hover:text-gray-400'
        : active ? 'text-purple-600' : 'text-gray-400 hover:text-gray-500'
    }`}>
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      darkMode
        ? 'bg-[#191919]'
        : 'bg-gradient-to-br from-purple-50 to-pink-50'
    }`}>
      <GeometricBg />

      <div className={`sticky top-0 z-20 backdrop-blur-xl transition-all duration-300 ${
        darkMode
          ? 'bg-gray-900/80 border-b border-gray-800/50 shadow-xl shadow-purple-500/5'
          : 'bg-white/80 border-b border-gray-200/50 shadow-md'
      }`}>
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold transition-all ${
                darkMode
                  ? 'bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'
              }`}>
                DualTrack OS
              </h1>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Your Life Operating System</p>
            </div>

            {/* Clock / Pomodoro Timer Toggle */}
            <div className="text-right">
              {!isPomodoroMode ? (
                // Clock Mode
                <div onClick={togglePomodoroMode} className="cursor-pointer group">
                  <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} group-hover:${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className={`font-mono text-lg font-bold flex items-center space-x-1 ${
                    darkMode
                      ? 'bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent'
                      : 'text-purple-600'
                  }`}>
                    <Clock size={16} className={darkMode ? 'text-cyan-400' : 'text-purple-600'} />
                    <span>{currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                    Click for Focus Mode
                  </div>
                </div>
              ) : (
                // Pomodoro Mode
                <div className="space-y-1">
                  <div className={`font-mono text-2xl font-bold ${
                    darkMode
                      ? pomodoroRunning
                        ? 'bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent'
                        : 'text-gray-400'
                      : pomodoroRunning ? 'text-orange-600' : 'text-gray-400'
                  }`}>
                    {formatTime(pomodoroSeconds)}
                  </div>
                  <div className="flex items-center space-x-2">
                    {!pomodoroRunning ? (
                      <button onClick={startPomodoro} className={`p-1 rounded ${darkMode ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400' : 'bg-green-100 hover:bg-green-200 text-green-600'}`}>
                        <Play size={14} />
                      </button>
                    ) : (
                      <button onClick={pausePomodoro} className={`p-1 rounded ${darkMode ? 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-400' : 'bg-orange-100 hover:bg-orange-200 text-orange-600'}`}>
                        <Pause size={14} />
                      </button>
                    )}
                    <button onClick={resetPomodoro} className={`p-1 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'}`}>
                      <RotateCcw size={14} />
                    </button>
                    <button onClick={togglePomodoroMode} className={`p-1 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'}`}>
                      <X size={14} />
                    </button>
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-500'}`}>
                    {pomodoroRunning ? '20-min Focus' : 'Paused'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto px-4 py-6">
        {currentView === 'dashboard' && (
          <div className="space-y-4 pb-24 relative z-10">
            <div className={`rounded-2xl p-6 shadow-2xl transition-all duration-300 ${
              darkMode
                ? 'bg-gradient-to-r from-purple-900/50 via-pink-900/50 to-purple-900/50 border-2 border-purple-500/30 backdrop-blur-xl'
                : 'bg-gradient-to-r from-purple-600 to-pink-600'
            }`}>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <div className={`text-sm ${darkMode ? 'text-purple-300' : 'opacity-90 text-white'}`}>TODAY'S SCORE</div>
                  <div className={`text-5xl font-bold ${darkMode ? 'bg-gradient-to-r from-cyan-300 to-pink-400 bg-clip-text text-transparent' : 'text-white'}`}>{dailyScore}/100</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm ${darkMode ? 'text-purple-300' : 'opacity-90 text-white'}`}>STREAK</div>
                  <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-white'}`}>🔥 {streak}</div>
                </div>
              </div>
              <div className={`mt-4 rounded-full h-3 overflow-hidden ${darkMode ? 'bg-gray-800/50' : 'bg-white/20'}`}>
                <div className={`h-full rounded-full transition-all duration-500 ${
                  darkMode
                    ? 'bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500'
                    : 'bg-white'
                }`} style={{ width: `${dailyScore}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className={`rounded-xl p-4 transition-all duration-300 ${
                darkMode
                  ? 'bg-gray-800/50 border-2 border-gray-700/50 shadow-lg shadow-yellow-500/5 backdrop-blur-sm'
                  : 'bg-white border-2 border-gray-100 shadow-md'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <Zap className={darkMode ? 'text-yellow-400' : 'text-yellow-500'} size={24} />
                  <span className={`text-2xl font-bold ${darkMode ? 'bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent' : 'text-gray-900'}`}>{energyLevel}/10</span>
                </div>
                <div className={`text-xs uppercase ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>Energy Level</div>
              </div>
              <div className={`rounded-xl p-4 transition-all duration-300 ${
                darkMode
                  ? 'bg-gray-800/50 border-2 border-gray-700/50 shadow-lg shadow-emerald-500/5 backdrop-blur-sm'
                  : 'bg-white border-2 border-gray-100 shadow-md'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-4 h-4 rounded-full ${alertLevel === 'green' ? (darkMode ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' : 'bg-green-500') : 'bg-gray-300'}`} />
                  <AlertTriangle className={darkMode ? 'text-gray-600' : 'text-gray-400'} size={20} />
                </div>
                <div className={`text-xs uppercase ${darkMode ? (alertLevel === 'green' ? 'text-emerald-400' : 'text-gray-500') : 'text-gray-600'}`}>
                  {alertLevel === 'green' ? 'Thriving' : 'Monitor'}
                </div>
              </div>
            </div>

            <div className={`rounded-xl p-6 transition-all duration-300 ${
              darkMode
                ? 'bg-gray-800/50 border-2 border-gray-700/50 shadow-lg backdrop-blur-sm'
                : 'bg-white border-2 border-gray-100 shadow-md'
            }`}>
              <h3 className={`text-lg font-bold mb-4 flex items-center ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                <Heart className={`mr-2 ${darkMode ? 'text-rose-400' : 'text-red-500'}`} size={20} />
                Daily Non-Negotiables
              </h3>
              <div className="space-y-3">
                <NDMItem icon="🥗" label="Protein Breakfast" completed={ndm.nutrition} onClick={() => toggleNDM('nutrition')} />
                <NDMItem icon="⚡" label="HIIT Burst" completed={ndm.movement} onClick={() => toggleNDM('movement')} />
                <NDMItem icon="🧘" label="Mindful Moment" completed={ndm.mindfulness} onClick={() => toggleNDM('mindfulness')} />
                <NDMItem icon="🧠" label="Brain Dump" completed={ndm.brainDump} onClick={() => toggleNDM('brainDump')} />
              </div>
            </div>
            
            <div className={`rounded-xl p-6 transition-all duration-300 ${
              darkMode
                ? 'bg-gray-800/50 border-2 border-gray-700/50 shadow-lg backdrop-blur-sm'
                : 'bg-white border-2 border-gray-100 shadow-md'
            }`}>
              <h3 className={`text-lg font-bold mb-4 flex items-center justify-between ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                <div className="flex items-center">
                  <Briefcase className={`mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} size={20} />
                  Career Progress
                </div>
                <button onClick={addCareerSection} className={`p-1 rounded ${darkMode ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400' : 'bg-blue-50 hover:bg-blue-100 text-blue-600'}`}>
                  <Plus size={16} />
                </button>
              </h3>
              <div className="space-y-4">
                {careerSections.map((section, idx) => (
                  <div key={section.id}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center space-x-2 flex-1">
                        <input
                          type="text"
                          value={section.label}
                          onChange={(e) => updateCareerSectionLabel(section.id, e.target.value)}
                          className={`text-sm font-semibold bg-transparent border-b-2 border-transparent focus:border-blue-500/50 outline-none ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        />
                        {careerSections.length > 1 && (
                          <button onClick={() => deleteCareerSection(section.id)} className={darkMode ? 'text-gray-600 hover:text-red-400' : 'text-gray-400 hover:text-red-600'}>
                            <X size={14} />
                          </button>
                        )}
                      </div>
                      <span className={`text-lg font-bold ${
                        idx % 3 === 0
                          ? darkMode ? 'bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent' : 'text-blue-600'
                          : idx % 3 === 1
                            ? darkMode ? 'bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent' : 'text-purple-600'
                            : darkMode ? 'bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent' : 'text-green-600'
                      }`}>
                        {section.wins} wins
                      </span>
                    </div>
                    <button onClick={() => addCareerSectionWin(section.id)} className={`w-full py-2 rounded-lg text-sm font-medium transition-all ${
                      idx % 3 === 0
                        ? darkMode
                          ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-2 border-blue-500/30'
                          : 'bg-blue-50 hover:bg-blue-100 text-blue-700'
                        : idx % 3 === 1
                          ? darkMode
                            ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border-2 border-purple-500/30'
                            : 'bg-purple-50 hover:bg-purple-100 text-purple-700'
                          : darkMode
                            ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/30'
                            : 'bg-green-50 hover:bg-green-100 text-green-700'
                    }`}>
                      + Log Win
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-xl p-6 transition-all duration-300 ${
              darkMode
                ? 'bg-gradient-to-r from-gray-900/80 to-gray-800/80 border-2 border-gray-700/50 backdrop-blur-sm shadow-xl'
                : 'bg-gradient-to-r from-gray-900 to-gray-700'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Apple size={24} className="text-white" />
                  <div>
                    <div className="font-bold text-white">Apple Health</div>
                    <div className={`text-xs ${darkMode ? 'text-emerald-400' : 'text-white opacity-75'}`}>Connected</div>
                  </div>
                </div>
                <Check size={24} className={darkMode ? 'text-emerald-400' : 'text-green-400'} />
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
          <div className="space-y-4 pb-24 relative z-10">
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
          <div className="space-y-6 pb-24 relative z-10">
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
          <div className="space-y-4 pb-24 relative z-10">
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
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  capture="environment"
                  className={`w-full px-4 py-3 rounded-lg transition-all ${
                    darkMode
                      ? 'bg-gray-900/50 border-2 border-gray-700 text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white file:cursor-pointer'
                      : 'bg-gray-50 border-2 border-gray-200 text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white file:cursor-pointer'
                  }`}
                />
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
          <div className="space-y-4 pb-24 relative z-10">
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
                    Version 1.0.0 • Made with 💜 for perimenopausal warriors
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'plan' && (
          <div className="space-y-4 pb-24 relative z-10">
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
          <div className="space-y-4 pb-24 relative z-10">
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
          ? 'bg-gray-900/80 border-t border-gray-800/50 shadow-xl shadow-purple-500/5'
          : 'bg-white/80 border-t border-gray-200/50 shadow-lg'
      }`}>
        <div className="max-w-2xl mx-auto px-2 py-2">
          <div className="grid grid-cols-6 gap-1">
            <NavButton icon={<Brain size={18} />} label="Home" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} />
            <NavButton icon={<Calendar size={18} />} label="Plan" active={currentView === 'plan'} onClick={() => setCurrentView('plan')} />
            <NavButton icon={<Zap size={18} />} label="Exercise" active={currentView === 'exercise'} onClick={() => setCurrentView('exercise')} />
            <NavButton icon={<Utensils size={18} />} label="Food" active={currentView === 'food'} onClick={() => setCurrentView('food')} />
            <NavButton icon={<BookOpen size={18} />} label="Library" active={currentView === 'library'} onClick={() => setCurrentView('library')} />
            <NavButton icon={<BarChart3 size={18} />} label="Insights" active={currentView === 'insights'} onClick={() => setCurrentView('insights')} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DualTrackOS;