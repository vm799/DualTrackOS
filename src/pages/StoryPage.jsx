import React from 'react';
import StoryPage from '../StoryPage'; // Original component

const StoryPageView = ({ darkMode, onBack, onEnter }) => {
  return (
    <StoryPage
      onBack={onBack}
      onEnter={onEnter}
      darkMode={darkMode}
    />
  );
};

export default StoryPageView;
