import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSessionStore from '../store/useSessionStore';

/**
 * Keyboard Shortcuts Hook
 *
 * Global keyboard shortcuts for power users:
 * - Cmd/Ctrl + K: Quick search (future implementation)
 * - Cmd/Ctrl + B: Brain dump modal
 * - Cmd/Ctrl + N: Nutrition modal
 * - Cmd/Ctrl + P: Productivity page / Pomodoro
 * - Cmd/Ctrl + E: Energy check-in
 * - Cmd/Ctrl + D: Dashboard
 * - Cmd/Ctrl + H: Health page
 * - Cmd/Ctrl + /: Show shortcuts help
 * - ESC: Close modals (handled per modal)
 */
const useKeyboardShortcuts = ({
  onBrainDump,
  onNutrition,
  onMovement,
  onEnergy,
  onPomodoro,
  onCommandCenter
}) => {
  const navigate = useNavigate();
  const trackKeyboardShortcut = useSessionStore((state) => state.trackKeyboardShortcut);

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Check if cmd (Mac) or ctrl (Windows/Linux) is pressed
      const modKey = e.metaKey || e.ctrlKey;

      // Ignore if user is typing in an input/textarea
      const activeElement = document.activeElement;
      const isTyping = activeElement.tagName === 'INPUT' ||
                       activeElement.tagName === 'TEXTAREA' ||
                       activeElement.isContentEditable;

      if (isTyping && e.key !== 'Escape') return;

      // Cmd/Ctrl + K: Quick search (placeholder for future)
      if (modKey && e.key === 'k') {
        e.preventDefault();
        console.log('Quick search - Coming soon!');
        // Future: Open search modal
      }

      // Cmd/Ctrl + B: Brain dump
      if (modKey && e.key === 'b') {
        e.preventDefault();
        trackKeyboardShortcut('brain-dump');
        if (onBrainDump) onBrainDump();
      }

      // Cmd/Ctrl + N: Nutrition
      if (modKey && e.key === 'n') {
        e.preventDefault();
        trackKeyboardShortcut('nutrition');
        if (onNutrition) onNutrition();
      }

      // Cmd/Ctrl + M: Movement
      if (modKey && e.key === 'm') {
        e.preventDefault();
        trackKeyboardShortcut('movement');
        if (onMovement) onMovement();
      }

      // Cmd/Ctrl + E: Energy tracking
      if (modKey && e.key === 'e') {
        e.preventDefault();
        trackKeyboardShortcut('energy');
        if (onEnergy) {
          onEnergy();
        } else {
          // Scroll to energy section if no handler provided
          const energySection = document.getElementById('energy');
          if (energySection) {
            energySection.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }

      // Cmd/Ctrl + P: Productivity / Pomodoro
      if (modKey && e.key === 'p') {
        e.preventDefault();
        trackKeyboardShortcut('pomodoro');
        if (onPomodoro) {
          onPomodoro();
        } else {
          navigate('/productivity');
        }
      }

      // Cmd/Ctrl + D: Dashboard
      if (modKey && e.key === 'd') {
        e.preventDefault();
        trackKeyboardShortcut('dashboard');
        navigate('/dashboard');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Cmd/Ctrl + H: Health page
      if (modKey && e.key === 'h') {
        e.preventDefault();
        trackKeyboardShortcut('health');
        navigate('/health');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Cmd/Ctrl + C: Command Center
      if (modKey && e.key === 'c') {
        e.preventDefault();
        trackKeyboardShortcut('command-center');
        if (onCommandCenter) onCommandCenter();
      }

      // Cmd/Ctrl + /: Show shortcuts help
      if (modKey && e.key === '/') {
        e.preventDefault();
        showShortcutsHelp();
      }

      // G then D: Go to dashboard (vim-style)
      // G then P: Go to productivity
      // G then H: Go to health
      // (Future enhancement)
    };

    const showShortcutsHelp = () => {
      const shortcuts = `
DualTrack OS - Keyboard Shortcuts

Navigation:
  Cmd/Ctrl + D    →  Dashboard
  Cmd/Ctrl + P    →  Productivity
  Cmd/Ctrl + H    →  Health

Actions:
  Cmd/Ctrl + B    →  Brain Dump
  Cmd/Ctrl + N    →  Nutrition
  Cmd/Ctrl + M    →  Movement
  Cmd/Ctrl + E    →  Energy Check-in
  Cmd/Ctrl + C    →  Command Center

Other:
  Cmd/Ctrl + K    →  Quick Search (coming soon)
  Cmd/Ctrl + /    →  Show this help
  ESC             →  Close modal/panel
      `.trim();

      alert(shortcuts);
      // Future: Show a nice modal instead of alert
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [navigate, onBrainDump, onNutrition, onMovement, onEnergy, onPomodoro, onCommandCenter]);
};

export default useKeyboardShortcuts;
