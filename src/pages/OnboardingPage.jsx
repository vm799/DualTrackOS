import React from 'react';
import { useNavigate } from 'react-router-dom';
import Onboarding from '../Onboarding'; // Original component
import useStore from '../store/useStore';

const OnboardingPage = ({ darkMode }) => {
  const navigate = useNavigate();
  const setUserProfile = useStore((state) => state.setUserProfile);
  const currentUserProfile = useStore((state) => state.userProfile);

  const handleOnboardingComplete = (profile) => {
    // Merge with existing profile to ensure all fields are present
    const completeProfile = {
      ...currentUserProfile,
      ...profile,
      hasCompletedOnboarding: true,
      disclaimerAccepted: true
    };

    // Save profile to store before navigating
    setUserProfile(completeProfile);

    // Use setTimeout to ensure state update has propagated
    setTimeout(() => {
      navigate('/dashboard');
    }, 0);
  };

  return (
    <Onboarding
      onComplete={handleOnboardingComplete}
      darkMode={darkMode}
    />
  );
};

export default OnboardingPage;

