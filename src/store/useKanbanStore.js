import { create } from 'zustand';

const useKanbanStore = create((set) => ({
  // State
  kanbanTasks: {
    backlog: [],
    inProgress: [],
    done: []
  },
  newTaskInput: '',
  expandedColumn: null,

  // Actions
  setKanbanTasks: (tasks) => set({ kanbanTasks: tasks }),
  setNewTaskInput: (input) => set({ newTaskInput: input }),
  setExpandedColumn: (column) => set({ expandedColumn: column }),

  addKanbanTask: () => {
    set((state) => {
      if (state.newTaskInput.trim()) {
        const newTask = {
          id: Date.now(),
          title: state.newTaskInput,
          category: 'work', // Can be 'work' or 'business'
          notes: '',
          createdAt: new Date().toISOString()
        };
        return {
          kanbanTasks: {
            ...state.kanbanTasks,
            backlog: [...state.kanbanTasks.backlog, newTask]
          },
          newTaskInput: ''
        };
      }
      return state;
    });
  },

  moveTask: (taskId, fromColumn, toColumn) => {
    set((state) => {
      const task = state.kanbanTasks[fromColumn].find(t => t.id === taskId);
      if (task) {
        const newKanbanTasks = {
          ...state.kanbanTasks,
          [fromColumn]: state.kanbanTasks[fromColumn].filter(t => t.id !== taskId),
          [toColumn]: [...state.kanbanTasks[toColumn], task]
        };
        return { kanbanTasks: newKanbanTasks };
      }
      return state;
    });
  },

  deleteTask: (taskId, column) => {
    set((state) => ({
      kanbanTasks: {
        ...state.kanbanTasks,
        [column]: state.kanbanTasks[column].filter(t => t.id !== taskId)
      }
    }));
  },
}));

export default useKanbanStore;
