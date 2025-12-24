import React, { useState } from 'react';
import { X, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import useRoleStore from '../store/useRoleStore';
import useStore from '../store/useStore';

/**
 * RoleSetupModal - Customizable role selection
 * No assumptions - user defines their reality
 */
const RoleSetupModal = () => {
  const darkMode = useStore((state) => state.darkMode);
  const {
    showRoleSetup,
    setShowRoleSetup,
    defaultRoles,
    userRoles,
    setUserRoles,
    completeRoleSetup,
  } = useRoleStore();

  const [selectedRoles, setSelectedRoles] = useState(userRoles);
  const [customRole, setCustomRole] = useState({ name: '', emoji: '🎯' });
  const [showCustomInput, setShowCustomInput] = useState(false);

  if (!showRoleSetup) return null;

  const handleToggleRole = (role) => {
    const isSelected = selectedRoles.find((r) => r.id === role.id);
    if (isSelected) {
      setSelectedRoles(selectedRoles.filter((r) => r.id !== role.id));
    } else {
      setSelectedRoles([...selectedRoles, { ...role, taskCount: 0 }]);
    }
  };

  const handleAddCustomRole = () => {
    if (!customRole.name.trim()) return;

    const newRole = {
      id: `custom-${Date.now()}`,
      name: customRole.name.trim(),
      emoji: customRole.emoji,
      taskCount: 0,
      custom: true,
    };

    setSelectedRoles([...selectedRoles, newRole]);
    setCustomRole({ name: '', emoji: '🎯' });
    setShowCustomInput(false);
  };

  const handleRemoveCustomRole = (roleId) => {
    setSelectedRoles(selectedRoles.filter((r) => r.id !== roleId));
  };

  const handleSave = () => {
    if (selectedRoles.length === 0) {
      alert('Please select or add at least one role to continue.');
      return;
    }
    setUserRoles(selectedRoles);
    completeRoleSetup();
  };

  const handleSkip = () => {
    setShowRoleSetup(false);
  };

  const commonEmojis = ['💼', '👥', '🏠', '💝', '💑', '🚀', '🎨', '🌟', '💆', '📚', '🏃', '🎯', '✨', '🌈', '🎭', '🎪'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl ${
          darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}
      >
        {/* Header */}
        <div className={`sticky top-0 z-10 border-b p-6 ${
          darkMode ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-gray-200'
        } backdrop-blur-xl`}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">What roles do you manage?</h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Select all that apply or create your own. No judgments, no assumptions.
              </p>
            </div>
            <button
              onClick={handleSkip}
              className={`p-2 rounded-lg transition-all ${
                darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">

          {/* Default Role Suggestions */}
          <div>
            <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Common Roles (tap to select)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {defaultRoles.map((role) => {
                const isSelected = selectedRoles.find((r) => r.id === role.id);
                return (
                  <button
                    key={role.id}
                    onClick={() => handleToggleRole(role)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? darkMode
                          ? 'bg-purple-900/30 border-purple-500/50 text-white'
                          : 'bg-purple-50 border-purple-300 text-gray-900'
                        : darkMode
                        ? 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-600'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl">{role.emoji}</span>
                    <span className="font-medium text-left flex-1">{role.name}</span>
                    {isSelected && <CheckCircle2 size={20} className="text-purple-500" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Roles Section */}
          <div>
            <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Your Custom Roles
            </h3>

            {/* Display Custom Roles */}
            {selectedRoles.filter((r) => r.custom).length > 0 && (
              <div className="space-y-2 mb-3">
                {selectedRoles
                  .filter((r) => r.custom)
                  .map((role) => (
                    <div
                      key={role.id}
                      className={`flex items-center gap-3 p-3 rounded-xl ${
                        darkMode ? 'bg-gray-800' : 'bg-gray-100'
                      }`}
                    >
                      <span className="text-xl">{role.emoji}</span>
                      <span className="font-medium flex-1">{role.name}</span>
                      <button
                        onClick={() => handleRemoveCustomRole(role.id)}
                        className={`p-1 rounded-lg transition-all ${
                          darkMode
                            ? 'hover:bg-red-900/30 text-red-400'
                            : 'hover:bg-red-100 text-red-600'
                        }`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
              </div>
            )}

            {/* Add Custom Role */}
            {!showCustomInput ? (
              <button
                onClick={() => setShowCustomInput(true)}
                className={`w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed transition-all ${
                  darkMode
                    ? 'border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                    : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700'
                }`}
              >
                <Plus size={20} />
                <span>Add a custom role</span>
              </button>
            ) : (
              <div
                className={`p-4 rounded-xl border-2 ${
                  darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="space-y-3">
                  {/* Emoji Picker */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Pick an emoji
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {commonEmojis.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => setCustomRole({ ...customRole, emoji })}
                          className={`text-2xl p-2 rounded-lg transition-all ${
                            customRole.emoji === emoji
                              ? darkMode
                                ? 'bg-purple-900/30 ring-2 ring-purple-500/50'
                                : 'bg-purple-100 ring-2 ring-purple-300'
                              : darkMode
                              ? 'hover:bg-gray-700'
                              : 'hover:bg-gray-200'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Role Name Input */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Role name
                    </label>
                    <input
                      type="text"
                      value={customRole.name}
                      onChange={(e) => setCustomRole({ ...customRole, name: e.target.value })}
                      placeholder="e.g., Volunteer Coordinator"
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                        darkMode
                          ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-purple-500'
                      } focus:outline-none`}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handleAddCustomRole();
                      }}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddCustomRole}
                      disabled={!customRole.name.trim()}
                      className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                        customRole.name.trim()
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : darkMode
                          ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Add Role
                    </button>
                    <button
                      onClick={() => {
                        setShowCustomInput(false);
                        setCustomRole({ name: '', emoji: '🎯' });
                      }}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        darkMode
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div
            className={`p-4 rounded-xl ${
              darkMode ? 'bg-purple-900/20 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'
            }`}
          >
            <p className={`text-sm ${darkMode ? 'text-purple-200' : 'text-purple-900'}`}>
              💡 <strong>Why track roles?</strong> So you can see your mental load across all areas of your life—and
              make sure self-care isn't being squeezed out.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className={`sticky bottom-0 border-t p-6 ${
          darkMode ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-gray-200'
        } backdrop-blur-xl`}>
          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                darkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Skip for now
            </button>
            <button
              onClick={handleSave}
              disabled={selectedRoles.length === 0}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedRoles.length > 0
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : darkMode
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Save & Continue ({selectedRoles.length} selected)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSetupModal;
