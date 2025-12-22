import { renderHook, act } from '@testing-library/react';
import useNDMStore from '../useNDMStore';

describe('useNDMStore - Non-Negotiable Daily Must-Dos', () => {
  beforeEach(() => {
    // Reset NDM state before each test
    const { result } = renderHook(() => useNDMStore());
    act(() => {
      result.current.resetNDMs();
    });
  });

  describe('Initialization', () => {
    it('should initialize with all NDMs incomplete', () => {
      const { result } = renderHook(() => useNDMStore());

      expect(result.current.ndm.movement).toBe(false);
      expect(result.current.ndm.nutrition).toBe(false);
      expect(result.current.ndm.connection).toBe(false);
      expect(result.current.ndm.mindset).toBe(false);
    });

    it('should calculate completion count as 0 initially', () => {
      const { result } = renderHook(() => useNDMStore());
      expect(result.current.getCompletionCount()).toBe(0);
    });

    it('should calculate completion percentage as 0 initially', () => {
      const { result } = renderHook(() => useNDMStore());
      expect(result.current.getCompletionPercentage()).toBe(0);
    });
  });

  describe('Individual NDM Completion', () => {
    it('should mark Movement NDM as complete', () => {
      const { result } = renderHook(() => useNDMStore());

      act(() => {
        result.current.setMovement(true);
      });

      expect(result.current.ndm.movement).toBe(true);
      expect(result.current.getCompletionCount()).toBe(1);
    });

    it('should mark Nutrition NDM as complete', () => {
      const { result } = renderHook(() => useNDMStore());

      act(() => {
        result.current.setNutrition(true);
      });

      expect(result.current.ndm.nutrition).toBe(true);
      expect(result.current.getCompletionCount()).toBe(1);
    });

    it('should mark Connection NDM as complete', () => {
      const { result } = renderHook(() => useNDMStore());

      act(() => {
        result.current.setConnection(true);
      });

      expect(result.current.ndm.connection).toBe(true);
      expect(result.current.getCompletionCount()).toBe(1);
    });

    it('should mark Mindset NDM as complete', () => {
      const { result } = renderHook(() => useNDMStore());

      act(() => {
        result.current.setMindset(true);
      });

      expect(result.current.ndm.mindset).toBe(true);
      expect(result.current.getCompletionCount()).toBe(1);
    });
  });

  describe('Multiple NDM Completion', () => {
    it('should track multiple completed NDMs', () => {
      const { result } = renderHook(() => useNDMStore());

      act(() => {
        result.current.setMovement(true);
        result.current.setNutrition(true);
      });

      expect(result.current.getCompletionCount()).toBe(2);
      expect(result.current.getCompletionPercentage()).toBe(50);
    });

    it('should calculate 75% completion correctly', () => {
      const { result } = renderHook(() => useNDMStore());

      act(() => {
        result.current.setMovement(true);
        result.current.setNutrition(true);
        result.current.setConnection(true);
      });

      expect(result.current.getCompletionCount()).toBe(3);
      expect(result.current.getCompletionPercentage()).toBe(75);
    });

    it('should achieve 100% completion', () => {
      const { result } = renderHook(() => useNDMStore());

      act(() => {
        result.current.setMovement(true);
        result.current.setNutrition(true);
        result.current.setConnection(true);
        result.current.setMindset(true);
      });

      expect(result.current.getCompletionCount()).toBe(4);
      expect(result.current.getCompletionPercentage()).toBe(100);
      expect(result.current.ndm.movement).toBe(true);
      expect(result.current.ndm.nutrition).toBe(true);
      expect(result.current.ndm.connection).toBe(true);
      expect(result.current.ndm.mindset).toBe(true);
    });
  });

  describe('Uncompleting NDMs', () => {
    it('should allow uncompleting a previously completed NDM', () => {
      const { result } = renderHook(() => useNDMStore());

      act(() => {
        result.current.setMovement(true);
      });

      expect(result.current.ndm.movement).toBe(true);

      act(() => {
        result.current.setMovement(false);
      });

      expect(result.current.ndm.movement).toBe(false);
      expect(result.current.getCompletionCount()).toBe(0);
    });
  });

  describe('Reset Functionality', () => {
    it('should reset all NDMs to incomplete', () => {
      const { result } = renderHook(() => useNDMStore());

      // Complete all NDMs
      act(() => {
        result.current.setMovement(true);
        result.current.setNutrition(true);
        result.current.setConnection(true);
        result.current.setMindset(true);
      });

      expect(result.current.getCompletionCount()).toBe(4);

      // Reset
      act(() => {
        result.current.resetNDMs();
      });

      expect(result.current.ndm.movement).toBe(false);
      expect(result.current.ndm.nutrition).toBe(false);
      expect(result.current.ndm.connection).toBe(false);
      expect(result.current.ndm.mindset).toBe(false);
      expect(result.current.getCompletionCount()).toBe(0);
    });
  });

  describe('Completion Tracking', () => {
    it('should correctly identify incomplete status', () => {
      const { result } = renderHook(() => useNDMStore());

      expect(result.current.getCompletionPercentage()).toBe(0);
      expect(result.current.getCompletionCount()).toBe(0);
    });

    it('should correctly identify partial completion', () => {
      const { result } = renderHook(() => useNDMStore());

      act(() => {
        result.current.setMovement(true);
      });

      const percentage = result.current.getCompletionPercentage();
      expect(percentage).toBe(25);
      expect(percentage).toBeLessThan(100);
    });

    it('should correctly identify full completion', () => {
      const { result } = renderHook(() => useNDMStore());

      act(() => {
        result.current.setMovement(true);
        result.current.setNutrition(true);
        result.current.setConnection(true);
        result.current.setMindset(true);
      });

      expect(result.current.getCompletionPercentage()).toBe(100);
      expect(result.current.getCompletionCount()).toBe(4);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid toggling of NDM status', () => {
      const { result } = renderHook(() => useNDMStore());

      act(() => {
        result.current.setMovement(true);
        result.current.setMovement(false);
        result.current.setMovement(true);
      });

      expect(result.current.ndm.movement).toBe(true);
      expect(result.current.getCompletionCount()).toBe(1);
    });

    it('should maintain independent state for each NDM', () => {
      const { result } = renderHook(() => useNDMStore());

      act(() => {
        result.current.setMovement(true);
      });

      expect(result.current.ndm.movement).toBe(true);
      expect(result.current.ndm.nutrition).toBe(false);
      expect(result.current.ndm.connection).toBe(false);
      expect(result.current.ndm.mindset).toBe(false);
    });
  });
});
