import React from 'react';
import Onboarding from '../Onboarding'; // Original component
import useStore from '../store/useStore';

const OnboardingPage = ({ darkMode }) => {
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

    // Save profile to store — the Router automatically redirects away from
    // /onboarding when hasCompletedOnboarding becomes true, so no manual
    // navigate() call is needed (and would race with the Router's <Navigate>).
    setUserProfile(completeProfile);
  };

  return (
    <Onboarding
      onComplete={handleOnboardingComplete}
      darkMode={darkMode}
    />
  );
};

export default OnboardingPage;

