import React from 'react';
import { useNavigate } from 'react-router-dom';
import StoryPage from '../StoryPage'; // Original component

const StoryPageView = ({ darkMode }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const handleEnter = () => {
    navigate('/onboarding');
  };

  return (
    <StoryPage
      onBack={handleBack}
      onEnter={handleEnter}
      darkMode={darkMode}
    />
  );
};

export default StoryPageView;

