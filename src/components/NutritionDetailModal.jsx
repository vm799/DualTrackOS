import React, { useState, useEffect } from 'react';
import { X, Check, Apple, Plus, AlertTriangle, Zap } from 'lucide-react';
import useStore from '../store/useStore';
import useNDMStore from '../store/useNDMStore';
import useNutritionStore from '../store/useNutritionStore';

/**
 * Nutrition Detail Modal
 * Granular food tracking for the Nutrition NDM
 */
const NutritionDetailModal = ({ show, onClose }) => {
  const darkMode = useStore((state) => state.darkMode);
  const { ndm, setNutrition } = useNDMStore();
  const { proteinToday, getProteinTarget, proteinVault, checkLeucineStatus } = useNutritionStore();

  const [selectedMeal, setSelectedMeal] = useState(null);
  const [customProtein, setCustomProtein] = useState('');
  const [showLeucineWarning, setShowLeucineWarning] = useState(false);

  // Close on ESC key
  useEffect(() => {
    if (!show) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [show, onClose]);

  if (!show) return null;

  const proteinTarget = getProteinTarget();

  const mealIdeas = [
    {
      category: '🌱 Dairy-Free Protein Vault (High Impact)',
      items: proteinVault || []
    },
    {
      category: '🍳 Breakfast Ideas (Protein-Rich)',
      items: [
        { name: 'Egg Scramble', protein: 18, details: '3 eggs + veggies', isHighLeucine: true },
        { name: 'Protein Smoothie', protein: 25, details: 'Protein powder + banana', isHighLeucine: true },
        { name: 'Oatmeal with Hemp', protein: 12, details: '1 cup oats + 3 tbsp hemp', isHighLeucine: false },
      ]
    },
    {
      category: '🥗 Lunch/Dinner Ideas',
      items: [
        { name: 'Grilled Chicken Salad', protein: 35, details: '6oz chicken breast + greens', isHighLeucine: true },
        { name: 'Salmon with Quinoa', protein: 32, details: '5oz salmon + 1 cup quinoa', isHighLeucine: true },
        { name: 'Tofu Stir-Fry', protein: 24, details: '1 cup firm tofu + veggies', isHighLeucine: true },
      ]
    }
  ];

  const logFood = (item) => {
    // Check if it's a vault item or standard item
    // Vault items come with isHighLeucine property
    useNutritionStore.getState().addMeal(item.name, item.protein, item.isHighLeucine);

    setSelectedMeal(item.name);
    setTimeout(() => setSelectedMeal(null), 2000);
  };

  const logCustom = () => {
    const amount = parseInt(customProtein);
    if (amount && amount > 0 && amount <= 100) {
      // Heuristic: If > 20g protein, ask if it's a high quality source
      if (amount >= 20) {
        // For now, just assume user knows or add a toggle. 
        // Better yet, just log it and let the store check later.
        // But to be "agentic", let's ask or default to standard.
        // Let's assume standard for custom input unless specified.
        useNutritionStore.getState().addMeal("Custom Entry", amount, false); // false for safety

        // Show Leucine warning proactively if they just logged a big meal that might be "low quality"
        setShowLeucineWarning(true);
        setTimeout(() => setShowLeucineWarning(false), 4000);
      } else {
        useNutritionStore.getState().addMeal("Snack/Side", amount, false);
      }

      setCustomProtein('');
    }
  };

  const markComplete = () => {
    setNutrition(true);
    onClose();
  };

  const progress = Math.min((proteinToday / proteinTarget) * 100, 100);
  const leucineStatus = checkLeucineStatus ? checkLeucineStatus() : 'neutral';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg overflow-y-auto" onClick={onClose}>
      <div className="min-h-screen flex items-center justify-center p-4 py-12">
        <div className={`max-w-4xl w-full rounded-3xl ${darkMode ? 'bg-gray-900 border-2 border-green-500/30' : 'bg-white border-2 border-green-200'
          }`} onClick={(e) => e.stopPropagation()}>
          {/* Close button */}
          <div className="flex justify-end p-4">
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="px-8 pb-8">
            <div className="flex items-center gap-3 mb-2">
              <Apple className={darkMode ? 'text-green-400' : 'text-green-600'} size={32} />
              <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Nutrition Non-Negotiable
              </h3>
            </div>

            <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Track your protein. <span className="font-bold text-amber-500">Floor: {proteinTarget}g</span> (Perimenopause Requirement)
            </p>

            {/* Protein Progress */}
            <div className={`p-5 rounded-xl mb-6 ${darkMode ? 'bg-gray-800/50 border-2 border-gray-700' : 'bg-gray-50 border-2 border-gray-200'
              }`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Today's Protein
                </span>
                <span className={`text-2xl font-bold ${proteinToday >= proteinTarget
                    ? darkMode ? 'text-emerald-400' : 'text-emerald-600'
                    : darkMode ? 'text-purple-400' : 'text-purple-600'
                  }`}>
                  {proteinToday}g / {proteinTarget}g
                </span>
              </div>

              <div className={`h-4 rounded-full overflow-hidden ${darkMode ? 'bg-gray-900/50' : 'bg-gray-200'}`}>
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                    boxShadow: progress > 0 ? '0 0 10px rgba(16, 185, 129, 0.5)' : 'none'
                  }}
                />
              </div>

              {proteinToday >= proteinTarget && (
                <p className={`text-sm font-bold mt-3 text-center ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                  🎉 Protein floor reached! Muscle synthesis activated.
                </p>
              )}

              {/* Leucine Warning */}
              {leucineStatus === 'warning' && (
                <div className={`mt-3 p-2 rounded-lg flex items-start gap-2 ${darkMode ? 'bg-amber-900/40 text-amber-200 border border-amber-500/30' : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                  <AlertTriangle size={16} className="mt-0.5" />
                  <p className="text-xs">
                    <strong>Check Leucine:</strong> That last meal was big, but was it high quality?
                    (Meat, Soy, Pea Isolate)? If it was plain plant protein (beans/grains), you likely missed the 3g Leucine threshold needed to trigger growth.
                  </p>
                </div>
              )}
            </div>

            {/* Custom Protein Entry */}
            <div className={`p-4 rounded-xl mb-6 ${darkMode ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-purple-50 border border-purple-300'
              }`}>
              <h4 className={`font-bold mb-3 ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>
                Quick Log Custom Amount:
              </h4>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={customProtein}
                  onChange={(e) => setCustomProtein(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && logCustom()}
                  placeholder="Enter grams (e.g., 25)"
                  className={`flex-1 px-4 py-2 rounded-lg border-2 ${darkMode
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    }`}
                />
                <button
                  onClick={logCustom}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${darkMode
                      ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/40'
                      : 'bg-purple-500 hover:bg-purple-600 text-white'
                    }`}
                >
                  <Plus size={18} />
                </button>
              </div>
              {showLeucineWarning && (
                <p className="text-xs text-amber-500 mt-2 animate-pulse">
                  ⚠️ Did this meal include a complete protein source?
                </p>
              )}
            </div>

            {/* Meal Ideas */}
            <div className="space-y-6">
              {mealIdeas.map((category, idx) => (
                <div key={idx}>
                  <h4 className={`font-bold mb-3 flex items-center gap-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {category.category}
                    {category.category.includes('Vault') && <Zap size={16} className="text-yellow-400" />}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {category.items.map((item, itemIdx) => {
                      const justLogged = selectedMeal === item.name;
                      const isVault = category.category.includes('Vault');

                      return (
                        <button
                          key={itemIdx}
                          onClick={() => logFood(item)}
                          className={`text-left p-4 rounded-xl transition-all relative overflow-hidden ${justLogged
                              ? darkMode
                                ? 'bg-emerald-500/20 border-2 border-emerald-500/50 scale-105'
                                : 'bg-emerald-100 border-2 border-emerald-400 scale-105'
                              : darkMode
                                ? isVault ? 'bg-gray-800/80 border-2 border-purple-500/30 hover:border-purple-400' : 'bg-gray-800/50 border-2 border-gray-700 hover:border-green-500/50'
                                : 'bg-white border-2 border-gray-200 hover:border-green-300'
                            }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className={`font-semibold ${justLogged
                                ? darkMode ? 'text-emerald-400' : 'text-emerald-700'
                                : darkMode ? 'text-gray-200' : 'text-gray-800'
                              }`}>
                              {item.name}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                              }`}>
                              {item.protein}g
                            </span>
                          </div>
                          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                            {item.details}
                          </p>
                          {item.isHighLeucine && (
                            <span className="absolute bottom-2 right-2 text-[10px] opacity-50 font-mono text-yellow-500">
                              HI-LEUCINE
                            </span>
                          )}
                          {justLogged && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
                              <p className={`text-sm font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                                ✓ Logged!
                              </p>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3 justify-end sticky bottom-0 pt-4 bg-inherit backdrop-blur-xl pb-2">
              <button
                onClick={onClose}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${darkMode
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-400'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                  }`}
              >
                Close
              </button>
              <button
                onClick={markComplete}
                disabled={ndm.nutrition}
                className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${ndm.nutrition
                    ? darkMode
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : darkMode
                      ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  }`}
              >
                <Check size={18} />
                {ndm.nutrition ? 'Already Complete' : 'Mark Complete'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionDetailModal;
