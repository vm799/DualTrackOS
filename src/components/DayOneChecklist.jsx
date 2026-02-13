import React, { useState, useEffect } from 'react';
import { Check, ShieldCheck } from 'lucide-react';
import useStore from '../store/useStore';

/**
 * Day One Checklist Widget
 * Ensures the user has completed the fundamental setup steps.
 */
const DayOneChecklist = () => {
    const darkMode = useStore((state) => state.darkMode);

    // Local state for persistence, could move to a store if needed globally
    const [checklist, setChecklist] = useState({
        bmr: false,
        protein: false,
        creatine: false
    });

    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem('dayOneChecklist');
        if (saved) {
            setChecklist(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('dayOneChecklist', JSON.stringify(checklist));
        // If all checked, maybe hide it after a delay or show a "Graduate" badge?
        if (Object.values(checklist).every(Boolean)) {
            // Keep it visible for satisfaction, or minimize
        }
    }, [checklist]);

    const toggleItem = (key) => {
        setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const isComplete = Object.values(checklist).every(Boolean);

    if (!isVisible) return null;

    return (
        <div className={`rounded-3xl p-6 mb-6 transition-all ${darkMode
                ? 'bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30'
                : 'bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200'
            }`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <ShieldCheck className={darkMode ? 'text-indigo-400' : 'text-indigo-600'} size={24} />
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Day 1 Protocols
                    </h3>
                </div>
                {isComplete && (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                        }`}>
                        ALL SYSTEMS GO 🚀
                    </span>
                )}
            </div>

            <div className="space-y-3">
                <CheckItem
                    checked={checklist.bmr}
                    onClick={() => toggleItem('bmr')}
                    label="Calculate BMR & TDEE"
                    subtext="Know your baseline numbers."
                    darkMode={darkMode}
                />
                <CheckItem
                    checked={checklist.protein}
                    onClick={() => toggleItem('protein')}
                    label="Commit to 135g Protein Floor"
                    subtext="Non-negotiable for muscle retention."
                    darkMode={darkMode}
                />
                <CheckItem
                    checked={checklist.creatine}
                    onClick={() => toggleItem('creatine')}
                    label="Buy Creatine Monohydrate"
                    subtext="5g daily for brain & body power."
                    darkMode={darkMode}
                />
            </div>
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
