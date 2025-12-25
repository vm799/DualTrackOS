import React from 'react';
import { useNavigate } from 'react-router-dom';
import LandingPage from '../LandingPage'; // Original component
import useStore from '../store/useStore';

const LandingPageView = ({ darkMode }) => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const userProfile = useStore((state) => state.userProfile);

  const handleEnter = () => {
    // If user has completed onboarding, go to check-in
    // If not, show preview/demo first to demonstrate value
    if (userProfile.hasCompletedOnboarding) {
      navigate('/check-in');
    } else {
      navigate('/preview');
    }
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

