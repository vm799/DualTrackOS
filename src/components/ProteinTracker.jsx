import React from 'react';
import { Activity } from 'lucide-react';
import useNutritionStore from '../store/useNutritionStore';
import useStore from '../store/useStore';

const ProteinTracker = ({ openNutrition }) => {
  const darkMode = useStore((state) => state.darkMode);
  const userProfile = useStore((state) => state.userProfile);

  const { proteinToday, getProteinTarget } = useNutritionStore();
  const [expandedTile, setExpandedTile] = React.useState(null); // Local state for expanding this tile

  return (
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
              openNutrition();
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
  );
};

export default ProteinTracker;