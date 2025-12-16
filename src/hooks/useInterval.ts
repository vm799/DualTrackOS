/**
 * Stable interval hook using useRef pattern
 * Prevents timer recreation when callback changes (same pattern that fixed box breathing)
 * Based on Dan Abramov's overreacted.io article on setInterval
 */

import { useEffect, useRef } from 'react';

export function useInterval(callback: () => void, delayMs: number | null): void {
  const savedCallback = useRef(callback);

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    // Don't schedule if no delay is specified or delay is null
    if (delayMs === null) {
      return;
    }

    const tick = () => {
      savedCallback.current();
    };

    const id = setInterval(tick, delayMs);

    return () => clearInterval(id);
  }, [delayMs]); // Only re-run if delay changes
}
