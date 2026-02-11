import { create } from 'zustand';

const useLearningStore = create((set) => ({
  // State
  learningLibrary: [], // Array of { id, url, title, type, notes, actionItems: [], dateAdded }

  // Actions
  setLearningLibrary: (library) => set({ learningLibrary: library }),

  addLearningItem: (url, title, type, notes) => {
    set((state) => ({
      learningLibrary: [...state.learningLibrary, {
        id: Date.now(),
        url,
        title,
        type, // 'book', 'article', 'youtube', 'instagram'
        notes: notes || '',
        actionItems: [],
        dateAdded: new Date().toLocaleDateString()
      }]
    }));
  },

  addActionItemToLearning: (learningId, actionText) => {
    set((state) => ({
      learningLibrary: state.learningLibrary.map(item =>
        item.id === learningId
          ? { ...item, actionItems: [...item.actionItems, { id: Date.now(), text: actionText, done: false }] }
          : item
      )
    }));
  },
}));

export default useLearningStore;
