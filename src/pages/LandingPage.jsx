import React from 'react';
import LandingPage from '../LandingPage'; // Original component

const LandingPageView = ({ darkMode, onEnter, onViewStory }) => {
  return (
    <LandingPage
      onEnter={onEnter}
      onViewStory={onViewStory}
      darkMode={darkMode}
    />
  );
};

export default LandingPageView;
