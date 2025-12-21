import React from 'react';
import { useNavigate } from 'react-router-dom';
import LandingPage from '../LandingPage'; // Original component
import useStore from '../store/useStore';

const LandingPageView = ({ darkMode }) => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);

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
      user={user}
    />
  );
};

export default LandingPageView;

