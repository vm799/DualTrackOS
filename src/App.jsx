import React, { useState, useEffect } from 'react';
import { Zap, Brain, Heart, Briefcase, Check, Mic, Play, Pause, RotateCcw, Utensils, BarChart3, Apple, Plus, Award, Activity, AlertTriangle, Download, Trash2, Settings } from 'lucide-react';

const DualTrackOS = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [dailyScore, setDailyScore] = useState(0);
  const [streak] = useState(12);
  const [energyLevel] = useState(7);
  const [isRecording, setIsRecording] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const [ndm, setNdm] = useState({ nutrition: false, movement: false, mindfulness: false, brainDump: false });
  const [careers, setCareers] = useState({ corporate: { wins: 0 }, consultancy: { wins: 0 } });
  const [vitals] = useState({
    sleep: { hours: 7.2, trend: 'up' },
    hrv: { value: 48, trend: 'stable' },
    rhr: { value: 61, trend: 'down' },
    steps: { value: 8234 },
    activeCalories: { value: 342 }
  });
  const [alertLevel] = useState('green');
  const [meals, setMeals] = useState([]);
  const [proteinToday, setProteinToday] = useState(0);
  const [workouts, setWorkouts] = useState([]);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isWorkoutRunning, setIsWorkoutRunning] = useState(false);
  const [weeklyData] = useState({ ndmStreak: 6, avgEnergy: 7.2, avgSleep: 7.1, workoutCount: 5, corporateWins: 12, consultancyWins: 8 });

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
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dualtrack-data', JSON.stringify({ ndm, careers, meals, workouts, proteinToday, darkMode }));
  }, [ndm, careers, meals, workouts, proteinToday, darkMode]);

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
  const addCareerWin = (type) => setCareers(p => ({ ...p, [type]: { wins: p[type].wins + 1 } }));
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
  const handleVoiceCheckin = () => { setIsRecording(true); setTimeout(() => { setIsRecording(false); alert('Voice captured!'); }, 2000); };

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
            <div className="text-right text-xs">
              <div className={darkMode ? 'text-gray-500' : 'text-gray-500'}>Dec 12, 2024</div>
              <div className={`font-semibold ${
                darkMode
                  ? 'bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent'
                  : 'text-purple-600'
              }`}>
                Day {streak} 🔥
              </div>
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
              <h3 className={`text-lg font-bold mb-4 flex items-center ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                <Briefcase className={`mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} size={20} />
                Career Progress
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Corporate</span>
                    <span className={`text-lg font-bold ${darkMode ? 'bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent' : 'text-blue-600'}`}>{careers.corporate.wins} wins</span>
                  </div>
                  <button onClick={() => addCareerWin('corporate')} className={`w-full py-2 rounded-lg text-sm font-medium transition-all ${
                    darkMode
                      ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-2 border-blue-500/30'
                      : 'bg-blue-50 hover:bg-blue-100 text-blue-700'
                  }`}>
                    + Log Win
                  </button>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Consultancy</span>
                    <span className={`text-lg font-bold ${darkMode ? 'bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent' : 'text-purple-600'}`}>{careers.consultancy.wins} wins</span>
                  </div>
                  <button onClick={() => addCareerWin('consultancy')} className={`w-full py-2 rounded-lg text-sm font-medium transition-all ${
                    darkMode
                      ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border-2 border-purple-500/30'
                      : 'bg-purple-50 hover:bg-purple-100 text-purple-700'
                  }`}>
                    + Log Win
                  </button>
                </div>
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
              <span>{isRecording ? 'RECORDING...' : 'VOICE CHECK-IN'}</span>
            </button>
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
      </div>
      
      <div className={`fixed bottom-0 left-0 right-0 z-20 backdrop-blur-xl transition-all duration-300 ${
        darkMode
          ? 'bg-gray-900/80 border-t border-gray-800/50 shadow-xl shadow-purple-500/5'
          : 'bg-white/80 border-t border-gray-200/50 shadow-lg'
      }`}>
        <div className="max-w-2xl mx-auto px-2 py-2">
          <div className="flex justify-around">
            <NavButton icon={<Brain size={20} />} label="Home" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} />
            <NavButton icon={<Zap size={20} />} label="Exercise" active={currentView === 'exercise'} onClick={() => setCurrentView('exercise')} />
            <NavButton icon={<Utensils size={20} />} label="Food" active={currentView === 'food'} onClick={() => setCurrentView('food')} />
            <NavButton icon={<BarChart3 size={20} />} label="Insights" active={currentView === 'insights'} onClick={() => setCurrentView('insights')} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DualTrackOS;