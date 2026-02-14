import React, { useState, useEffect } from 'react';
import { Check, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import useStore from '../store/useStore';

/**
 * Daily Protocols Widget
 * Rotates through different protocol sets each day, resetting automatically.
 * Day 1 = foundational setup, Day 2+ = rotating daily habits.
 */

const PROTOCOL_SETS = [
  {
    day: 1,
    title: 'Day 1 Protocols',
    subtitle: 'Foundation Setup',
    items: [
      { key: 'bmr', label: 'Calculate BMR & TDEE', subtext: 'Know your baseline numbers.' },
      { key: 'protein', label: 'Commit to 135g Protein Floor', subtext: 'Non-negotiable for muscle retention.' },
      { key: 'creatine', label: 'Buy Creatine Monohydrate', subtext: '5g daily for brain & body power.' },
    ],
  },
  {
    day: 2,
    title: 'Day 2 Protocols',
    subtitle: 'Movement & Mindset',
    items: [
      { key: 'walk', label: '10-min Morning Walk', subtext: 'Cortisol regulation + circadian reset.' },
      { key: 'water', label: 'Drink 500ml Water Before Coffee', subtext: 'Rehydrate after sleep.' },
      { key: 'journal', label: '5-min Brain Dump Journal', subtext: 'Clear mental clutter before the day.' },
    ],
  },
  {
    day: 3,
    title: 'Day 3 Protocols',
    subtitle: 'Nutrition Focus',
    items: [
      { key: 'meal_prep', label: 'Prep 2 High-Protein Meals', subtext: 'Reduce decision fatigue later.' },
      { key: 'supplements', label: 'Take Supplements (Creatine, Mg, D3)', subtext: 'Stack your essentials.' },
      { key: 'no_sugar', label: 'No Added Sugar Before Noon', subtext: 'Stable glucose = stable energy.' },
    ],
  },
  {
    day: 4,
    title: 'Day 4 Protocols',
    subtitle: 'Recovery & Resilience',
    items: [
      { key: 'stretch', label: '10-min Fascia Stretch / Yoga', subtext: 'Mobility is longevity.' },
      { key: 'sleep_prep', label: 'Set Phone to DND by 9pm', subtext: 'Protect sleep architecture.' },
      { key: 'gratitude', label: 'Write 3 Gratitude Items', subtext: 'Rewire your brain for positivity.' },
    ],
  },
  {
    day: 5,
    title: 'Day 5 Protocols',
    subtitle: 'Strength & Power',
    items: [
      { key: 'lift', label: 'Resistance Training Session', subtext: 'Build muscle, protect bones.' },
      { key: 'protein_hit', label: 'Hit 135g Protein Target', subtext: 'Track and close the gap.' },
      { key: 'cold', label: '30-sec Cold Water Finish (Shower)', subtext: 'Dopamine + resilience training.' },
    ],
  },
  {
    day: 6,
    title: 'Day 6 Protocols',
    subtitle: 'Social & Mental Load',
    items: [
      { key: 'delegate', label: 'Delegate or Drop 1 Task', subtext: 'Reduce invisible mental load.' },
      { key: 'connect', label: 'Reach Out to 1 Friend', subtext: 'Social connection = health.' },
      { key: 'boundary', label: 'Set 1 Boundary Today', subtext: 'Protect your energy for what matters.' },
    ],
  },
  {
    day: 7,
    title: 'Day 7 Protocols',
    subtitle: 'Reflect & Reset',
    items: [
      { key: 'review', label: 'Review This Week\'s Wins', subtext: 'Celebrate progress, not perfection.' },
      { key: 'plan', label: 'Plan 3 Priorities for Next Week', subtext: 'Clarity reduces anxiety.' },
      { key: 'rest', label: 'Take 1 Hour of True Rest', subtext: 'No screens, no productivity. Just be.' },
    ],
  },
];

const getTodayKey = () => new Date().toISOString().split('T')[0];

const getDayNumber = () => {
  const stored = localStorage.getItem('dailyProtocols_startDate');
  if (!stored) {
    localStorage.setItem('dailyProtocols_startDate', getTodayKey());
    return 1;
  }
  const start = new Date(stored);
  const today = new Date(getTodayKey());
  const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  return (diff % PROTOCOL_SETS.length) + 1;
};

const DayOneChecklist = () => {
  const darkMode = useStore((state) => state.darkMode);
  const [dayNumber, setDayNumber] = useState(getDayNumber);
  const [showPrevious, setShowPrevious] = useState(false);

  const protocolSet = PROTOCOL_SETS[(dayNumber - 1) % PROTOCOL_SETS.length];

  // Build initial checklist from protocol items
  const buildChecklist = (items) => {
    const obj = {};
    items.forEach((item) => { obj[item.key] = false; });
    return obj;
  };

  const [checklist, setChecklist] = useState(() => {
    const savedDate = localStorage.getItem('dailyProtocols_date');
    const today = getTodayKey();
    if (savedDate === today) {
      const saved = localStorage.getItem('dailyProtocols_checklist');
      if (saved) {
        try { return JSON.parse(saved); } catch { /* fall through */ }
      }
    }
    return buildChecklist(protocolSet.items);
  });

  // Reset checklist when date changes
  useEffect(() => {
    const interval = setInterval(() => {
      const currentDay = getDayNumber();
      if (currentDay !== dayNumber) {
        setDayNumber(currentDay);
        const newSet = PROTOCOL_SETS[(currentDay - 1) % PROTOCOL_SETS.length];
        setChecklist(buildChecklist(newSet.items));
        localStorage.setItem('dailyProtocols_date', getTodayKey());
      }
    }, 60000); // check every minute
    return () => clearInterval(interval);
  }, [dayNumber]);

  // Persist checklist
  useEffect(() => {
    localStorage.setItem('dailyProtocols_checklist', JSON.stringify(checklist));
    localStorage.setItem('dailyProtocols_date', getTodayKey());
  }, [checklist]);

  const toggleItem = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isComplete = Object.values(checklist).every(Boolean);

  return (
    <div className={`rounded-3xl p-6 mb-6 transition-all ${darkMode
      ? 'bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30'
      : 'bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className={darkMode ? 'text-indigo-400' : 'text-indigo-600'} size={24} />
          <div>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {protocolSet.title}
            </h3>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {protocolSet.subtitle}
            </p>
          </div>
        </div>
        {isComplete && (
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${darkMode
            ? 'bg-green-500/20 text-green-400'
            : 'bg-green-100 text-green-700'
          }`}>
            ALL SYSTEMS GO
          </span>
        )}
      </div>

      <div className="space-y-3">
        {protocolSet.items.map((item) => (
          <CheckItem
            key={item.key}
            checked={!!checklist[item.key]}
            onClick={() => toggleItem(item.key)}
            label={item.label}
            subtext={item.subtext}
            darkMode={darkMode}
          />
        ))}
      </div>

      {/* Show upcoming protocols */}
      <button
        onClick={() => setShowPrevious(!showPrevious)}
        className={`mt-4 flex items-center gap-2 text-xs font-medium transition-all ${darkMode
          ? 'text-indigo-400 hover:text-indigo-300'
          : 'text-indigo-600 hover:text-indigo-700'
        }`}
      >
        {showPrevious ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {showPrevious ? 'Hide' : 'View'} upcoming protocols
      </button>

      {showPrevious && (
        <div className={`mt-3 p-3 rounded-xl space-y-2 ${darkMode
          ? 'bg-gray-800/50 border border-gray-700'
          : 'bg-white/60 border border-gray-200'
        }`}>
          {PROTOCOL_SETS.filter((_, i) => i !== (dayNumber - 1) % PROTOCOL_SETS.length).map((set) => (
            <div key={set.day} className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
              <p className={`text-xs font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {set.title} — {set.subtitle}
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {set.items.map((i) => i.label).join(' • ')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CheckItem = ({ checked, onClick, label, subtext, darkMode }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${checked
      ? darkMode ? 'bg-indigo-500/20 border border-indigo-500/50' : 'bg-indigo-100 border border-indigo-200'
      : darkMode ? 'bg-gray-800/50 border border-gray-700 hover:bg-gray-800' : 'bg-white border border-gray-200 hover:bg-gray-50'
    }`}
  >
    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${checked
      ? 'bg-indigo-500 border-indigo-500'
      : darkMode ? 'border-gray-500' : 'border-gray-300'
    }`}>
      {checked && <Check size={14} className="text-white" />}
    </div>
    <div className="text-left">
      <p className={`font-semibold ${checked
        ? darkMode ? 'text-indigo-300 line-through' : 'text-indigo-800 line-through'
        : darkMode ? 'text-gray-200' : 'text-gray-800'
      }`}>
        {label}
      </p>
      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        {subtext}
      </p>
    </div>
  </button>
);

export default DayOneChecklist;
