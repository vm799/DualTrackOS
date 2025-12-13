import React from 'react';
import { Sparkles } from 'lucide-react';

/**
 * SpiritAnimalCard - Gamified Spirit Animal Display Component
 *
 * Shows the user's current spirit animal evolution stage with:
 * - Japanese name and romanji
 * - Description
 * - XP progress bar to next level
 * - Points remaining to next threshold
 * - Visual feedback on hover
 * - Click to open modal
 */
const SpiritAnimalCard = ({ spiritAnimalScore, darkMode, onClick, getSpiritAnimalStage }) => {
  const stage = getSpiritAnimalStage(spiritAnimalScore);

  // Calculate progress to next level
  const getProgressToNextLevel = () => {
    const nextThreshold = spiritAnimalScore < 20 ? 20 : spiritAnimalScore < 40 ? 40 : spiritAnimalScore < 60 ? 60 : spiritAnimalScore < 80 ? 80 : 100;
    const prevThreshold = spiritAnimalScore < 20 ? 0 : spiritAnimalScore < 40 ? 20 : spiritAnimalScore < 60 ? 40 : spiritAnimalScore < 80 ? 60 : 80;
    const pointsRemaining = nextThreshold - spiritAnimalScore;
    const progressPercent = ((spiritAnimalScore - prevThreshold) / (nextThreshold - prevThreshold)) * 100;
    return { pointsRemaining, progressPercent };
  };

  const { pointsRemaining, progressPercent } = getProgressToNextLevel();

  // Get progress bar color based on stage
  const getProgressBarColor = () => {
    if (stage.color === 'gold') return 'bg-gradient-to-r from-yellow-400 to-orange-400';
    if (stage.color === 'purple') return 'bg-gradient-to-r from-purple-500 to-pink-500';
    if (stage.color === 'orange') return 'bg-gradient-to-r from-orange-400 to-pink-500';
    if (stage.color === 'yellow') return 'bg-gradient-to-r from-yellow-300 to-orange-400';
    return 'bg-gradient-to-r from-gray-400 to-gray-500';
  };

  // Get level indicator dot color
  const getLevelDotColor = () => {
    if (spiritAnimalScore >= 80) return 'bg-yellow-400 animate-pulse shadow-lg shadow-yellow-400/50';
    if (spiritAnimalScore >= 60) return 'bg-purple-400 animate-pulse shadow-lg shadow-purple-400/50';
    if (spiritAnimalScore >= 40) return 'bg-orange-400 shadow-lg shadow-orange-400/50';
    if (spiritAnimalScore >= 20) return 'bg-green-400';
    return 'bg-gray-400';
  };

  return (
    <button
      onClick={onClick}
      className={`relative group transition-all duration-300 ${
        darkMode
          ? 'hover:bg-purple-900/20 border-2 border-purple-500/30 hover:border-purple-400/60'
          : 'hover:bg-purple-50 border-2 border-purple-200 hover:border-purple-400'
      } rounded-xl p-2 cursor-pointer`}
      title="Click to view spirit animal details"
    >
      <div className="flex items-center space-x-2">
        {/* Emoji with pulse animation */}
        <div className="relative">
          <span className="text-3xl group-hover:scale-110 transition-transform duration-300 inline-block">
            {stage.emoji}
          </span>
          {/* Level indicator dot */}
          <div className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${getLevelDotColor()}`} />
        </div>

        {/* Spirit Name & Progress */}
        <div className="text-left">
          <div className={`text-xs font-bold ${
            darkMode ? 'text-purple-300' : 'text-purple-700'
          }`}>
            {stage.japanese} ({stage.romanji})
          </div>
          <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
            {stage.description}
          </div>
          {/* Points to next level */}
          {spiritAnimalScore < 100 && (
            <div className="flex items-center space-x-1 mt-0.5">
              <div className={`h-1 rounded-full flex-1 ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`} style={{ width: '60px' }}>
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor()}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className={`text-xs font-medium ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                {pointsRemaining}%
              </span>
            </div>
          )}
        </div>

        {/* Click affordance */}
        <Sparkles className={`${darkMode ? 'text-purple-400' : 'text-purple-600'} group-hover:animate-spin`} size={14} />
      </div>
    </button>
  );
};

export default SpiritAnimalCard;
