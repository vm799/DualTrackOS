import React from 'react';
import { Sparkles, Info } from 'lucide-react';

/**
 * Spirit Animal Component (心の成長 - Kokoro no Seichou - Growth of the Heart)
 *
 * Inspired by Japanese cultural concepts:
 * - Tamagotchi: Digital nurturing and care
 * - Ikigai (生き甲斔): Purpose found in balance
 * - Ma (間): The importance of space/rest
 * - Wabi-sabi (侘寂): Beauty in imperfection and cycles
 * - Kintsugi (金継ぎ): Honoring repair and rest as valuable as action
 *
 * Philosophy: Your spirit animal thrives when you honor BALANCE,
 * not just productivity. Resting when tired is as valuable as
 * working when energized.
 */

const SpiritAnimal = ({
  balanceScore = 0,
  growthLevel = 0,
  darkMode = true,
  showInfo = false,
  onInfoClick
}) => {

  // Growth states (0-4)
  const growthStates = [
    {
      name: 'Seed',
      japanese: '種',
      description: 'Dormant potential, waiting to awaken',
      minScore: 0,
      color: 'from-gray-400 to-gray-500',
      glow: 'shadow-gray-500/20',
      tails: 0,
      size: 'w-16 h-16'
    },
    {
      name: 'Sprout',
      japanese: '芽',
      description: 'Beginning to grow, learning balance',
      minScore: 20,
      color: 'from-green-400 to-emerald-500',
      glow: 'shadow-emerald-500/40',
      tails: 1,
      size: 'w-20 h-20'
    },
    {
      name: 'Growing',
      japanese: '成長',
      description: 'Finding rhythm in work and rest',
      minScore: 40,
      color: 'from-cyan-400 to-blue-500',
      glow: 'shadow-cyan-500/50',
      tails: 3,
      size: 'w-24 h-24'
    },
    {
      name: 'Thriving',
      japanese: '繁栄',
      description: 'In harmony, productivity meets restoration',
      minScore: 60,
      color: 'from-purple-400 via-pink-500 to-orange-400',
      glow: 'shadow-purple-500/60',
      tails: 5,
      size: 'w-28 h-28'
    },
    {
      name: 'Enlightened',
      japanese: '悟り',
      description: 'Mastered balance, embodying ikigai',
      minScore: 80,
      color: 'from-yellow-300 via-orange-400 to-pink-500',
      glow: 'shadow-yellow-500/80',
      tails: 9,
      size: 'w-32 h-32'
    }
  ];

  // Determine current state
  const currentState = growthStates.reduce((prev, curr) => {
    return balanceScore >= curr.minScore ? curr : prev;
  }, growthStates[0]);

  // Sakura petal count based on growth
  const petalCount = currentState.tails;

  return (
    <div className={`relative ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      {/* Spirit Animal Container */}
      <div className="flex flex-col items-center justify-center space-y-4">

        {/* Animated Spirit Orb */}
        <div className="relative">
          {/* Floating sakura petals */}
          {[...Array(petalCount)].map((_, i) => (
            <div
              key={i}
              className="absolute text-pink-400 opacity-60"
              style={{
                top: `${Math.sin(i * (360 / petalCount) * Math.PI / 180) * 60}px`,
                left: `${Math.cos(i * (360 / petalCount) * Math.PI / 180) * 60}px`,
                animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`
              }}
            >
              <span className="text-2xl">🌸</span>
            </div>
          ))}

          {/* Main Spirit Orb */}
          <div className={`
            ${currentState.size}
            rounded-full
            bg-gradient-to-br ${currentState.color}
            ${currentState.glow}
            shadow-2xl
            animate-pulse-slow
            flex items-center justify-center
            relative
            overflow-hidden
          `}>
            {/* Inner glow */}
            <div className={`
              absolute inset-0
              bg-gradient-to-br ${currentState.color}
              opacity-50
              animate-spin-slow
            `} />

            {/* Kitsune tails (represented by swirls) */}
            <div className="relative z-10 text-4xl animate-float">
              {currentState.tails === 0 && '💫'}
              {currentState.tails === 1 && '🌱'}
              {currentState.tails === 3 && '🦊'}
              {currentState.tails === 5 && '✨'}
              {currentState.tails === 9 && '🌟'}
            </div>
          </div>

          {/* Glow ring */}
          <div className={`
            absolute inset-0 -m-2
            rounded-full
            border-2 border-dashed
            ${darkMode ? 'border-white/20' : 'border-gray-400/40'}
            animate-spin-very-slow
          `} />
        </div>

        {/* Name and Level */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center space-x-2">
            <h3 className={`text-lg font-bold ${
              darkMode
                ? `bg-gradient-to-r ${currentState.color} bg-clip-text text-transparent`
                : 'text-gray-900'
            }`}>
              {currentState.japanese} {currentState.name}
            </h3>
            {onInfoClick && (
              <button
                onClick={onInfoClick}
                className={`p-1 rounded-full transition-colors ${
                  darkMode
                    ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                    : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                }`}
              >
                <Info size={16} />
              </button>
            )}
          </div>

          <p className={`text-xs italic ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
            {currentState.description}
          </p>

          {/* Balance Score */}
          <div className="flex items-center justify-center space-x-2 mt-3">
            <div className={`flex-1 h-2 rounded-full overflow-hidden ${
              darkMode ? 'bg-gray-800' : 'bg-gray-200'
            }`}>
              <div
                className={`h-full bg-gradient-to-r ${currentState.color} transition-all duration-1000`}
                style={{ width: `${balanceScore}%` }}
              />
            </div>
            <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {balanceScore}%
            </span>
          </div>

          {/* Next milestone */}
          {currentState.name !== 'Enlightened' && (
            <p className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-500'}`}>
              {growthStates[growthStates.indexOf(currentState) + 1]?.minScore - balanceScore}% to {growthStates[growthStates.indexOf(currentState) + 1]?.name}
            </p>
          )}
        </div>

        {/* Philosophy tooltip */}
        {showInfo && (
          <div className={`mt-4 p-4 rounded-xl text-xs ${
            darkMode
              ? 'bg-purple-500/10 border border-purple-500/30'
              : 'bg-purple-50 border border-purple-200'
          }`}>
            <div className="flex items-start space-x-2 mb-2">
              <Sparkles className={darkMode ? 'text-purple-400' : 'text-purple-600'} size={16} />
              <p className={`font-semibold ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                Balance Philosophy (バランスの哲学)
              </p>
            </div>
            <ul className={`space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
              <li>• Resting when tired is as valuable as working when energized</li>
              <li>• Meditating when anxious honors your spirit</li>
              <li>• Productivity without rest depletes your energy</li>
              <li>• True growth comes from sustainable balance</li>
            </ul>
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes spin-very-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .animate-spin-very-slow {
          animation: spin-very-slow 60s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SpiritAnimal;
