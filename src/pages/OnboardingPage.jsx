import React from 'react';
import { useNavigate } from 'react-router-dom';
import Onboarding from '../Onboarding'; // Original component
import useStore from '../store/useStore';

const OnboardingPage = ({ darkMode }) => {
  const navigate = useNavigate();
  const setUserProfile = useStore((state) => state.setUserProfile);

  const handleOnboardingComplete = (profile) => {
    // Save profile to store before navigating
    setUserProfile(profile);
    navigate('/dashboard');
  };

  return (
    <Onboarding
      onComplete={handleOnboardingComplete}
      darkMode={darkMode}
    />
  );
};

export default OnboardingPage;

