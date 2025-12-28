import React from 'react';
import { Calendar, MapPin, Users, Star, Volume2, Tag } from 'lucide-react';

/**
 * Story Card Component
 *
 * Displays a story in grid, list, or timeline view
 */
const StoryCard = ({ story, viewMode = 'grid', darkMode, onClick }) => {
  const {
    title,
    what,
    who = [],
    where: location,
    when,
    storyDate,
    category,
    tags = [],
    isFavorite,
    audioUrl,
    createdAt
  } = story;

  const displayDate = storyDate || createdAt;
  const formattedDate = new Date(displayDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // Grid View
  if (viewMode === 'grid') {
    return (
      <div
        onClick={onClick}
        className={`group cursor-pointer rounded-xl p-5 transition-all hover:scale-105 ${
          darkMode
            ? 'bg-gray-800/50 border-2 border-gray-700 hover:border-purple-500/50'
            : 'bg-white border-2 border-gray-200 hover:border-purple-400'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className={`font-bold text-lg mb-1 truncate ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {title || 'Untitled Story'}
            </h3>
            <div className={`flex items-center gap-2 text-xs ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <Calendar size={12} />
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Indicators */}
          <div className="flex items-center gap-1 ml-2">
            {isFavorite && (
              <Star size={16} className="text-amber-500 fill-amber-500" />
            )}
            {audioUrl && (
              <Volume2 size={16} className={darkMode ? 'text-purple-400' : 'text-purple-600'} />
            )}
          </div>
        </div>

        {/* Content Preview */}
        {what && (
          <p className={`text-sm mb-3 line-clamp-3 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {what}
          </p>
        )}

        {/* Metadata */}
        <div className="space-y-2">
          {who.length > 0 && (
            <div className={`flex items-center gap-2 text-xs ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <Users size={12} />
              <span className="truncate">{who.slice(0, 3).join(', ')}</span>
            </div>
          )}

          {location && (
            <div className={`flex items-center gap-2 text-xs ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <MapPin size={12} />
              <span className="truncate">{location}</span>
            </div>
          )}
        </div>

        {/* Tags & Category */}
        {(tags.length > 0 || category) && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {category && (
              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                darkMode
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'bg-purple-100 text-purple-700'
              }`}>
                {category}
              </span>
            )}
            {tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className={`px-2 py-0.5 rounded text-xs ${
                  darkMode
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {tag}
              </span>
            ))}
            {tags.length > 2 && (
              <span className={`px-2 py-0.5 rounded text-xs ${
                darkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>
                +{tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  // List View
  if (viewMode === 'list') {
    return (
      <div
        onClick={onClick}
        className={`group cursor-pointer rounded-xl p-4 transition-all ${
          darkMode
            ? 'bg-gray-800/50 border-2 border-gray-700 hover:border-purple-500/50'
            : 'bg-white border-2 border-gray-200 hover:border-purple-400'
        }`}
      >
        <div className="flex items-start gap-4">
          {/* Date Badge */}
          <div className={`flex-shrink-0 w-16 text-center p-2 rounded-lg ${
            darkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <div className={`text-xs font-semibold ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {new Date(displayDate).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
            </div>
            <div className={`text-2xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {new Date(displayDate).getDate()}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className={`font-bold text-lg ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {title || 'Untitled Story'}
              </h3>
              <div className="flex items-center gap-1 ml-2">
                {isFavorite && <Star size={16} className="text-amber-500 fill-amber-500" />}
                {audioUrl && <Volume2 size={16} className={darkMode ? 'text-purple-400' : 'text-purple-600'} />}
              </div>
            </div>

            {what && (
              <p className={`text-sm mb-2 line-clamp-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {what}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-xs">
              {who.length > 0 && (
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  <Users size={12} className="inline mr-1" />
                  {who.slice(0, 2).join(', ')}
                </span>
              )}
              {location && (
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  <MapPin size={12} className="inline mr-1" />
                  {location}
                </span>
              )}
              {tags.length > 0 && (
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  <Tag size={12} className="inline mr-1" />
                  {tags.slice(0, 2).join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Timeline View
  if (viewMode === 'timeline') {
    return (
      <div className="relative pl-8">
        {/* Timeline Line */}
        <div className={`absolute left-2 top-0 bottom-0 w-0.5 ${
          darkMode ? 'bg-gray-700' : 'bg-gray-300'
        }`} />

        {/* Timeline Dot */}
        <div className={`absolute left-0 top-0 w-5 h-5 rounded-full border-4 ${
          darkMode
            ? 'bg-gray-900 border-purple-500'
            : 'bg-white border-purple-500'
        }`} />

        {/* Content */}
        <div
          onClick={onClick}
          className={`group cursor-pointer rounded-xl p-5 transition-all ${
            darkMode
              ? 'bg-gray-800/50 border-2 border-gray-700 hover:border-purple-500/50'
              : 'bg-white border-2 border-gray-200 hover:border-purple-400'
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className={`font-bold text-lg ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {title || 'Untitled Story'}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {formattedDate}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {isFavorite && <Star size={16} className="text-amber-500 fill-amber-500" />}
              {audioUrl && <Volume2 size={16} className={darkMode ? 'text-purple-400' : 'text-purple-600'} />}
            </div>
          </div>

          {what && (
            <p className={`text-sm mb-3 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {what}
            </p>
          )}

          <div className="flex flex-wrap gap-2 text-xs">
            {who.length > 0 && (
              <div className={`flex items-center gap-1 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <Users size={12} />
                {who.slice(0, 2).join(', ')}
              </div>
            )}
            {location && (
              <div className={`flex items-center gap-1 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <MapPin size={12} />
                {location}
              </div>
            )}
          </div>

          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tags.map(tag => (
                <span
                  key={tag}
                  className={`px-2 py-0.5 rounded text-xs ${
                    darkMode
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default StoryCard;
