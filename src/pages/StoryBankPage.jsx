import React, { useState } from 'react';
import { BookOpen, Plus, Mic, TrendingUp, Search, Filter, Grid, List, Calendar, Bell, BellOff, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import useStoryBankStore from '../store/useStoryBankStore';
import StoryEditor from '../components/StoryBank/StoryEditor';
import StoryCard from '../components/StoryBank/StoryCard';
import ProgressTracker from '../components/StoryBank/ProgressTracker';

/**
 * Story Bank Page
 *
 * Main hub for building your story bank following Vin Scully's methodology
 * - Document 1 story per day using 5W1H framework
 * - Voice transcription support
 * - Daily AI/tech news integration
 * - Track progress toward 365-story goal
 */
const StoryBankPage = () => {
  const navigate = useNavigate();
  const darkMode = useStore((state) => state.darkMode);
  const {
    stories,
    filters,
    viewMode,
    reminderSettings,
    setSearchQuery,
    setViewMode,
    setReminderEnabled,
    getFilteredStories,
    getYearlyProgress
  } = useStoryBankStore();

  const [showEditor, setShowEditor] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filteredStories = getFilteredStories();
  const progress = getYearlyProgress();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#191919]' : 'bg-gray-50'}`}>
      {/* HEADER */}
      <div className={`sticky top-0 z-20 backdrop-blur-xl transition-all ${
        darkMode
          ? 'bg-gray-900/95 border-b border-gray-800/50'
          : 'bg-white/95 border-b border-gray-200/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Back Arrow and Large Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className={`p-2 rounded-lg transition-all ${
                  darkMode
                    ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
                title="Back to Home"
                aria-label="Back to Home"
              >
                <ArrowLeft size={24} />
              </button>

              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-3 hover:opacity-80 transition-all"
                title="Go to Dashboard"
              >
                <img
                  src="/lioness-logo.png"
                  alt="DualTrack OS"
                  className="w-16 h-16 drop-shadow-lg"
                />
                <h1 className={`text-2xl sm:text-3xl font-bold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Story Bank
                </h1>
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setReminderEnabled(!reminderSettings.enabled)}
                className={`p-2 rounded-lg transition-all ${
                  reminderSettings.enabled
                    ? darkMode
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-600 text-white'
                    : darkMode
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-400'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
                title={reminderSettings.enabled ? 'Disable daily reminder' : 'Enable daily reminder'}
              >
                {reminderSettings.enabled ? <Bell size={20} /> : <BellOff size={20} />}
              </button>

              <button
                onClick={() => setShowEditor(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  darkMode
                    ? 'bg-purple-600 hover:bg-purple-500 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                <Plus size={20} />
                <span className="hidden sm:inline">New Story</span>
              </button>

              <button
                onClick={() => setShowEditor(true)}
                className={`p-2 rounded-lg transition-all ${
                  darkMode
                    ? 'bg-gray-800 hover:bg-gray-700 text-purple-400'
                    : 'bg-gray-100 hover:bg-gray-200 text-purple-600'
                }`}
                title="Voice Recording"
              >
                <Mic size={20} />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <ProgressTracker progress={progress} darkMode={darkMode} />
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search & Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}
              size={20}
            />
            <input
              type="text"
              placeholder="Search stories..."
              value={filters.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border-2 ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:border-purple-500`}
            />
          </div>

          {/* View Mode */}
          <div className={`flex items-center gap-1 p-1 rounded-lg ${
            darkMode ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid'
                  ? darkMode
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-600 text-white'
                  : darkMode
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Grid View"
            >
              <Grid size={18} />
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${
                viewMode === 'list'
                  ? darkMode
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-600 text-white'
                  : darkMode
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
              title="List View"
            >
              <List size={18} />
            </button>

            <button
              onClick={() => setViewMode('timeline')}
              className={`p-2 rounded ${
                viewMode === 'timeline'
                  ? darkMode
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-600 text-white'
                  : darkMode
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Timeline View"
            >
              <Calendar size={18} />
            </button>
          </div>

          {/* Filters Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              darkMode
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <Filter size={18} />
            Filters
          </button>
        </div>

        {/* Empty State */}
        {filteredStories.length === 0 && !filters.searchQuery && (
          <div className="text-center py-16">
            <BookOpen
              className={`mx-auto mb-4 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`}
              size={64}
            />
            <h2 className={`text-2xl font-bold mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Start Building Your Story Bank
            </h2>
            <p className={`text-sm mb-6 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Document your first story using the 5W1H framework
            </p>
            <button
              onClick={() => setShowEditor(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-all"
            >
              <Plus size={20} />
              Create Your First Story
            </button>
          </div>
        )}

        {/* No Search Results */}
        {filteredStories.length === 0 && filters.searchQuery && (
          <div className="text-center py-16">
            <Search
              className={`mx-auto mb-4 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`}
              size={64}
            />
            <h2 className={`text-2xl font-bold mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              No stories found
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Try a different search term or create a new story
            </p>
          </div>
        )}

        {/* Stories Grid */}
        {filteredStories.length > 0 && (
          <div className={`
            ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : ''}
            ${viewMode === 'list' ? 'space-y-4' : ''}
            ${viewMode === 'timeline' ? 'space-y-8' : ''}
          `}>
            {filteredStories.map(story => (
              <StoryCard
                key={story.id}
                story={story}
                viewMode={viewMode}
                darkMode={darkMode}
                onClick={() => {
                  useStoryBankStore.getState().setCurrentStory(story);
                  setShowEditor(true);
                }}
              />
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {stories.length > 0 && (
          <div className={`mt-8 p-6 rounded-xl ${
            darkMode ? 'bg-gray-800/50' : 'bg-white'
          } border-2 ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className={darkMode ? 'text-purple-400' : 'text-purple-600'} size={20} />
              <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Your Progress
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Stories
                </p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stories.length}
                </p>
              </div>
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  This Year
                </p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                  {progress.count}
                </p>
              </div>
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Remaining
                </p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {progress.remaining}
                </p>
              </div>
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Progress
                </p>
                <p className={`text-2xl font-bold ${
                  progress.onTrack
                    ? darkMode ? 'text-emerald-400' : 'text-emerald-600'
                    : darkMode ? 'text-amber-400' : 'text-amber-600'
                }`}>
                  {progress.percentage}%
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Story Editor Modal */}
      {showEditor && (
        <StoryEditor
          darkMode={darkMode}
          onClose={() => {
            setShowEditor(false);
            useStoryBankStore.getState().setCurrentStory(null);
          }}
        />
      )}
    </div>
  );
};

export default StoryBankPage;
