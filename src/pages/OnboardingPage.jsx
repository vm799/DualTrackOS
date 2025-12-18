import React from 'react';
import Onboarding from '../Onboarding'; // Original component

const OnboardingPage = ({ darkMode, onComplete }) => {
  return (
    <Onboarding
      onComplete={onComplete}
      darkMode={darkMode}
    />
  );
};

export default OnboardingPage;
