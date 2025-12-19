import React from 'react';
import { Plus, Sparkles, X } from 'lucide-react';
import useKanbanStore from '../store/useKanbanStore';
import useStore from '../store/useStore';

const KanbanBoard = () => {
  const darkMode = useStore((state) => state.darkMode);
  const {
    kanbanTasks,
    newTaskInput,
    expandedColumn,
    setNewTaskInput,
    setExpandedColumn,
    addKanbanTask,
    moveTask,
    deleteTask
  } = useKanbanStore();

  return (
    <div className={`rounded-xl p-6 transition-all duration-300 ${
      darkMode
        ? 'bg-gray-800/50 border-2 border-gray-700/50 shadow-lg backdrop-blur-sm'
        : 'bg-white border-2 border-gray-100 shadow-md'
    }`}>
      <h3 className={`text-lg font-bold mb-4 flex items-center ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
        <Sparkles className={`mr-2 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} size={20} />
        Life's Pipeline
      </h3>

      {/* Add Task Input */}
      <div className="flex space-x-2 mb-6">
        <input
          type="text"
          value={newTaskInput}
          onChange={(e) => setNewTaskInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addKanbanTask()}
          placeholder="Add new task..."
          className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
            darkMode
              ? 'bg-gray-900/50 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-blue-500/50'
              : 'bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
          }`}
        />
        <button
          onClick={addKanbanTask}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            darkMode
              ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-2 border-blue-500/40'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-3 gap-3">
        {/* BACKLOG */}
        <div
          onClick={() => setExpandedColumn(expandedColumn === 'backlog' ? null : 'backlog')}
          className={`rounded-lg p-3 cursor-pointer transition-all ${
            darkMode
              ? 'bg-gray-900/50 border-2 border-gray-700 hover:border-gray-600'
              : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className={`text-xs font-bold uppercase ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Backlog
            </h4>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
            }`}>
              {kanbanTasks.backlog.length}
            </span>
          </div>
          <div className="space-y-2">
            {kanbanTasks.backlog.slice(0, expandedColumn === 'backlog' ? undefined : 3).map(task => (
              <div
                key={task.id}
                onClick={(e) => e.stopPropagation()}
                className={`p-2 rounded text-xs ${
                  darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}
              >
                <p className={`font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  {task.title}
                </p>
                <div className="flex space-x-1">
                  <button
                    onClick={() => moveTask(task.id, 'backlog', 'inProgress')}
                    className={`flex-1 py-1 rounded text-xs ${
                      darkMode
                        ? 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-400'
                        : 'bg-orange-100 hover:bg-orange-200 text-orange-700'
                    }`}
                  >
                    Start →
                  </button>
                  <button
                    onClick={() => deleteTask(task.id, 'backlog')}
                    className={`px-2 py-1 rounded ${
                      darkMode ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-100 text-red-600'
                    }`}
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            ))}
            {expandedColumn !== 'backlog' && kanbanTasks.backlog.length > 3 && (
              <div className={`text-xs text-center ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                +{kanbanTasks.backlog.length - 3} more
              </div>
            )}
          </div>
        </div>

        {/* IN PROGRESS */}
        <div
          onClick={() => setExpandedColumn(expandedColumn === 'inProgress' ? null : 'inProgress')}
          className={`rounded-lg p-3 cursor-pointer transition-all ${
            darkMode
              ? 'bg-orange-900/20 border-2 border-orange-700/30 hover:border-orange-600/50'
              : 'bg-orange-50 border-2 border-orange-200 hover:border-orange-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className={`text-xs font-bold uppercase ${darkMode ? 'text-orange-400' : 'text-orange-700'}`}>
              In Progress
            </h4>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              darkMode ? 'bg-orange-700/30 text-orange-300' : 'bg-orange-200 text-orange-800'
            }`}>
              {kanbanTasks.inProgress.length}
            </span>
          </div>
          <div className="space-y-2">
            {kanbanTasks.inProgress.slice(0, expandedColumn === 'inProgress' ? undefined : 3).map(task => (
              <div
                key={task.id}
                onClick={(e) => e.stopPropagation()}
                className={`p-2 rounded text-xs ${
                  darkMode ? 'bg-gray-800 border border-orange-700/30' : 'bg-white border border-orange-300'
                }`}
              >
                <p className={`font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  {task.title}
                </p>
                <div className="flex space-x-1">
                  <button
                    onClick={() => moveTask(task.id, 'inProgress', 'backlog')}
                    className={`px-2 py-1 rounded text-xs ${
                      darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => moveTask(task.id, 'inProgress', 'done')}
                    className={`flex-1 py-1 rounded text-xs ${
                      darkMode
                        ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400'
                        : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'
                    }`}
                  >
                    Done →
                  </button>
                </div>
              </div>
            ))}
            {expandedColumn !== 'inProgress' && kanbanTasks.inProgress.length > 3 && (
              <div className={`text-xs text-center ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                +{kanbanTasks.inProgress.length - 3} more
              </div>
            )}
          </div>
        </div>

        {/* DONE */}
        <div
          onClick={() => setExpandedColumn(expandedColumn === 'done' ? null : 'done')}
          className={`rounded-lg p-3 cursor-pointer transition-all ${
            darkMode
              ? 'bg-emerald-900/20 border-2 border-emerald-700/30 hover:border-emerald-600/50'
              : 'bg-emerald-50 border-2 border-emerald-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className={`text-xs font-bold uppercase ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
              Done
            </h4>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
            }`}>
              {kanbanTasks.done.length}
            </span>
          </div>
          <div className="space-y-2">
            {kanbanTasks.done.slice(0, expandedColumn === 'done' ? undefined : 3).map(task => (
              <div
                key={task.id}
                onClick={(e) => e.stopPropagation()}
                className={`p-2 rounded text-xs ${
                  darkMode ? 'bg-gray-800 border border-emerald-700/30' : 'bg-white border border-emerald-300'
                }`}
              >
                <p className={`font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  {task.title}
                </p>
                <div className="flex space-x-1">
                  <button
                    onClick={() => moveTask(task.id, 'done', 'inProgress')}
                    className={`px-2 py-1 rounded text-xs ${
                      darkMode ? 'hover:bg-orange-500/20 text-orange-400' : 'hover:bg-orange-100 text-orange-700'
                    }`}
                  >
                    ← Move
                  </button>
                  <button
                    onClick={() => deleteTask(task.id, 'done')}
                    className={`px-2 py-1 rounded ${
                      darkMode ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-100 text-red-600'
                    }`}
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            ))}
            {expandedColumn !== 'done' && kanbanTasks.done.length > 3 && (
              <div className={`text-xs text-center ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                +{kanbanTasks.done.length - 3} more
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;