import React, { useState } from 'react';
import { X, Check, PenTool, Trash2 } from 'lucide-react';
import useStore from '../store/useStore';
import useNDMStore from '../store/useNDMStore';

/**
 * Brain Dump Modal
 * Dedicated space for thought capture - the Brain Dump NDM
 */
const BrainDumpModal = ({ show, onClose }) => {
  const darkMode = useStore((state) => state.darkMode);
  const { ndm, setBrainDump } = useNDMStore();

  const [thoughts, setThoughts] = useState([]);
  const [currentThought, setCurrentThought] = useState('');
  const [dumpMode, setDumpMode] = useState('freestyle'); // freestyle | prompts
  const [selectedPrompt, setSelectedPrompt] = useState(null);

  if (!show) return null;

  const addThought = () => {
    if (currentThought.trim()) {
      setThoughts([...thoughts, {
        id: Date.now(),
        text: currentThought,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      }]);
      setCurrentThought('');
    }
  };

  const deleteThought = (id) => {
    setThoughts(thoughts.filter(t => t.id !== id));
  };

  const markComplete = () => {
    setBrainDump(true);
    onClose();
  };

  const prompts = [
    "What's weighing on my mind right now?",
    "What am I avoiding thinking about?",
    "What needs to get done that I keep forgetting?",
    "What am I worried about?",
    "What am I excited about?",
    "What decisions do I need to make?",
    "What's frustrating me?",
    "What's bringing me joy?",
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4 py-12">
        <div className={`max-w-3xl w-full rounded-3xl relative ${
          darkMode ? 'bg-gray-900 border-2 border-purple-500/30' : 'bg-white border-2 border-purple-200'
        }`}>
          {/* Close button at top */}
          <div className="flex justify-end p-4">
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
          <div className="px-8 pb-8">

        <div className="flex items-center gap-3 mb-2">
          <PenTool className={darkMode ? 'text-purple-400' : 'text-purple-600'} size={32} />
          <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Brain Dump Non-Negotiable
          </h3>
        </div>

        <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Clear your mental clutter. Write everything that's on your mind. No filter, no judgment.
        </p>

        {ndm.brainDump && (
          <div className={`p-4 rounded-xl mb-6 ${
            darkMode ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-300'
          }`}>
            <p className={`text-sm font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
              ✅ Brain Dump complete for today! Mind = cleared.
            </p>
          </div>
        )}

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setDumpMode('freestyle')}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
              dumpMode === 'freestyle'
                ? darkMode
                  ? 'bg-purple-500/20 border-2 border-purple-500/50 text-purple-400'
                  : 'bg-purple-500 border-2 border-purple-600 text-white'
                : darkMode
                  ? 'bg-gray-800 border-2 border-gray-700 text-gray-400 hover:border-purple-500/30'
                  : 'bg-gray-100 border-2 border-gray-200 text-gray-600 hover:border-purple-300'
            }`}
          >
            Freestyle Dump
          </button>
          <button
            onClick={() => setDumpMode('prompts')}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
              dumpMode === 'prompts'
                ? darkMode
                  ? 'bg-purple-500/20 border-2 border-purple-500/50 text-purple-400'
                  : 'bg-purple-500 border-2 border-purple-600 text-white'
                : darkMode
                  ? 'bg-gray-800 border-2 border-gray-700 text-gray-400 hover:border-purple-500/30'
                  : 'bg-gray-100 border-2 border-gray-200 text-gray-600 hover:border-purple-300'
            }`}
          >
            Guided Prompts
          </button>
        </div>

        {/* Freestyle Mode */}
        {dumpMode === 'freestyle' && (
          <div className="mb-6">
            <textarea
              value={currentThought}
              onChange={(e) => setCurrentThought(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.shiftKey) {
                  e.preventDefault();
                  addThought();
                }
              }}
              placeholder="Just start writing... whatever comes to mind. Press Shift+Enter to add to list."
              rows={6}
              className={`w-full px-4 py-3 rounded-xl border-2 resize-none ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500/50'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-purple-500'
              }`}
            />
            <button
              onClick={addThought}
              className={`mt-2 px-6 py-2 rounded-lg font-semibold transition-all ${
                darkMode
                  ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/40'
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
              }`}
            >
              Add Thought
            </button>
          </div>
        )}

        {/* Prompts Mode */}
        {dumpMode === 'prompts' && (
          <div className="mb-6 space-y-3">
            {prompts.map((prompt, idx) => {
              const isSelected = selectedPrompt === idx;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? darkMode
                        ? 'bg-purple-500/20 border-2 border-purple-500/50 shadow-lg'
                        : 'bg-purple-100 border-2 border-purple-400'
                      : darkMode
                        ? 'bg-gray-800/50 border-2 border-gray-700 hover:border-purple-500/50'
                        : 'bg-gray-50 border-2 border-gray-200 hover:border-purple-300'
                  }`}
                  onClick={() => {
                    setSelectedPrompt(idx);
                    setCurrentThought(prompt + '\n\n');
                  }}
                >
                  <p className={`text-sm font-semibold flex items-center gap-2 ${
                    isSelected
                      ? darkMode ? 'text-purple-300' : 'text-purple-700'
                      : darkMode ? 'text-purple-400' : 'text-purple-600'
                  }`}>
                    {isSelected && <Check size={16} className="text-purple-400" />}
                    {prompt}
                  </p>
                </div>
              );
            })}
            <textarea
              value={currentThought}
              onChange={(e) => setCurrentThought(e.target.value)}
              placeholder="Click a prompt above or write your own answer..."
              rows={4}
              className={`w-full px-4 py-3 rounded-xl border-2 resize-none mt-3 ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              }`}
            />
            <button
              onClick={addThought}
              className={`mt-2 px-6 py-2 rounded-lg font-semibold transition-all ${
                darkMode
                  ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/40'
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
              }`}
            >
              Add Thought
            </button>
          </div>
        )}

        {/* Captured Thoughts */}
        {thoughts.length > 0 && (
          <div className="mb-6">
            <h4 className={`font-bold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Captured Thoughts ({thoughts.length}):
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {thoughts.map((thought) => (
                <div
                  key={thought.id}
                  className={`p-3 rounded-lg flex items-start gap-3 ${
                    darkMode ? 'bg-gray-800/50' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex-1">
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {thought.text}
                    </p>
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {thought.timestamp}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteThought(thought.id)}
                    className={`p-1 rounded hover:bg-red-500/20 transition-all ${
                      darkMode ? 'text-red-400' : 'text-red-600'
                    }`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className={`p-4 rounded-xl mb-6 ${
          darkMode ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-300'
        }`}>
          <p className={`text-xs ${darkMode ? 'text-blue-400' : 'text-blue-800'}`}>
            💡 <strong>Pro tip:</strong> The goal isn't to solve these thoughts—it's to get them OUT of your head and onto the page. Clearing mental clutter makes space for what matters.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              darkMode
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-400'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
            }`}
          >
            Close
          </button>
          <button
            onClick={markComplete}
            disabled={ndm.brainDump}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              ndm.brainDump
                ? darkMode
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : darkMode
                  ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }`}
          >
            <Check size={18} />
            {ndm.brainDump ? 'Already Complete' : 'Mark Complete'}
          </button>
        </div>
        </div> {/* End content */}
        </div>
      </div>
    </div>
  );
};

export default BrainDumpModal;
