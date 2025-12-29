import React from 'react';
import { useNavigate } from 'react-router-dom';
import StoryPage from '../StoryPage'; // Original component

const StoryPageView = ({ darkMode }) => {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate('/onboarding');
  };

  return (
    <StoryPage
      onEnter={handleEnter}
      darkMode={darkMode}
    />
  );
};

export default StoryPageView;

