import { renderHook, act } from '@testing-library/react';
import useEnergyMoodStore from '../useEnergyMoodStore';

describe('useEnergyMoodStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useEnergyMoodStore());
    act(() => {
      result.current.setEnergyTracking({ morning: null, afternoon: null, evening: null });
      result.current.setCurrentMood(null);
      result.current.setSelectedEnergyActions([]);
      result.current.setSelectedMoodActions([]);
    });
  });

  describe('Initial State', () => {
    it('should have null energy tracking for all periods', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      expect(result.current.energyTracking.morning).toBeNull();
      expect(result.current.energyTracking.afternoon).toBeNull();
      expect(result.current.energyTracking.evening).toBeNull();
    });

    it('should have null mood initially', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      expect(result.current.currentMood).toBeNull();
    });

    it('should have empty action arrays', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      expect(result.current.selectedEnergyActions).toEqual([]);
      expect(result.current.selectedMoodActions).toEqual([]);
    });

    it('should have modals closed initially', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      expect(result.current.showEnergyModal).toBe(false);
      expect(result.current.showMoodModal).toBe(false);
    });
  });

  describe('Energy Tracking', () => {
    it('should set energy tracking for all periods', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      act(() => {
        result.current.setEnergyTracking({ morning: 4, afternoon: 3, evening: 2 });
      });

      expect(result.current.energyTracking.morning).toBe(4);
      expect(result.current.energyTracking.afternoon).toBe(3);
      expect(result.current.energyTracking.evening).toBe(2);
    });

    it('should set current energy for current period', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      act(() => {
        result.current.setCurrentEnergy(5);
      });

      // Energy should be set for the current time period
      const period = result.current.getTimeOfDay();
      expect(result.current.energyTracking[period]).toBe(5);
    });

    it('should calculate average energy correctly', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      act(() => {
        result.current.setEnergyTracking({ morning: 4, afternoon: 3, evening: 5 });
      });

      const average = result.current.getCurrentEnergy();
      expect(average).toBe(4); // (4 + 3 + 5) / 3 = 4
    });

    it('should ignore null values when calculating average', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      act(() => {
        result.current.setEnergyTracking({ morning: 4, afternoon: null, evening: 2 });
      });

      const average = result.current.getCurrentEnergy();
      expect(average).toBe(3); // (4 + 2) / 2 = 3
    });

    it('should return 0 if no energy tracked', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      const average = result.current.getCurrentEnergy();
      expect(average).toBe(0);
    });

    it('should get current period energy', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      act(() => {
        result.current.setEnergyTracking({ morning: 4, afternoon: 3, evening: 2 });
      });

      const periodEnergy = result.current.getCurrentPeriodEnergy();
      const period = result.current.getTimeOfDay();

      expect(periodEnergy).toBe(result.current.energyTracking[period]);
    });
  });

  describe('Time of Day Detection', () => {
    it('should detect time of day correctly', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      const timeOfDay = result.current.getTimeOfDay();

      // Should return one of the valid periods
      expect(['morning', 'afternoon', 'evening']).toContain(timeOfDay);
    });
  });

  describe('Mood Tracking', () => {
    it('should set current mood', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      act(() => {
        result.current.setCurrentMood('energized');
      });

      expect(result.current.currentMood).toBe('energized');
    });

    it('should update mood', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      act(() => {
        result.current.setCurrentMood('anxious');
      });

      expect(result.current.currentMood).toBe('anxious');

      act(() => {
        result.current.setCurrentMood('calm');
      });

      expect(result.current.currentMood).toBe('calm');
    });
  });

  describe('Energy Actions', () => {
    it('should add energy action', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      act(() => {
        result.current.handleEnergyActionSelect('take-walk');
      });

      expect(result.current.selectedEnergyActions).toContain('take-walk');
    });

    it('should add multiple energy actions', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      act(() => {
        result.current.handleEnergyActionSelect('take-walk');
        result.current.handleEnergyActionSelect('power-nap');
      });

      expect(result.current.selectedEnergyActions).toEqual(['take-walk', 'power-nap']);
    });

    it('should not add duplicate energy actions', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      act(() => {
        result.current.handleEnergyActionSelect('take-walk');
        result.current.handleEnergyActionSelect('take-walk');
      });

      expect(result.current.selectedEnergyActions).toEqual(['take-walk']);
    });

    it('should set energy actions directly', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      act(() => {
        result.current.setSelectedEnergyActions(['action1', 'action2', 'action3']);
      });

      expect(result.current.selectedEnergyActions).toEqual(['action1', 'action2', 'action3']);
    });
  });

  describe('Mood Actions', () => {
    it('should add mood action', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      act(() => {
        result.current.handleMoodActionSelect('breathing-exercise');
      });

      expect(result.current.selectedMoodActions).toContain('breathing-exercise');
    });

    it('should add multiple mood actions', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      act(() => {
        result.current.handleMoodActionSelect('breathing-exercise');
        result.current.handleMoodActionSelect('gratitude-journal');
      });

      expect(result.current.selectedMoodActions).toEqual(['breathing-exercise', 'gratitude-journal']);
    });

    it('should not add duplicate mood actions', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      act(() => {
        result.current.handleMoodActionSelect('breathing-exercise');
        result.current.handleMoodActionSelect('breathing-exercise');
      });

      expect(result.current.selectedMoodActions).toEqual(['breathing-exercise']);
    });

    it('should set mood actions directly', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      act(() => {
        result.current.setSelectedMoodActions(['action1', 'action2']);
      });

      expect(result.current.selectedMoodActions).toEqual(['action1', 'action2']);
    });
  });

  describe('Modal State', () => {
    it('should show energy modal', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      act(() => {
        result.current.setShowEnergyModal(true);
      });

      expect(result.current.showEnergyModal).toBe(true);
    });

    it('should hide energy modal', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      act(() => {
        result.current.setShowEnergyModal(true);
        result.current.setShowEnergyModal(false);
      });

      expect(result.current.showEnergyModal).toBe(false);
    });

    it('should show mood modal', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      act(() => {
        result.current.setShowMoodModal(true);
      });

      expect(result.current.showMoodModal).toBe(true);
    });

    it('should hide mood modal', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      act(() => {
        result.current.setShowMoodModal(true);
        result.current.setShowMoodModal(false);
      });

      expect(result.current.showMoodModal).toBe(false);
    });
  });

  describe('Energy Suggestions', () => {
    it('should provide critical rest suggestions for energy level 1', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      const suggestions = result.current.getEnergyBasedSuggestions(1);

      expect(suggestions.title).toBe('Critical Rest Needed');
      expect(suggestions.color).toBe('rose');
      expect(suggestions.tasks).toBeDefined();
      expect(suggestions.snacks).toBeDefined();
      expect(suggestions.warning).toBeDefined();
    });

    it('should provide gentle mode suggestions for energy level 2', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      const suggestions = result.current.getEnergyBasedSuggestions(2);

      expect(suggestions.title).toBe('Gentle Mode Active');
      expect(suggestions.color).toBe('purple');
    });

    it('should provide moderate energy suggestions for energy level 3', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      const suggestions = result.current.getEnergyBasedSuggestions(3);

      expect(suggestions.title).toBe('Steady Progress Mode');
      expect(suggestions.color).toBe('cyan');
    });

    it('should provide high productivity suggestions for energy level 4', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      const suggestions = result.current.getEnergyBasedSuggestions(4);

      expect(suggestions.title).toBe('Peak Performance Window');
      expect(suggestions.color).toBe('orange');
    });

    it('should provide peak performance suggestions for energy level 5', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      const suggestions = result.current.getEnergyBasedSuggestions(5);

      expect(suggestions.title).toBe('Flow State Activated');
      expect(suggestions.color).toBe('yellow');
    });

    it('should include tasks array in suggestions', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      const suggestions = result.current.getEnergyBasedSuggestions(4);

      expect(Array.isArray(suggestions.tasks)).toBe(true);
      expect(suggestions.tasks.length).toBeGreaterThan(0);
    });

    it('should include snacks array in suggestions', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      const suggestions = result.current.getEnergyBasedSuggestions(3);

      expect(Array.isArray(suggestions.snacks)).toBe(true);
      expect(suggestions.snacks.length).toBeGreaterThan(0);

      // Check snack structure
      const snack = suggestions.snacks[0];
      expect(snack).toHaveProperty('name');
      expect(snack).toHaveProperty('protein');
      expect(snack).toHaveProperty('note');
    });
  });

  describe('Mood Wellness Suggestions', () => {
    it('should provide anxious mood wellness suggestions', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      const suggestions = result.current.getMoodBasedWellness('anxious');

      expect(suggestions).toBeDefined();
      expect(suggestions.title).toBe('Grounding & Soothing');
      expect(suggestions.activities).toBeDefined();
      expect(Array.isArray(suggestions.activities)).toBe(true);
      expect(suggestions.activities.length).toBeGreaterThan(0);
    });

    it('should provide overwhelmed mood wellness suggestions', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      const suggestions = result.current.getMoodBasedWellness('overwhelmed');

      expect(suggestions).toBeDefined();
      expect(suggestions.title).toBe('🌸 GENTLE MODE ACTIVATED');
      expect(suggestions.activities).toBeDefined();
      expect(Array.isArray(suggestions.activities)).toBe(true);
    });

    it('should provide energized mood wellness suggestions', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      const suggestions = result.current.getMoodBasedWellness('energized');

      expect(suggestions).toBeDefined();
      expect(suggestions.title).toBe('Channel Your Energy Wisely');
      expect(suggestions.activities).toBeDefined();
      expect(Array.isArray(suggestions.activities)).toBe(true);
    });

    it('should provide focused mood wellness suggestions', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      const suggestions = result.current.getMoodBasedWellness('focused');

      expect(suggestions).toBeDefined();
      expect(suggestions.title).toBe('Deep Work Opportunity');
      expect(suggestions.activities).toBeDefined();
      expect(Array.isArray(suggestions.activities)).toBe(true);
    });

    it('should provide calm mood wellness suggestions', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      const suggestions = result.current.getMoodBasedWellness('calm');

      expect(suggestions).toBeDefined();
      expect(suggestions.title).toBe('Reflective State');
      expect(suggestions.activities).toBeDefined();
      expect(Array.isArray(suggestions.activities)).toBe(true);
    });

    it('should provide tired mood wellness suggestions', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      const suggestions = result.current.getMoodBasedWellness('tired');

      expect(suggestions).toBeDefined();
      expect(suggestions.title).toBe('Rest & Recovery Mode');
      expect(suggestions.activities).toBeDefined();
      expect(Array.isArray(suggestions.activities)).toBe(true);
    });

    it('should return null for unknown mood', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      const suggestions = result.current.getMoodBasedWellness('unknown-mood');

      expect(suggestions).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle partial energy tracking', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      act(() => {
        result.current.setEnergyTracking({ morning: 5, afternoon: null, evening: null });
      });

      const average = result.current.getCurrentEnergy();
      expect(average).toBe(5);
    });

    it('should handle energy tracking with single period', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      act(() => {
        result.current.setCurrentEnergy(3);
      });

      const average = result.current.getCurrentEnergy();
      expect(average).toBe(3);
    });

    it('should maintain state consistency after multiple updates', () => {
      const { result } = renderHook(() => useEnergyMoodStore());

      act(() => {
        result.current.setCurrentEnergy(4);
        result.current.setCurrentMood('focused');
        result.current.handleEnergyActionSelect('task1');
        result.current.handleMoodActionSelect('mood1');
      });

      expect(result.current.currentMood).toBe('focused');
      expect(result.current.selectedEnergyActions).toContain('task1');
      expect(result.current.selectedMoodActions).toContain('mood1');
    });
  });
});
