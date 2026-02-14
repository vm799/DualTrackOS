import React, { useState, useEffect } from 'react';
import { Check, Zap } from 'lucide-react';
import useStore from '../store/useStore';
import InfoTooltip from './InfoTooltip';

const movements = [
    { id: 'bounce', label: 'Bouncing / Lymph', icon: '🐰', desc: '5 mins soft bouncing' },
    { id: 'fascia', label: 'Fascia Stretch', icon: '🧘‍♀️', desc: 'Deep tissue release' },
    { id: 'animal', label: 'Animal Moves', icon: '🦍', desc: 'Bear/Gorilla walks' },
    { id: 'dance', label: 'Dance Break', icon: '💃', desc: '1 song full out' },
];

const NonZeroDayWidget = () => {
    const darkMode = useStore((state) => state.darkMode);
    const [completed, setCompleted] = useState({});

    // Load state from local storage on mount (simple persistence for now)
    useEffect(() => {
        const todayKey = `nzd-${new Date().toDateString()}`;
        const saved = localStorage.getItem(todayKey);
        if (saved) {
            setCompleted(JSON.parse(saved));
        }
    }, []);

    const toggleMovement = (id) => {
        const newCompleted = { ...completed, [id]: !completed[id] };
        setCompleted(newCompleted);

        const todayKey = `nzd-${new Date().toDateString()}`;
        localStorage.setItem(todayKey, JSON.stringify(newCompleted));
    };

    const allDone = movements.every(m => completed[m.id]);

    return (
        <div className={`p-5 rounded-2xl relative transition-all duration-300 ${darkMode ? 'bg-gray-800/60 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'
            }`}>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className={`font-bold text-lg flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        <Zap className="text-yellow-400" size={20} fill="currentColor" />
                        Non-Zero Day
                        <InfoTooltip
                            title="What is a Non-Zero Day?"
                            text="A Non-Zero Day means you did at least ONE thing to move your body today. It's not about intensity or burning calories — it's about keeping your fascia (connective tissue) hydrated and mobile. Even 5 minutes of bouncing or stretching counts. The goal is consistency over perfection: never let a day pass with zero movement."
                            darkMode={darkMode}
                            dismissKey="nzd-explain"
                            size={14}
                        />
                    </h3>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Keep the fascia juicy!
                        <InfoTooltip
                            title="What is Fascia?"
                            text="Fascia is the connective tissue that wraps around every muscle, bone, and organ in your body like a web. When you don't move, fascia gets stiff and 'dried out', leading to pain, poor posture, and restricted movement. Regular gentle movement keeps fascia hydrated ('juicy') and supple — think of it like keeping a sponge moist vs letting it dry out and crack."
                            darkMode={darkMode}
                            dismissKey="fascia-explain"
                            size={12}
                        />
                    </p>
                </div>

                {allDone && (
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30">
                        🔥 Streak!
                    </span>
                )}
            </div>

            <div className="space-y-3">
                {movements.map((move) => (
                    <button
                        key={move.id}
                        onClick={() => toggleMovement(move.id)}
                        className={`w-full text-left p-3 rounded-xl flex items-center justify-between transition-all group ${completed[move.id]
                                ? darkMode ? 'bg-green-900/20 border-green-500/30' : 'bg-green-50 border-green-200'
                                : darkMode ? 'bg-gray-700/30 hover:bg-gray-700/50' : 'bg-gray-50 hover:bg-gray-100'
                            } border ${darkMode ? 'border-transparent' : 'border-transparent'}`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${completed[move.id] ? 'grayscale-0' : 'grayscale opacity-70'
                                } bg-white/10`}>
                                {move.icon}
                            </div>
                            <div>
                                <p className={`font-semibold text-sm ${completed[move.id] ? (darkMode ? 'text-green-400' : 'text-green-700') : (darkMode ? 'text-gray-300' : 'text-gray-700')
                                    }`}>
                                    {move.label}
                                </p>
                                <p className="text-[10px] text-gray-500">
                                    {move.desc}
                                </p>
                            </div>
                        </div>

                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${completed[move.id]
                                ? 'bg-green-500 border-green-500'
                                : darkMode ? 'border-gray-600 group-hover:border-gray-500' : 'border-gray-300 group-hover:border-gray-400'
                            }`}>
                            {completed[move.id] && <Check size={14} className="text-white" strokeWidth={3} />}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default NonZeroDayWidget;
