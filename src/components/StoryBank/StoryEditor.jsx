import React, { useState, useEffect } from 'react';
import { X, Save, Mic, Square, Play, Pause, Trash2, Star, Tag, Calendar } from 'lucide-react';
import useStoryBankStore from '../../store/useStoryBankStore';

/**
 * Story Editor Component
 *
 * Structured editor for creating/editing stories using 5W1H framework
 * - Who: Characters involved
 * - What: What happened
 * - Where: Location/setting
 * - When: Time context
 * - Why: Purpose/motivation
 * - How: How it unfolded
 * + Dialogue
 *
 * Features:
 * - Voice recording with Web Speech API
 * - Auto-save drafts
 * - Tag management
 * - Category selection
 */
const StoryEditor = ({ darkMode, onClose }) => {
  const { currentStory, addStory, updateStory } = useStoryBankStore();

  const [formData, setFormData] = useState({
    title: '',
    who: [],
    what: '',
    where: '',
    when: '',
    why: '',
    how: '',
    dialogue: [],
    category: 'personal',
    tags: [],
    storyDate: new Date().toISOString().split('T')[0],
    isFavorite: false
  });

  const [isRecording, setIsRecording] = useState(false);
  const [currentField, setCurrentField] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const [whoInput, setWhoInput] = useState('');

  // Load current story into form
  useEffect(() => {
    if (currentStory) {
      setFormData({
        title: currentStory.title || '',
        who: currentStory.who || [],
        what: currentStory.what || '',
        where: currentStory.where || '',
        when: currentStory.when || '',
        why: currentStory.why || '',
        how: currentStory.how || '',
        dialogue: currentStory.dialogue || [],
        category: currentStory.category || 'personal',
        tags: currentStory.tags || [],
        storyDate: currentStory.storyDate
          ? new Date(currentStory.storyDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        isFavorite: currentStory.isFavorite || false
      });
    }
  }, [currentStory]);

  // Handle form field changes
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Add person to "who" list
  const addPerson = () => {
    if (whoInput.trim()) {
      setFormData(prev => ({
        ...prev,
        who: [...prev.who, whoInput.trim()]
      }));
      setWhoInput('');
    }
  };

  // Remove person from "who" list
  const removePerson = (index) => {
    setFormData(prev => ({
      ...prev,
      who: prev.who.filter((_, i) => i !== index)
    }));
  };

  // Add tag
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim().toLowerCase()]
      }));
      setTagInput('');
    }
  };

  // Remove tag
  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  // Start voice recording for a field
  const startVoiceRecording = (field) => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');

      if (event.results[event.results.length - 1].isFinal) {
        handleChange(field, formData[field] + ' ' + transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      setCurrentField(null);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setCurrentField(null);
    };

    recognition.start();
    setIsRecording(true);
    setCurrentField(field);

    // Store recognition instance for stopping
    window._currentRecognition = recognition;
  };

  // Stop voice recording
  const stopVoiceRecording = () => {
    if (window._currentRecognition) {
      window._currentRecognition.stop();
      window._currentRecognition = null;
    }
    setIsRecording(false);
    setCurrentField(null);
  };

  // Save story
  const handleSave = () => {
    if (!formData.title.trim()) {
      alert('Please add a title for your story');
      return;
    }

    const storyData = {
      ...formData,
      storyDate: new Date(formData.storyDate).toISOString()
    };

    if (currentStory) {
      updateStory(currentStory.id, storyData);
    } else {
      addStory(storyData);
    }

    onClose();
  };

  const categories = [
    { value: 'personal', label: 'Personal' },
    { value: 'work', label: 'Work' },
    { value: 'family', label: 'Family' },
    { value: 'travel', label: 'Travel' },
    { value: 'achievement', label: 'Achievement' },
    { value: 'lesson', label: 'Lesson Learned' },
    { value: 'funny', label: 'Funny' },
    { value: 'inspiring', label: 'Inspiring' },
    { value: 'news', label: 'News/Current Events' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg p-4 overflow-y-auto">
      <div className={`max-w-4xl w-full rounded-3xl my-8 ${
        darkMode ? 'bg-gray-900 border-2 border-purple-500/30' : 'bg-white border-2 border-purple-200'
      }`}>
        {/* Header */}
        <div className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${
          darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {currentStory ? 'Edit Story' : 'New Story'}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-all ${
              darkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title & Metadata Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Title */}
            <div className="md:col-span-2">
              <label className={`block text-sm font-semibold mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Story Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Give your story a memorable title..."
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:border-purple-500`}
              />
            </div>

            {/* Date */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Story Date
              </label>
              <div className="relative">
                <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`} size={18} />
                <input
                  type="date"
                  value={formData.storyDate}
                  onChange={(e) => handleChange('storyDate', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 ${
                    darkMode
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'bg-white border-gray-200 text-gray-900'
                  } focus:outline-none focus:border-purple-500`}
                />
              </div>
            </div>
          </div>

          {/* Category & Favorite */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-200 text-gray-900'
                } focus:outline-none focus:border-purple-500`}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => handleChange('isFavorite', !formData.isFavorite)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  formData.isFavorite
                    ? darkMode
                      ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                      : 'bg-amber-100 border-amber-500 text-amber-700'
                    : darkMode
                      ? 'bg-gray-800 border-gray-700 text-gray-400 hover:border-amber-500/50'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-amber-400'
                }`}
              >
                <Star size={18} className={formData.isFavorite ? 'fill-current' : ''} />
                {formData.isFavorite ? 'Favorite' : 'Mark as Favorite'}
              </button>
            </div>
          </div>

          {/* 5W1H Framework */}
          <div className="space-y-4">
            <h3 className={`text-lg font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              The 5W1H Framework
            </h3>

            {/* WHO */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                WHO - Characters involved
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={whoInput}
                  onChange={(e) => setWhoInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPerson())}
                  placeholder="Add a person (press Enter)..."
                  className={`flex-1 px-4 py-2 rounded-lg border-2 ${
                    darkMode
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:border-purple-500`}
                />
                <button
                  onClick={addPerson}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    darkMode
                      ? 'bg-purple-600 hover:bg-purple-500 text-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.who.map((person, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                      darkMode
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {person}
                    <button
                      onClick={() => removePerson(index)}
                      className="hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* WHAT */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={`text-sm font-semibold ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  WHAT - What happened? *
                </label>
                <button
                  onClick={() => isRecording && currentField === 'what' ? stopVoiceRecording() : startVoiceRecording('what')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs transition-all ${
                    isRecording && currentField === 'what'
                      ? 'bg-red-500 text-white animate-pulse'
                      : darkMode
                        ? 'bg-gray-800 hover:bg-gray-700 text-purple-400'
                        : 'bg-gray-100 hover:bg-gray-200 text-purple-600'
                  }`}
                >
                  {isRecording && currentField === 'what' ? <Square size={14} /> : <Mic size={14} />}
                  {isRecording && currentField === 'what' ? 'Stop' : 'Voice'}
                </button>
              </div>
              <textarea
                value={formData.what}
                onChange={(e) => handleChange('what', e.target.value)}
                placeholder="Describe what happened in this story..."
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:border-purple-500 resize-none`}
              />
            </div>

            {/* WHERE */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                WHERE - Location/setting
              </label>
              <input
                type="text"
                value={formData.where}
                onChange={(e) => handleChange('where', e.target.value)}
                placeholder="Where did this take place?"
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:border-purple-500`}
              />
            </div>

            {/* WHEN */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                WHEN - Time context
              </label>
              <input
                type="text"
                value={formData.when}
                onChange={(e) => handleChange('when', e.target.value)}
                placeholder="When did this happen? (e.g., 'Summer 2023', 'Last Tuesday morning')"
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:border-purple-500`}
              />
            </div>

            {/* WHY */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={`text-sm font-semibold ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  WHY - Purpose/motivation
                </label>
                <button
                  onClick={() => isRecording && currentField === 'why' ? stopVoiceRecording() : startVoiceRecording('why')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs transition-all ${
                    isRecording && currentField === 'why'
                      ? 'bg-red-500 text-white animate-pulse'
                      : darkMode
                        ? 'bg-gray-800 hover:bg-gray-700 text-purple-400'
                        : 'bg-gray-100 hover:bg-gray-200 text-purple-600'
                  }`}
                >
                  {isRecording && currentField === 'why' ? <Square size={14} /> : <Mic size={14} />}
                  {isRecording && currentField === 'why' ? 'Stop' : 'Voice'}
                </button>
              </div>
              <textarea
                value={formData.why}
                onChange={(e) => handleChange('why', e.target.value)}
                placeholder="Why did this happen? What was the motivation or purpose?"
                rows={3}
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:border-purple-500 resize-none`}
              />
            </div>

            {/* HOW */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={`text-sm font-semibold ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  HOW - How it unfolded
                </label>
                <button
                  onClick={() => isRecording && currentField === 'how' ? stopVoiceRecording() : startVoiceRecording('how')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs transition-all ${
                    isRecording && currentField === 'how'
                      ? 'bg-red-500 text-white animate-pulse'
                      : darkMode
                        ? 'bg-gray-800 hover:bg-gray-700 text-purple-400'
                        : 'bg-gray-100 hover:bg-gray-200 text-purple-600'
                  }`}
                >
                  {isRecording && currentField === 'how' ? <Square size={14} /> : <Mic size={14} />}
                  {isRecording && currentField === 'how' ? 'Stop' : 'Voice'}
                </button>
              </div>
              <textarea
                value={formData.how}
                onChange={(e) => handleChange('how', e.target.value)}
                placeholder="How did it unfold? Describe the sequence of events..."
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:border-purple-500 resize-none`}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tags (press Enter)..."
                className={`flex-1 px-4 py-2 rounded-lg border-2 ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:border-purple-500`}
              />
              <button
                onClick={addTag}
                className={`px-4 py-2 rounded-lg ${
                  darkMode
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <Tag size={18} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                    darkMode
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`sticky bottom-0 flex items-center justify-between p-6 border-t ${
          darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <button
            onClick={onClose}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              darkMode
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-all"
          >
            <Save size={20} />
            {currentStory ? 'Update Story' : 'Save Story'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryEditor;
