import { useEffect } from 'react';

/**
 * useEnergyDarkMode Hook
 *
 * Applies energy-based tints to dark mode
 * Adjusts color temperature and vibrancy based on user's energy level
 *
 * Energy Levels:
 * - Low (1-3): Softer, warmer tones (reduce blue light, more relaxing)
 * - Medium (4-7): Standard purple palette
 * - High (8-10): Brighter, more vibrant colors (energizing)
 *
 * @param {boolean} darkMode - Current dark mode state
 * @param {number} energyLevel - User's current energy (1-10)
 */
const useEnergyDarkMode = (darkMode, energyLevel) => {
  useEffect(() => {
    if (!darkMode) {
      // Remove energy class if not in dark mode
      document.documentElement.classList.remove('energy-low', 'energy-medium', 'energy-high');
      return;
    }

    // Determine energy category
    let energyClass = 'energy-medium'; // Default

    if (energyLevel <= 3) {
      energyClass = 'energy-low';
    } else if (energyLevel >= 8) {
      energyClass = 'energy-high';
    }

    // Remove all energy classes
    document.documentElement.classList.remove('energy-low', 'energy-medium', 'energy-high');

    // Add current energy class
    document.documentElement.classList.add(energyClass);

    // Apply CSS custom properties based on energy level
    const root = document.documentElement;

    if (energyLevel <= 3) {
      // Low Energy: Warmer, softer tones
      root.style.setProperty('--primary-hue', '280'); // More magenta/warm purple
      root.style.setProperty('--primary-saturation', '65%'); // Less saturated
      root.style.setProperty('--primary-lightness', '65%'); // Lighter/softer
      root.style.setProperty('--bg-temperature', 'rgba(139, 92, 246, 0.03)'); // Warm overlay
      root.style.setProperty('--text-warmth', '0.95'); // Slightly reduce blue in text
    } else if (energyLevel >= 8) {
      // High Energy: Brighter, more vibrant
      root.style.setProperty('--primary-hue', '270'); // True purple/blue-purple
      root.style.setProperty('--primary-saturation', '85%'); // Highly saturated
      root.style.setProperty('--primary-lightness', '70%'); // Brighter
      root.style.setProperty('--bg-temperature', 'rgba(96, 165, 250, 0.03)'); // Cool overlay
      root.style.setProperty('--text-warmth', '1'); // Full brightness
    } else {
      // Medium Energy: Standard palette
      root.style.setProperty('--primary-hue', '275'); // Standard purple
      root.style.setProperty('--primary-saturation', '75%');
      root.style.setProperty('--primary-lightness', '67%');
      root.style.setProperty('--bg-temperature', 'rgba(168, 85, 247, 0.03)');
      root.style.setProperty('--text-warmth', '1');
    }

    return () => {
      // Cleanup: Reset to defaults
      root.style.removeProperty('--primary-hue');
      root.style.removeProperty('--primary-saturation');
      root.style.removeProperty('--primary-lightness');
      root.style.removeProperty('--bg-temperature');
      root.style.removeProperty('--text-warmth');
    };
  }, [darkMode, energyLevel]);
};

/**
 * getEnergyPalette
 *
 * Returns color palette object based on energy level
 * Useful for components that need energy-aware colors
 *
 * @param {number} energyLevel - User's current energy (1-10)
 * @param {boolean} darkMode - Current dark mode state
 * @returns {object} Color palette with primary, secondary, accent colors
 */
export const getEnergyPalette = (energyLevel, darkMode = false) => {
  if (!darkMode) {
    // Light mode: standard palette
    return {
      primary: 'rgb(168, 85, 247)', // purple-600
      secondary: 'rgb(236, 72, 153)', // pink-500
      accent: 'rgb(59, 130, 246)', // blue-500
      background: 'rgb(255, 255, 255)',
      text: 'rgb(15, 23, 42)' // slate-900
    };
  }

  // Dark mode: energy-adaptive palette
  if (energyLevel <= 3) {
    // Low energy: warm, soft
    return {
      primary: 'rgb(192, 132, 252)', // purple-400 (warmer)
      secondary: 'rgb(251, 146, 60)', // orange-400 (warm accent)
      accent: 'rgb(139, 92, 246)', // purple-500 (softer)
      background: 'rgb(15, 23, 42)', // slate-900
      text: 'rgb(226, 232, 240)', // slate-200 (softer white)
      overlay: 'rgba(139, 92, 246, 0.05)' // Warm purple overlay
    };
  } else if (energyLevel >= 8) {
    // High energy: bright, vibrant
    return {
      primary: 'rgb(196, 118, 255)', // Bright purple
      secondary: 'rgb(96, 165, 250)', // blue-400 (cool, energizing)
      accent: 'rgb(236, 72, 153)', // pink-500 (vibrant)
      background: 'rgb(15, 23, 42)', // slate-900
      text: 'rgb(248, 250, 252)', // slate-50 (bright white)
      overlay: 'rgba(96, 165, 250, 0.05)' // Cool blue overlay
    };
  } else {
    // Medium energy: standard
    return {
      primary: 'rgb(168, 85, 247)', // purple-600
      secondary: 'rgb(236, 72, 153)', // pink-500
      accent: 'rgb(59, 130, 246)', // blue-500
      background: 'rgb(15, 23, 42)', // slate-900
      text: 'rgb(241, 245, 249)', // slate-100
      overlay: 'rgba(168, 85, 247, 0.03)' // Neutral purple overlay
    };
  }
};

/**
 * getEnergyGradient
 *
 * Returns gradient classes based on energy level
 *
 * @param {number} energyLevel - User's current energy (1-10)
 * @param {boolean} darkMode - Current dark mode state
 * @returns {string} Tailwind gradient classes
 */
export const getEnergyGradient = (energyLevel, darkMode = false) => {
  if (!darkMode) {
    return 'from-purple-500 to-pink-500';
  }

  if (energyLevel <= 3) {
    return 'from-purple-600/80 to-orange-600/80'; // Warm
  } else if (energyLevel >= 8) {
    return 'from-purple-500 via-pink-500 to-blue-500'; // Vibrant
  } else {
    return 'from-purple-600 to-pink-600'; // Standard
  }
};

/**
 * getEnergyTextColor
 *
 * Returns text color class based on energy level
 *
 * @param {number} energyLevel - User's current energy (1-10)
 * @param {boolean} darkMode - Current dark mode state
 * @returns {string} Tailwind text color class
 */
export const getEnergyTextColor = (energyLevel, darkMode = false) => {
  if (!darkMode) {
    return 'text-slate-900';
  }

  if (energyLevel <= 3) {
    return 'text-slate-200'; // Softer
  } else if (energyLevel >= 8) {
    return 'text-slate-50'; // Brighter
  } else {
    return 'text-slate-100'; // Standard
  }
};

/**
 * getEnergyBackgroundColor
 *
 * Returns background color class based on energy level
 *
 * @param {number} energyLevel - User's current energy (1-10)
 * @param {boolean} darkMode - Current dark mode state
 * @returns {string} Tailwind background color class
 */
export const getEnergyBackgroundColor = (energyLevel, darkMode = false) => {
  if (!darkMode) {
    return 'bg-white';
  }

  if (energyLevel <= 3) {
    return 'bg-slate-900'; // Standard (warm overlay applied via CSS)
  } else if (energyLevel >= 8) {
    return 'bg-slate-900'; // Standard (cool overlay applied via CSS)
  } else {
    return 'bg-slate-900'; // Standard
  }
};

export default useEnergyDarkMode;
