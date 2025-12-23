import { renderHook, act } from '@testing-library/react';
import useNDMStore from '../useNDMStore';

describe('useNDMStore - Non-Negotiable Daily Must-Dos', () => {
  beforeEach(() => {
    // Reset NDM state before each test
    const { result } = renderHook(() => useNDMStore());
    act(() => {
      result.current.resetNDM();
    });
  });

  describe('Initialization', () => {
    it('should initialize with all NDMs incomplete', () => {
      const { result } = renderHook(() => useNDMStore());

      expect(result.current.ndm.movement).toBe(false);
      expect(result.current.ndm.nutrition).toBe(false);
      expect(result.current.ndm.mindfulness).toBe(false);
      expect(result.current.ndm.brainDump).toBe(false);
    });

    it('should calculate completion count as 0 initially', () => {
      const { result } = renderHook(() => useNDMStore());
      expect(result.current.getCompletionCount()).toBe(0);
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

    it('should mark Mindfulness NDM as complete', () => {
      const { result } = renderHook(() => useNDMStore());

      act(() => {
        result.current.setMindfulness(true);
      });

      expect(result.current.ndm.mindfulness).toBe(true);
      expect(result.current.getCompletionCount()).toBe(1);
    });

    it('should mark Brain Dump NDM as complete', () => {
      const { result } = renderHook(() => useNDMStore());

      act(() => {
        result.current.setBrainDump(true);
      });

      expect(result.current.ndm.brainDump).toBe(true);
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
    });

    it('should calculate 75% completion correctly', () => {
      const { result } = renderHook(() => useNDMStore());

      act(() => {
        result.current.setMovement(true);
        result.current.setNutrition(true);
        result.current.setMindfulness(true);
      });

      expect(result.current.getCompletionCount()).toBe(3);
    });

    it('should achieve 100% completion', () => {
      const { result } = renderHook(() => useNDMStore());

      act(() => {
        result.current.setMovement(true);
        result.current.setNutrition(true);
        result.current.setMindfulness(true);
        result.current.setBrainDump(true);
      });

      expect(result.current.getCompletionCount()).toBe(4);
      expect(result.current.ndm.movement).toBe(true);
      expect(result.current.ndm.nutrition).toBe(true);
      expect(result.current.ndm.mindfulness).toBe(true);
      expect(result.current.ndm.brainDump).toBe(true);
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
        result.current.setMindfulness(true);
        result.current.setBrainDump(true);
      });

      expect(result.current.getCompletionCount()).toBe(4);

      // Reset
      act(() => {
        result.current.resetNDM();
      });

      expect(result.current.ndm.movement).toBe(false);
      expect(result.current.ndm.nutrition).toBe(false);
      expect(result.current.ndm.mindfulness).toBe(false);
      expect(result.current.ndm.brainDump).toBe(false);
      expect(result.current.getCompletionCount()).toBe(0);
    });
  });

  describe('Completion Tracking', () => {
    it('should correctly identify incomplete status', () => {
      const { result } = renderHook(() => useNDMStore());

      expect(result.current.getCompletionCount()).toBe(0);
    });

    it('should correctly identify partial completion', () => {
      const { result } = renderHook(() => useNDMStore());

      act(() => {
        result.current.setMovement(true);
      });

      const count = result.current.getCompletionCount();
      expect(count).toBe(1);
      expect(count).toBeLessThan(4);
    });

    it('should correctly identify full completion', () => {
      const { result } = renderHook(() => useNDMStore());

      act(() => {
        result.current.setMovement(true);
        result.current.setNutrition(true);
        result.current.setMindfulness(true);
        result.current.setBrainDump(true);
      });

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
      expect(result.current.ndm.mindfulness).toBe(false);
      expect(result.current.ndm.brainDump).toBe(false);
    });
  });
});
