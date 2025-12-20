import React from 'react';
import { useNavigate } from 'react-router-dom';
import LandingPage from '../LandingPage'; // Original component

const LandingPageView = ({ darkMode }) => {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate('/onboarding');
  };

  const handleViewStory = () => {
    navigate('/story');
  };

  return (
    <LandingPage
      onEnter={handleEnter}
      onViewStory={handleViewStory}
      darkMode={darkMode}
    />
  );
};

export default LandingPageView;

