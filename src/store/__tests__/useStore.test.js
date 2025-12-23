import { renderHook, act } from '@testing-library/react';
import useStore from '../useStore';

describe('useStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { result } = renderHook(() => useStore());
    act(() => {
      result.current.setDarkMode(false);
      result.current.setUserProfile({
        weight: null,
        height: null,
        age: null,
        lifeStage: 'reproductive',
        hasCompletedOnboarding: false
      });
    });
  });

  describe('Dark Mode', () => {
    it('should initialize with dark mode off', () => {
      const { result } = renderHook(() => useStore());
      expect(result.current.darkMode).toBe(false);
    });

    it('should toggle dark mode', () => {
      const { result } = renderHook(() => useStore());

      act(() => {
        result.current.setDarkMode(true);
      });

      expect(result.current.darkMode).toBe(true);

      act(() => {
        result.current.setDarkMode(false);
      });

      expect(result.current.darkMode).toBe(false);
    });
  });

  describe('User Profile', () => {
    it('should initialize with default profile', () => {
      const { result } = renderHook(() => useStore());

      expect(result.current.userProfile).toBeDefined();
      expect(result.current.userProfile.hasCompletedOnboarding).toBe(false);
      expect(result.current.userProfile.lifeStage).toBe('reproductive');
    });

    it('should update user profile', () => {
      const { result } = renderHook(() => useStore());

      const newProfile = {
        weight: 150,
        height: 65,
        age: 45,
        lifeStage: 'perimenopause',
        hasCompletedOnboarding: true
      };

      act(() => {
        result.current.setUserProfile(newProfile);
      });

      expect(result.current.userProfile.weight).toBe(150);
      expect(result.current.userProfile.age).toBe(45);
      expect(result.current.userProfile.lifeStage).toBe('perimenopause');
      expect(result.current.userProfile.hasCompletedOnboarding).toBe(true);
    });

    it('should update only specific profile fields', () => {
      const { result } = renderHook(() => useStore());

      const initialProfile = result.current.userProfile;

      act(() => {
        result.current.setUserProfile({ ...initialProfile, weight: 150 });
      });

      expect(result.current.userProfile.weight).toBe(150);
      expect(result.current.userProfile.lifeStage).toBe(initialProfile.lifeStage);
    });
  });

  describe('Life Stage', () => {
    it('should correctly set reproductive life stage', () => {
      const { result } = renderHook(() => useStore());

      act(() => {
        result.current.setUserProfile({ lifeStage: 'reproductive' });
      });

      expect(result.current.userProfile.lifeStage).toBe('reproductive');
    });

    it('should correctly set perimenopause life stage', () => {
      const { result } = renderHook(() => useStore());

      act(() => {
        result.current.setUserProfile({ lifeStage: 'perimenopause' });
      });

      expect(result.current.userProfile.lifeStage).toBe('perimenopause');
    });
  });

  describe('Onboarding', () => {
    it('should mark onboarding as complete', () => {
      const { result } = renderHook(() => useStore());

      expect(result.current.userProfile.hasCompletedOnboarding).toBe(false);

      act(() => {
        result.current.setUserProfile({ hasCompletedOnboarding: true });
      });

      expect(result.current.userProfile.hasCompletedOnboarding).toBe(true);
    });
  });
});
