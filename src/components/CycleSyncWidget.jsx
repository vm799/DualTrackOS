import React from 'react';
import { Calendar, Battery, Moon, Zap, Activity, Briefcase } from 'lucide-react';
import useCycleStore from '../store/useCycleStore';
import useStore from '../store/useStore';
import useNutritionStore from '../store/useNutritionStore';

const CycleSyncWidget = () => {
    const {
        cycleDay,
        getPhase,
        getMojoMode,
        getRecommendations
    } = useCycleStore();

    const darkMode = useStore((state) => state.darkMode);
    const { isOfficeDay, toggleOfficeDay } = useStore();
    const { proteinVault } = useNutritionStore();

    const phase = getPhase();
    const mode = getMojoMode();
    const recs = getRecommendations();

    // Check if store is hydrating or empty
    if (!cycleDay) {
        return (
            <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-pink-50'}`}>
                <p className="text-sm">Cycle data not set. Go to Settings.</p>
            </div>
        );
    }

    const isPowerMode = mode.includes('Power');

    // Get a random vault item for lunch if in office mode
    const lunchRec = proteinVault && proteinVault.length > 0
        ? proteinVault[Math.floor(Math.random() * proteinVault.length)]
        : { name: 'Tuna Pouch + Rice', protein: 25 };

    return (
        <div className={`p-5 rounded-2xl relative overflow-hidden transition-all duration-300 transform hover:scale-[1.02] ${darkMode
            ? isPowerMode
                ? 'bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30'
                : 'bg-gradient-to-br from-indigo-900/40 to-blue-900/40 border border-indigo-500/30'
            : isPowerMode
                ? 'bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100'
                : 'bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100'
            }`}>
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${darkMode ? 'bg-white/10' : 'bg-white/60'
                        }`}>
                        {isPowerMode ? <Zap size={20} className="text-yellow-400" /> : <Moon size={20} className="text-indigo-400" />}
                    </div>
                    <div>
                        <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {phase} Phase
                        </h3>
                        <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Day {cycleDay} • {mode} Mode
                        </p>
                    </div>
                </div>

                {/* Mojo Score Badge (Visual Only for now) */}
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${darkMode
                    ? isPowerMode ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                    : isPowerMode ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-indigo-100 text-indigo-700 border-indigo-200'
                    }`}>
                    {isPowerMode ? 'High Mojo 🚀' : 'Low Mojo 🧘‍♀️'}
                </div>
            </div>

            {/* Work Mode Toggle */}
            <div className="flex items-center justify-between mb-3 px-1">
                <span className={`text-xs font-bold flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Briefcase size={12} />
                    Gym @ Work?
                </span>
                <button
                    onClick={toggleOfficeDay}
                    className={`w-10 h-5 rounded-full relative transition-all ${isOfficeDay ? 'bg-green-500' : (darkMode ? 'bg-gray-700' : 'bg-gray-300')
                        }`}
                >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${isOfficeDay ? 'left-[22px]' : 'left-0.5'
                        }`} />
                </button>
            </div>

            {/* Recommendations Grid */}
            <div className="space-y-2">
                {/* Office Lunch Rec */}
                {isOfficeDay && (
                    <div className={`p-2 rounded-lg border-l-4 border-green-500 flex items-center justify-between ${darkMode ? 'bg-green-900/20' : 'bg-green-50'
                        }`}>
                        <div>
                            <p className={`text-[10px] font-bold uppercase ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                                Office Lunch Pick 🍱
                            </p>
                            <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {lunchRec.name}
                            </p>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${darkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-200 text-green-800'}`}>
                            {lunchRec.protein}g P
                        </span>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                    {recs.slice(0, isOfficeDay ? 2 : 4).map((rec, idx) => (
                        <div key={idx} className={`text-xs p-2 rounded-lg flex items-center gap-2 ${darkMode ? 'bg-black/20 text-gray-300' : 'bg-white/50 text-gray-700'
                            }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${isPowerMode ? 'bg-pink-400' : 'bg-indigo-400'
                                }`} />
                            {rec}
                        </div>
                    ))}
                </div>
            </div>

            {/* Progress Bar (Cycle) */}
            <div className="mt-4 relative h-1.5 bg-gray-200/20 rounded-full overflow-hidden">
                <div
                    className={`absolute top-0 bottom-0 left-0 transition-all duration-1000 ${isPowerMode ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-indigo-500 to-blue-500'
                        }`}
                    style={{ width: `${(cycleDay / 28) * 100}%` }}
                />
            </div>
        </div>
    );
};

export default CycleSyncWidget;
