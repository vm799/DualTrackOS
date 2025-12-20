/**
 * Time formatting utility functions
 */

/**
 * Format seconds to MM:SS format
 * @param {number} seconds - Number of seconds to format
 * @returns {string} Formatted time string (e.g., "5:03", "12:45")
 */
export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format hour (0-23) to 12-hour format with AM/PM
 * @param {number} hour - Hour in 24-hour format (0-23)
 * @returns {string} Formatted hour string (e.g., "9AM", "3PM", "12PM")
 */
export const formatHour = (hour) => {
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
  return `${displayHour}${suffix}`;
};
