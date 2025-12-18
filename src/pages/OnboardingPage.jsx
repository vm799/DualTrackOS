import React from 'react';
import { useNavigate } from 'react-router-dom';
import Onboarding from '../Onboarding'; // Original component

const OnboardingPage = ({ darkMode }) => {
  const navigate = useNavigate();

  const handleOnboardingComplete = (profile) => {
    // This function will still be passed to the original Onboarding component
    // but the navigation happens here
    // setUserProfile(profile); // This will be handled by the original Onboarding component or a centralized store
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

