import React, { useState, useEffect } from 'react';
import { Zap, Brain, Heart, Briefcase, Check, Mic, Play, Pause, RotateCcw, Utensils, BarChart3, Apple, Plus, Award, Activity, AlertTriangle, Download, Trash2, Settings } from 'lucide-react';

const DualTrackOS = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [dailyScore, setDailyScore] = useState(0);
  const [streak] = useState(12);
  const [energyLevel] = useState(7);
  const [isRecording, setIsRecording] = useState(false);

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
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dualtrack-data', JSON.stringify({ ndm, careers, meals, workouts, proteinToday }));
  }, [ndm, careers, meals, workouts, proteinToday]);

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

  const NDMItem = ({ icon, label, completed, onClick }) => (
    <div onClick={onClick} className={`flex items-center justify-between p-4 rounded-lg cursor-pointer ${completed ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50 border-2 border-gray-200'}`}>
      <div className="flex items-center space-x-3"><span className="text-2xl">{icon}</span><span className={`font-medium ${completed ? 'text-green-700' : 'text-gray-700'}`}>{label}</span></div>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${completed ? 'bg-green-500' : 'bg-gray-300'}`}>{completed && <Check className="text-white" size={20} />}</div>
    </div>
  );

  const VitalRow = ({ label, value, trend }) => (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center space-x-2">
        <span className="font-semibold">{value}</span>
        <span className={`text-lg ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-400'}`}>{trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}</span>
      </div>
    </div>
  );

  const WorkoutCard = ({ emoji, name, duration, intensity, description, onClick }) => (
    <div onClick={onClick} className="bg-white rounded-xl p-4 shadow-md border-2 border-gray-100 cursor-pointer hover:border-orange-300 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3"><span className="text-3xl">{emoji}</span><div><div className="font-bold">{name}</div><div className="text-xs text-gray-500">{description}</div></div></div>
        <div className="text-right"><div className="text-sm font-semibold text-orange-600">{duration}</div><div className="text-xs text-gray-500">{intensity}</div></div>
      </div>
    </div>
  );

  const QuickMealButton = ({ emoji, name, protein, onClick }) => (
    <button onClick={() => onClick(name, protein)} className="bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-lg p-3 text-left">
      <div className="text-2xl mb-1">{emoji}</div><div className="text-xs font-semibold text-gray-700">{name}</div><div className="text-xs text-green-600 font-bold">{protein}g protein</div>
    </button>
  );

  const StatRow = ({ label, value, color }) => (
    <div className="flex justify-between items-center"><span className="text-sm text-gray-600">{label}</span><span className={`font-bold ${color}`}>{value}</span></div>
  );

  const NavButton = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`flex flex-col items-center space-y-1 ${active ? 'text-purple-600' : 'text-gray-400'}`}>{icon}<span className="text-xs font-medium">{label}</span></button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div><h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">DualTrack OS</h1><p className="text-xs text-gray-500">Your Life Operating System</p></div>
            <div className="text-right text-xs text-gray-500"><div>Dec 12, 2024</div><div className="font-semibold text-purple-600">Day {streak} 🔥</div></div>
          </div>
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto px-4 py-6">
        {currentView === 'dashboard' && (
          <div className="space-y-4 pb-24">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex justify-between items-center mb-2">
                <div><div className="text-sm opacity-90">TODAY'S SCORE</div><div className="text-5xl font-bold">{dailyScore}/100</div></div>
                <div className="text-right"><div className="text-sm opacity-90">STREAK</div><div className="text-3xl font-bold">🔥 {streak}</div></div>
              </div>
              <div className="mt-4 bg-white/20 rounded-full h-3 overflow-hidden"><div className="bg-white h-full rounded-full" style={{ width: `${dailyScore}%` }} /></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-md border-2 border-gray-100">
                <div className="flex items-center justify-between mb-2"><Zap className="text-yellow-500" size={24} /><span className="text-2xl font-bold">{energyLevel}/10</span></div>
                <div className="text-xs text-gray-600 uppercase">Energy Level</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md border-2 border-gray-100">
                <div className="flex items-center justify-between mb-2"><div className={`w-4 h-4 rounded-full ${alertLevel === 'green' ? 'bg-green-500' : 'bg-gray-300'}`} /><AlertTriangle className="text-gray-400" size={20} /></div>
                <div className="text-xs text-gray-600 uppercase">{alertLevel === 'green' ? 'Thriving' : 'Monitor'}</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-100">
              <h3 className="text-lg font-bold mb-4 flex items-center"><Heart className="mr-2 text-red-500" size={20} />Daily Non-Negotiables</h3>
              <div className="space-y-3">
                <NDMItem icon="🥗" label="Protein Breakfast" completed={ndm.nutrition} onClick={() => toggleNDM('nutrition')} />
                <NDMItem icon="⚡" label="HIIT Burst" completed={ndm.movement} onClick={() => toggleNDM('movement')} />
                <NDMItem icon="🧘" label="Mindful Moment" completed={ndm.mindfulness} onClick={() => toggleNDM('mindfulness')} />
                <NDMItem icon="🧠" label="Brain Dump" completed={ndm.brainDump} onClick={() => toggleNDM('brainDump')} />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-100">
              <h3 className="text-lg font-bold mb-4 flex items-center"><Briefcase className="mr-2 text-blue-500" size={20} />Career Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2"><span className="text-sm font-semibold text-gray-700">Corporate</span><span className="text-lg font-bold text-blue-600">{careers.corporate.wins} wins</span></div>
                  <button onClick={() => addCareerWin('corporate')} className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-lg text-sm font-medium">+ Log Win</button>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2"><span className="text-sm font-semibold text-gray-700">Consultancy</span><span className="text-lg font-bold text-purple-600">{careers.consultancy.wins} wins</span></div>
                  <button onClick={() => addCareerWin('consultancy')} className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 py-2 rounded-lg text-sm font-medium">+ Log Win</button>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-xl p-6 shadow-md text-white">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3"><Apple size={24} /><div><div className="font-bold">Apple Health</div><div className="text-xs opacity-75">Connected</div></div></div>
                <Check size={24} className="text-green-400" />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><div className="opacity-75">Steps Today</div><div className="font-bold text-lg">{vitals.steps.value.toLocaleString()}</div></div>
                <div><div className="opacity-75">Active Cal</div><div className="font-bold text-lg">{vitals.activeCalories.value}</div></div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-100">
              <h3 className="text-lg font-bold mb-4 flex items-center"><Activity className="mr-2 text-green-500" size={20} />Health Vitals</h3>
              <div className="space-y-3">
                <VitalRow label="Sleep" value={`${vitals.sleep.hours} hrs`} trend={vitals.sleep.trend} />
                <VitalRow label="HRV" value={`${vitals.hrv.value} ms`} trend={vitals.hrv.trend} />
                <VitalRow label="Resting HR" value={`${vitals.rhr.value} bpm`} trend={vitals.rhr.trend} />
              </div>
            </div>
            
            <button onClick={handleVoiceCheckin} className={`w-full py-6 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center space-x-3 ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'}`}>
              <Mic size={28} /><span>{isRecording ? 'RECORDING...' : 'VOICE CHECK-IN'}</span>
            </button>
          </div>
        )}
        
        {currentView === 'exercise' && (
          <div className="space-y-4 pb-24">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg">
              <h2 className="text-2xl font-bold mb-2">Exercise Library</h2>
              <p className="text-sm opacity-90">HIIT bursts optimized for you</p>
            </div>
            {workouts.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-md border-2 border-green-100">
                <h3 className="font-bold mb-3 text-green-700">Completed Today ({workouts.length})</h3>
                {workouts.slice(-3).map(w => (
                  <div key={w.id} className="flex justify-between py-2 border-b last:border-0"><span className="text-sm">{w.name}</span><span className="text-xs text-gray-500">{formatTime(w.duration)}</span></div>
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
          <div className="space-y-6 pb-24">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 text-white shadow-lg text-center">
              <h2 className="text-3xl font-bold mb-2">{activeWorkout?.name}</h2>
              <div className="text-6xl font-bold my-6">{formatTime(workoutTimer)}</div>
              <div className="flex justify-center space-x-4">
                {isWorkoutRunning ? (
                  <button onClick={() => setIsWorkoutRunning(false)} className="bg-white text-red-600 px-8 py-3 rounded-full font-bold flex items-center space-x-2"><Pause size={20} /><span>PAUSE</span></button>
                ) : (
                  <button onClick={() => setIsWorkoutRunning(true)} className="bg-white text-red-600 px-8 py-3 rounded-full font-bold flex items-center space-x-2"><Play size={20} /><span>RESUME</span></button>
                )}
                <button onClick={() => setWorkoutTimer(0)} className="bg-white/20 text-white px-6 py-3 rounded-full font-bold"><RotateCcw size={20} /></button>
              </div>
            </div>
            <button onClick={completeWorkout} className="w-full bg-green-500 text-white py-4 rounded-xl font-bold text-lg">✓ COMPLETE WORKOUT</button>
            <button onClick={() => { setActiveWorkout(null); setIsWorkoutRunning(false); setWorkoutTimer(0); setCurrentView('exercise'); }} className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-medium">Cancel</button>
          </div>
        )}
        
        {currentView === 'food' && (
          <div className="space-y-4 pb-24">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
              <h2 className="text-2xl font-bold mb-2">Nutrition Tracking</h2>
              <div className="flex justify-between items-end">
                <div><div className="text-sm opacity-90">Protein Today</div><div className="text-4xl font-bold">{proteinToday}g</div></div>
                <div className="text-right"><div className="text-sm opacity-90">Target: 120g</div><div className="text-2xl font-bold">{Math.round((proteinToday / 120) * 100)}%</div></div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-100">
              <h3 className="font-bold mb-4 flex items-center"><Plus className="mr-2 text-green-500" size={20} />Quick Add Meals</h3>
              <div className="grid grid-cols-2 gap-3">
                <QuickMealButton emoji="🍳" name="Eggs + Avocado" protein={25} onClick={addMeal} />
                <QuickMealButton emoji="🥗" name="Chicken Salad" protein={35} onClick={addMeal} />
                <QuickMealButton emoji="🥤" name="Protein Shake" protein={30} onClick={addMeal} />
                <QuickMealButton emoji="🐟" name="Salmon + Veggies" protein={40} onClick={addMeal} />
              </div>
            </div>
            {meals.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-100">
                <h3 className="font-bold mb-4">Today's Meals</h3>
                {meals.map(m => (
                  <div key={m.id} className="flex justify-between py-2 border-b last:border-0"><div><div className="font-medium">{m.name}</div><div className="text-xs text-gray-500">{m.time}</div></div><div className="text-green-600 font-bold">{m.protein}g</div></div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {currentView === 'insights' && (
          <div className="space-y-4 pb-24">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
              <h2 className="text-2xl font-bold mb-2">Weekly Intelligence</h2>
              <p className="text-sm opacity-90">Your patterns & progress</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-100">
              <h3 className="font-bold mb-4 flex items-center"><Award className="mr-2 text-yellow-500" size={20} />This Week's Wins</h3>
              <div className="space-y-4">
                <StatRow label="NDM Completion" value={`${weeklyData.ndmStreak}/7 days`} color="text-green-600" />
                <StatRow label="Avg Energy" value={`${weeklyData.avgEnergy}/10`} color="text-blue-600" />
                <StatRow label="Avg Sleep" value={`${weeklyData.avgSleep} hrs`} color="text-purple-600" />
                <StatRow label="Workouts" value={`${weeklyData.workoutCount} sessions`} color="text-orange-600" />
                <StatRow label="Corporate Wins" value={weeklyData.corporateWins} color="text-blue-600" />
                <StatRow label="Consultancy Wins" value={weeklyData.consultancyWins} color="text-purple-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-100">
              <h3 className="font-bold mb-4 flex items-center"><Settings className="mr-2 text-gray-600" size={20} />Settings & Data</h3>
              <div className="space-y-3">
                <button onClick={exportData} className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-3 rounded-lg font-medium flex items-center justify-center space-x-2">
                  <Download size={20} />
                  <span>Export All Data</span>
                </button>
                <button onClick={resetData} className="w-full bg-red-50 hover:bg-red-100 text-red-700 py-3 rounded-lg font-medium flex items-center justify-center space-x-2">
                  <Trash2 size={20} />
                  <span>Reset All Data</span>
                </button>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">Version 1.0.0 • Made with 💜 for perimenopausal warriors</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
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