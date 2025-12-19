import { create } from 'zustand';

const useHourlyTaskStore = create((set) => ({
  // State
  hourlyTasks: {}, // Structure: { "hour": [{ id, text, completed, type }] }

  // Actions
  setHourlyTasks: (tasks) => set({ hourlyTasks: tasks }),

  addHourlyTask: (hour, taskText) => {
    set((state) => {
      if (!taskText.trim()) return state;
      const newTasksForHour = [...(state.hourlyTasks[hour] || []), { id: Date.now(), text: taskText, completed: false, type: 'task' }];
      return {
        hourlyTasks: {
          ...state.hourlyTasks,
          [hour]: newTasksForHour
        }
      };
    });
  },

  toggleHourlyTask: (hour, taskId) => {
    set((state) => {
      const updatedTasksForHour = (state.hourlyTasks[hour] || []).map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      return {
        hourlyTasks: {
          ...state.hourlyTasks,
          [hour]: updatedTasksForHour
        }
      };
    });
  },

  deleteHourlyTask: (hour, taskId) => {
    set((state) => {
      const filteredTasksForHour = (state.hourlyTasks[hour] || []).filter(task => task.id !== taskId);
      return {
        hourlyTasks: {
          ...state.hourlyTasks,
          [hour]: filteredTasksForHour
        }
      };
    });
  },
}));

export default useHourlyTaskStore;
