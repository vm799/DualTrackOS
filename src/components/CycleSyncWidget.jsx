import React from 'react';
import { Moon, Zap, Briefcase } from 'lucide-react';
import useCycleStore from '../store/useCycleStore';
import useStore from '../store/useStore';
import useNutritionStore from '../store/useNutritionStore';
import InfoTooltip from './InfoTooltip';

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

    const [quickDayInput, setQuickDayInput] = React.useState('');

    if (!cycleDay || !useCycleStore.getState().cycleStart) {
        return (
            <div className={`p-5 rounded-2xl transition-all duration-300 ${darkMode
                ? 'bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30'
                : 'bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100'}`}>
                <div className="flex items-center gap-2 mb-3">
                    <Zap size={20} className="text-yellow-400" />
                    <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Cycle Sync
                    </h3>
                </div>
                <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    What day of your cycle are you on?
                </p>
                <div className="flex gap-2">
                    <input
                        type="number"
                        min="1"
                        max="35"
                        value={quickDayInput}
                        onChange={(e) => setQuickDayInput(e.target.value)}
                        placeholder="e.g. 8"
                        className={`flex-1 px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                            darkMode
                                ? 'bg-gray-800 border-gray-700 text-white focus:ring-purple-500/50 placeholder-gray-500'
                                : 'bg-white border-gray-300 text-gray-900 focus:ring-purple-500/50'
                        }`}
                    />
                    <button
                        onClick={() => {
                            const day = parseInt(quickDayInput, 10);
                            if (day >= 1 && day <= 35) {
                                useCycleStore.getState().setCycleDay(day);
                                // Also set a synthetic cycle start so it auto-updates
                                const syntheticStart = new Date();
                                syntheticStart.setDate(syntheticStart.getDate() - (day - 1));
                                useCycleStore.getState().setCycleStart(syntheticStart.toISOString());
                            }
                        }}
                        disabled={!quickDayInput || parseInt(quickDayInput, 10) < 1}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                            quickDayInput && parseInt(quickDayInput, 10) >= 1
                                ? darkMode
                                    ? 'bg-purple-500 hover:bg-purple-600 text-white'
                                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                                : darkMode
                                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        Set
                    </button>
                </div>
                <p className={`text-[10px] mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Day 1 = first day of your period
                </p>
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
                        <h3 className={`font-bold text-lg flex items-center gap-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {phase} Phase
                            <InfoTooltip
                                title="Your Cycle Phases"
                                darkMode={darkMode}
                                dismissKey="cycle-phases"
                                size={14}
                            >
                                <div className={`text-xs space-y-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    <p><span className="font-semibold">🌑 Menstrual (Days 1-5):</span> Rest & restore. Low energy. Gentle movement only.</p>
                                    <p><span className="font-semibold">🌱 Follicular (Days 6-14):</span> Rising energy. Push hard — PRs, new skills, HIIT.</p>
                                    <p><span className="font-semibold">🌕 Ovulatory (Days 15-17):</span> Peak power. Social events, max strength.</p>
                                    <p><span className="font-semibold">🍂 Luteal (Days 18-28):</span> Winding down. Detail work, moderate exercise.</p>
                                </div>
                            </InfoTooltip>
                        </h3>
                        <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Day {cycleDay} • {mode} Mode
                        </p>
                    </div>
                </div>

                {/* Mojo Score Badge (Visual Only for now) */}
                <div className="flex items-center gap-1">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${darkMode
                        ? isPowerMode ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                        : isPowerMode ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-indigo-100 text-indigo-700 border-indigo-200'
                        }`}>
                        {isPowerMode ? 'High Mojo 🚀' : 'Low Mojo 🧘‍♀️'}
                    </div>
                    <InfoTooltip
                        title="What is Mojo?"
                        text="Your 'Mojo' reflects your natural energy level based on where you are in your menstrual cycle. During follicular and ovulatory phases, your body has more energy for intense exercise and social activities (High Mojo). During menstrual and luteal phases, your body needs more rest and gentle movement (Low Mojo). Working WITH your cycle instead of against it leads to better results and less burnout."
                        darkMode={darkMode}
                        dismissKey="mojo-explain"
                        size={12}
                    />
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
