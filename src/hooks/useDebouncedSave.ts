/**
 * Debounced save hook to prevent excessive localStorage writes
 * Batches rapid state changes into a single write operation
 */

import { useEffect, useRef } from 'react';

const DEFAULT_DEBOUNCE_MS = 500;

export function useDebouncedSave<T>(
  value: T,
  key: string,
  delayMs: number = DEFAULT_DEBOUNCE_MS
): void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set up new timeout
    timeoutRef.current = setTimeout(() => {
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(value));
        }
      } catch (error) {
        console.warn(`Error saving to localStorage key "${key}":`, error);
      }
    }, delayMs);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, key, delayMs]);
}
