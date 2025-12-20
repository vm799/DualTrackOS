import React from 'react';
import { BookOpen, Plus, X, Link, Youtube, Instagram } from 'lucide-react';
import useLearningStore from '../store/useLearningStore';
import useStore from '../store/useStore';

const LearningLibrary = () => {
  const darkMode = useStore((state) => state.darkMode);
  const { learningLibrary, addLearningItem, addActionItemToLearning } = useLearningStore();

  const [showAddModal, setShowAddModal] = React.useState(false);
  const [newUrl, setNewUrl] = React.useState('');
  const [newTitle, setNewTitle] = React.useState('');
  const [newType, setNewType] = React.useState('article'); // Default type
  const [newNotes, setNewNotes] = React.useState('');
  const [expandedLearningItem, setExpandedLearningItem] = React.useState(null);
  const [newActionItemText, setNewActionItemText] = React.useState('');

  const handleAddLearningItem = () => {
    if (newUrl.trim() && newTitle.trim()) {
      addLearningItem(newUrl, newTitle, newType, newNotes);
      setNewUrl('');
      setNewTitle('');
      setNewType('article');
      setNewNotes('');
      setShowAddModal(false);
    }
  };

  const handleAddActionItem = (learningId) => {
    if (newActionItemText.trim()) {
      addActionItemToLearning(learningId, newActionItemText);
      setNewActionItemText('');
    }
  };

  return (
    <div className={`rounded-xl p-6 transition-all duration-300 ${
      darkMode
        ? 'bg-gray-800/50 border-2 border-gray-700/50 shadow-lg backdrop-blur-sm'
        : 'bg-white border-2 border-gray-100 shadow-md'
    }`}>
      <h3 className={`text-lg font-bold mb-4 flex items-center ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
        <BookOpen className={`mr-2 ${darkMode ? 'text-green-400' : 'text-green-500'}`} size={20} />
        Learning Library
      </h3>

      <button
        onClick={() => setShowAddModal(true)}
        className={`w-full py-2 mb-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all ${
          darkMode
            ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-2 border-blue-500/40'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        <Plus size={18} />
        <span>Add New Learning Item</span>
      </button>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl p-6 w-full max-w-md ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Add Learning Item</h4>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Title (e.g., 'Mastering React Hooks')"
              className={`w-full px-4 py-2 mb-3 rounded-lg border-2 ${
                darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
            />
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="URL (e.g., https://react.dev/learn)"
              className={`w-full px-4 py-2 mb-3 rounded-lg border-2 ${
                darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
            />
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className={`w-full px-4 py-2 mb-3 rounded-lg border-2 ${
                darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
            >
              <option value="article">Article</option>
              <option value="book">Book</option>
              <option value="youtube">YouTube Video</option>
              <option value="instagram">Instagram Post</option>
            </select>
            <textarea
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="Notes (optional)"
              rows="3"
              className={`w-full px-4 py-2 mb-4 rounded-lg border-2 ${
                darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
            ></textarea>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className={`px-4 py-2 rounded-lg font-medium ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddLearningItem}
                className={`px-4 py-2 rounded-lg font-medium ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {learningLibrary.length === 0 ? (
          <p className={`text-center text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>No learning items yet. Add one to get started!</p>
        ) : (
          learningLibrary.map(item => (
            <div
              key={item.id}
              className={`rounded-lg p-4 cursor-pointer transition-all duration-300 ${
                darkMode
                  ? 'bg-gray-700/50 border border-gray-600 hover:border-blue-500/50'
                  : 'bg-gray-50 border border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => setExpandedLearningItem(expandedLearningItem === item.id ? null : item.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {item.type === 'book' && <BookOpen className={darkMode ? 'text-blue-400' : 'text-blue-600'} size={18} />}
                  {item.type === 'article' && <Link className={darkMode ? 'text-green-400' : 'text-green-600'} size={18} />}
                  {item.type === 'youtube' && <Youtube className={darkMode ? 'text-red-400' : 'text-red-600'} size={18} />}
                  {item.type === 'instagram' && <Instagram className={darkMode ? 'text-purple-400' : 'text-purple-600'} size={18} />}
                  <h4 className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{item.title}</h4>
                </div>
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {item.dateAdded}
                </span>
              </div>
              {expandedLearningItem === item.id && (
                <div className="mt-3">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm underline ${darkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'}`}
                  >
                    Go to source
                  </a>
                  {item.notes && (
                    <p className={`text-sm mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <strong>Notes:</strong> {item.notes}
                    </p>
                  )}
                  <h5 className={`font-semibold mt-3 mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Action Items:</h5>
                  <div className="space-y-1">
                    {item.actionItems.length === 0 ? (
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No action items yet.</p>
                    ) : (
                      item.actionItems.map(action => (
                        <div key={action.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={action.done}
                            // onChange={() => toggleActionItem(item.id, action.id)} // Need to implement toggle
                            className={`form-checkbox h-4 w-4 ${darkMode ? 'text-blue-500 bg-gray-700 border-gray-600' : 'text-blue-600 border-gray-300'}`}
                          />
                          <span className={`${action.done ? 'line-through text-gray-500' : darkMode ? 'text-gray-200' : 'text-gray-800'} text-sm`}>
                            {action.text}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex mt-3">
                    <input
                      type="text"
                      value={newActionItemText}
                      onChange={(e) => setNewActionItemText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddActionItem(item.id)}
                      placeholder="Add action item..."
                      className={`flex-1 px-3 py-1 rounded-l-lg border-2 ${
                        darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                    />
                    <button
                      onClick={() => handleAddActionItem(item.id)}
                      className={`px-3 py-1 rounded-r-lg font-medium ${
                        darkMode ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/40' : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LearningLibrary;
